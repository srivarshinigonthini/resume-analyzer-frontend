import React from "react";

export default function PremiumPage({ onUpgrade, onBack }) {
  const loadRazorpay = () => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => openPayment();
    document.body.appendChild(script);
  };

  const openPayment = () => {
    const options = {
      key: "rzp_test_T0cpmnjFSrfykI",
      amount: 9900,
      currency: "INR",
      name: "ResumeAI",
      description: "Premium Plan - Unlimited Analyses",
      handler: function (response) {
        alert("Payment Successful! Payment ID: " + response.razorpay_payment_id);
        const user = JSON.parse(localStorage.getItem("currentUser") || "{}");
        user.isPremium = true;
        localStorage.setItem("currentUser", JSON.stringify(user));
        const users = JSON.parse(localStorage.getItem("users") || "[]");
        const updated = users.map(u => u.email === user.email ? { ...u, isPremium: true } : u);
        localStorage.setItem("users", JSON.stringify(updated));
        onUpgrade();
      },
      prefill: {
        email: JSON.parse(localStorage.getItem("currentUser") || "{}").email || ""
      },
      theme: { color: "#6366f1" }
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0b0d14",
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

      {/* Top nav */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "14px 32px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        background: "rgba(11,13,20,0.85)", backdropFilter: "blur(16px)",
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
        <button type="button" onClick={onBack} style={{
          background: "transparent",
          border: "1px solid rgba(255,255,255,0.08)",
          color: "#64748b", padding: "7px 16px",
          borderRadius: "9px", cursor: "pointer",
          fontSize: "13px", fontWeight: "500", fontFamily: "inherit",
        }}>← Go Back</button>
      </div>

      {/* Content */}
      <div style={{
        maxWidth: "820px", margin: "0 auto",
        padding: "120px 24px 60px",
      }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "6px",
            background: "rgba(99,102,241,0.1)",
            border: "1px solid rgba(99,102,241,0.2)",
            borderRadius: "99px", padding: "5px 14px",
            fontSize: "12px", fontWeight: "600", color: "#a5b4fc",
            marginBottom: "16px",
          }}>
            <span>⭐</span> Upgrade Your Plan
          </div>
          <h1 style={{
            fontSize: "34px", fontWeight: "800",
            letterSpacing: "-0.03em", marginBottom: "10px",
          }}>
            Unlock{" "}
            <span style={{
              background: "linear-gradient(90deg, #6366f1, #22d3ee)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>Premium Access</span>
          </h1>
          <p style={{ color: "#475569", fontSize: "15px" }}>
            You've used your 2 free trials. Upgrade for unlimited access!
          </p>
        </div>

        {/* Plans grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "32px" }}>

          {/* Free Plan */}
          <div style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: "20px", padding: "32px",
            backdropFilter: "blur(20px)",
          }}>
            <h2 style={{ color: "#64748b", fontSize: "14px", fontWeight: "700",
              textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "12px" }}>
              Free Plan
            </h2>
            <div style={{ marginBottom: "28px" }}>
              <span style={{ fontSize: "40px", fontWeight: "900", color: "#f1f5f9" }}>₹0</span>
              <span style={{ color: "#475569", fontSize: "14px" }}> /month</span>
            </div>
            {[
              "2 resume analyses per 24hrs",
              "Basic ATS score",
              "3 job suggestions",
              "3 course links",
            ].map((f, i) => (
              <div key={i} style={{
                color: "#475569", fontSize: "13px",
                marginBottom: "12px", display: "flex", gap: "10px", alignItems: "flex-start",
              }}>
                <span style={{ color: "#334155", marginTop: "1px" }}>✓</span>{f}
              </div>
            ))}
            <div style={{
              marginTop: "28px", padding: "12px",
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "10px", color: "#334155",
              textAlign: "center", fontSize: "13px", fontWeight: "600",
            }}>
              Current Plan
            </div>
          </div>

          {/* Premium Plan */}
          <div style={{
            background: "rgba(99,102,241,0.06)",
            border: "1px solid rgba(99,102,241,0.35)",
            borderRadius: "20px", padding: "32px",
            backdropFilter: "blur(20px)",
            boxShadow: "0 0 40px rgba(99,102,241,0.1)",
            position: "relative", overflow: "hidden",
          }}>
            {/* Subtle inner glow */}
            <div style={{
              position: "absolute", top: "-40px", right: "-40px",
              width: "160px", height: "160px",
              background: "radial-gradient(circle, rgba(34,211,238,0.12) 0%, transparent 70%)",
              pointerEvents: "none",
            }} />

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <h2 style={{ color: "#a5b4fc", fontSize: "14px", fontWeight: "700",
                textTransform: "uppercase", letterSpacing: "0.07em" }}>
                Premium Plan
              </h2>
              <span style={{
                background: "linear-gradient(90deg, #6366f1, #22d3ee)",
                color: "#fff", padding: "3px 10px",
                borderRadius: "99px", fontSize: "10px", fontWeight: "700",
                letterSpacing: "0.05em",
              }}>POPULAR</span>
            </div>

            <div style={{ marginBottom: "28px" }}>
              <span style={{
                fontSize: "40px", fontWeight: "900",
                background: "linear-gradient(90deg, #6366f1, #22d3ee)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>₹99</span>
              <span style={{ color: "#475569", fontSize: "14px" }}> /month</span>
            </div>

            {[
              "Unlimited resume analyses",
              "Deep AI analysis",
              "Unlimited job suggestions",
              "Unlimited course links",
              "Career roadmap",
              "Priority support",
            ].map((f, i) => (
              <div key={i} style={{
                color: "#94a3b8", fontSize: "13px",
                marginBottom: "12px", display: "flex", gap: "10px", alignItems: "flex-start",
              }}>
                <span style={{ color: "#6366f1", marginTop: "1px" }}>✓</span>{f}
              </div>
            ))}

            <button type="button" onClick={loadRazorpay} style={{
              marginTop: "28px", width: "100%", padding: "14px",
              background: "linear-gradient(135deg, #6366f1 0%, #22d3ee 100%)",
              border: "none", borderRadius: "11px",
              color: "#fff", fontSize: "15px", fontWeight: "700",
              cursor: "pointer", fontFamily: "inherit",
              boxShadow: "0 0 28px rgba(99,102,241,0.3)",
              letterSpacing: "-0.01em",
            }}>
              Upgrade Now →
            </button>
          </div>
        </div>

        {/* Trust row */}
        <div style={{ display: "flex", justifyContent: "center", gap: "32px", flexWrap: "wrap" }}>
          {[
            { icon: "🔒", label: "Secure Payment" },
            { icon: "⚡", label: "Instant Access" },
            { icon: "↩️", label: "Cancel Anytime" },
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
  );
}