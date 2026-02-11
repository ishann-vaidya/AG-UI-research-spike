from fastapi import FastAPI
from fastapi.responses import StreamingResponse
import uuid
import asyncio
import json
import time

app = FastAPI()

def event(event_type, data):
    return f"event: {event_type}\ndata: {json.dumps(data)}\n\n"

async def stream():
    run_id = str(uuid.uuid4())
    message_id = str(uuid.uuid4())

    yield event("RunStarted", {
        "runId": run_id,
        "threadId": "crewai-thread",
        "timestamp": int(time.time() * 1000)
    })

    yield event("TextMessageStart", {
        "messageId": message_id,
        "role": "assistant",
        "timestamp": int(time.time() * 1000)
    })

    text = "CrewAI adapter active. Coordinating multiple agents simulation."

    for word in text.split(" "):
        await asyncio.sleep(0.08)
        yield event("TextMessageContent", {
            "messageId": message_id,
            "delta": word + " "
        })

    yield event("TextMessageEnd", {
        "messageId": message_id
    })

    yield event("RunFinished", {
        "runId": run_id,
        "threadId": "crewai-thread",
        "timestamp": int(time.time() * 1000)
    })

@app.post("/agent-crewai")
async def agent():
    return StreamingResponse(stream(), media_type="text/event-stream")
