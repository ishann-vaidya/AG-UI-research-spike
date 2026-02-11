import {
  CopilotRuntime,
  copilotRuntimeNextJSAppRouterEndpoint,
  CopilotServiceAdapter,
} from "@copilotkit/runtime";
import { NextRequest } from "next/server";

/**
 * Custom service adapter to forward requests to the dummy backend
 */
class RemoteAgentAdapter implements CopilotServiceAdapter {
  constructor(private backendUrl: string) {}

  async process(request: any): Promise<any> {
    // Forward the request to the dummy backend
    const response = await fetch(this.backendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    // Get the response as text (SSE format)
    const text = await response.text();

    // Return a simple response object
    return {
      content: text,
    };
  }
}

export const POST = async (req: NextRequest) => {
  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    endpoint: "/api/copilotkit",
    serviceAdapter: new RemoteAgentAdapter("http://localhost:8124/agent-langchain"),
    runtime: new CopilotRuntime(),
  });

  return handleRequest(req);
};
