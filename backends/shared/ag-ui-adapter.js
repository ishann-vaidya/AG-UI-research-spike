/**
 * AG-UI Shared Adapter
 *
 * Purpose:
 * Convert any backend output into AG-UI SSE events.
 *
 * Used by:
 *  - LangChain backend
 *  - CrewAI backend
 *  - Mastra backend
 */

import crypto from "crypto";

/**
 * Send AG-UI SSE event
 */
export function sendEvent(res, type, data) {
  res.write(`event: ${type}\n`);
  res.write(`data: ${JSON.stringify(data)}\n\n`);
}

/**
 * Initialize AG-UI headers
 */
export function initStream(res) {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
}

/**
 * Create run + message IDs
 */
export function createIds(thread = "default-thread") {
  return {
    runId: crypto.randomUUID(),
    messageId: crypto.randomUUID(),
    threadId: thread,
  };
}

/**
 * Generic streaming helper
 * Accepts plain text and emits token events
 */
export async function streamText(res, text, ids, delay = 70) {
  const { runId, messageId, threadId } = ids;

  sendEvent(res, "RunStarted", {
    runId,
    threadId,
    timestamp: Date.now(),
  });

  sendEvent(res, "TextMessageStart", {
    messageId,
    role: "assistant",
    timestamp: Date.now(),
  });

  const tokens = text.split(" ");

  for (const token of tokens) {
    await new Promise((r) => setTimeout(r, delay));

    sendEvent(res, "TextMessageContent", {
      messageId,
      delta: token + " ",
    });
  }

  sendEvent(res, "TextMessageEnd", { messageId });

  sendEvent(res, "RunFinished", {
    runId,
    threadId,
    timestamp: Date.now(),
  });

  res.end();
}
