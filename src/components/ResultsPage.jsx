import React, { useEffect, useState, useRef } from "react";

// ── Confetti (CDN-free inline implementation) ──────────────────────────────
function launchConfetti() {
  const canvas = document.createElement("canvas");
  canvas.style.cssText =
    "position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999";
  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const colors = ["#6366f1", "#22d3ee", "#a5b4fc", "#ffffff", "#f0abfc"];
  const particles = Array.from({ length: 130 }, () => ({
    x: Math.random() * canvas.width,
    y: -10,
    vx: (Math.random() - 0.5) * 4,
    vy: Math.random() * 3 + 2,
    color: colors[Math.floor(Math.random() * colors.length)],
    size: Math.random() * 7 + 3,
    rotation: Math.random() * 360,
    rotSpeed: (Math.random() - 0.5) * 6,
    opacity: 1,
  }));
  let frame = 0;
  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.05;
      p.rotation += p.rotSpeed;
      if (frame > 80) p.opacity -= 0.012;
      ctx.save();
      ctx.globalAlpha = Math.max(0, p.opacity);
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.5);
      ctx.restore();
    });
    frame++;
    if (frame < 160) requestAnimationFrame(animate);
    else document.body.removeChild(canvas);
  };
  animate();
}

// ── useWindowWidth ────────────────────────────────────────────────────────
function useWindowWidth() {
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 768);
  useEffect(() => {
    const handler = () => setW(window.innerWidth);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return w;
}

// ── CircleScore ───────────────────────────────────────────────────────────
function CircleScore({ value, max = 100, color, label, unit = "" }) {
  const r = 48;
  const circ = 2 * Math.PI * r;
  const fill = (value / max) * circ;
  return (
    <div style={{ textAlign: "center" }}>
      <p style={{
        color: "#64748b", fontSize: "10px", fontWeight: "700",
        letterSpacing: "0.09em", textTransform: "uppercase", marginBottom: "10px",
      }}>{label}</p>
      <div style={{ position: "relative", display: "inline-block" }}>
        <svg width="120" height="120" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="9" />
          <circle
            cx="60" cy="60" r={r}
            fill="none"
            stroke="url(#sg)"
            strokeWidth="9"
            strokeLinecap="round"
            strokeDasharray={`${fill} ${circ}`}
            strokeDashoffset={circ * 0.25}
            style={{ transition: "stroke-dasharray 0.05s" }}
          />
          <defs>
            <linearGradient id="sg" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#22d3ee" />
            </linearGradient>
          </defs>
        </svg>
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
        }}>
          <span style={{ fontSize: "30px", fontWeight: "800", color, lineHeight: 1 }}>{value}</span>
          <span style={{ fontSize: "11px", color: "#475569", fontWeight: "500" }}>{unit || "/100"}</span>
        </div>
      </div>
    </div>
  );
}

// ── RadarChart ────────────────────────────────────────────────────────────
function RadarChart({ skillsFound = [], missingSkills = [], isMobile }) {
  const [progress, setProgress] = useState(0);
  const rafRef = useRef(null);
  useEffect(() => {
    let start = null;
    const dur = 1200;
    const go = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / dur, 1);
      setProgress(1 - Math.pow(1 - p, 3));
      if (p < 1) rafRef.current = requestAnimationFrame(go);
    };
    rafRef.current = requestAnimationFrame(go);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const size = isMobile ? 300 : 400;
  const cx = size / 2, cy = size / 2, maxR = isMobile ? 100 : 140;
  const levels = 4;

  const allSkills = [
    ...skillsFound.slice(0, 6).map((s) => ({ label: s, found: true, val: 0.7 + Math.random() * 0.3 })),
    ...missingSkills.slice(0, 4).map((s) => ({ label: s, found: false, val: 0.1 + Math.random() * 0.25 })),
  ].slice(0, 8);

  const n = allSkills.length;
  if (n < 3) return null;

  const angle = (i) => (Math.PI * 2 * i) / n - Math.PI / 2;
  const point = (i, r) => ({ x: cx + r * Math.cos(angle(i)), y: cy + r * Math.sin(angle(i)) });

  const rings = Array.from({ length: levels }, (_, i) => {
    const r = (maxR * (i + 1)) / levels;
    return Array.from({ length: n }, (_, j) => point(j, r))
      .map((p, j) => `${j === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ") + "Z";
  });

  const spokes = Array.from({ length: n }, (_, i) => ({ x1: cx, y1: cy, ...point(i, maxR) }));

  const dataPath = allSkills.map((s, i) => {
    const p = point(i, s.val * maxR * progress);
    return `${i === 0 ? "M" : "L"}${p.x},${p.y}`;
  }).join(" ") + "Z";

  const idealPath = allSkills.map((s, i) => {
    const p = point(i, (s.found ? 0.9 : 0) * maxR * progress);
    return `${i === 0 ? "M" : "L"}${p.x},${p.y}`;
  }).join(" ") + "Z";

  const labelR = maxR + (isMobile ? 22 : 28);

  return (
    <div style={{
      display: "flex",
      flexDirection: isMobile ? "column" : "row",
      alignItems: isMobile ? "center" : "center",
      gap: isMobile ? "20px" : "32px",
    }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}
        style={{ flexShrink: 0, overflow: "visible", maxWidth: "100%" }}>
        <defs>
          <linearGradient id="radarFill" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id="radarStroke" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#22d3ee" />
          </linearGradient>
        </defs>
        {rings.map((d, i) => <path key={i} d={d} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />)}
        {spokes.map((s, i) => <line key={i} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />)}
        <path d={idealPath} fill="rgba(34,211,238,0.06)" stroke="rgba(34,211,238,0.2)" strokeWidth="1.5" strokeDasharray="4 3" />
        <path d={dataPath} fill="url(#radarFill)" stroke="url(#radarStroke)" strokeWidth="2" />
        {allSkills.map((s, i) => {
          const p = point(i, s.val * maxR * progress);
          return <circle key={i} cx={p.x} cy={p.y} r="4"
            fill={s.found ? "#22d3ee" : "#f87171"}
            stroke={s.found ? "rgba(34,211,238,0.4)" : "rgba(248,113,113,0.4)"}
            strokeWidth="6" strokeOpacity="0.3" />;
        })}
        {allSkills.map((s, i) => {
          const p = point(i, labelR);
          const a = angle(i);
          const anchor = Math.abs(a) < 0.2 || Math.abs(a - Math.PI) < 0.2
            ? "middle" : Math.cos(a) > 0 ? "start" : "end";
          return (
            <text key={i} x={p.x} y={p.y}
              textAnchor={anchor} dominantBaseline="middle"
              fontSize={isMobile ? "9" : "11"} fontWeight="600"
              fontFamily="Inter, sans-serif"
              fill={s.found ? "#22d3ee" : "#f87171"}>
              {s.label.length > (isMobile ? 10 : 14) ? s.label.slice(0, isMobile ? 9 : 13) + "…" : s.label}
            </text>
          );
        })}
        <circle cx={cx} cy={cy} r="3" fill="rgba(255,255,255,0.15)" />
      </svg>

      {/* Legend + stats — horizontal on mobile */}
      <div style={{
        width: "100%",
        display: "flex",
        flexDirection: isMobile ? "row" : "column",
        gap: isMobile ? "12px" : "24px",
        flexWrap: "wrap",
      }}>
        {/* Legend */}
        <div style={{ flex: isMobile ? "1 1 120px" : "unset" }}>
          <p style={{ color: "#475569", fontSize: "10px", fontWeight: "700", letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: "10px" }}>Legend</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {[
              { label: "Your profile", style: { width: "24px", height: "3px", background: "linear-gradient(90deg,#6366f1,#22d3ee)", borderRadius: "2px" } },
              { label: "Ideal match", style: { width: "24px", height: "2px", borderTop: "2px dashed rgba(34,211,238,0.4)" } },
            ].map(({ label, style }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={style} />
                <span style={{ color: "#94a3b8", fontSize: "12px" }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div style={{ flex: isMobile ? "1 1 160px" : "unset" }}>
          <p style={{ color: "#475569", fontSize: "10px", fontWeight: "700", letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: "10px" }}>Breakdown</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {[
              { label: "Skills found", val: skillsFound.length, color: "#22d3ee", bg: "rgba(34,211,238,0.06)", border: "rgba(34,211,238,0.15)" },
              { label: "Missing", val: missingSkills.length, color: "#f87171", bg: "rgba(248,113,113,0.06)", border: "rgba(248,113,113,0.15)" },
              { label: "Match rate", val: Math.round((skillsFound.length / (skillsFound.length + missingSkills.length || 1)) * 100) + "%", color: "#a5b4fc", bg: "rgba(99,102,241,0.06)", border: "rgba(99,102,241,0.2)" },
            ].map(({ label, val, color, bg, border }) => (
              <div key={label} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "8px 12px", borderRadius: "10px",
                background: bg, border: `1px solid ${border}`,
              }}>
                <span style={{ color: "#94a3b8", fontSize: "12px" }}>{label}</span>
                <span style={{ color, fontSize: "16px", fontWeight: "800" }}>{val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────
export default function ResultsPage({ data, onBack }) {
  const [atsScore, setAtsScore] = useState(0);
  const [roleScore, setRoleScore] = useState(0);
  const width = useWindowWidth();
  const isMobile = width < 640;

  useEffect(() => {
    const tick = (setter, target, ref) => {
      const id = setInterval(() => {
        setter((prev) => {
          if (prev >= target) { clearInterval(id); return target; }
          return prev + 1;
        });
      }, 20);
      ref.current = id;
    };
    const r1 = { current: null }, r2 = { current: null };
    tick(setAtsScore, data.ats_score, r1);
    tick(setRoleScore, data.role_match_percentage, r2);
    if (data.ats_score >= 80) setTimeout(launchConfetti, 1000);
    return () => { clearInterval(r1.current); clearInterval(r2.current); };
  }, [data]);

  const scoreColor = (s) => s >= 80 ? "#22d3ee" : s >= 60 ? "#a5b4fc" : "#f87171";

  const getCourseUrl = (c) => {
    if (c.url?.startsWith("http")) return c.url;
    if (c.platform?.toLowerCase().includes("udemy"))
      return `https://www.udemy.com/courses/search/?q=${encodeURIComponent(c.name)}`;
    if (c.platform?.toLowerCase().includes("youtube"))
      return `https://www.youtube.com/results?search_query=${encodeURIComponent(c.name)}`;
    return `https://www.coursera.org/search?query=${encodeURIComponent(c.name)}`;
  };

  const getJobUrl = (j) =>
    j.url?.startsWith("http") ? j.url
      : `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(j.title)}`;

  const Card = ({ children, style = {} }) => (
    <div style={{
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: isMobile ? "16px" : "20px",
      backdropFilter: "blur(20px)",
      padding: isMobile ? "18px 16px" : "28px",
      ...style,
    }}>{children}</div>
  );

  const SectionTitle = ({ icon, children, color = "#a5b4fc" }) => (
    <h2 style={{
      color, fontSize: isMobile ? "11px" : "13px", fontWeight: "700",
      textTransform: "uppercase", letterSpacing: "0.07em",
      marginBottom: "14px", display: "flex", alignItems: "center", gap: "6px",
    }}>
      <span>{icon}</span>{children}
    </h2>
  );

  const pad = isMobile ? "0 14px" : "0 24px";
  const gridGap = isMobile ? "12px" : "16px";

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0b0d14",
      fontFamily: "'Inter','Segoe UI',sans-serif",
      color: "#f1f5f9",
    }}>
      {/* Glow blobs */}
      <div style={{ position: "fixed", top: "-100px", left: "-100px", width: "350px", height: "350px", background: "radial-gradient(circle,rgba(99,102,241,0.1) 0%,transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "fixed", bottom: "-80px", right: "-80px", width: "300px", height: "300px", background: "radial-gradient(circle,rgba(34,211,238,0.08) 0%,transparent 70%)", pointerEvents: "none" }} />

      {/* Nav */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: isMobile ? "12px 16px" : "14px 32px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        background: "rgba(11,13,20,0.9)", backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{
            width: "30px", height: "30px",
            background: "linear-gradient(135deg,#6366f1,#22d3ee)",
            borderRadius: "8px",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "14px",
          }}>⚡</div>
          <span style={{ fontWeight: "700", fontSize: isMobile ? "14px" : "15px", letterSpacing: "-0.01em" }}>ResumeAI</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {!isMobile && (
            <div style={{
              padding: "4px 12px", borderRadius: "99px",
              background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)",
              fontSize: "11px", fontWeight: "600", color: "#a5b4fc",
            }}>Analysis Complete</div>
          )}
          <button onClick={onBack} style={{
            background: "transparent",
            border: "1px solid rgba(255,255,255,0.09)",
            color: "#64748b", padding: isMobile ? "6px 12px" : "7px 16px",
            borderRadius: "9px", cursor: "pointer",
            fontSize: isMobile ? "12px" : "13px", fontWeight: "500",
            fontFamily: "inherit",
          }}>← {isMobile ? "Back" : "Analyze Another"}</button>
        </div>
      </div>

      {/* Content */}
      <div style={{
        maxWidth: "960px", margin: "0 auto",
        padding: isMobile ? "80px 14px 48px" : "100px 24px 60px",
        display: "flex", flexDirection: "column", gap: gridGap,
      }}>

        {/* Page title */}
        <div style={{ marginBottom: isMobile ? "4px" : "12px" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "5px",
            background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)",
            borderRadius: "99px", padding: "4px 12px",
            fontSize: "11px", fontWeight: "600", color: "#a5b4fc", marginBottom: "10px",
          }}>
            <span>✦</span> AI-Powered Analysis
          </div>
          <h1 style={{
            fontSize: isMobile ? "22px" : "30px", fontWeight: "800",
            letterSpacing: "-0.03em", marginBottom: "4px", lineHeight: 1.2,
          }}>
            Your{" "}
            <span style={{ background: "linear-gradient(90deg,#6366f1,#22d3ee)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Resume Results
            </span>
          </h1>
          <p style={{ color: "#475569", fontSize: isMobile ? "13px" : "14px" }}>
            Detailed breakdown against your target role.
          </p>
        </div>

        {/* Score row — always side by side */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: gridGap }}>
          <Card style={{ display: "flex", justifyContent: "center", padding: isMobile ? "20px 12px" : "32px" }}>
            <CircleScore value={atsScore} color={scoreColor(atsScore)} label="ATS Score" unit="/100" />
          </Card>
          <Card style={{ display: "flex", justifyContent: "center", padding: isMobile ? "20px 12px" : "32px" }}>
            <CircleScore value={roleScore} color={scoreColor(roleScore)} label="Role Match" unit="%" />
          </Card>
        </div>

        {/* Skills row — stacked on mobile */}
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: gridGap }}>
          <Card>
            <SectionTitle icon="✅" color="#22d3ee">Skills Found</SectionTitle>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "7px" }}>
              {data.skills_found?.map((skill, i) => (
                <span key={i} style={{
                  background: "rgba(34,211,238,0.08)", border: "1px solid rgba(34,211,238,0.2)",
                  color: "#22d3ee", padding: "4px 11px",
                  borderRadius: "99px", fontSize: "11px", fontWeight: "500",
                }}>{skill}</span>
              ))}
            </div>
          </Card>
          <Card>
            <SectionTitle icon="⚠️" color="#f87171">Missing Skills</SectionTitle>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "7px" }}>
              {data.missing_skills?.map((skill, i) => (
                <span key={i} style={{
                  background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)",
                  color: "#f87171", padding: "4px 11px",
                  borderRadius: "99px", fontSize: "11px", fontWeight: "500",
                }}>{skill}</span>
              ))}
            </div>
          </Card>
        </div>

        {/* Radar */}
        <Card>
          <SectionTitle icon="📊" color="#a5b4fc">Skill Match Analysis</SectionTitle>
          <div style={{ overflowX: "auto" }}>
            <RadarChart skillsFound={data.skills_found || []} missingSkills={data.missing_skills || []} isMobile={isMobile} />
          </div>
        </Card>

        {/* Strengths & Improvements — stacked on mobile */}
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: gridGap }}>
          {[
            { icon: "💪", color: "#22d3ee", label: "Strengths", items: data.strengths, dot: { bg: "rgba(34,211,238,0.12)", border: "rgba(34,211,238,0.25)", color: "#22d3ee" } },
            { icon: "🔧", color: "#fbbf24", label: "Improvements", items: data.improvements, dot: { bg: "rgba(251,191,36,0.1)", border: "rgba(251,191,36,0.25)", color: "#fbbf24" } },
          ].map(({ icon, color, label, items, dot }) => (
            <Card key={label}>
              <SectionTitle icon={icon} color={color}>{label}</SectionTitle>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {items?.map((s, i) => (
                  <li key={i} style={{
                    color: "#94a3b8", fontSize: "13px", lineHeight: "1.6",
                    marginBottom: "11px", display: "flex", gap: "9px",
                  }}>
                    <span style={{
                      width: "17px", height: "17px", borderRadius: "50%",
                      background: dot.bg, border: `1px solid ${dot.border}`,
                      color: dot.color, fontSize: "9px", fontWeight: "700",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0, marginTop: "3px",
                    }}>{i + 1}</span>
                    {s}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>

        {/* Job Roles */}
        <Card>
          <SectionTitle icon="💼" color="#a5b4fc">Suitable Job Roles</SectionTitle>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {data.job_roles?.map((job, i) => (
              <span key={i} style={{
                background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.25)",
                color: "#a5b4fc", padding: isMobile ? "7px 14px" : "8px 18px",
                borderRadius: "99px", fontSize: isMobile ? "12px" : "13px", fontWeight: "600",
              }}>{job}</span>
            ))}
          </div>
        </Card>

        {/* Courses */}
        <Card>
          <SectionTitle icon="📚" color="#a5b4fc">Courses to Improve</SectionTitle>
          <div style={{ display: "grid", gap: "8px" }}>
            {data.courses?.map((course, i) => (
              <a key={i}
                href={getCourseUrl(course)}
                target="_blank" rel="noopener noreferrer"
                style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: "12px", padding: isMobile ? "11px 14px" : "14px 18px",
                  textDecoration: "none", gap: "10px",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(99,102,241,0.35)"; e.currentTarget.style.background = "rgba(99,102,241,0.05)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: 0 }}>
                  <div style={{
                    width: "34px", height: "34px", borderRadius: "9px", flexShrink: 0,
                    background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.2)",
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: "15px",
                  }}>📖</div>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ color: "#f1f5f9", fontSize: isMobile ? "13px" : "14px", fontWeight: "600", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{course.name}</p>
                    <p style={{ color: "#475569", fontSize: "11px", margin: "2px 0 0" }}>{course.platform}</p>
                  </div>
                </div>
                <span style={{
                  background: "linear-gradient(135deg,#6366f1,#22d3ee)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                  fontSize: "13px", fontWeight: "700", whiteSpace: "nowrap", flexShrink: 0,
                }}>Learn →</span>
              </a>
            ))}
          </div>
        </Card>

        {/* Jobs */}
        <Card>
          <SectionTitle icon="🚀" color="#22d3ee">Apply for Jobs</SectionTitle>
          <div style={{ display: "grid", gap: "8px" }}>
            {data.job_links?.map((job, i) => (
              <a key={i}
                href={getJobUrl(job)}
                target="_blank" rel="noopener noreferrer"
                style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: "12px", padding: isMobile ? "11px 14px" : "14px 18px",
                  textDecoration: "none", gap: "10px",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(34,211,238,0.35)"; e.currentTarget.style.background = "rgba(34,211,238,0.04)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: 0 }}>
                  <div style={{
                    width: "34px", height: "34px", borderRadius: "9px", flexShrink: 0,
                    background: "rgba(34,211,238,0.08)", border: "1px solid rgba(34,211,238,0.2)",
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: "15px",
                  }}>💼</div>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ color: "#f1f5f9", fontSize: isMobile ? "13px" : "14px", fontWeight: "600", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{job.title}</p>
                    <p style={{ color: "#475569", fontSize: "11px", margin: "2px 0 0" }}>{job.company} · {job.platform}</p>
                  </div>
                </div>
                <span style={{
                  background: "linear-gradient(135deg,#6366f1 0%,#22d3ee 100%)",
                  color: "#fff", padding: isMobile ? "7px 13px" : "8px 18px",
                  borderRadius: "8px", fontSize: "12px", fontWeight: "700",
                  whiteSpace: "nowrap", flexShrink: 0,
                  boxShadow: "0 0 14px rgba(99,102,241,0.25)",
                }}>Apply →</span>
              </a>
            ))}
          </div>
        </Card>

      </div>
    </div>
  );
}