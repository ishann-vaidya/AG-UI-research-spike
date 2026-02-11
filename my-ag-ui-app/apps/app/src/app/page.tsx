"use client";

import AgentSwitcher from "./AgentSwitcher";
import { ExampleLayout } from "@/components/example-layout";
import { Canvas } from "@/components/canvas";
import { useGenerativeUIExamples, useExampleSuggestions } from "@/hooks";

import { CopilotChat } from "@copilotkit/react-core/v2";

export default function HomePage() {
  // 🪁 Generative UI Examples
  useGenerativeUIExamples();

  // 🪁 Example Suggestions
  useExampleSuggestions();

  return (
    <ExampleLayout
      chatContent={
        <div>
          <AgentSwitcher />
          <CopilotChat />
        </div>
      }
      appContent={<Canvas />}
    />
  );
}
