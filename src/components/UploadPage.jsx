import React, { useState } from "react";

export default function UploadPage({ onResult }) {
  const [file, setFile] = useState(null);
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleUpload = async () => {
    if (!file) { setError("Please select a PDF file!"); return; }
    if (!role) { setError("Please enter the role you are applying for!"); return; }
    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("role", role);

    try {
      const res = await fetch("https://resume-analyzer-backend-production-6455.up.railway.app/api/resume/upload",{
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      onResult(JSON.parse(data.analysis));
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0a0a0a 0%, #0d1117 50%, #0a0a0a 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'Segoe UI', sans-serif", padding: "20px"
    }}>
      <div style={{
        position: "fixed", top: "10%", left: "10%",
        width: "300px", height: "300px",
        background: "radial-gradient(circle, rgba(0,255,163,0.08) 0%, transparent 70%)",
        pointerEvents: "none"
      }}/>
      <div style={{
        position: "fixed", bottom: "10%", right: "10%",
        width: "400px", height: "400px",
        background: "radial-gradient(circle, rgba(0,150,255,0.08) 0%, transparent 70%)",
        pointerEvents: "none"
      }}/>

      <div style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "24px", padding: "48px",
        width: "100%", maxWidth: "480px",
        backdropFilter: "blur(20px)",
        boxShadow: "0 0 60px rgba(0,255,163,0.05)"
      }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>⚡</div>
          <h1 style={{
            fontSize: "32px", fontWeight: "800",
            background: "linear-gradient(90deg, #00ffa3, #00c3ff)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            marginBottom: "8px"
          }}>Resume Analyzer</h1>
          <p style={{ color: "#555", fontSize: "14px" }}>
            AI-powered resume analysis & career recommendations
          </p>
        </div>

        {/* Role Input */}
        <div style={{ marginBottom: "20px" }}>
          <label style={{ color: "#aaa", fontSize: "13px", fontWeight: "600", display: "block", marginBottom: "8px" }}>
            🎯 What role are you applying for?
          </label>
          <input
            type="text"
            placeholder="e.g. Data Analyst, Full Stack Developer..."
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={{
              width: "100%", padding: "14px 16px",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(0,255,163,0.2)",
              borderRadius: "12px", color: "#fff",
              fontSize: "14px", outline: "none",
              boxSizing: "border-box"
            }}
          />
        </div>

        {/* Upload Box */}
        <div style={{
          border: "2px dashed rgba(0,255,163,0.3)",
          borderRadius: "16px", padding: "40px 20px",
          textAlign: "center", marginBottom: "24px",
          background: "rgba(0,255,163,0.02)"
        }}>
          <div style={{ fontSize: "40px", marginBottom: "12px" }}>📄</div>
          <p style={{ color: "#555", marginBottom: "16px", fontSize: "14px" }}>
            Upload your resume PDF
          </p>
          <input
            type="file" accept=".pdf"
            onChange={(e) => setFile(e.target.files[0])}
            style={{ display: "none" }} id="fileInput"
          />
          <label htmlFor="fileInput" style={{
            cursor: "pointer",
            background: "rgba(0,255,163,0.1)",
            color: "#00ffa3", padding: "10px 24px",
            borderRadius: "8px",
            border: "1px solid rgba(0,255,163,0.3)",
            fontSize: "14px", fontWeight: "600"
          }}>
            Choose PDF File
          </label>
          {file && (
            <p style={{ marginTop: "12px", color: "#00ffa3", fontSize: "13px" }}>
              ✅ {file.name}
            </p>
          )}
        </div>

        {error && (
          <p style={{ color: "#ff4d4d", textAlign: "center", marginBottom: "16px", fontSize: "13px" }}>
            {error}
          </p>
        )}

        <button
          onClick={handleUpload}
          disabled={loading}
          style={{
            width: "100%", padding: "16px",
            background: loading ? "rgba(0,255,163,0.2)" : "linear-gradient(90deg, #00ffa3, #00c3ff)",
            border: "none", borderRadius: "12px",
            color: loading ? "#00ffa3" : "#000",
            fontSize: "16px", fontWeight: "700",
            cursor: loading ? "not-allowed" : "pointer"
          }}
        >
          {loading ? "⚡ Analyzing..." : "Analyze Resume →"}
        </button>
      </div>
    </div>
  );
}