# Kibo CSR Agentic AI Application

An agentic AI application for Kibo Customer Service Representatives (CSRs) that enables natural language interactions to retrieve order details and perform order cancellations.

---

## Project Scope

| Category | Scope |
|----------|-------|
| **Purpose** | CSRs type (or speak) natural language requests; an LLM-powered agent retrieves orders or cancels them |
| **Retrieve** | Fetch order details and display as structured `<OrderCard />` |
| **Act** | Cancel orders (only Pending status) |
| **Stack** | React 18+ & TypeScript, .NET 8+ Web API, SQLite, OpenAI API |

See the assessment document for full requirements.

---

## Documentation

| Document | Purpose |
|----------|---------|
| [SETUP.md](./docs/SETUP.md) | Environment setup and how to run locally or with Docker |
| [CORE-FEATURES.md](./docs/CORE-FEATURES.md) | Mandatory features and how they were implemented |
| [ADDITIONAL-FEATURES.md](./docs/ADDITIONAL-FEATURES.md) | Bonus and extra features, rationale, and implementation |
| [CHALLENGES-AND-IMPROVEMENTS.md](./docs/CHALLENGES-AND-IMPROVEMENTS.md) | Challenges faced and suggested improvements |
| [developer-log.md](./developer-log.md) | AI strategy, human audit, and verification (assessment requirement) |

---

## Quick Start

```bash
# 1. Copy .env.example to .env and add your OpenAI API key
cp .env.example .env

# 2. Run everything (Docker)
docker compose up --build
```

- **Frontend:** http://localhost:3000  
- **Backend API:** http://localhost:5000  

For full setup and testing, see [SETUP.md](./docs/SETUP.md).
