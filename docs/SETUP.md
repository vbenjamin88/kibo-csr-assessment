# Environment Setup & Run Guide

How to set up and run the Kibo CSR Agentic AI application on Windows, Linux, and Mac.

---

## Prerequisites

| Tool | Version |
|------|---------|
| Node.js | 20 LTS+ |
| .NET SDK | 8.0+ |
| Docker Desktop | Latest (for containerized run) |
| OpenAI API Key | From OpenAI Platform |

---

## Option A: Docker (One Command - Recommended)

1. Clone and enter the repo:
   ```bash
   git clone https://github.com/vbenjamin88/kibo-csr-assessment.git
   cd kibo-csr-assessment
   ```

2. Create `.env` and add your API key:
   ```bash
   cp .env.example .env
   # Edit .env: replace sk-your-openai-api-key with your key
   ```

3. Run the stack:
   ```bash
   docker compose up --build
   ```

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API (via nginx proxy): http://localhost:3000/api/...

Only LLM_API_KEY is required; docker compose up starts backend, frontend, and database (SQLite in a volume).

---

## Option B: Local Development

### Backend

```bash
cd src/backend
dotnet restore KiboCsr.sln
dotnet run --project KiboCsr.Api
```

Ensure LLM_API_KEY is set (e.g. from .env or export).

### Frontend (separate terminal)

```bash
cd src/frontend
npm install
npm run dev
```

Frontend: http://localhost:3000 (proxies /api to backend)

---

## Running Tests

```bash
# Backend
cd src/backend && dotnet test KiboCsr.sln

# Frontend
cd src/frontend && npm test
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| LLM_API_KEY not found | Set it in .env or as env var before docker compose up |
| Port 3000/5000 in use | Stop other apps or change ports in docker-compose.yml |
| Docker build fails | Ensure Docker Desktop is running |
| Speech recognition not working | Use Chrome or Edge; grant microphone permission |
