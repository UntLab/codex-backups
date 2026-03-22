import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get("name") || "Digital Card";
  const title = searchParams.get("title") || "";
  const accent = searchParams.get("accent") || "#00ffcc";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#030305",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px 60px",
            borderRadius: "24px",
            border: `2px solid ${accent}33`,
            background: "rgba(10, 15, 20, 0.9)",
          }}
        >
          <div
            style={{
              fontSize: 20,
              color: accent,
              marginBottom: 12,
              letterSpacing: 2,
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            DIGITAL IDENTITY
          </div>
          <div
            style={{
              fontSize: 56,
              fontWeight: 800,
              color: "#ffffff",
              textTransform: "uppercase",
              letterSpacing: 3,
              marginBottom: 8,
            }}
          >
            {name}
          </div>
          {title && (
            <div
              style={{
                fontSize: 24,
                color: accent,
                marginTop: 8,
              }}
            >
              {title}
            </div>
          )}
          <div
            style={{
              width: 60,
              height: 3,
              background: accent,
              marginTop: 24,
              borderRadius: 2,
            }}
          />
          <div
            style={{
              fontSize: 14,
              color: "#5a6b7c",
              marginTop: 16,
              letterSpacing: 1,
            }}
          >
            CardSaaS — Digital Business Cards
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
