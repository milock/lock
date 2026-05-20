import { ImageResponse } from "next/og";
import { profile } from "@/lib/data";

export const runtime = "edge";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${profile.name} — ${profile.headline}`;

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#1a1a1a",
          backgroundImage:
            "radial-gradient(circle at 80% -10%, rgba(4,150,136,0.16), transparent 55%)",
          padding: "80px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            color: "#a3a3a3",
            fontSize: 30,
            letterSpacing: "0.04em",
          }}
        >
          <div
            style={{
              width: 16,
              height: 16,
              borderRadius: 999,
              background: "#049688",
              marginRight: 18,
            }}
          />
          michaellock.dev
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              color: "#fafafa",
              fontSize: 104,
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
            }}
          >
            {profile.name}
          </div>
          <div
            style={{
              color: "#a3a3a3",
              fontSize: 40,
              marginTop: 28,
              maxWidth: 980,
              lineHeight: 1.25,
            }}
          >
            {profile.headline}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            color: "#737373",
            fontSize: 28,
          }}
        >
          <div
            style={{
              width: 64,
              height: 4,
              background: "#049688",
              marginRight: 24,
            }}
          />
          {profile.location}
        </div>
      </div>
    ),
    { ...size },
  );
}
