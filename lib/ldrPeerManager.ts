/**
 * WebRTC Peer-to-Peer Manager for riellybooth ♡
 * Supports:
 * 1. Mode Berdua Jarak Jauh (LDR Photobooth):
 *    - 6-character random alphanumeric room code (e.g. RLY-8K2N9X)
 *    - Strict 2-participant limit (Host + 1 Guest)
 *    - Host admission control (prompt to accept/reject incoming guest)
 *    - Bi-directional MediaStream video streaming (side-by-side composite)
 *    - Synchronized countdown & snapshot triggers across devices
 *    - 30-minute auto-expiration session safety
 * 2. Transfer Hasil Strip Laptop -> HP (Scan QR):
 *    - Direct in-browser encrypted P2P image transfer
 *    - Zero server storage / zero third-party leak
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

// Generate 6-char random alphanumeric room code excluding confusing chars (0, O, 1, I)
export function generateLDRRoomCode(): string {
  const chars = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
  let result = "RLY-";
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
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

  // Initialize Host Room (e.g. peer id: riellybooth-host-RLY-8X2M9K)
  public async initHostRoom(roomCode: string, localStream: MediaStream) {
    this.roomCode = roomCode.toUpperCase();
    this.isHost = true;
    this.localStream = localStream;
    this.cleanup();

    const { default: Peer } = await import("peerjs");
    const hostPeerId = `riellybooth-host-${this.roomCode}`;

    this.peer = new Peer(hostPeerId, {
      debug: 1,
    });

    this.peer.on("open", () => {
      this.onStateChange?.({
        roomCode: this.roomCode,
        isHost: true,
        isConnected: false,
        statusMessage: "Menunggu ayang/bestie kamu membuka link...",
      });
      // 30-minute session auto-expire
      this.startSessionTimeout();
    });

    this.peer.on("connection", (conn: any) => {
      // If already connected to 1 guest, reject any 3rd party device
      if (this.connection) {
        conn.on("open", () => {
          conn.send({ type: "JOIN_REJECTED", reason: "Room sudah penuh (Maksimal 2 orang)." });
          setTimeout(() => conn.close(), 1000);
        });
        return;
      }

      conn.on("data", (data: LDRMessage) => {
        if (data.type === "JOIN_REQUEST") {
          // Admission control: host must accept guest
          this.onStateChange?.({
            guestRequest: {
              guestName: data.guestName || "Ayang / Bestie",
              guestPeerId: data.guestPeerId,
              accept: () => this.acceptGuest(conn, data.guestPeerId),
              reject: () => this.rejectGuest(conn),
            },
          });
        } else {
          this.onMessageReceived?.(data);
        }
      });
    });

    this.peer.on("error", (err: any) => {
      console.warn("PeerJS Host Error:", err);
      if (err.type === "unavailable-id") {
        this.onStateChange?.({ statusMessage: "Kode room sudah terpakai, silakan buat kode baru." });
      }
    });
  }

  // Host approves incoming guest
  private acceptGuest(conn: any, guestPeerId: string) {
    this.connection = conn;
    conn.send({ type: "JOIN_ACCEPTED", roomCode: this.roomCode });

    this.onStateChange?.({
      guestRequest: null,
      isConnected: true,
      statusMessage: "Terhubung! Menghubungkan kamera...",
    });

    // Call guest with local camera stream
    if (this.localStream && this.peer) {
      const call = this.peer.call(guestPeerId, this.localStream);
      this.call = call;

      call.on("stream", (remoteMediaStream: MediaStream) => {
        this.remoteStream = remoteMediaStream;
        this.onStateChange?.({
          remoteStream: remoteMediaStream,
          isConnected: true,
          statusMessage: "🟢 Kamera berdua aktif!",
        });
      });

      call.on("close", () => {
        this.handleDisconnect("Ayang / bestie keluar dari sesi.");
      });
    }

    conn.on("close", () => {
      this.handleDisconnect("Koneksi terputus.");
    });
  }

  // Host rejects guest
  private rejectGuest(conn: any) {
    conn.send({ type: "JOIN_REJECTED", reason: "Host tidak menyetujui permintaan gabung." });
    setTimeout(() => conn.close(), 500);
    this.onStateChange?.({ guestRequest: null });
  }

  // Guest joins Host Room
  public async joinRoom(roomCode: string, localStream: MediaStream, guestName: string = "Ayang") {
    this.roomCode = roomCode.toUpperCase();
    this.isHost = false;
    this.localStream = localStream;
    this.cleanup();

    const { default: Peer } = await import("peerjs");
    const guestPeerId = `riellybooth-guest-${this.roomCode}-${Math.random().toString(36).substring(2, 6)}`;
    const hostPeerId = `riellybooth-host-${this.roomCode}`;

    this.peer = new Peer(guestPeerId, { debug: 1 });

    this.peer.on("open", () => {
      this.onStateChange?.({
        roomCode: this.roomCode,
        isHost: false,
        isConnected: false,
        statusMessage: "Menghubungkan ke room host...",
      });

      const conn = this.peer.connect(hostPeerId, { reliable: true });
      this.connection = conn;

      conn.on("open", () => {
        this.onStateChange?.({
          statusMessage: "Menunggu persetujuan host untuk bergabung...",
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
          statusMessage: "🟢 Kamera berdua aktif!",
        });
      });

      call.on("close", () => {
        this.handleDisconnect("Host mengakhiri sesi panggilan.");
      });
    });

    this.peer.on("error", (err: any) => {
      console.warn("PeerJS Guest Error:", err);
      this.onStateChange?.({
        statusMessage: "Gagal menemukan room. Pastikan kode room benar dan host masih aktif.",
      });
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
