import React, { useEffect, useState } from "react";

const steps = [
  "Reading your resume...",
  "Analyzing skills & experience...",
  "Matching with role requirements...",
  "Generating AI feedback...",
  "Almost done...",
];

export default function LoadingPage() {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0b0d14",
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
      color: "#f1f5f9",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}>
      {/* Glow blobs */}
      <div style={{
        position: "fixed", top: "-100px", left: "-100px",
        width: "400px", height: "400px",
        background: "radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "fixed", bottom: "-80px", right: "-80px",
        width: "350px", height: "350px",
        background: "radial-gradient(circle, rgba(34,211,238,0.08) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div style={{ textAlign: "center", padding: "40px" }}>

        {/* Spinner */}
        <div style={{
          width: "72px", height: "72px",
          border: "3px solid rgba(99,102,241,0.15)",
          borderTop: "3px solid #6366f1",
          borderRadius: "50%",
          margin: "0 auto 32px",
          animation: "spin 0.9s linear infinite",
        }} />

        {/* Title */}
        <h2 style={{
          fontSize: "24px", fontWeight: "800",
          letterSpacing: "-0.03em", marginBottom: "12px",
          background: "linear-gradient(90deg, #6366f1, #22d3ee)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>
          Analyzing your resume
        </h2>

        {/* Current step */}
        <p style={{
          color: "#64748b", fontSize: "15px",
          minHeight: "24px", transition: "all 0.3s ease",
        }}>
          {steps[stepIndex]}
        </p>

        {/* Step dots */}
        <div style={{
          display: "flex", justifyContent: "center", gap: "8px", marginTop: "32px",
        }}>
          {steps.map((_, i) => (
            <div key={i} style={{
              width: i === stepIndex ? "20px" : "6px",
              height: "6px",
              borderRadius: "99px",
              background: i <= stepIndex ? "#6366f1" : "rgba(255,255,255,0.08)",
              transition: "all 0.4s ease",
            }} />
          ))}
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}