import React, { useState, useEffect } from "react";
import LoginPage from "./components/LoginPage";
import UploadPage from "./components/UploadPage";
import ResultsPage from "./components/ResultsPage";
import LoadingPage from "./components/LoadingPage";
import PremiumPage from "./components/PremiumPage";

function App() {
  const [user, setUser] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPremium, setShowPremium] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const handleLogin = () => {
    const savedUser = localStorage.getItem("currentUser");
    setUser(JSON.parse(savedUser));
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    setUser(null);
    setResult(null);
  };

  const checkTrialAndAnalyze = (onResult, onLoading) => {
    const user = JSON.parse(localStorage.getItem("currentUser") || "{}");
    if (user.isPremium) return true;

    const trialKey = `trials_${user.email}`;
    const trialData = JSON.parse(localStorage.getItem(trialKey) || '{"count": 0, "date": ""}');
    const today = new Date().toDateString();

    if (trialData.date !== today) {
      localStorage.setItem(trialKey, JSON.stringify({ count: 0, date: today }));
      trialData.count = 0;
    }

    if (trialData.count >= 2) {
      setShowPremium(true);
      return false;
    }

    localStorage.setItem(trialKey, JSON.stringify({ count: trialData.count + 1, date: today }));
    return true;
  };

  const getTrialsLeft = () => {
    const user = JSON.parse(localStorage.getItem("currentUser") || "{}");
    if (user.isPremium) return "unlimited";
    const trialKey = `trials_${user.email}`;
    const trialData = JSON.parse(localStorage.getItem(trialKey) || '{"count": 0, "date": ""}');
    const today = new Date().toDateString();
    if (trialData.date !== today) return 2;
    return Math.max(0, 2 - trialData.count);
  };

  if (!user) return <LoginPage onLogin={handleLogin} />;
  if (showPremium) return <PremiumPage onUpgrade={() => { setShowPremium(false); setUser(JSON.parse(localStorage.getItem("currentUser"))); }} onBack={() => setShowPremium(false)} />;
  if (loading) return <LoadingPage />;
  if (result) return <ResultsPage data={result} onBack={() => setResult(null)} />;

  return (
    <UploadPage
      onResult={setResult}
      onLoading={setLoading}
      checkTrial={checkTrialAndAnalyze}
      trialsLeft={getTrialsLeft()}
      user={user}
      onLogout={handleLogout}
    />
  );
}

export default App;