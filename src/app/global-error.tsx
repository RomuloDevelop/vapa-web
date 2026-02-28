"use client";

import { useEffect } from "react";
import { captureError } from "@/lib/error-tracking";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    captureError(error);
  }, [error]);

  return (
    <html lang="en" className="h-full">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#142840",
          fontFamily: "'Outfit', sans-serif",
          color: "#FFFFFF",
        }}
      >
        <div
          style={{
            maxWidth: 480,
            padding: "48px 32px",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            gap: 24,
          }}
        >
          <span
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "#DCBA60",
              letterSpacing: "2px",
              textTransform: "uppercase",
            }}
          >
            SYSTEM ERROR
          </span>
          <h1
            style={{
              fontSize: 32,
              fontWeight: 700,
              margin: 0,
              lineHeight: 1.2,
            }}
          >
            Something went wrong
          </h1>
          <p
            style={{
              fontSize: 15,
              color: "#C2CEDB",
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            We encountered an unexpected error. Our team has been notified and is
            working on a fix.
          </p>
          <div
            style={{
              display: "flex",
              gap: 12,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={reset}
              style={{
                padding: "14px 32px",
                backgroundColor: "#DCBA60",
                color: "#142840",
                fontSize: 14,
                fontWeight: 600,
                border: "none",
                borderRadius: 6,
                cursor: "pointer",
              }}
            >
              Try Again
            </button>
            <a
              href="/"
              style={{
                padding: "14px 32px",
                backgroundColor: "transparent",
                color: "#C2CEDB",
                fontSize: 14,
                fontWeight: 500,
                border: "1px solid rgba(220, 186, 96, 0.5)",
                borderRadius: 6,
                textDecoration: "none",
                cursor: "pointer",
              }}
            >
              Go Home
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
