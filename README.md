# Kibo CSR Agentic AI Application

An agentic AI application for Kibo Customer Service Representatives (CSRs) that enables natural language interactions to retrieve order details and perform order cancellations—designed for use while on the phone with customers.

---

## Project Scope

### Purpose

CSRs are often on the phone with customers and need to retrieve data or perform actions instantly without navigating complex menus. This application allows CSRs to type (or speak) natural language requests into a chat interface, and an LLM-powered agent responds by retrieving order details or executing order cancellations.

### Functional Scope

| Capability | Description |
|------------|-------------|
| **Retrieve** | Fetch order details and display them as a structured UI component (OrderCard) |
| **Act** | Cancel orders based on business rules (e.g., only "Pending" orders can be cancelled) |

### Technical Stack

- **Frontend:** React 18+ & TypeScript
- **Backend:** .NET 8+ Web API
- **Database:** SQL or MongoDB
- **AI:** OpenAI API (or OpenAI-compatible endpoint)

### Key Features

1. **LLM Tools**
   - `GetOrder(orderId)` – Returns the full order object
   - `CancelOrder(orderId)` – Updates the order status to Cancelled

2. **UI**
   - Chat interface with text and structured components
   - `<OrderCard />` component displaying Order ID, Status Badge, and items
   - Dynamic inline rendering when the agent returns order data

3. **User Stories**
   - **Rich Lookup:** "Can you pull up order #101?" → Displays OrderCard inline
   - **Successful Action:** "Customer wants to cancel order #101" → Cancels and confirms

### Non-Functional Scope

- Unit tests (backend and frontend)
- Docker Compose (one-step run: `docker-compose up`)
- Mobile-responsive UI
- Voice-to-text input (optional enhancement)
- CI/CD and cloud deployment support

---

## Setup & Run

### Prerequisites

- Node.js 20+
- .NET 8 SDK
- Docker Desktop (for containerized run)
- OpenAI API Key

### Quick Start (Docker)

```bash
# 1. Copy .env.example to .env and add your OpenAI API key
cp .env.example .env    # Linux/Mac
# copy .env.example .env   # Windows CMD

# 2. Edit .env: replace sk-your-openai-api-key with your key from https://platform.openai.com/api-keys

# 3. Run the entire stack
docker-compose up --build
```

- **Frontend:** http://localhost:3000  
- **Backend API:** http://localhost:5000

### Local Development

See [SETUP.md](./SETUP.md) for detailed environment setup and run instructions.

---

## Testing

```bash
# Backend tests
cd src/backend && dotnet test

# Frontend tests
cd src/frontend && npm test
```

---

## Documentation

| Document | Description |
|----------|-------------|
| [SETUP.md](./SETUP.md) | Environment setup, run, and deployment guide |
| [STRATEGY.md](./STRATEGY.md) | Implementation strategy and enhancement roadmap |
| [developer-log.md](./developer-log.md) | AI strategy, human audit, and verification notes |

---

## License

Proprietary – Kibo Assessment
