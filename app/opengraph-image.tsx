import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "RiellyBooth — Little Moments, Big Memories · Online Photobooth";
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
          backgroundColor: "#FFF0F4",
          backgroundImage: "radial-gradient(#F8D8E3 2px, transparent 2px)",
          backgroundSize: "26px 26px",
          padding: "56px 72px",
          fontFamily: "sans-serif",
          border: "12px solid #FFF9F0",
        }}
      >
        {/* Left Column: Scrapbook Pink Editorial Branding */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            maxWidth: "660px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 18px",
              backgroundColor: "#FFF9F0",
              border: "2px solid #E9B8CA",
              borderRadius: "999px",
              color: "#E84D91",
              fontSize: "15px",
              fontWeight: 800,
              letterSpacing: "1.5px",
              marginBottom: "22px",
            }}
          >
            ONLINE PHOTOBOOTH STUDIO · 100% FREE
          </div>

          <div
            style={{
              fontSize: "74px",
              fontWeight: 900,
              color: "#392633",
              lineHeight: 1.02,
              marginBottom: "10px",
              display: "flex",
            }}
          >
            RiellyBooth
          </div>

          <div
            style={{
              fontSize: "34px",
              fontWeight: 800,
              color: "#E84D91",
              lineHeight: 1.15,
              marginBottom: "18px",
              display: "flex",
            }}
          >
            Little Moments, Big Memories.
          </div>

          <div
            style={{
              fontSize: "21px",
              color: "#8B7180",
              lineHeight: 1.45,
              marginBottom: "30px",
              display: "flex",
            }}
          >
            Your own little photo studio. Capture cute moments, create HD photo strips, Live Photo MP4, and keep memories forever — zero watermark.
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
            }}
          >
            {[
              "30+ Aesthetic Frames",
              "Newspaper Broadsheet",
              "LDR Mode P2P",
              "Live Photo MP4",
              "Zero Watermark",
            ].map((feat) => (
              <div
                key={feat}
                style={{
                  backgroundColor: "#FFF9F0",
                  border: "2px solid #E9B8CA",
                  borderRadius: "999px",
                  padding: "8px 16px",
                  fontSize: "15px",
                  fontWeight: 700,
                  color: "#392633",
                  display: "flex",
                }}
              >
                {feat}
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Layered Scrapbook Photostrip Card */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "290px",
            backgroundColor: "#FFFFFF",
            border: "3px solid #E9B8CA",
            borderRadius: "24px",
            padding: "20px 18px 24px 18px",
            boxShadow: "0 18px 36px -8px rgba(57, 38, 51, 0.16)",
            transform: "rotate(3deg)",
          }}
        >
          <div
            style={{
              fontSize: "13px",
              fontWeight: 800,
              color: "#E84D91",
              letterSpacing: "2px",
              marginBottom: "14px",
              display: "flex",
            }}
          >
            RIELLYBOOTH STUDIO
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              width: "100%",
            }}
          >
            {["01 · SMILE", "02 · POSE", "03 · CANDID", "04 · MEMORY"].map((label, idx) => (
              <div
                key={label}
                style={{
                  width: "100%",
                  height: "76px",
                  backgroundColor: idx % 2 === 0 ? "#FFF0F4" : "#FFF9F0",
                  border: "2px solid #F8D8E3",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "14px",
                  fontWeight: 800,
                  color: "#E84D91",
                  letterSpacing: "1.5px",
                }}
              >
                {label}
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: "16px",
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              paddingTop: "10px",
              borderTop: "1px solid #F8D8E3",
              fontSize: "12px",
              fontWeight: 700,
              color: "#8B7180",
            }}
          >
            <span>riellybooth.my.id</span>
            <span style={{ color: "#E84D91" }}>300 DPI HD</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
