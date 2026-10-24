/**
 * P2P WebRTC Strip Transfer between Desktop and Mobile
 * Zero server storage, zero third-party API leaks.
 * Uses WebRTC DataChannel (PeerJS) to beam high-res strip image directly from laptop to phone.
 */

export type TransferMessage =
  | { type: "REQUEST_STRIP" }
  | { type: "TRANSFER_PAYLOAD"; dataUrl: string; filename: string }
  | { type: "TRANSFER_COMPLETE" };

export function generateTransferCode(): string {
  const chars = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
  let code = "TR-";
  for (let i = 0; i < 5; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export class P2PStripSender {
  private peer: any = null;
  private connection: any = null;
  private stripDataUrl: string = "";
  private transferCode: string = "";
  private onTransferStatus: ((status: string) => void) | null = null;

  constructor(stripDataUrl: string, onTransferStatus?: (status: string) => void) {
    this.stripDataUrl = stripDataUrl;
    this.onTransferStatus = onTransferStatus || null;
  }

  public async startSender(code?: string): Promise<string> {
    this.transferCode = code || generateTransferCode();
    const { default: Peer } = await import("peerjs");
    const peerId = `riellybooth-sender-${this.transferCode}`;

    this.cleanup();
    this.peer = new Peer(peerId, { debug: 1 });

    this.peer.on("open", () => {
      this.onTransferStatus?.("Menunggu HP scan QR...");
    });

    this.peer.on("connection", (conn: any) => {
      this.connection = conn;
      this.onTransferStatus?.("HP terhubung! Mengirim photo strip...");

      conn.on("open", () => {
        // Send high-res strip image payload directly to phone
        conn.send({
          type: "TRANSFER_PAYLOAD",
          dataUrl: this.stripDataUrl,
          filename: `riellybooth-${Date.now()}.png`,
        });
        this.onTransferStatus?.("Berhasil terkirim ke HP! 🎉");
      });

      conn.on("data", (data: TransferMessage) => {
        if (data.type === "REQUEST_STRIP") {
          conn.send({
            type: "TRANSFER_PAYLOAD",
            dataUrl: this.stripDataUrl,
            filename: `riellybooth-${Date.now()}.png`,
          });
        }
      });
    });

    this.peer.on("error", (err: any) => {
      console.warn("P2P Sender Error:", err);
    });

    return this.transferCode;
  }

  public updateStripDataUrl(dataUrl: string) {
    this.stripDataUrl = dataUrl;
  }

  public cleanup() {
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
  }
}

export class P2PStripReceiver {
  private peer: any = null;
  private connection: any = null;

  public async receiveStrip(
    transferCode: string,
    onReceived: (dataUrl: string, filename: string) => void,
    onStatusChange: (status: string) => void
  ) {
    const { default: Peer } = await import("peerjs");
    const receiverId = `riellybooth-recv-${transferCode}-${Math.random().toString(36).substring(2, 6)}`;
    const senderId = `riellybooth-sender-${transferCode}`;

    onStatusChange("Menghubungkan ke laptop via WebRTC P2P...");
    this.peer = new Peer(receiverId, { debug: 1 });

    this.peer.on("open", () => {
      const conn = this.peer.connect(senderId, { reliable: true });
      this.connection = conn;

      conn.on("open", () => {
        onStatusChange("Terhubung ke laptop! Mengunduh foto...");
        conn.send({ type: "REQUEST_STRIP" });
      });

      conn.on("data", (data: TransferMessage) => {
        if (data.type === "TRANSFER_PAYLOAD") {
          onStatusChange("Foto strip berhasil diterima! 🎀");
          onReceived(data.dataUrl, data.filename);
        }
      });

      conn.on("error", (err: any) => {
        console.warn("Receiver conn error:", err);
        onStatusChange("Koneksi transfer gagal atau laptop telah ditutup.");
      });
    });

    this.peer.on("error", (err: any) => {
      console.warn("Receiver peer error:", err);
      onStatusChange("Gagal menemukan sesi laptop. Pastikan layar laptop masih terbuka.");
    });
  }

  public cleanup() {
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
  }
}
