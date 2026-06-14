import React, { useState, useEffect } from "react";

const FEATURES = [
  { icon: "🎯", title: "ATS Score Analysis", desc: "See exactly how your resume scores against applicant tracking systems." },
  { icon: "✨", title: "AI-Powered Feedback", desc: "Get line-by-line suggestions to strengthen your resume instantly." },
  { icon: "📊", title: "Keyword Matching", desc: "Match your skills to job descriptions with precision." },
];

export default function LoginPage({ onLogin }) {
  const [isNew, setIsNew] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [focusedField, setFocusedField] = useState(null);
  const [featureIndex, setFeatureIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const interval = setInterval(() => {
      setFeatureIndex((i) => (i + 1) % FEATURES.length);
    }, 3000);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => { clearInterval(interval); window.removeEventListener("resize", handleResize); };
  }, []);

  const handleSubmit = async () => {
    if (!email || !password) { setError("Please fill all fields."); return; }
    if (isNew && !name) { setError("Please enter your name."); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    setLoading(false);

    if (isNew) {
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      if (users.find((u) => u.email === email)) { setError("Email already registered. Try logging in."); return; }
      users.push({ name, email, password, isPremium: false });
      localStorage.setItem("users", JSON.stringify(users));
      localStorage.setItem("currentUser", JSON.stringify({ name, email, isPremium: false }));
    } else {
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const user = users.find((u) => u.email === email && u.password === password);
      if (!user) { setError("Invalid email or password."); return; }
      localStorage.setItem("currentUser", JSON.stringify(user));
    }
    onLogin();
  };

  const inputStyle = (field) => ({
    width: "100%",
    padding: "13px 16px",
    background: focusedField === field ? "rgba(99,102,241,0.08)" : "rgba(255,255,255,0.04)",
    border: `1px solid ${focusedField === field ? "rgba(99,102,241,0.6)" : "rgba(255,255,255,0.1)"}`,
    borderRadius: "10px",
    color: "#f1f5f9",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
    transition: "all 0.2s ease",
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
  });

  const labelStyle = {
    display: "block",
    fontSize: "12px",
    fontWeight: "600",
    color: "#94a3b8",
    marginBottom: "6px",
    letterSpacing: "0.05em",
    textTransform: "uppercase",
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0b0d14",
      display: "flex",
      flexDirection: isMobile ? "column" : "row",
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
      overflow: "hidden",
    }}>
      {/* ── LEFT PANEL ── */}
      <div style={{
        flex: isMobile ? "none" : "0 0 45%",
        background: "linear-gradient(145deg, #0f1120 0%, #12162b 100%)",
        borderRight: isMobile ? "none" : "1px solid rgba(255,255,255,0.06)",
        borderBottom: isMobile ? "1px solid rgba(255,255,255,0.06)" : "none",
        display: "flex",
        flexDirection: "column",
        justifyContent: isMobile ? "center" : "space-between",
        padding: isMobile ? "32px 24px" : "48px 52px",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: "-80px", left: "-80px",
          width: "360px", height: "360px",
          background: "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: "-100px", right: "-60px",
          width: "300px", height: "300px",
          background: "radial-gradient(circle, rgba(34,211,238,0.1) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        {/* Logo */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: isMobile ? "24px" : "56px" }}>
            <div style={{
              width: "36px", height: "36px",
              background: "linear-gradient(135deg, #6366f1, #22d3ee)",
              borderRadius: "10px",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "18px",
            }}>⚡</div>
            <span style={{ color: "#f1f5f9", fontWeight: "700", fontSize: "16px" }}>ResumeAI</span>
          </div>

          <h2 style={{
            fontSize: isMobile ? "24px" : "36px",
            fontWeight: "800", lineHeight: "1.15",
            color: "#f1f5f9", marginBottom: "16px", letterSpacing: "-0.03em",
          }}>
            Land your{" "}
            <span style={{
              background: "linear-gradient(90deg, #6366f1, #22d3ee)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>dream job</span>
            {" "}faster.
          </h2>
          {!isMobile && (
            <p style={{ color: "#64748b", fontSize: "15px", lineHeight: "1.6", maxWidth: "320px" }}>
              AI-powered resume analysis that tells you exactly what to fix.
            </p>
          )}
        </div>

        {/* Feature card - hide on mobile */}
        {!isMobile && (
          <div style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: "16px",
            padding: "28px",
          }}>
            <div style={{ fontSize: "28px", marginBottom: "12px" }}>{FEATURES[featureIndex].icon}</div>
            <div style={{ color: "#e2e8f0", fontWeight: "600", fontSize: "15px", marginBottom: "8px" }}>
              {FEATURES[featureIndex].title}
            </div>
            <div style={{ color: "#64748b", fontSize: "13px", lineHeight: "1.6" }}>
              {FEATURES[featureIndex].desc}
            </div>
            <div style={{ display: "flex", gap: "6px", marginTop: "20px" }}>
              {FEATURES.map((_, i) => (
                <div key={i} onClick={() => setFeatureIndex(i)} style={{
                  width: i === featureIndex ? "20px" : "6px",
                  height: "6px", borderRadius: "3px",
                  background: i === featureIndex ? "linear-gradient(90deg, #6366f1, #22d3ee)" : "rgba(255,255,255,0.15)",
                  transition: "all 0.3s ease", cursor: "pointer",
                }} />
              ))}
            </div>
          </div>
        )}

        {/* Social proof - hide on mobile */}
        {!isMobile && (
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ display: "flex" }}>
              {["#6366f1","#22d3ee","#a78bfa","#34d399"].map((c, i) => (
                <div key={i} style={{
                  width: "28px", height: "28px", borderRadius: "50%",
                  background: c, border: "2px solid #0f1120",
                  marginLeft: i > 0 ? "-8px" : "0",
                }} />
              ))}
            </div>
            <span style={{ color: "#64748b", fontSize: "13px" }}>
              <span style={{ color: "#94a3b8", fontWeight: "600" }}>2,400+</span> resumes analyzed
            </span>
          </div>
        )}
      </div>

      {/* ── RIGHT PANEL ── */}
      <div style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: isMobile ? "32px 24px" : "48px 40px",
        position: "relative",
      }}>
        <div style={{ width: "100%", maxWidth: "400px" }}>
          <div style={{ marginBottom: "32px" }}>
            <h1 style={{
              fontSize: isMobile ? "22px" : "26px",
              fontWeight: "800", color: "#f1f5f9",
              marginBottom: "8px", letterSpacing: "-0.02em",
            }}>
              {isNew ? "Create your account" : "Welcome back"}
            </h1>
            <p style={{ color: "#475569", fontSize: "14px" }}>
              {isNew ? "Start analyzing your resume for free." : "Sign in to continue your job search."}
            </p>
          </div>

          {/* Toggle */}
          <div style={{
            display: "flex",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: "12px",
            padding: "4px",
            marginBottom: "28px",
          }}>
            {["Login", "Sign Up"].map((label, i) => {
              const active = i === 0 ? !isNew : isNew;
              return (
                <button key={label} type="button"
                  onClick={() => { setIsNew(i === 1); setError(""); }}
                  style={{
                    flex: 1, padding: "10px", border: "none", borderRadius: "9px",
                    background: active ? "linear-gradient(135deg, rgba(99,102,241,0.25), rgba(34,211,238,0.15))" : "transparent",
                    color: active ? "#e2e8f0" : "#475569",
                    cursor: "pointer", fontSize: "14px", fontWeight: "600",
                    transition: "all 0.2s ease",
                    boxShadow: active ? "0 0 0 1px rgba(99,102,241,0.3)" : "none",
                  }}>
                  {label}
                </button>
              );
            })}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "18px", marginBottom: "8px" }}>
            {isNew && (
              <div>
                <label style={labelStyle}>Full Name</label>
                <input type="text" placeholder="Jane Smith" value={name}
                  onChange={(e) => setName(e.target.value)}
                  onFocus={() => setFocusedField("name")}
                  onBlur={() => setFocusedField(null)}
                  style={inputStyle("name")} />
              </div>
            )}
            <div>
              <label style={labelStyle}>Email</label>
              <input type="email" placeholder="you@example.com" value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField(null)}
                style={inputStyle("email")} />
            </div>
            <div>
              <label style={labelStyle}>Password</label>
              <input type="password" placeholder="••••••••" value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocusedField("password")}
                onBlur={() => setFocusedField(null)}
                onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); }}
                style={inputStyle("password")} />
            </div>
          </div>

          {!isNew && <div style={{ marginBottom: "24px" }} />}
          {isNew && <div style={{ marginBottom: "24px" }} />}

          {error && (
            <div style={{
              background: "rgba(239,68,68,0.08)",
              border: "1px solid rgba(239,68,68,0.2)",
              borderRadius: "10px", padding: "12px 16px",
              marginBottom: "20px", color: "#fca5a5",
              fontSize: "13px", display: "flex", alignItems: "center", gap: "8px",
            }}>
              <span>⚠️</span> {error}
            </div>
          )}

          <button type="button" onClick={handleSubmit} style={{
            width: "100%", padding: "14px",
            background: loading ? "rgba(99,102,241,0.4)" : "linear-gradient(135deg, #6366f1 0%, #22d3ee 100%)",
            border: "none", borderRadius: "11px",
            color: loading ? "#94a3b8" : "#fff",
            fontSize: "15px", fontWeight: "700",
            cursor: loading ? "not-allowed" : "pointer",
            transition: "all 0.2s ease",
            boxShadow: loading ? "none" : "0 0 24px rgba(99,102,241,0.3)",
          }}>
            {loading ? "Please wait…" : isNew ? "Create Account →" : "Sign In →"}
          </button>

          <p style={{ textAlign: "center", color: "#334155", fontSize: "12px", marginTop: "24px" }}>
            By continuing, you agree to our{" "}
            <span style={{ color: "#6366f1", cursor: "pointer" }}>Terms</span> and{" "}
            <span style={{ color: "#6366f1", cursor: "pointer" }}>Privacy Policy</span>.
          </p>
        </div>
      </div>
    </div>
  );
}