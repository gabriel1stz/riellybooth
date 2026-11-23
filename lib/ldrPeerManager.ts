/**
 * WebRTC Peer-to-Peer Manager for riellybooth ♡
 * Supports:
 * 1. Mode Berdua Jarak Jauh (LDR Photobooth):
 *    - 6-character random alphanumeric room code (e.g. RLY-8K2N9X)
 *    - Strict 2-participant limit (Host + 1 Guest)
 *    - Instant Auto-Admission on valid room code + bi-directional status feedback
 *    - Bi-directional MediaStream video streaming (side-by-side composite)
 *    - Synchronized countdown & chunked snapshot transfer (SYNC_SHOT_CHUNK) safe for all WebRTC SCTP limits
 *    - Carrier-grade NAT traversal with multi-provider STUN and TURN servers
 *    - Automatic guest retry & resilient host persistence
 */

export type LDRMessage =
  | { type: "JOIN_REQUEST"; guestName: string; guestPeerId: string }
  | { type: "JOIN_ACCEPTED"; roomCode: string }
  | { type: "JOIN_REJECTED"; reason: string }
  | { type: "START_COUNTDOWN"; seconds: number }
  | { type: "TRIGGER_SNAPSHOT"; shotIndex: number }
  | { type: "SYNC_SHOT"; shotIndex: number; dataUrl: string }
  | {
    type: "SYNC_SHOT_CHUNK";
    transferId: string;
    shotIndex: number;
    chunkIndex: number;
    totalChunks: number;
    chunk: string;
  }
  | { type: "SESSION_ENDED" }
  | { type: "TRANSFER_STRIP"; dataUrl: string; filename: string };

export type LDRSessionState = {
  roomCode: string;
  isHost: boolean;
  isConnected: boolean;
  remoteStream: MediaStream | null;
  guestRequest: { guestName: string; guestPeerId: string; accept: () => void; reject: () => void } | null;
  statusMessage: string;
};

// Robust multi-provider STUN & OpenRelay TURN configuration to punch through 4G/5G mobile CGNAT
const PEER_CONFIG = {
  debug: 1,
  config: {
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:stun1.l.google.com:19302" },
      { urls: "stun:stun2.l.google.com:19302" },
      { urls: "stun:stun3.l.google.com:19302" },
      { urls: "stun:stun4.l.google.com:19302" },
      { urls: "stun:stun.cloudflare.com:3478" },
      { urls: "stun:global.stun.twilio.com:3478" },
      {
        urls: "turn:openrelay.metered.ca:80",
        username: "openrelayproject",
        credential: "openrelayproject",
      },
      {
        urls: "turn:openrelay.metered.ca:443",
        username: "openrelayproject",
        credential: "openrelayproject",
      },
      {
        urls: "turn:openrelay.metered.ca:443?transport=tcp",
        username: "openrelayproject",
        credential: "openrelayproject",
      },
    ],
    iceCandidatePoolSize: 10,
  },
};

const CHUNK_SIZE = 16000; // 16KB safe for all WebRTC SCTP implementations (Chrome, Safari iOS, Firefox)

// Generate 6-char random alphanumeric room code excluding confusing chars (0, O, 1, I)
export function generateLDRRoomCode(): string {
  const chars = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
  let result = "RLY-";
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Normalizes user input: handles naked codes (8X2M9K), spaces, full URLs, and case insensitivity
export function normalizeRoomCode(input: string): string {
  if (!input) return "";
  let clean = input.trim();

  if (clean.includes("?ldr=") || clean.includes("&ldr=")) {
    const match = clean.match(/[?&]ldr=([^&#\s]+)/i);
    if (match && match[1]) clean = match[1];
  } else if (clean.includes("?room=") || clean.includes("&room=")) {
    const match = clean.match(/[?&]room=([^&#\s]+)/i);
    if (match && match[1]) clean = match[1];
  }

  clean = clean.replace(/^https?:\/\/[^\/]+\/?/i, "");
  clean = clean.toUpperCase().replace(/[^A-Z0-9-]/g, "");

  if (!clean.startsWith("RLY-")) {
    if (clean.startsWith("RLY")) {
      clean = "RLY-" + clean.substring(3);
    } else {
      clean = "RLY-" + clean;
    }
  }

  return clean;
}

export class LDRPeerManager {
  private peer: any = null;
  private connection: any = null;
  private call: any = null;
  private localStream: MediaStream | null = null;
  private remoteStream: MediaStream | null = null;
  private onStateChange: ((state: Partial<LDRSessionState>) => void) | null = null;
  private onMessageReceived: ((msg: LDRMessage) => void) | null = null;
  private sessionTimeoutTimer: ReturnType<typeof setTimeout> | null = null;
  private retryTimer: ReturnType<typeof setTimeout> | null = null;
  private chunkBuffers: Map<string, { shotIndex: number; total: number; parts: string[]; received: number }> =
    new Map();
  private isDestroyed: boolean = false;
  public roomCode: string = "";
  public isHost: boolean = false;

  constructor(
    onStateChange: (state: Partial<LDRSessionState>) => void,
    onMessageReceived: (msg: LDRMessage) => void
  ) {
    this.onStateChange = onStateChange;
    this.onMessageReceived = onMessageReceived;
  }

  // Update local stream dynamically (e.g. camera flip front/back)
  public updateLocalStream(newStream: MediaStream) {
    this.localStream = newStream;
    if (this.call && this.call.peerConnection) {
      try {
        const videoTrack = newStream.getVideoTracks()[0];
        if (videoTrack) {
          const senders = this.call.peerConnection.getSenders();
          const videoSender = senders.find((s: any) => s.track && s.track.kind === "video");
          if (videoSender) {
            videoSender.replaceTrack(videoTrack);
          }
        }
      } catch (err) {
        console.warn("Failed to replace video track:", err);
      }
    }
  }

  private handleIncomingData(data: LDRMessage) {
    if (data.type === "SYNC_SHOT_CHUNK") {
      let entry = this.chunkBuffers.get(data.transferId);
      if (!entry) {
        entry = {
          shotIndex: data.shotIndex,
          total: data.totalChunks,
          parts: new Array(data.totalChunks),
          received: 0,
        };
        this.chunkBuffers.set(data.transferId, entry);
      }
      if (!entry.parts[data.chunkIndex]) {
        entry.parts[data.chunkIndex] = data.chunk;
        entry.received++;
      }
      if (entry.received === entry.total) {
        const fullDataUrl = entry.parts.join("");
        this.chunkBuffers.delete(data.transferId);
        this.onMessageReceived?.({
          type: "SYNC_SHOT",
          shotIndex: entry.shotIndex,
          dataUrl: fullDataUrl,
        });
      }
      return;
    }

    this.onMessageReceived?.(data);
  }

  // Initialize Host Room (e.g. peer id: riellybooth-host-RLY-8X2M9K)
  public async initHostRoom(roomCode: string, localStream: MediaStream) {
    this.cleanup();
    this.isDestroyed = false;
    this.roomCode = normalizeRoomCode(roomCode);
    this.isHost = true;
    this.localStream = localStream;

    const { default: Peer } = await import("peerjs");
    if (this.isDestroyed) return;

    const hostPeerId = `riellybooth-host-${this.roomCode}`;
    this.peer = new Peer(hostPeerId, PEER_CONFIG);

    this.peer.on("open", () => {
      this.onStateChange?.({
        roomCode: this.roomCode,
        isHost: true,
        isConnected: false,
        statusMessage: `Menunggu ayang/bestie gabung ke ${this.roomCode}... 📸`,
      });
      this.startSessionTimeout();
    });

    this.peer.on("connection", (conn: any) => {
      if (this.connection && this.connection.open && this.connection.peer !== conn.peer) {
        const rejectExtra = () => {
          try {
            conn.send({ type: "JOIN_REJECTED", reason: "Room sudah penuh (Maksimal 2 orang)." });
          } catch (e) { }
          setTimeout(() => {
            try {
              conn.close();
            } catch (e) { }
          }, 500);
        };
        if (conn.open) rejectExtra();
        else conn.on("open", rejectExtra);
        return;
      }

      conn.on("data", (data: LDRMessage) => {
        if (data.type === "JOIN_REQUEST") {
          this.acceptGuest(conn, data.guestPeerId, data.guestName);
        } else {
          this.handleIncomingData(data);
        }
      });

      conn.on("close", () => {
        if (this.connection === conn) {
          this.disconnectGuest("Ayang / bestie keluar dari sesi.");
        }
      });

      conn.on("error", (err: any) => {
        console.warn("Host connection error:", err);
      });
    });

    // Answer incoming media call from guest
    this.peer.on("call", (call: any) => {
      if (this.call && this.call !== call) {
        try {
          this.call.close();
        } catch (e) { }
      }
      this.call = call;
      call.answer(this.localStream);

      call.on("stream", (remoteMediaStream: MediaStream) => {
        this.remoteStream = remoteMediaStream;
        this.onStateChange?.({
          remoteStream: remoteMediaStream,
          isConnected: true,
          statusMessage: "🟢 Kamera berdua aktif! Pose bareng sekarang! 💖",
        });
      });

      call.on("close", () => {
        if (this.call === call) {
          this.disconnectGuest("Panggilan video selesai.");
        }
      });
    });

    this.peer.on("disconnected", () => {
      try {
        if (this.peer && !this.peer.destroyed && !this.isDestroyed) {
          this.peer.reconnect();
        }
      } catch (e) { }
    });

    this.peer.on("error", (err: any) => {
      console.warn("PeerJS Host Error:", err);
      if (err.type === "unavailable-id") {
        this.onStateChange?.({
          statusMessage: "Kode room sedang aktif digunakan. Silakan buat kode baru.",
        });
      }
    });
  }

  // Host approves incoming guest safely (ensuring conn.open before sending)
  private acceptGuest(conn: any, guestPeerId: string, guestName?: string) {
    this.connection = conn;

    const sendAcceptedAndCall = () => {
      try {
        conn.send({ type: "JOIN_ACCEPTED", roomCode: this.roomCode });
      } catch (e) { }

      this.onStateChange?.({
        guestRequest: null,
        isConnected: true,
        statusMessage: `💖 ${guestName || "Partner LDR"} terhubung! Menghubungkan kamera...`,
      });

      // Initiate WebRTC video call to guest
      if (this.localStream && this.peer && !this.peer.destroyed) {
        setTimeout(() => {
          if (this.remoteStream || this.isDestroyed || !this.peer || this.peer.destroyed) return;
          try {
            const call = this.peer.call(guestPeerId, this.localStream);
            if (!call) return;
            this.call = call;

            call.on("stream", (remoteMediaStream: MediaStream) => {
              this.remoteStream = remoteMediaStream;
              this.onStateChange?.({
                remoteStream: remoteMediaStream,
                isConnected: true,
                statusMessage: "🟢 Kamera berdua aktif! Pose bareng sekarang! 💖",
              });
            });

            call.on("close", () => {
              if (this.call === call) {
                this.disconnectGuest("Ayang / bestie mengakhiri panggilan.");
              }
            });

            call.on("error", (callErr: any) => {
              console.warn("PeerJS Call Error:", callErr);
            });
          } catch (callInitErr) {
            console.warn("Failed to initiate call to guest:", callInitErr);
          }
        }, 250);
      }
    };

    if (conn.open) {
      sendAcceptedAndCall();
    } else {
      conn.once("open", sendAcceptedAndCall);
    }
  }

  // Guest joins Host Room with automatic retry if Host isn't ready yet
  public async joinRoom(roomCode: string, localStream: MediaStream, guestName: string = "Ayang") {
    this.cleanup();
    this.isDestroyed = false;
    this.roomCode = normalizeRoomCode(roomCode);
    this.isHost = false;
    this.localStream = localStream;

    const { default: Peer } = await import("peerjs");
    if (this.isDestroyed) return;

    const guestPeerId = `riellybooth-guest-${this.roomCode}-${Math.random().toString(36).substring(2, 7)}`;
    const hostPeerId = `riellybooth-host-${this.roomCode}`;

    this.peer = new Peer(guestPeerId, PEER_CONFIG);

    let attempts = 0;
    const maxAttempts = 4;
    let handshakeOpened = false;

    const attemptConnect = () => {
      if (this.isDestroyed || !this.peer || this.peer.destroyed || handshakeOpened) return;
      attempts++;

      this.onStateChange?.({
        roomCode: this.roomCode,
        isHost: false,
        isConnected: false,
        statusMessage:
          attempts === 1
            ? `Menghubungkan ke room ${this.roomCode}...`
            : `Mencoba menghubungkan ke ${this.roomCode} (${attempts}/${maxAttempts})...`,
      });

      try {
        // Close any stale previous attempt connection before opening a new one
        if (this.connection) {
          try {
            this.connection.close();
          } catch (e) {}
          this.connection = null;
        }
        const conn = this.peer.connect(hostPeerId, { reliable: true });
        this.connection = conn;

        conn.on("open", () => {
          handshakeOpened = true;
          if (this.retryTimer) {
            clearTimeout(this.retryTimer);
            this.retryTimer = null;
          }
          this.onStateChange?.({
            statusMessage: "Terhubung! Mengaktifkan kamera dua arah...",
          });
          conn.send({
            type: "JOIN_REQUEST",
            guestName,
            guestPeerId,
          });
        });

        conn.on("data", (data: LDRMessage) => {
          if (data.type === "JOIN_ACCEPTED") {
            this.onStateChange?.({
              isConnected: true,
              statusMessage: "Disetujui! Menghubungkan kamera...",
            });

            // Fallback: if Host's media call hasn't arrived in 1.5s, Guest initiates the call
            setTimeout(() => {
              if (!this.remoteStream && !this.isDestroyed && this.peer && !this.peer.destroyed && this.localStream) {
                try {
                  const fallbackCall = this.peer.call(hostPeerId, this.localStream);
                  if (!fallbackCall) return;
                  this.call = fallbackCall;
                  fallbackCall.on("stream", (remoteMediaStream: MediaStream) => {
                    this.remoteStream = remoteMediaStream;
                    this.onStateChange?.({
                      remoteStream: remoteMediaStream,
                      isConnected: true,
                      statusMessage: "🟢 Kamera berdua aktif! Pose bareng! 💖",
                    });
                  });
                } catch (e) { }
              }
            }, 1500);
          } else if (data.type === "JOIN_REJECTED") {
            this.onStateChange?.({
              isConnected: false,
              statusMessage: `Gagal gabung: ${data.reason}`,
            });
            this.cleanup();
          } else {
            this.handleIncomingData(data);
          }
        });

        conn.on("close", () => {
          if (handshakeOpened) {
            this.handleDisconnect("Host menutup sesi photobooth.");
          }
        });

        conn.on("error", (connErr: any) => {
          console.warn("Guest connection error:", connErr);
        });

        // Schedule retry if connection didn't open within 3.5 seconds
        if (this.retryTimer) clearTimeout(this.retryTimer);
        this.retryTimer = setTimeout(() => {
          if (!handshakeOpened && !this.isDestroyed) {
            try {
              conn.close();
            } catch (e) { }
            if (attempts < maxAttempts) {
              attemptConnect();
            } else {
              this.onStateChange?.({
                statusMessage: `Gagal terhubung ke ${this.roomCode}. Pastikan Host sudah membuka kamera & kode benar.`,
              });
            }
          }
        }, 3500);
      } catch (connectErr) {
        console.warn("Error calling peer.connect:", connectErr);
      }
    };

    this.peer.on("open", () => {
      attemptConnect();
    });

    // Answer incoming media call from host
    this.peer.on("call", (call: any) => {
      this.call = call;
      call.answer(this.localStream);

      call.on("stream", (remoteMediaStream: MediaStream) => {
        this.remoteStream = remoteMediaStream;
        this.onStateChange?.({
          remoteStream: remoteMediaStream,
          isConnected: true,
          statusMessage: "🟢 Kamera berdua aktif! Pose bareng! 💖",
        });
      });

      call.on("close", () => {
        if (this.call === call) {
          this.handleDisconnect("Host mengakhiri sesi panggilan.");
        }
      });

      call.on("error", (callErr: any) => {
        console.warn("Guest incoming call error:", callErr);
      });
    });

    this.peer.on("disconnected", () => {
      try {
        if (this.peer && !this.peer.destroyed && !this.isDestroyed) {
          this.peer.reconnect();
        }
      } catch (e) { }
    });

    this.peer.on("error", (err: any) => {
      console.warn("PeerJS Guest Error:", err);
      if (err.type === "peer-unavailable" && attempts >= maxAttempts) {
        this.onStateChange?.({
          statusMessage: `Room ${this.roomCode} tidak ditemukan atau Host belum membuka kamera.`,
        });
      }
    });
  }

  // Send message across WebRTC data channel
  public sendMessage(msg: LDRMessage) {
    if (this.connection && this.connection.open) {
      try {
        this.connection.send(msg);
      } catch (err) {
        console.warn("LDR send error:", err);
      }
    }
  }

  // Trigger countdown simultaneously on both screens
  public triggerCountdown(seconds: number = 3) {
    this.sendMessage({ type: "START_COUNTDOWN", seconds });
  }

  // Broadcast captured shot in safe 16KB chunks so WebRTC SCTP DataChannel never drops
  public syncShot(shotIndex: number, dataUrl: string) {
    if (!this.connection || !this.connection.open) return;
    if (dataUrl.length <= CHUNK_SIZE) {
      this.sendMessage({ type: "SYNC_SHOT", shotIndex, dataUrl });
      return;
    }

    const transferId = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const totalChunks = Math.ceil(dataUrl.length / CHUNK_SIZE);
    for (let i = 0; i < totalChunks; i++) {
      const chunk = dataUrl.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);
      this.sendMessage({
        type: "SYNC_SHOT_CHUNK",
        transferId,
        shotIndex,
        chunkIndex: i,
        totalChunks,
        chunk,
      });
    }
  }

  // When guest disconnects, Host resets connection state but KEEPS the room alive
  private disconnectGuest(msg: string) {
    if (this.isHost) {
      if (this.call) {
        try {
          this.call.close();
        } catch (e) { }
        this.call = null;
      }
      if (this.connection) {
        try {
          this.connection.close();
        } catch (e) { }
        this.connection = null;
      }
      this.remoteStream = null;
      this.onStateChange?.({
        isConnected: false,
        remoteStream: null,
        statusMessage: `${msg} Menunggu teman bergabung kembali ke ${this.roomCode}...`,
      });
    } else {
      this.handleDisconnect(msg);
    }
  }

  private handleDisconnect(msg: string) {
    this.onStateChange?.({
      isConnected: false,
      remoteStream: null,
      statusMessage: msg,
    });
    this.cleanup();
  }

  private startSessionTimeout() {
    if (this.sessionTimeoutTimer) clearTimeout(this.sessionTimeoutTimer);
    this.sessionTimeoutTimer = setTimeout(() => {
      this.sendMessage({ type: "SESSION_ENDED" });
      this.handleDisconnect("Sesi 30 menit telah berakhir secara otomatis.");
    }, 1800000);
  }

  public cleanup() {
    this.isDestroyed = true;
    this.chunkBuffers.clear();
    if (this.retryTimer) {
      clearTimeout(this.retryTimer);
      this.retryTimer = null;
    }
    if (this.sessionTimeoutTimer) {
      clearTimeout(this.sessionTimeoutTimer);
      this.sessionTimeoutTimer = null;
    }
    if (this.call) {
      try {
        this.call.close();
      } catch (e) { }
      this.call = null;
    }
    if (this.connection) {
      try {
        this.connection.close();
      } catch (e) { }
      this.connection = null;
    }
    if (this.peer) {
      try {
        this.peer.destroy();
      } catch (e) { }
      this.peer = null;
    }
    this.remoteStream = null;
  }
}
