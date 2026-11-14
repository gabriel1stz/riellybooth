/**
 * WebRTC Peer-to-Peer Manager for riellybooth ♡
 * Supports:
 * 1. Mode Berdua Jarak Jauh (LDR Photobooth):
 *    - 6-character random alphanumeric room code (e.g. RLY-8K2N9X)
 *    - Strict 2-participant limit (Host + 1 Guest)
 *    - Instant Auto-Admission on valid room code + bi-directional status feedback
 *    - Bi-directional MediaStream video streaming (side-by-side composite)
 *    - Synchronized countdown & snapshot triggers across devices
 *    - Synchronized photo strip data across devices (SYNC_SHOT)
 *    - Carrier-grade NAT traversal with multi-provider STUN and Metered OpenRelay TURN servers
 *    - Resilient reconnection & session lifecycle
 * 2. Transfer Hasil Strip Laptop -> HP (Scan QR)
 */

export type LDRMessage =
  | { type: "JOIN_REQUEST"; guestName: string; guestPeerId: string }
  | { type: "JOIN_ACCEPTED"; roomCode: string }
  | { type: "JOIN_REJECTED"; reason: string }
  | { type: "START_COUNTDOWN"; seconds: number }
  | { type: "TRIGGER_SNAPSHOT"; shotIndex: number }
  | { type: "SYNC_SHOT"; shotIndex: number; dataUrl: string }
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

  // If input is a URL (e.g. https://riellybooth.my.id/?ldr=RLY-8X2M9K or ?room=...)
  if (clean.includes("?ldr=") || clean.includes("&ldr=")) {
    const match = clean.match(/[?&]ldr=([^&#\s]+)/i);
    if (match && match[1]) clean = match[1];
  } else if (clean.includes("?room=") || clean.includes("&room=")) {
    const match = clean.match(/[?&]room=([^&#\s]+)/i);
    if (match && match[1]) clean = match[1];
  }

  // Strip protocol and domain if present
  clean = clean.replace(/^https?:\/\/[^\/]+\/?/i, "");
  // Keep only uppercase alphanumeric and hyphens
  clean = clean.toUpperCase().replace(/[^A-Z0-9-]/g, "");

  // Ensure standard RLY- prefix
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
  private sessionTimeoutTimer: NodeJS.Timeout | null = null;
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

  // Initialize Host Room (e.g. peer id: riellybooth-host-RLY-8X2M9K)
  public async initHostRoom(roomCode: string, localStream: MediaStream) {
    this.roomCode = normalizeRoomCode(roomCode);
    this.isHost = true;
    this.localStream = localStream;
    this.cleanup();

    const { default: Peer } = await import("peerjs");
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
      // If already connected to an active open guest connection, reject 3rd party
      if (this.connection && this.connection.open) {
        conn.on("open", () => {
          conn.send({ type: "JOIN_REJECTED", reason: "Room sudah penuh (Maksimal 2 orang)." });
          setTimeout(() => {
            try {
              conn.close();
            } catch (e) {}
          }, 500);
        });
        return;
      }

      conn.on("data", (data: LDRMessage) => {
        if (data.type === "JOIN_REQUEST") {
          // Automatic seamless admission for holders of the private room code
          this.acceptGuest(conn, data.guestPeerId, data.guestName);
        } else {
          this.onMessageReceived?.(data);
        }
      });

      conn.on("close", () => {
        this.disconnectGuest("Ayang / bestie keluar dari sesi.");
      });

      conn.on("error", (err: any) => {
        console.warn("Host connection error:", err);
      });
    });

    // Also listen for incoming calls in case guest calls host
    this.peer.on("call", (call: any) => {
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
        this.disconnectGuest("Panggilan video selesai.");
      });
    });

    this.peer.on("disconnected", () => {
      // Reconnect to signaling server if disconnected
      try {
        if (this.peer && !this.peer.destroyed) {
          this.peer.reconnect();
        }
      } catch (e) {}
    });

    this.peer.on("error", (err: any) => {
      console.warn("PeerJS Host Error:", err);
      if (err.type === "unavailable-id") {
        this.onStateChange?.({
          statusMessage: "Kode room sedang aktif digunakan. Silakan gunakan kode baru.",
        });
      }
    });
  }

  // Host approves incoming guest
  private acceptGuest(conn: any, guestPeerId: string, guestName?: string) {
    this.connection = conn;
    conn.send({ type: "JOIN_ACCEPTED", roomCode: this.roomCode });

    this.onStateChange?.({
      guestRequest: null,
      isConnected: true,
      statusMessage: `💖 ${guestName || "Partner LDR"} terhubung! Menghubungkan kamera...`,
    });

    // Initiate WebRTC video call to guest
    if (this.localStream && this.peer) {
      setTimeout(() => {
        try {
          const call = this.peer.call(guestPeerId, this.localStream);
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
            this.disconnectGuest("Ayang / bestie mengakhiri panggilan.");
          });

          call.on("error", (callErr: any) => {
            console.warn("PeerJS Call Error:", callErr);
          });
        } catch (callInitErr) {
          console.warn("Failed to initiate call to guest:", callInitErr);
        }
      }, 300);
    }
  }

  // Guest joins Host Room
  public async joinRoom(roomCode: string, localStream: MediaStream, guestName: string = "Ayang") {
    this.roomCode = normalizeRoomCode(roomCode);
    this.isHost = false;
    this.localStream = localStream;
    this.cleanup();

    const { default: Peer } = await import("peerjs");
    const guestPeerId = `riellybooth-guest-${this.roomCode}-${Math.random().toString(36).substring(2, 7)}`;
    const hostPeerId = `riellybooth-host-${this.roomCode}`;

    this.peer = new Peer(guestPeerId, PEER_CONFIG);

    this.peer.on("open", () => {
      this.onStateChange?.({
        roomCode: this.roomCode,
        isHost: false,
        isConnected: false,
        statusMessage: `Menghubungkan ke room ${this.roomCode}...`,
      });

      const connectToHost = () => {
        try {
          const conn = this.peer.connect(hostPeerId, { reliable: true });
          this.connection = conn;

          conn.on("open", () => {
            this.onStateChange?.({
              statusMessage: "Terhubung! Menunggu handshake kamera host...",
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
                statusMessage: "Disetujui! Mengaktifkan kamera dua arah...",
              });

              // Also prepare to call host if host call doesn't arrive within 2 seconds
              setTimeout(() => {
                if (!this.remoteStream && this.peer && this.localStream) {
                  try {
                    const fallbackCall = this.peer.call(hostPeerId, this.localStream);
                    this.call = fallbackCall;
                    fallbackCall.on("stream", (remoteMediaStream: MediaStream) => {
                      this.remoteStream = remoteMediaStream;
                      this.onStateChange?.({
                        remoteStream: remoteMediaStream,
                        isConnected: true,
                        statusMessage: "🟢 Kamera berdua aktif! Pose bareng! 💖",
                      });
                    });
                  } catch (e) {}
                }
              }, 2000);
            } else if (data.type === "JOIN_REJECTED") {
              this.onStateChange?.({
                isConnected: false,
                statusMessage: `Gagal gabung: ${data.reason}`,
              });
              this.cleanup();
            } else {
              this.onMessageReceived?.(data);
            }
          });

          conn.on("close", () => {
            this.handleDisconnect("Host menutup sesi photobooth.");
          });

          conn.on("error", (connErr: any) => {
            console.warn("Guest connection error:", connErr);
            this.onStateChange?.({
              statusMessage: "Koneksi ke host terganggu. Menghubungkan ulang...",
            });
          });
        } catch (connectErr) {
          console.warn("Error calling peer.connect:", connectErr);
        }
      };

      connectToHost();
    });

    // Answer incoming call from host
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
        this.handleDisconnect("Host mengakhiri sesi panggilan.");
      });

      call.on("error", (callErr: any) => {
        console.warn("Guest incoming call error:", callErr);
      });
    });

    this.peer.on("disconnected", () => {
      try {
        if (this.peer && !this.peer.destroyed) {
          this.peer.reconnect();
        }
      } catch (e) {}
    });

    this.peer.on("error", (err: any) => {
      console.warn("PeerJS Guest Error:", err);
      if (err.type === "peer-unavailable") {
        this.onStateChange?.({
          statusMessage: `Room ${this.roomCode} tidak ditemukan atau Host belum membuka kamera. Pastikan kode benar.`,
        });
      } else {
        this.onStateChange?.({
          statusMessage: "Gagal menghubungkan ke room. Periksa jaringan internet kamu.",
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

  // Broadcast captured shot so both devices stay 100% in sync
  public syncShot(shotIndex: number, dataUrl: string) {
    this.sendMessage({ type: "SYNC_SHOT", shotIndex, dataUrl });
  }

  // When guest disconnects, Host resets connection state but KEEPS the room alive
  private disconnectGuest(msg: string) {
    if (this.isHost) {
      if (this.call) {
        try {
          this.call.close();
        } catch (e) {}
        this.call = null;
      }
      if (this.connection) {
        try {
          this.connection.close();
        } catch (e) {}
        this.connection = null;
      }
      this.remoteStream = null;
      this.onStateChange?.({
        isConnected: false,
        remoteStream: null,
        statusMessage: `${msg} Menunggu teman bergabung kembali...`,
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
    // 30 minutes = 1800000 ms
    this.sessionTimeoutTimer = setTimeout(() => {
      this.sendMessage({ type: "SESSION_ENDED" });
      this.handleDisconnect("Sesi 30 menit telah berakhir secara otomatis.");
    }, 1800000);
  }

  public cleanup() {
    if (this.sessionTimeoutTimer) {
      clearTimeout(this.sessionTimeoutTimer);
      this.sessionTimeoutTimer = null;
    }
    if (this.call) {
      try {
        this.call.close();
      } catch (e) {}
      this.call = null;
    }
    if (this.connection) {
      try {
        this.connection.close();
      } catch (e) {}
      this.connection = null;
    }
    if (this.peer) {
      try {
        this.peer.destroy();
      } catch (e) {}
      this.peer = null;
    }
    this.remoteStream = null;
  }
}
