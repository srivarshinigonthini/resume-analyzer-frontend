import React, { useEffect, useState } from "react";

const steps = [
  "Parsing your resume...",
  "Analyzing skills & keywords...",
  "Matching against role requirements...",
  "Calculating ATS score...",
  "Generating recommendations...",
];

export default function LoadingPage() {
  const [dots, setDots] = useState("");
  const [step, setStep] = useState(0);

  useEffect(() => {
    const dotsInterval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 400);

    const stepInterval = setInterval(() => {
      setStep((prev) => (prev + 1) % steps.length);
    }, 1800);

    return () => {
      clearInterval(dotsInterval);
      clearInterval(stepInterval);
    };
  }, []);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0b0d14",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
      color: "#f1f5f9",
      padding: "20px",
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

      <div style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: "24px",
        backdropFilter: "blur(20px)",
        padding: "52px 48px",
        width: "100%", maxWidth: "460px",
        textAlign: "center",
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginBottom: "36px" }}>
          <div style={{
            width: "36px", height: "36px",
            background: "linear-gradient(135deg, #6366f1, #22d3ee)",
            borderRadius: "10px",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "18px",
          }}>⚡</div>
          <span style={{ fontWeight: "700", fontSize: "16px", letterSpacing: "-0.01em" }}>ResumeAI</span>
        </div>

        {/* Spinner */}
        <div style={{ position: "relative", width: "88px", height: "88px", margin: "0 auto 32px" }}>
          <svg width="88" height="88" viewBox="0 0 88 88" style={{ position: "absolute", inset: 0 }}>
            <circle cx="44" cy="44" r="36" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
            <circle
              cx="44" cy="44" r="36"
              fill="none"
              stroke="url(#spinGrad)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray="60 166"
              style={{ animation: "spin 1.2s linear infinite", transformOrigin: "44px 44px" }}
            />
            <defs>
              <linearGradient id="spinGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#22d3ee" />
              </linearGradient>
            </defs>
          </svg>
          <div style={{
            position: "absolute", inset: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "26px",
          }}>🧠</div>
        </div>

        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>

        {/* Headline */}
        <h2 style={{
          fontSize: "22px", fontWeight: "800",
          letterSpacing: "-0.02em", marginBottom: "10px",
        }}>
          Analyzing Your{" "}
          <span style={{
            background: "linear-gradient(90deg, #6366f1, #22d3ee)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>Resume</span>
        </h2>

        {/* Animated step text */}
        <p style={{
          color: "#475569", fontSize: "14px", minHeight: "22px",
          transition: "opacity 0.3s",
        }}>
          {steps[step]}{dots}
        </p>

        {/* Progress pills */}
        <div style={{ display: "flex", justifyContent: "center", gap: "6px", marginTop: "32px" }}>
          {steps.map((_, i) => (
            <div key={i} style={{
              height: "4px",
              width: i === step ? "28px" : "8px",
              borderRadius: "99px",
              background: i === step
                ? "linear-gradient(90deg, #6366f1, #22d3ee)"
                : "rgba(255,255,255,0.08)",
              transition: "width 0.4s ease, background 0.4s ease",
            }} />
          ))}
        </div>

        <p style={{ color: "#1e293b", fontSize: "12px", marginTop: "28px" }}>
          This usually takes 10–20 seconds
        </p>
      </div>
    </div>
  );
}