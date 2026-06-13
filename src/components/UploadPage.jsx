import React, { useState, useRef } from "react";

export default function UploadPage({ onResult, onLoading, checkTrial, trialsLeft, user, onLogout }) {
  const [file, setFile] = useState(null);
  const [role, setRole] = useState("");
  const [error, setError] = useState("");
  const [focusedField, setFocusedField] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef();

  const handleFile = (f) => {
    if (f && f.type === "application/pdf") {
      setFile(f);
      setError("");
    } else {
      setError("Only PDF files are supported.");
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleUpload = async () => {
    if (!file) { setError("Please select a PDF file!"); return; }
    if (!role) { setError("Please enter the role you are applying for!"); return; }

    const allowed = checkTrial(onResult, onLoading);
    if (!allowed) return;

    setError("");
    setLoading(true);
    onLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("role", role);

    try {
      const res = await fetch("https://resume-analyzer-backend-production-6455.up.railway.app/api/resume/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || `Server error: ${res.status}`);
      }

      const parsed = typeof data.analysis === "string"
        ? JSON.parse(data.analysis)
        : data.analysis;

      onResult(parsed);
    } catch (err) {
      console.error("Upload error:", err);
      setError("Error: " + err.message);
    } finally {
      setLoading(false);
      onLoading(false);
    }
  };

  const isPremium = trialsLeft === "unlimited";

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0b0d14",
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
      color: "#f1f5f9",
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

      {/* Top nav */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "14px 32px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        background: "rgba(11,13,20,0.8)", backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: "32px", height: "32px",
            background: "linear-gradient(135deg, #6366f1, #22d3ee)",
            borderRadius: "9px",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "16px",
          }}>⚡</div>
          <span style={{ fontWeight: "700", fontSize: "15px", letterSpacing: "-0.01em" }}>ResumeAI</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{
            padding: "5px 12px", borderRadius: "99px", fontSize: "12px", fontWeight: "600",
            background: isPremium ? "rgba(99,102,241,0.15)" : trialsLeft > 0 ? "rgba(251,191,36,0.1)" : "rgba(239,68,68,0.1)",
            border: `1px solid ${isPremium ? "rgba(99,102,241,0.4)" : trialsLeft > 0 ? "rgba(251,191,36,0.3)" : "rgba(239,68,68,0.3)"}`,
            color: isPremium ? "#a5b4fc" : trialsLeft > 0 ? "#fbbf24" : "#f87171",
          }}>
            {isPremium ? "⭐ Premium" : `${trialsLeft} trial${trialsLeft !== 1 ? "s" : ""} left`}
          </div>

          <div style={{
            display: "flex", alignItems: "center", gap: "8px",
            padding: "6px 12px",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "99px",
          }}>
            <div style={{
              width: "22px", height: "22px", borderRadius: "50%",
              background: "linear-gradient(135deg, #6366f1, #22d3ee)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "11px", fontWeight: "700", color: "#fff",
            }}>
              {(user?.name || user?.email || "U")[0].toUpperCase()}
            </div>
            <span style={{ color: "#94a3b8", fontSize: "13px" }}>
              {user?.name || user?.email}
            </span>
          </div>

          <button type="button" onClick={onLogout} style={{
            background: "transparent",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "#475569", padding: "6px 14px",
            borderRadius: "8px", cursor: "pointer", fontSize: "12px",
            fontWeight: "500", transition: "all 0.2s",
          }}>
            Sign out
          </button>
        </div>
      </div>

      {/* Main content */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        minHeight: "100vh", padding: "100px 24px 40px",
      }}>
        <div style={{ width: "100%", maxWidth: "520px" }}>

          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "6px",
              background: "rgba(99,102,241,0.1)",
              border: "1px solid rgba(99,102,241,0.2)",
              borderRadius: "99px", padding: "5px 14px",
              fontSize: "12px", fontWeight: "600", color: "#a5b4fc",
              marginBottom: "16px",
            }}>
              <span>✦</span> AI-Powered Analysis
            </div>
            <h1 style={{
              fontSize: "32px", fontWeight: "800",
              letterSpacing: "-0.03em", marginBottom: "10px",
              color: "#f1f5f9",
            }}>
              Analyze your{" "}
              <span style={{
                background: "linear-gradient(90deg, #6366f1, #22d3ee)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>resume</span>
            </h1>
            <p style={{ color: "#475569", fontSize: "15px" }}>
              Upload your PDF and get instant feedback tailored to your target role.
            </p>
          </div>

          <div style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: "20px", padding: "36px",
            backdropFilter: "blur(20px)",
          }}>

            <div style={{ marginBottom: "24px" }}>
              <label style={{
                display: "block", fontSize: "12px", fontWeight: "600",
                color: "#64748b", marginBottom: "8px",
                textTransform: "uppercase", letterSpacing: "0.06em",
              }}>
                Target Role
              </label>
              <input
                type="text"
                placeholder="e.g. Data Analyst, Full Stack Developer…"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                onFocus={() => setFocusedField("role")}
                onBlur={() => setFocusedField(null)}
                onKeyDown={(e) => { if (e.key === "Enter") e.preventDefault(); }}
                style={{
                  width: "100%", padding: "13px 16px",
                  background: focusedField === "role" ? "rgba(99,102,241,0.08)" : "rgba(255,255,255,0.04)",
                  border: `1px solid ${focusedField === "role" ? "rgba(99,102,241,0.6)" : "rgba(255,255,255,0.1)"}`,
                  borderRadius: "10px", color: "#f1f5f9",
                  fontSize: "14px", outline: "none",
                  boxSizing: "border-box", transition: "all 0.2s ease",
                  fontFamily: "inherit",
                }}
              />
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label style={{
                display: "block", fontSize: "12px", fontWeight: "600",
                color: "#64748b", marginBottom: "8px",
                textTransform: "uppercase", letterSpacing: "0.06em",
              }}>
                Resume PDF
              </label>
              <div
                onClick={() => fileInputRef.current.click()}
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                style={{
                  border: `2px dashed ${dragging ? "rgba(99,102,241,0.7)" : file ? "rgba(34,211,238,0.4)" : "rgba(255,255,255,0.1)"}`,
                  borderRadius: "14px",
                  padding: "36px 24px",
                  textAlign: "center",
                  cursor: "pointer",
                  background: dragging
                    ? "rgba(99,102,241,0.06)"
                    : file
                    ? "rgba(34,211,238,0.04)"
                    : "rgba(255,255,255,0.02)",
                  transition: "all 0.2s ease",
                }}
              >
                <input
                  ref={fileInputRef}
                  type="file" accept=".pdf"
                  style={{ display: "none" }}
                  onChange={(e) => handleFile(e.target.files[0])}
                />

                {file ? (
                  <>
                    <div style={{ fontSize: "32px", marginBottom: "10px" }}>📄</div>
                    <p style={{ color: "#22d3ee", fontWeight: "600", fontSize: "14px", marginBottom: "4px" }}>
                      {file.name}
                    </p>
                    <p style={{ color: "#475569", fontSize: "12px" }}>
                      {(file.size / 1024).toFixed(1)} KB · Click to change
                    </p>
                  </>
                ) : (
                  <>
                    <div style={{
                      width: "48px", height: "48px", borderRadius: "14px",
                      background: "rgba(99,102,241,0.1)",
                      border: "1px solid rgba(99,102,241,0.2)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "22px", margin: "0 auto 14px",
                    }}>📎</div>
                    <p style={{ color: "#94a3b8", fontSize: "14px", fontWeight: "500", marginBottom: "4px" }}>
                      Drop your PDF here or{" "}
                      <span style={{ color: "#6366f1", textDecoration: "underline" }}>browse</span>
                    </p>
                    <p style={{ color: "#334155", fontSize: "12px" }}>PDF only · Max 10MB</p>
                  </>
                )}
              </div>
            </div>

            {error && (
              <div style={{
                background: "rgba(239,68,68,0.08)",
                border: "1px solid rgba(239,68,68,0.2)",
                borderRadius: "10px", padding: "11px 16px",
                marginBottom: "20px", color: "#fca5a5",
                fontSize: "13px", display: "flex", alignItems: "center", gap: "8px",
              }}>
                <span>⚠️</span> {error}
              </div>
            )}

            <button
              type="button"
              onClick={handleUpload}
              disabled={loading}
              style={{
                width: "100%", padding: "14px",
                background: loading
                  ? "rgba(99,102,241,0.35)"
                  : "linear-gradient(135deg, #6366f1 0%, #22d3ee 100%)",
                border: "none", borderRadius: "11px",
                color: loading ? "#94a3b8" : "#fff",
                fontSize: "15px", fontWeight: "700",
                cursor: loading ? "not-allowed" : "pointer",
                letterSpacing: "-0.01em",
                boxShadow: loading ? "none" : "0 0 28px rgba(99,102,241,0.3)",
                transition: "all 0.2s ease",
                fontFamily: "inherit",
              }}
            >
              {loading ? (
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                  <span style={{
                    width: "14px", height: "14px", border: "2px solid #475569",
                    borderTopColor: "#94a3b8", borderRadius: "50%",
                    display: "inline-block",
                    animation: "spin 0.7s linear infinite",
                  }} />
                  Analyzing…
                </span>
              ) : "Analyze Resume →"}
            </button>

            {!isPremium && trialsLeft <= 1 && trialsLeft !== "unlimited" && (
              <p style={{ textAlign: "center", color: "#475569", fontSize: "12px", marginTop: "14px" }}>
                {trialsLeft === 0
                  ? <>You've used all your trials. <span style={{ color: "#6366f1", cursor: "pointer" }}>Upgrade to Premium</span> for unlimited access.</>
                  : <>Last free trial — <span style={{ color: "#6366f1", cursor: "pointer" }}>upgrade for unlimited</span></>
                }
              </p>
            )}
          </div>

          <div style={{
            display: "flex", justifyContent: "center", gap: "24px",
            marginTop: "28px",
          }}>
            {[
              { icon: "🎯", label: "ATS Scoring" },
              { icon: "✨", label: "AI Feedback" },
              { icon: "📊", label: "Keyword Match" },
            ].map(({ icon, label }) => (
              <div key={label} style={{
                display: "flex", alignItems: "center", gap: "6px",
                color: "#334155", fontSize: "12px", fontWeight: "500",
              }}>
                <span>{icon}</span> {label}
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}