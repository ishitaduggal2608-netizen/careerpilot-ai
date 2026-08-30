import { useState } from "react";

function BackendTest() {
  const [response, setResponse] = useState("");

  const sendData = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "Ishita",
          goal: "Software Developer",
        }),
      });

      const data = await res.json();

      setResponse(JSON.stringify(data, null, 2));
    } catch (error) {
      console.error(error);
      setResponse("Could not connect to backend.");
    }
  };

  return (
    <div style={{ padding: "40px" }}>
      <h1>Backend Test</h1>

      <button onClick={sendData}>
        Send Data to Backend
      </button>

      {response && (
        <pre style={{ marginTop: "20px" }}>
          {response}
        </pre>
      )}
    </div>
  );
}

export default BackendTest;