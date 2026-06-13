import React, { useEffect, useState, useRef } from "react";
import confetti from "canvas-confetti";

function CircleScore({ value, max = 100, color, label, unit = "" }) {
  const r = 54;
  const circ = 2 * Math.PI * r;
  const fill = (value / max) * circ;

  return (
    <div style={{ textAlign: "center" }}>
      <p style={{
        color: "#64748b", fontSize: "11px", fontWeight: "600",
        letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "14px"
      }}>{label}</p>
      <div style={{ position: "relative", display: "inline-block" }}>
        <svg width="140" height="140" viewBox="0 0 140 140">
          <circle cx="70" cy="70" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
          <circle
            cx="70" cy="70" r={r}
            fill="none"
            stroke="url(#scoreGrad)"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={`${fill} ${circ}`}
            strokeDashoffset={circ * 0.25}
            style={{ transition: "stroke-dasharray 0.05s" }}
          />
          <defs>
            <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#22d3ee" />
            </linearGradient>
          </defs>
        </svg>
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center"
        }}>
          <span style={{
            fontSize: "36px", fontWeight: "800",
            color, lineHeight: 1,
            fontFamily: "'Inter', monospace"
          }}>{value}</span>
          <span style={{ fontSize: "13px", color: "#475569", fontWeight: "500" }}>{unit || "/100"}</span>
        </div>
      </div>
    </div>
  );
}

function RadarChart({ skillsFound = [], missingSkills = [] }) {
  const [progress, setProgress] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    let start = null;
    const duration = 1200;
    const animate = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      // ease out cubic
      setProgress(1 - Math.pow(1 - p, 3));
      if (p < 1) rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const cx = 200, cy = 200, maxR = 140;
  const levels = 4;

  // Combine all skills for axes — found skills get high values, missing get low
  const allSkills = [
    ...skillsFound.slice(0, 6).map(s => ({ label: s, found: true, val: 0.7 + Math.random() * 0.3 })),
    ...missingSkills.slice(0, 4).map(s => ({ label: s, found: false, val: 0.1 + Math.random() * 0.25 })),
  ].slice(0, 8);

  const n = allSkills.length;
  if (n < 3) return null;

  const angle = (i) => (Math.PI * 2 * i) / n - Math.PI / 2;
  const point = (i, r) => ({
    x: cx + r * Math.cos(angle(i)),
    y: cy + r * Math.sin(angle(i)),
  });

  // Grid rings
  const rings = Array.from({ length: levels }, (_, i) => {
    const r = (maxR * (i + 1)) / levels;
    return Array.from({ length: n }, (_, j) => point(j, r))
      .map((p, j) => `${j === 0 ? "M" : "L"}${p.x},${p.y}`)
      .join(" ") + "Z";
  });

  // Spokes
  const spokes = Array.from({ length: n }, (_, i) => ({
    x1: cx, y1: cy, ...point(i, maxR),
  }));

  // Data polygon — full profile (found=high, missing=low)
  const dataPath = allSkills.map((s, i) => {
    const r = s.val * maxR * progress;
    const p = point(i, r);
    return `${i === 0 ? "M" : "L"}${p.x},${p.y}`;
  }).join(" ") + "Z";

  // Ideal polygon — all found skills at 90%, missing at 0
  const idealPath = allSkills.map((s, i) => {
    const r = (s.found ? 0.9 : 0) * maxR * progress;
    const p = point(i, r);
    return `${i === 0 ? "M" : "L"}${p.x},${p.y}`;
  }).join(" ") + "Z";

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "32px", flexWrap: "wrap" }}>
      <svg width="400" height="400" viewBox="0 0 400 400" style={{ flexShrink: 0, overflow: "visible" }}>
        <defs>
          <linearGradient id="radarFill" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id="idealFill" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0.05" />
          </linearGradient>
        </defs>

        {/* Grid rings */}
        {rings.map((d, i) => (
          <path key={i} d={d} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
        ))}

        {/* Spokes */}
        {spokes.map((s, i) => (
          <line key={i} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2}
            stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
        ))}

        {/* Ideal area */}
        <path d={idealPath} fill="url(#idealFill)" stroke="rgba(34,211,238,0.2)" strokeWidth="1.5" strokeDasharray="4 3" />

        {/* Data area */}
        <path d={dataPath} fill="url(#radarFill)" stroke="url(#radarStroke)" strokeWidth="2" />
        <defs>
          <linearGradient id="radarStroke" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#22d3ee" />
          </linearGradient>
        </defs>

        {/* Dots on data polygon */}
        {allSkills.map((s, i) => {
          const r = s.val * maxR * progress;
          const p = point(i, r);
          return (
            <circle key={i} cx={p.x} cy={p.y} r="4"
              fill={s.found ? "#22d3ee" : "#f87171"}
              stroke={s.found ? "rgba(34,211,238,0.4)" : "rgba(248,113,113,0.4)"}
              strokeWidth="6" strokeOpacity="0.3"
            />
          );
        })}

        {/* Axis labels */}
        {allSkills.map((s, i) => {
          const labelR = maxR + 28;
          const p = point(i, labelR);
          const a = angle(i);
          const anchor = Math.abs(a) < 0.2 || Math.abs(a - Math.PI) < 0.2
            ? "middle"
            : Math.cos(a) > 0 ? "start" : "end";
          return (
            <text key={i} x={p.x} y={p.y}
              textAnchor={anchor}
              dominantBaseline="middle"
              fontSize="11"
              fontWeight="600"
              fontFamily="Inter, sans-serif"
              fill={s.found ? "#22d3ee" : "#f87171"}
            >
              {s.label.length > 14 ? s.label.slice(0, 13) + "…" : s.label}
            </text>
          );
        })}

        {/* Center dot */}
        <circle cx={cx} cy={cy} r="3" fill="rgba(255,255,255,0.15)" />
      </svg>

      {/* Legend + stats */}
      <div style={{ flex: 1, minWidth: "160px" }}>
        <div style={{ marginBottom: "24px" }}>
          <p style={{ color: "#475569", fontSize: "11px", fontWeight: "600", letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: "14px" }}>Legend</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ width: "28px", height: "3px", background: "linear-gradient(90deg, #6366f1, #22d3ee)", borderRadius: "2px" }} />
              <span style={{ color: "#94a3b8", fontSize: "13px" }}>Your profile</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ width: "28px", height: "2px", borderTop: "2px dashed rgba(34,211,238,0.4)" }} />
              <span style={{ color: "#94a3b8", fontSize: "13px" }}>Ideal match</span>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: "24px" }}>
          <p style={{ color: "#475569", fontSize: "11px", fontWeight: "600", letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: "14px" }}>Breakdown</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "10px 14px", borderRadius: "10px",
              background: "rgba(34,211,238,0.06)", border: "1px solid rgba(34,211,238,0.15)"
            }}>
              <span style={{ color: "#94a3b8", fontSize: "13px" }}>Skills found</span>
              <span style={{ color: "#22d3ee", fontSize: "18px", fontWeight: "800" }}>{skillsFound.length}</span>
            </div>
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "10px 14px", borderRadius: "10px",
              background: "rgba(248,113,113,0.06)", border: "1px solid rgba(248,113,113,0.15)"
            }}>
              <span style={{ color: "#94a3b8", fontSize: "13px" }}>Skills missing</span>
              <span style={{ color: "#f87171", fontSize: "18px", fontWeight: "800" }}>{missingSkills.length}</span>
            </div>
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "10px 14px", borderRadius: "10px",
              background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.2)"
            }}>
              <span style={{ color: "#94a3b8", fontSize: "13px" }}>Match rate</span>
              <span style={{ color: "#a5b4fc", fontSize: "18px", fontWeight: "800" }}>
                {Math.round((skillsFound.length / (skillsFound.length + missingSkills.length || 1)) * 100)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResultsPage({ data, onBack }) {
  const [atsScore, setAtsScore] = useState(0);
  const [roleScore, setRoleScore] = useState(0);

  useEffect(() => {
    let atsInterval = setInterval(() => {
      setAtsScore((prev) => {
        if (prev >= data.ats_score) { clearInterval(atsInterval); return data.ats_score; }
        return prev + 1;
      });
    }, 20);

    let roleInterval = setInterval(() => {
      setRoleScore((prev) => {
        if (prev >= data.role_match_percentage) { clearInterval(roleInterval); return data.role_match_percentage; }
        return prev + 1;
      });
    }, 20);

    if (data.ats_score >= 80) {
      setTimeout(() => {
        confetti({
          particleCount: 150, spread: 80,
          origin: { y: 0.6 },
          colors: ["#6366f1", "#22d3ee", "#ffffff"]
        });
      }, 1000);
    }

    return () => { clearInterval(atsInterval); clearInterval(roleInterval); };
  }, [data]);

  const scoreColor = (s) => s >= 80 ? "#22d3ee" : s >= 60 ? "#a5b4fc" : "#f87171";

  const getCourseUrl = (course) => {
    if (course.url && course.url.startsWith("http")) return course.url;
    if (course.platform?.toLowerCase().includes("udemy"))
      return `https://www.udemy.com/courses/search/?q=${encodeURIComponent(course.name)}`;
    if (course.platform?.toLowerCase().includes("youtube"))
      return `https://www.youtube.com/results?search_query=${encodeURIComponent(course.name)}`;
    return `https://www.coursera.org/search?query=${encodeURIComponent(course.name)}`;
  };

  const getJobUrl = (job) => {
    if (job.url && job.url.startsWith("http")) return job.url;
    return `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(job.title)}`;
  };

  const Card = ({ children, style = {} }) => (
    <div style={{
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: "20px",
      backdropFilter: "blur(20px)",
      padding: "28px",
      ...style
    }}>{children}</div>
  );

  const SectionTitle = ({ icon, children, color = "#a5b4fc" }) => (
    <h2 style={{
      color,
      fontSize: "13px", fontWeight: "700",
      textTransform: "uppercase", letterSpacing: "0.07em",
      marginBottom: "18px", display: "flex", alignItems: "center", gap: "8px"
    }}>
      <span>{icon}</span>{children}
    </h2>
  );

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

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            padding: "4px 12px", borderRadius: "99px",
            background: "rgba(99,102,241,0.1)",
            border: "1px solid rgba(99,102,241,0.2)",
            fontSize: "12px", fontWeight: "600", color: "#a5b4fc"
          }}>
            Analysis Complete
          </div>
          <button onClick={onBack} style={{
            background: "transparent",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "#64748b", padding: "7px 16px",
            borderRadius: "9px", cursor: "pointer",
            fontSize: "13px", fontWeight: "500",
            fontFamily: "inherit",
          }}>← Analyze Another</button>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: "960px", margin: "0 auto", padding: "100px 24px 60px" }}>

        {/* Page title */}
        <div style={{ marginBottom: "36px" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "6px",
            background: "rgba(99,102,241,0.1)",
            border: "1px solid rgba(99,102,241,0.2)",
            borderRadius: "99px", padding: "5px 14px",
            fontSize: "12px", fontWeight: "600", color: "#a5b4fc",
            marginBottom: "14px",
          }}>
            <span>✦</span> AI-Powered Analysis
          </div>
          <h1 style={{
            fontSize: "30px", fontWeight: "800",
            letterSpacing: "-0.03em", marginBottom: "6px",
          }}>
            Your{" "}
            <span style={{
              background: "linear-gradient(90deg, #6366f1, #22d3ee)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>Resume Results</span>
          </h1>
          <p style={{ color: "#475569", fontSize: "14px" }}>
            Here's a detailed breakdown of your resume against the target role.
          </p>
        </div>

        {/* Score row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
          <Card style={{ display: "flex", justifyContent: "center", padding: "32px" }}>
            <CircleScore value={atsScore} color={scoreColor(atsScore)} label="ATS Score" unit="/100" />
          </Card>
          <Card style={{ display: "flex", justifyContent: "center", padding: "32px" }}>
            <CircleScore value={roleScore} color={scoreColor(roleScore)} label="Role Match" unit="%" />
          </Card>
        </div>

        {/* Skills row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
          <Card>
            <SectionTitle icon="✅" color="#22d3ee">Skills Found</SectionTitle>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {data.skills_found?.map((skill, i) => (
                <span key={i} style={{
                  background: "rgba(34,211,238,0.08)",
                  border: "1px solid rgba(34,211,238,0.2)",
                  color: "#22d3ee", padding: "5px 13px",
                  borderRadius: "99px", fontSize: "12px", fontWeight: "500"
                }}>{skill}</span>
              ))}
            </div>
          </Card>

          <Card>
            <SectionTitle icon="⚠️" color="#f87171">Missing Skills</SectionTitle>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {data.missing_skills?.map((skill, i) => (
                <span key={i} style={{
                  background: "rgba(248,113,113,0.08)",
                  border: "1px solid rgba(248,113,113,0.2)",
                  color: "#f87171", padding: "5px 13px",
                  borderRadius: "99px", fontSize: "12px", fontWeight: "500"
                }}>{skill}</span>
              ))}
            </div>
          </Card>
        </div>

        {/* Radar Chart */}
        <Card style={{ marginBottom: "16px" }}>
          <SectionTitle icon="📊" color="#a5b4fc">Skill Match Analysis</SectionTitle>
          <RadarChart skillsFound={data.skills_found || []} missingSkills={data.missing_skills || []} />
        </Card>

        {/* Strengths & Improvements */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
          <Card>
            <SectionTitle icon="💪" color="#22d3ee">Strengths</SectionTitle>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {data.strengths?.map((s, i) => (
                <li key={i} style={{
                  color: "#94a3b8", fontSize: "13px", lineHeight: "1.6",
                  marginBottom: "12px", display: "flex", gap: "10px"
                }}>
                  <span style={{
                    width: "18px", height: "18px", borderRadius: "50%",
                    background: "rgba(34,211,238,0.12)",
                    border: "1px solid rgba(34,211,238,0.25)",
                    color: "#22d3ee", fontSize: "10px", fontWeight: "700",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0, marginTop: "2px"
                  }}>{i + 1}</span>
                  {s}
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <SectionTitle icon="🔧" color="#fbbf24">Improvements</SectionTitle>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {data.improvements?.map((s, i) => (
                <li key={i} style={{
                  color: "#94a3b8", fontSize: "13px", lineHeight: "1.6",
                  marginBottom: "12px", display: "flex", gap: "10px"
                }}>
                  <span style={{
                    width: "18px", height: "18px", borderRadius: "50%",
                    background: "rgba(251,191,36,0.1)",
                    border: "1px solid rgba(251,191,36,0.25)",
                    color: "#fbbf24", fontSize: "10px", fontWeight: "700",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0, marginTop: "2px"
                  }}>{i + 1}</span>
                  {s}
                </li>
              ))}
            </ul>
          </Card>
        </div>

        {/* Job Roles */}
        <Card style={{ marginBottom: "16px" }}>
          <SectionTitle icon="💼" color="#a5b4fc">Suitable Job Roles</SectionTitle>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {data.job_roles?.map((job, i) => (
              <span key={i} style={{
                background: "rgba(99,102,241,0.1)",
                border: "1px solid rgba(99,102,241,0.25)",
                color: "#a5b4fc", padding: "8px 18px",
                borderRadius: "99px", fontSize: "13px", fontWeight: "600"
              }}>{job}</span>
            ))}
          </div>
        </Card>

        {/* Courses */}
        <Card style={{ marginBottom: "16px" }}>
          <SectionTitle icon="📚" color="#a5b4fc">Courses to Improve Your Skills</SectionTitle>
          <div style={{ display: "grid", gap: "10px" }}>
            {data.courses?.map((course, i) => (
              <a key={i}
                href={getCourseUrl(course)}
                target="_blank" rel="noopener noreferrer"
                style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: "12px", padding: "14px 18px",
                  textDecoration: "none",
                  transition: "border-color 0.2s, background 0.2s",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = "rgba(99,102,241,0.35)";
                  e.currentTarget.style.background = "rgba(99,102,241,0.05)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
                  e.currentTarget.style.background = "rgba(255,255,255,0.02)";
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <div style={{
                    width: "36px", height: "36px", borderRadius: "10px",
                    background: "rgba(99,102,241,0.12)",
                    border: "1px solid rgba(99,102,241,0.2)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "16px", flexShrink: 0
                  }}>📖</div>
                  <div>
                    <p style={{ color: "#f1f5f9", fontSize: "14px", fontWeight: "600", margin: 0 }}>{course.name}</p>
                    <p style={{ color: "#475569", fontSize: "12px", margin: "3px 0 0" }}>{course.platform}</p>
                  </div>
                </div>
                <span style={{
                  background: "linear-gradient(135deg, #6366f1, #22d3ee)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                  fontSize: "13px", fontWeight: "700", whiteSpace: "nowrap"
                }}>Learn →</span>
              </a>
            ))}
          </div>
        </Card>

        {/* Jobs */}
        <Card>
          <SectionTitle icon="🚀" color="#22d3ee">Apply for Jobs Now</SectionTitle>
          <div style={{ display: "grid", gap: "10px" }}>
            {data.job_links?.map((job, i) => (
              <a key={i}
                href={getJobUrl(job)}
                target="_blank" rel="noopener noreferrer"
                style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: "12px", padding: "14px 18px",
                  textDecoration: "none",
                  transition: "border-color 0.2s, background 0.2s",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = "rgba(34,211,238,0.35)";
                  e.currentTarget.style.background = "rgba(34,211,238,0.04)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
                  e.currentTarget.style.background = "rgba(255,255,255,0.02)";
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <div style={{
                    width: "36px", height: "36px", borderRadius: "10px",
                    background: "rgba(34,211,238,0.08)",
                    border: "1px solid rgba(34,211,238,0.2)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "16px", flexShrink: 0
                  }}>💼</div>
                  <div>
                    <p style={{ color: "#f1f5f9", fontSize: "14px", fontWeight: "600", margin: 0 }}>{job.title}</p>
                    <p style={{ color: "#475569", fontSize: "12px", margin: "3px 0 0" }}>{job.company} · {job.platform}</p>
                  </div>
                </div>
                <span style={{
                  background: "linear-gradient(135deg, #6366f1 0%, #22d3ee 100%)",
                  color: "#fff", padding: "8px 18px",
                  borderRadius: "8px", fontSize: "12px",
                  fontWeight: "700", whiteSpace: "nowrap",
                  boxShadow: "0 0 16px rgba(99,102,241,0.25)"
                }}>Apply →</span>
              </a>
            ))}
          </div>
        </Card>

      </div>
    </div>
  );
}