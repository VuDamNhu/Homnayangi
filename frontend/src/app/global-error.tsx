"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <head>
        <title>Error</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <div style={{ padding: "20px", textAlign: "center", fontFamily: "sans-serif" }}>
          <h2>Something went wrong!</h2>
          <p>A critical error occurred.</p>
          <button
            onClick={() => reset()}
            style={{
              padding: "10px 20px",
              marginTop: "10px",
              cursor: "pointer",
              background: "#333",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
