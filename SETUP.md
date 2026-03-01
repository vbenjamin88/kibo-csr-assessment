# Environment Setup & Run Guide

Complete guide for setting up and running the Kibo CSR Agentic AI application on **Windows, Linux, and Mac**.

---

## Prerequisites

| Tool | Version | Purpose |
|------|---------|---------|
| **Node.js** | 20 LTS+ | Frontend build & dev |
| **npm** | 10+ | Package management |
| **.NET SDK** | 8.0+ | Backend API |
| **Docker Desktop** | Latest | Containerization (optional) |
| **Git** | 2.x | Version control |
| **OpenAI API Key** | - | LLM authentication |

### Verify Installations

```powershell
# Windows PowerShell
node --version
npm --version
dotnet --version
docker --version
git --version
```

```bash
# Linux / Mac
node --version
npm --version
dotnet --version
docker --version
git --version
```

---

## Option A: Run with Docker (Recommended – Cross-Platform)

Works on **Windows, Linux, and Mac**.

### 1. Clone the Repository

```bash
git clone https://github.com/vbenjamin88/kibo-csr-assessment.git
cd kibo-csr-assessment
```

### 2. Set Environment Variable

**Windows (PowerShell):**
```powershell
$env:LLM_API_KEY = "sk-your-openai-api-key"
```

**Windows (Command Prompt):**
```cmd
set LLM_API_KEY=sk-your-openai-api-key
```

**Linux / Mac:**
```bash
export LLM_API_KEY=sk-your-openai-api-key
```

**Or create `.env` file** in the project root:
```
LLM_API_KEY=sk-your-openai-api-key
```

### 3. Run Everything

```bash
docker-compose up --build
```

### 4. Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **API (via frontend proxy):** http://localhost:3000/api/...

---

## Option B: Run Locally (Development)

### Backend

```bash
cd src/backend
dotnet restore KiboCsr.sln
dotnet run --project KiboCsr.Api
```

Backend runs at `http://localhost:5000`.

### Frontend

In a **new terminal**:

```bash
cd src/frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:3000` and proxies `/api` to the backend.

---

## Running Tests

### Backend

```bash
cd src/backend
dotnet test KiboCsr.sln
```

### Frontend

```bash
cd src/frontend
npm test
```

---

## Platform-Specific Notes

### Windows
- Use PowerShell or Command Prompt as shown above
- Docker Desktop must be running for containerized run
- If `dotnet` is not found, install .NET 8 SDK from https://dotnet.microsoft.com/download

### Linux
- Install Docker: `sudo apt install docker.io docker-compose` (Ubuntu/Debian)
- Or use Docker Desktop for Linux
- Ensure user is in `docker` group: `sudo usermod -aG docker $USER`

### Mac
- Install Docker Desktop from https://www.docker.com/products/docker-desktop
- Use Terminal or iTerm

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `LLM_API_KEY` not found | Set env var before `docker-compose up` |
| Port 3000/5000 in use | Stop other apps or change ports in docker-compose.yml |
| CORS errors | Backend allows all origins in dev; check proxy in frontend |
| DB connection failed | Ensure backend container has write access to volume |
| Speech recognition not working | Use Chrome or Edge; grant microphone permission; HTTPS required in production |
| `dotnet restore` fails | Check network; add `nuget.org` to NuGet sources |

---

## Quick Reference

```bash
# Full stack with Docker (all platforms)
docker-compose up --build

# Backend only
cd src/backend && dotnet run --project KiboCsr.Api

# Frontend only (with backend running)
cd src/frontend && npm run dev

# Run all tests
cd src/backend && dotnet test
cd src/frontend && npm test
```
