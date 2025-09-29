// src/components/DebugParallelRequests.jsx
import React, { useState } from "react";
import axiosInstance from "../../api/axiosInstance";

export default function DebugParallelRequests() {
  const [logs, setLogs] = useState([]);
  const [running, setRunning] = useState(false);

  const addLog = (msg) => setLogs((l) => [ `${new Date().toISOString()} — ${msg}`, ...l ]);

  // Simple parallel: goals + tasks
  const runParallelTwo = async () => {
    setRunning(true);
    setLogs([]);
    addLog("Starting two parallel requests: /goals/ and /tasks/");

    try {
      const start = Date.now();
      const res = await Promise.all([
        axiosInstance.get("/goals/"),
        axiosInstance.get("/tasks/"),
      ]);
      const ms = Date.now() - start;
      addLog(`✅ Both succeeded in ${ms}ms`);
      addLog(`goals: ${res[0].status}, tasks: ${res[1].status}`);
    } catch (err) {
      addLog(`❌ Parallel request error: ${err.message || err}`);
      // If error.response available, print status and url
      if (err?.config) addLog(`failed request url: ${err.config.url}`);
      if (err?.response) addLog(`response status: ${err.response.status}`);
    } finally {
      setRunning(false);
    }
  };

  // Larger parallel test: N requests to the same endpoint
  const runMany = async (n = 6) => {
    setRunning(true);
    setLogs([]);
    addLog(`Starting ${n} parallel requests to /tasks/`);
    try {
      const requests = Array.from({ length: n }).map(() => axiosInstance.get("/tasks/"));
      const start = Date.now();
      const res = await Promise.all(requests);
      addLog(`✅ All ${n} requests succeeded in ${Date.now() - start}ms`);
    } catch (err) {
      addLog(`❌ Some request failed: ${err.message || err}`);
      if (err?.response) addLog(`failed response status: ${err.response.status}`);
    } finally {
      setRunning(false);
    }
  };

  return (
    <div style={{ padding: 12, border: "1px solid #ddd", marginBottom: 12 }}>
      <h4>Debug: Parallel Requests</h4>
      <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
        <button onClick={runParallelTwo} disabled={running}>Run 2 parallel</button>
        <button onClick={() => runMany(6)} disabled={running}>Run 6 parallel</button>
      </div>

      <div style={{ maxHeight: 240, overflow: "auto", background: "#f7f7f7", padding: 8 }}>
        {logs.length === 0 ? <div style={{ color: "#666" }}>No logs yet</div> : logs.map((l, i) => <div key={i} style={{ fontFamily: "monospace", fontSize: 12 }}>{l}</div>)}
      </div>
      <div style={{ marginTop: 8, color: "#999" }}>
        (Temporary debug UI — remove after testing)
      </div>
    </div>
  );
}