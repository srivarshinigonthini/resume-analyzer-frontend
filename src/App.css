import React, { useState } from "react";
import UploadPage from "./components/UploadPage";
import ResultsPage from "./components/ResultsPage";
import LoadingPage from "./components/LoadingPage";

function App() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  return (
    <div>
      {loading ? (
        <LoadingPage />
      ) : result ? (
        <ResultsPage data={result} onBack={() => setResult(null)} />
      ) : (
        <UploadPage onResult={setResult} onLoading={setLoading} />
      )}
    </div>
  );
}

export default App;