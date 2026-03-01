# Developer Log – Kibo CSR Assessment

## AI Strategy

### Context Provided to AI

1. **Assessment requirements**: Full PDF spec including stack (React 18+, .NET 8, SQL/Mongo, OpenAI), functional requirements (GetOrder, CancelOrder, OrderCard, chat UI), non-functional (tests, Docker).
2. **Project structure**: Enforced separation of backend (KiboCsr.Api, KiboCsr.Tests) and frontend (React + Vite + TypeScript).
3. **Conventions**: .NET best practices (async, DI, EF Core), TypeScript strict mode, Tailwind for styling.
4. **Enhancements**: Mobile-responsive, voice-to-text, dark/light mode, Kibo branded loading icon, cross-platform Docker.

### How AI Was Directed

- **Schemas first**: Defined `Order`, `OrderStatus`, and API DTOs before implementation.
- **Explicit rules**: "Only Pending orders can be cancelled"; "Agent must ask for confirmation before cancelling"; "[ORDER:id] format for inline rendering."
- **Incremental build**: Backend → Frontend → Docker → Tests → CI, with validation at each step.

---

## Human Audit – Corrections & Refinements

### 1. Security: LLM API Key Handling

**AI output**: Initially suggested reading the API key from `appsettings.json` only.

**Correction**: Ensured `LLM_API_KEY` is read from environment variables (and optionally `OpenAI:ApiKey` in config), never committed. Added validation that throws if the key is missing at startup. Documented in README and docker-compose.

**Reason**: Avoid leaking credentials; support 12-factor config.

---

### 2. Business Logic: Cancel Confirmation Flow

**AI output**: Agent could cancel immediately when the user said "cancel order 101."

**Correction**: Updated the system prompt so the agent must first ask: "Are you sure you want to cancel Order #101? (Yes/No)" and only call `CancelOrder` when the user replies "Yes."

**Reason**: Reduces accidental cancellations; aligns with assessment bonus requirement.

---

### 3. Frontend: OrderCard Rendering with Missing Data

**AI output**: ChatMessage tried to render OrderCard when `[ORDER:101]` appeared, but the order data was not always available.

**Correction**: Chat component now parses the streamed content for `[ORDER:id]`, fetches each order via `getOrder()`, and passes an `orders` map to ChatMessage. OrderCard only renders when the order exists in the map.

**Reason**: Avoids blank or broken cards; ensures robust dynamic rendering.

---

## Verification – Test Generation

### AI-Assisted Tests

- **Backend**: xUnit tests for `OrderService` (GetOrder with/without #, CancelOrder for Pending/Shipped/NotFound). AI suggested cases; human verified edge cases (e.g. `#101` vs `101`).
- **Frontend**: Vitest + React Testing Library for OrderCard (id, customer, status, total, items, test id). AI proposed structure; human added assertions for accessibility and test ids.

### Edge Cases Covered

- Order not found
- Shipped order cannot be cancelled
- Already-cancelled order
- Order ID with leading `#`
- Empty or malformed API responses

---

## Tools & Versions

- **Backend**: .NET 8, EF Core 8, SQLite
- **Frontend**: React 18, Vite 5, Tailwind 3, TypeScript 5.6
- **Containerization**: Docker, docker-compose (Windows, Linux, Mac)
- **CI**: GitHub Actions
