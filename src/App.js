import React, { useState } from "react";
import UploadPage from "./components/UploadPage";
import ResultsPage from "./components/ResultsPage";

function App() {
  const [result, setResult] = useState(null);

  return (
    <div>
      {result ? (
        <ResultsPage data={result} onBack={() => setResult(null)} />
      ) : (
        <UploadPage onResult={setResult} />
      )}
    </div>
  );
}

export default App;