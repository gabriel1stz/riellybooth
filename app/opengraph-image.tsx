import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "riellybooth ♡ Photobooth Online Gratis & Aesthetic Photo Strip";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "#FFF5F7",
          backgroundImage: "radial-gradient(#FBCFE8 2px, transparent 2px)",
          backgroundSize: "24px 24px",
          padding: "50px 70px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Left Column: Branding & Tagline */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            maxWidth: "650px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 18px",
              backgroundColor: "#FFE4E6",
              border: "2px solid #FDA4AF",
              borderRadius: "999px",
              color: "#9F1239",
              fontSize: "18px",
              fontWeight: 800,
              marginBottom: "20px",
            }}
          >
            🎀 VIRTUAL PHOTOBOOTH ONLINE #1 INDONESIA
          </div>
          <div
            style={{
              fontSize: "68px",
              fontWeight: 900,
              color: "#1E293B",
              lineHeight: 1.05,
              marginBottom: "16px",
              display: "flex",
              alignItems: "center",
              gap: "14px",
            }}
          >
            <span>riellybooth</span>
            <span style={{ color: "#F43F5E" }}>♡</span>
          </div>
          <div
            style={{
              fontSize: "24px",
              color: "#475569",
              lineHeight: 1.4,
              marginBottom: "32px",
            }}
          >
            Bikin photo strip aesthetic langsung dari browser HP & laptop. Gratis tanpa watermark!
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            {["16+ Frame Viral", "Mode LDR Jarak Jauh", "Live Photo MP4", "Halloween Edition 🎃", "100% Gratis"].map(
              (feat) => (
                <div
                  key={feat}
                  style={{
                    backgroundColor: "#FFFFFF",
                    border: "2px solid #F472B6",
                    borderRadius: "14px",
                    padding: "8px 16px",
                    fontSize: "16px",
                    fontWeight: 700,
                    color: "#BE185D",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
                  }}
                >
                  ✨ {feat}
                </div>
              )
            )}
          </div>
        </div>

        {/* Right Column: Visual Mockup Photostrip */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "300px",
            backgroundColor: "#FFFFFF",
            border: "4px solid #F472B6",
            borderRadius: "28px",
            padding: "20px 18px",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.12)",
            transform: "rotate(3deg)",
          }}
        >
          <div
            style={{
              fontSize: "16px",
              fontWeight: 800,
              color: "#E11D48",
              marginBottom: "12px",
            }}
          >
            🎀 riellybooth strip 🎀
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              width: "100%",
            }}
          >
            {[1, 2, 3].map((num) => (
              <div
                key={num}
                style={{
                  width: "100%",
                  height: "92px",
                  backgroundColor: "#FDF2F8",
                  border: "2px solid #FBCFE8",
                  borderRadius: "14px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "36px",
                }}
              >
                {num === 1 ? "✌️" : num === 2 ? "💖" : "🎃"}
              </div>
            ))}
          </div>
          <div
            style={{
              marginTop: "16px",
              fontSize: "13px",
              fontWeight: 800,
              color: "#64748B",
              letterSpacing: "1px",
            }}
          >
            RIELLYBOOTH.MY.ID
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
