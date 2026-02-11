"use client";

import { useState } from "react";

const agents = [
  { id: "langchain", label: "LangChain" },
  { id: "crewai", label: "CrewAI" },
  { id: "mastra", label: "Mastra" },
];

export default function AgentSwitcher() {
  const [activeAgent, setActiveAgent] = useState("langchain");

  return (
    <div style={{ padding: 12, borderBottom: "1px solid #ddd" }}>
      <strong>Active Framework:</strong>

      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
        {agents.map((agent) => (
          <button
            key={agent.id}
            onClick={() => setActiveAgent(agent.id)}
            style={{
              padding: "6px 12px",
              borderRadius: 6,
              border:
                activeAgent === agent.id
                  ? "2px solid black"
                  : "1px solid #ccc",
              background:
                activeAgent === agent.id ? "#eee" : "transparent",
              cursor: "pointer",
            }}
          >
            {agent.label}
          </button>
        ))}
      </div>

      <p style={{ marginTop: 10, fontSize: 12, color: "#666" }}>
        Selected agent: <b>{activeAgent}</b>
      </p>
    </div>
  );
}
