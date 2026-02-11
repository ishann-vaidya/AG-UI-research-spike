# AG-UI Research Spike: Multi-Framework Agent Integration

## Overview

This research spike explores whether **AG-UI (Agentic UI Protocol)** can function as a unified UX layer for agent-based systems built using different backend frameworks such as LangChain, Mastra, and CrewAI.

The primary goal was to evaluate architectural feasibility rather than deliver a production-ready integration.

---

## Research Objective

The hypothesis tested in this spike:

> AG-UI can decouple frontend UX from backend agent implementations by introducing a standardized streaming protocol layer.

### Key Questions Explored

- Can multiple agent frameworks plug into the same UI?
- What middleware is required between frameworks and AG-UI?
- What protocol mismatches appear during real integration attempts?
- How effectively can AG-UI serve as an abstraction layer across diverse agent runtimes?

---

## Technology Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Agent Runtime**: CopilotKit v2
- **UI Components**: React with TypeScript
- **Styling**: Tailwind CSS (via PostCSS)
- **Package Manager**: pnpm

### Backend Adapters
- **Node.js Adapters**: Express.js
- **Python Adapters**: FastAPI + Uvicorn
- **Communication Protocol**: Server-Sent Events (SSE)

### Agent Frameworks (Simulated)
- LangChain/LangGraph
- Mastra
- CrewAI

---

## Project Structure

```
research-spike/
├── README.md
│
├── my-ag-ui-app/                          # Main frontend application
│   ├── apps/
│   │   ├── app/                          # Next.js web application
│   │   │   ├── src/
│   │   │   │   ├── app/
│   │   │   │   │   ├── page.tsx          # Main chat interface
│   │   │   │   │   ├── layout.tsx        # Root layout
│   │   │   │   │   └── api/
│   │   │   │   │       └── copilotkit/
│   │   │   │   │           ├── route.ts         # CopilotKit API route
│   │   │   │   │           └── ag-ui-middleware.ts
│   │   │   │   │
│   │   │   │   ├── components/
│   │   │   │   │   ├── AgentSwitcher.tsx        # Switch between agents
│   │   │   │   │   ├── headless-chat.tsx        # Chat UI component
│   │   │   │   │   ├── example-layout/          # Layout wrapper
│   │   │   │   │   ├── canvas/                  # Drag-drop canvas
│   │   │   │   │   │   ├── index.tsx
│   │   │   │   │   │   ├── todo-card.tsx
│   │   │   │   │   │   ├── todo-column.tsx
│   │   │   │   │   │   └── todo-list.tsx
│   │   │   │   │   └── generative-ui/           # Generative UI examples
│   │   │   │   │       ├── meeting-time-picker.tsx
│   │   │   │   │       └── charts/
│   │   │   │   │           ├── bar-chart.tsx
│   │   │   │   │           ├── pie-chart.tsx
│   │   │   │   │           └── config.ts
│   │   │   │   │
│   │   │   │   └── hooks/
│   │   │   │       ├── use-example-suggestions.tsx
│   │   │   │       └── use-generative-ui-examples.tsx
│   │   │   │
│   │   │   ├── package.json
│   │   │   ├── next.config.ts
│   │   │   └── tsconfig.json
│   │   │
│   │   ├── agent/                        # LangGraph Python agent
│   │   │   ├── src/
│   │   │   │   ├── query.py              # Query processing
│   │   │   │   ├── todos.py              # Todo management
│   │   │   │   └── db.csv                # Sample database
│   │   │   ├── langgraph.json
│   │   │   └── package.json
│   │   │
│   │   └── mcp/                          # MCP (Model Context Protocol) app
│   │       ├── src/
│   │       │   ├── mcp-app-wrapper.tsx
│   │       │   └── threejs-app.tsx
│   │       ├── server.ts                 # MCP server
│   │       ├── mcp-app.html
│   │       └── vite.config.ts
│   │
│   ├── package.json                      # Workspace root
│   ├── pnpm-lock.yaml
│   ├── pnpm-workspace.yaml              # Workspace configuration
│   ├── turbo.json                        # Turborepo config
│   ├── CLAUDE.md                         # Claude AI instructions
│   └── docker/                           # Docker configurations
│       ├── Dockerfile.app
│       └── Dockerfile.mcp
│
├── backends/
│   ├── shared/
│   │   └── ag-ui-adapter.js             # Shared AG-UI protocol adapter
│   │
│   ├── mastra-backend/
│   │   ├── index.js                     # Mastra adapter (Express)
│   │   └── package.json
│   │
│   ├── crewai-backend/
│   │   ├── main.py                      # CrewAI adapter (FastAPI)
│   │   └── requirements.txt
│   │
│   └── dummy-agents/
│       ├── server.js                    # LangChain simulation
│       ├── package.json
│       └── pnpm-lock.yaml
│
└── docker/                               # Root docker configs
```

---

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND LAYER                           │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │           Next.js + CopilotKit (Port 3000)              │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐  │   │
│  │  │ AgentSwitcher│  │ CopilotChat │  │  Canvas/UI     │  │   │
│  │  └─────────────┘  └─────────────┘  └─────────────────┘  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                            │                                    │
│                            ▼                                    │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │           CopilotKit Runtime API Route                  │   │
│  │              /api/copilotkit (Port 3000)                 │   │
│  └─────────────────────────────────────────────────────────┘   │
│                            │                                    │
└────────────────────────────┼────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      MIDDLEWARE LAYER                           │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              RemoteAgentServiceAdapter                   │   │
│  │           (Request Forwarding & Response Parsing)       │   │
│  └─────────────────────────────────────────────────────────┘   │
└────────────────────────────┼────────────────────────────────────┘
                             │
         ┌───────────────────┼───────────────────┐
         │                   │                   │
         ▼                   ▼                   ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   LangChain  │  │    Mastra    │  │    CrewAI    │
│   (Port :    │  │   (Port 8125)│  │   (Port 8126)│
│   simulated) │  │              │  │              │
└──────────────┘  └──────────────┘  └──────────────┘
         │                   │                   │
         └───────────────────┼───────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    AG-UI ADAPTER LAYER                         │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              ag-ui-adapter.js (Shared)                  │   │
│  │  • initStream()     • createIds()     • streamText()   │   │
│  │  • sendEvent()      • SSE Formatting                   │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### AG-UI Event Flow

```
┌──────────────┐    SSE Events    ┌──────────────┐
│    Backend   │ ───────────────► │   Frontend   │
│   (Adapter)  │                  │  (CopilotKit)│
└──────────────┘                  └──────────────┘

Event Types Emitted:
├── RunStarted          (runId, threadId, timestamp)
├── TextMessageStart    (messageId, role, timestamp)
├── TextMessageContent  (messageId, delta)
├── TextMessageEnd      (messageId)
└── RunFinished         (runId, threadId, timestamp)
```

---

## Key Components

### 1. Shared AG-UI Adapter (`backends/shared/ag-ui-adapter.js`)

A reusable middleware layer that converts any backend output into AG-UI-compliant Server-Sent Events (SSE).

**Key Functions:**

| Function | Purpose |
|----------|---------|
| [`initStream()`](backends/shared/ag-ui-adapter.js:26) | Initialize SSE headers |
| [`createIds()`](backends/shared/ag-ui-adapter.js:35) | Generate unique run/message/thread IDs |
| [`streamText()`](backends/shared/ag-ui-adapter.js:47) | Stream text with AG-UI lifecycle events |
| [`sendEvent()`](backends/shared/ag-ui-adapter.js:18) | Emit SSE events |

### 2. Backend Adapters

#### Mastra Adapter (`backends/mastra-backend/index.js`)
- **Port**: 8125
- **Framework**: Express.js
- **Endpoint**: `POST /agent-mastra`
- Simulates structured workflow execution

#### CrewAI Adapter (`backends/crewai-backend/main.py`)
- **Port**: 8126
- **Framework**: FastAPI
- **Endpoint**: `POST /agent-crewai`
- Simulates multi-agent coordination

#### LangChain Simulation (`backends/dummy-agents/server.js`)
- **Port**: 8124
- **Endpoint**: `POST /agent-langchain`
- Simulates LangChain agent execution

### 3. Frontend Components

#### Main Application (`my-ag-ui-app/apps/app/src/app/page.tsx`)
- Integrates CopilotKit chat interface
- Agent switcher for backend selection
- Generative UI examples
- Drag-and-drop canvas component

#### API Route (`my-ag-ui-app/apps/app/src/app/api/copilotkit/route.ts`)
- Custom `RemoteAgentAdapter` for forwarding requests to dummy backends
- Bridges CopilotKit runtime with AG-UI protocol

---

## How to Run

### Prerequisites

- Node.js 18+ and pnpm
- Python 3.10+ and pip
- (Optional) Docker for containerized deployment

### Frontend Application

```bash
cd my-ag-ui-app/apps/app
pnpm install
pnpm dev
```

**Runs at**: http://localhost:3000

### Backend Adapters

#### Mastra Adapter
```bash
cd backends/mastra-backend
pnpm install
node index.js
# Runs on http://localhost:8125
```

#### CrewAI Adapter
```bash
cd backends/crewai-backend
pip install -r requirements.txt
uvicorn main:app --port 8126
# Runs on http://localhost:8126
```

#### LangChain Simulation
```bash
cd backends/dummy-agents
pnpm install
node server.js
# Runs on http://localhost:8124
```

### Docker Deployment

```bash
# Build frontend
cd my-ag-ui-app
docker build -f docker/Dockerfile.app -t ag-ui-app .

# Build MCP app
docker build -f docker/Dockerfile.mcp -t ag-ui-mcp .
```

---

## Hypothesis Findings

### Gaps Between AG-UI and Framework APIs

1. **Missing Lifecycle Events**
   - Most frameworks do not emit AG-UI lifecycle events natively
   - Frameworks expose different streaming schemas

2. **Runtime Expectations**
   - CopilotKit runtime expects agent behaviors not exposed externally
   - Tight coupling between runtime agent model and UI expectations

3. **Protocol Mismatches**
   - Different frameworks use different streaming formats
   - No standardized event taxonomy across frameworks

### Required Middleware Components

A shared adapter layer was implemented to bridge these gaps:

**[`ag-ui-adapter.js`](backends/shared/ag-ui-adapter.js)** responsibilities:
- Generate run and message IDs for tracking
- Normalize event structure across frameworks
- Emit standardized AG-UI lifecycle events
- Token-by-token streaming with configurable delays

### Missing Protocol Features

Observed limitations during implementation:
- No official adapters for common frameworks
- Tool invocation handling not implemented
- No fallback mechanisms when terminal events fail
- Limited support for multi-turn conversations

---

## Current Status

### ✅ Completed

- [x] AG-UI frontend setup with CopilotKit
- [x] Multi-framework adapter architecture
- [x] Shared protocol middleware implementation
- [x] Dummy agent implementations (LangChain, Mastra, CrewAI)
- [x] Agent switcher UI component
- [x] Generative UI examples (charts, meeting picker)
- [x] Drag-and-drop canvas component
- [x] MCP server implementation
- [x] Turborepo workspace configuration
- [x] Docker support for deployment

### ⏳ Not Completed

- [ ] Real framework integration (live LangChain/Mastra/CrewAI agents)
- [ ] Tool invocation validation
- [ ] Multi-turn conversation support
- [ ] Performance benchmarking
- [ ] Error handling and retry mechanisms
- [ ] Authentication and user sessions

### Reason for Limitations

Backend protocol incompatibility between AG-UI expectations and existing framework APIs, combined with spike time constraints.

---

## Key Insights

AG-UI shows strong potential as a frontend abstraction layer for agent-based systems, but real-world adoption requires:

1. **Framework-Specific Adapter Layers**
   - Each agent framework needs a dedicated adapter
   - Adapters must translate framework-specific events to AG-UI protocol

2. **Event Normalization Middleware**
   - Shared middleware handles common concerns (IDs, timestamps, SSE formatting)
   - Framework-specific logic isolated in adapters

3. **Protocol Compatibility Tooling**
   - Better tooling for protocol validation
   - Developer tools for debugging event streams

4. **Standardization Efforts**
   - Wider adoption of AG-UI by framework maintainers
   - Official adapter libraries for popular frameworks

---

## Future Directions

1. **Live Agent Integration**
   - Connect real LangGraph agents instead of simulations
   - Implement Mastra agents with actual tool definitions
   - Build CrewAI crew configurations

2. **Enhanced Protocol Support**
   - Tool invocation events
   - Function calling with parameters
   - Streaming structured data (JSON mode)

3. **User Experience**
   - Conversation history and memory
   - Voice input/output
   - Real-time collaboration features

4. **Observability**
   - Event logging and debugging
   - Performance metrics
   - Error tracking and alerts

---

## References

- [AG-UI Protocol Specification](https://github.com/ag-ui-protocol/ag-ui)
- [CopilotKit Documentation](https://docs.copilotkit.ai)
- [LangChain Documentation](https://python.langchain.com)
- [Mastra Documentation](https://mastra.ai)
- [CrewAI Documentation](https://docs.crewai.com)
