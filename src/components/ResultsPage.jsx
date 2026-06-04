import React, { useEffect, useState } from "react";
import confetti from "canvas-confetti";

export default function ResultsPage({ data, onBack }) {
  const [atsScore, setAtsScore] = useState(0);
  const [roleScore, setRoleScore] = useState(0);

  useEffect(() => {
    // Animate scores
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

    // Confetti if high score
    if (data.ats_score >= 80) {
      setTimeout(() => {
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 },
          colors: ["#00ffa3", "#00c3ff", "#ffffff"]
        });
      }, 1000);
    }

    return () => { clearInterval(atsInterval); clearInterval(roleInterval); };
  }, [data]);

  const scoreColor = atsScore >= 80 ? "#00ffa3" : atsScore >= 60 ? "#ffcc00" : "#ff4d4d";
  const roleColor = roleScore >= 80 ? "#00ffa3" : roleScore >= 60 ? "#ffcc00" : "#ff4d4d";

  const getCourseUrl = (course) => {
    if (course.url && course.url.startsWith("http")) return course.url;
    if (course.platform && course.platform.toLowerCase().includes("udemy"))
      return `https://www.udemy.com/courses/search/?q=${encodeURIComponent(course.name)}`;
    if (course.platform && course.platform.toLowerCase().includes("youtube"))
      return `https://www.youtube.com/results?search_query=${encodeURIComponent(course.name)}`;
    return `https://www.coursera.org/search?query=${encodeURIComponent(course.name)}`;
  };

  const getJobUrl = (job) => {
    if (job.url && job.url.startsWith("http")) return job.url;
    return `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(job.title)}`;
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0a0a0a 0%, #0d1117 50%, #0a0a0a 100%)",
      fontFamily: "'Segoe UI', sans-serif",
      padding: "32px 16px", color: "#fff"
    }}>
      <div style={{
        position: "fixed", top: 0, left: 0,
        width: "400px", height: "400px",
        background: "radial-gradient(circle, rgba(0,255,163,0.06) 0%, transparent 70%)",
        pointerEvents: "none"
      }}/>
      <div style={{
        position: "fixed", bottom: 0, right: 0,
        width: "400px", height: "400px",
        background: "radial-gradient(circle, rgba(0,150,255,0.06) 0%, transparent 70%)",
        pointerEvents: "none"
      }}/>

      <div style={{ maxWidth: "900px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
          <div>
            <h1 style={{
              fontSize: "28px", fontWeight: "800",
              background: "linear-gradient(90deg, #00ffa3, #00c3ff)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
            }}>Analysis Results</h1>
            <p style={{ color: "#888", fontSize: "13px" }}>AI-powered resume insights</p>
          </div>
          <button onClick={onBack} style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.15)",
            color: "#ccc", padding: "10px 20px",
            borderRadius: "10px", cursor: "pointer", fontSize: "13px"
          }}>← Analyze Another</button>
        </div>

        {/* Score Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
          <div style={{
            background: "rgba(255,255,255,0.05)",
            border: `1px solid ${scoreColor}40`,
            borderRadius: "20px", padding: "32px",
            textAlign: "center",
            boxShadow: `0 0 30px ${scoreColor}15`
          }}>
            <p style={{ color: "#aaa", fontSize: "12px", marginBottom: "8px", letterSpacing: "1px" }}>ATS SCORE</p>
            <div style={{ fontSize: "64px", fontWeight: "900", color: scoreColor, lineHeight: 1 }}>
              {atsScore}
            </div>
            <div style={{ color: "#777", fontSize: "16px", marginBottom: "12px" }}>/100</div>
            <div style={{ height: "4px", background: "rgba(255,255,255,0.1)", borderRadius: "99px" }}>
              <div style={{
                height: "100%", width: `${atsScore}%`,
                background: `linear-gradient(90deg, ${scoreColor}, #00c3ff)`,
                borderRadius: "99px", transition: "width 0.05s"
              }}/>
            </div>
          </div>

          <div style={{
            background: "rgba(255,255,255,0.05)",
            border: `1px solid ${roleColor}40`,
            borderRadius: "20px", padding: "32px",
            textAlign: "center",
            boxShadow: `0 0 30px ${roleColor}15`
          }}>
            <p style={{ color: "#aaa", fontSize: "12px", marginBottom: "8px", letterSpacing: "1px" }}>ROLE MATCH</p>
            <div style={{ fontSize: "64px", fontWeight: "900", color: roleColor, lineHeight: 1 }}>
              {roleScore}
            </div>
            <div style={{ color: "#777", fontSize: "16px", marginBottom: "12px" }}>%</div>
            <div style={{ height: "4px", background: "rgba(255,255,255,0.1)", borderRadius: "99px" }}>
              <div style={{
                height: "100%", width: `${roleScore}%`,
                background: `linear-gradient(90deg, ${roleColor}, #00c3ff)`,
                borderRadius: "99px", transition: "width 0.05s"
              }}/>
            </div>
          </div>
        </div>

        {/* Skills Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
          <div style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(0,255,163,0.2)",
            borderRadius: "20px", padding: "24px"
          }}>
            <h2 style={{ color: "#00ffa3", fontSize: "15px", fontWeight: "700", marginBottom: "16px" }}>
              ✅ Skills Found
            </h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {data.skills_found?.map((skill, i) => (
                <span key={i} style={{
                  background: "rgba(0,255,163,0.1)",
                  border: "1px solid rgba(0,255,163,0.3)",
                  color: "#00ffa3", padding: "5px 12px",
                  borderRadius: "99px", fontSize: "12px", fontWeight: "500"
                }}>{skill}</span>
              ))}
            </div>
          </div>

          <div style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,77,77,0.2)",
            borderRadius: "20px", padding: "24px"
          }}>
            <h2 style={{ color: "#ff4d4d", fontSize: "15px", fontWeight: "700", marginBottom: "16px" }}>
              ❌ Missing Skills
            </h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {data.missing_skills?.map((skill, i) => (
                <span key={i} style={{
                  background: "rgba(255,77,77,0.1)",
                  border: "1px solid rgba(255,77,77,0.3)",
                  color: "#ff6b6b", padding: "5px 12px",
                  borderRadius: "99px", fontSize: "12px", fontWeight: "500"
                }}>{skill}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Skill Progress Bars */}
        <div style={{
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "20px", padding: "24px", marginBottom: "20px"
        }}>
          <h2 style={{ color: "#fff", fontSize: "15px", fontWeight: "700", marginBottom: "20px" }}>
            📊 Skill Match Analysis
          </h2>
          {data.skills_found?.slice(0, 5).map((skill, i) => (
            <div key={i} style={{ marginBottom: "14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                <span style={{ color: "#ccc", fontSize: "13px" }}>{skill}</span>
                <span style={{ color: "#00ffa3", fontSize: "13px", fontWeight: "600" }}>✓ Found</span>
              </div>
              <div style={{ height: "6px", background: "rgba(255,255,255,0.05)", borderRadius: "99px" }}>
                <div style={{
                  height: "100%",
                  width: `${80 + Math.random() * 20}%`,
                  background: "linear-gradient(90deg, #00ffa3, #00c3ff)",
                  borderRadius: "99px",
                  transition: "width 1s ease"
                }}/>
              </div>
            </div>
          ))}
          {data.missing_skills?.slice(0, 3).map((skill, i) => (
            <div key={i} style={{ marginBottom: "14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                <span style={{ color: "#ccc", fontSize: "13px" }}>{skill}</span>
                <span style={{ color: "#ff4d4d", fontSize: "13px", fontWeight: "600" }}>✗ Missing</span>
              </div>
              <div style={{ height: "6px", background: "rgba(255,255,255,0.05)", borderRadius: "99px" }}>
                <div style={{
                  height: "100%",
                  width: `${10 + Math.random() * 30}%`,
                  background: "linear-gradient(90deg, #ff4d4d, #ff8800)",
                  borderRadius: "99px",
                  transition: "width 1s ease"
                }}/>
              </div>
            </div>
          ))}
        </div>

        {/* Strengths & Improvements */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
          <div style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(0,195,255,0.2)",
            borderRadius: "20px", padding: "24px"
          }}>
            <h2 style={{ color: "#00c3ff", fontSize: "15px", fontWeight: "700", marginBottom: "16px" }}>
              💪 Strengths
            </h2>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {data.strengths?.map((s, i) => (
                <li key={i} style={{ color: "#ccc", fontSize: "13px", marginBottom: "12px", display: "flex", gap: "8px", lineHeight: "1.5" }}>
                  <span style={{ color: "#00c3ff", flexShrink: 0 }}>→</span>{s}
                </li>
              ))}
            </ul>
          </div>

          <div style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,204,0,0.2)",
            borderRadius: "20px", padding: "24px"
          }}>
            <h2 style={{ color: "#ffcc00", fontSize: "15px", fontWeight: "700", marginBottom: "16px" }}>
              🔧 Improvements
            </h2>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {data.improvements?.map((s, i) => (
                <li key={i} style={{ color: "#ccc", fontSize: "13px", marginBottom: "12px", display: "flex", gap: "8px", lineHeight: "1.5" }}>
                  <span style={{ color: "#ffcc00", flexShrink: 0 }}>→</span>{s}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Job Roles */}
        <div style={{
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "20px", padding: "24px", marginBottom: "20px"
        }}>
          <h2 style={{ color: "#fff", fontSize: "15px", fontWeight: "700", marginBottom: "16px" }}>
            💼 Suitable Job Roles For You
          </h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
            {data.job_roles?.map((job, i) => (
              <span key={i} style={{
                background: "linear-gradient(90deg, rgba(0,255,163,0.15), rgba(0,195,255,0.15))",
                border: "1px solid rgba(0,255,163,0.25)",
                color: "#fff", padding: "10px 20px",
                borderRadius: "99px", fontSize: "13px", fontWeight: "600"
              }}>{job}</span>
            ))}
          </div>
        </div>

        {/* Courses */}
        <div style={{
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "20px", padding: "24px", marginBottom: "20px"
        }}>
          <h2 style={{ color: "#fff", fontSize: "15px", fontWeight: "700", marginBottom: "16px" }}>
            📚 Courses to Improve Your Skills
          </h2>
          <div style={{ display: "grid", gap: "12px" }}>
            {data.courses?.map((course, i) => (
              <a key={i}
                href={getCourseUrl(course)}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "12px", padding: "14px 18px",
                  textDecoration: "none"
                }}>
                <div>
                  <p style={{ color: "#fff", fontSize: "14px", fontWeight: "600", margin: 0 }}>
                    {course.name}
                  </p>
                  <p style={{ color: "#888", fontSize: "12px", margin: "4px 0 0" }}>
                    {course.platform}
                  </p>
                </div>
                <span style={{
                  background: "linear-gradient(90deg, #00ffa3, #00c3ff)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                  fontSize: "13px", fontWeight: "700", whiteSpace: "nowrap"
                }}>Learn →</span>
              </a>
            ))}
          </div>
        </div>

        {/* Job Apply Links */}
        <div style={{
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(0,255,163,0.15)",
          borderRadius: "20px", padding: "24px"
        }}>
          <h2 style={{ color: "#fff", fontSize: "15px", fontWeight: "700", marginBottom: "16px" }}>
            🚀 Apply for Jobs Now
          </h2>
          <div style={{ display: "grid", gap: "12px" }}>
            {data.job_links?.map((job, i) => (
              <a key={i}
                href={getJobUrl(job)}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  background: "rgba(0,255,163,0.03)",
                  border: "1px solid rgba(0,255,163,0.12)",
                  borderRadius: "12px", padding: "14px 18px",
                  textDecoration: "none"
                }}>
                <div>
                  <p style={{ color: "#fff", fontSize: "14px", fontWeight: "600", margin: 0 }}>
                    {job.title}
                  </p>
                  <p style={{ color: "#888", fontSize: "12px", margin: "4px 0 0" }}>
                    {job.company} • {job.platform}
                  </p>
                </div>
                <span style={{
                  background: "linear-gradient(90deg, #00ffa3, #00c3ff)",
                  color: "#000", padding: "8px 16px",
                  borderRadius: "8px", fontSize: "12px",
                  fontWeight: "700", whiteSpace: "nowrap"
                }}>Apply →</span>
              </a>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}