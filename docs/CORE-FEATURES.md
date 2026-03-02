# Core Features - Implementation

Mandatory requirements from the assessment and how they were implemented.

---

## Data Layer

| Item | Implementation |
|------|----------------|
| **Location** | `KiboCsr.Api/Data/AppDbContext.cs`, `Models/Order.cs` |
| **Schema** | OrderId (string), CustomerName (string), Status (enum), Total (decimal), ItemsJson (JSON) |
| **Database** | SQLite via EF Core 8 |
| **Seeding** | 5 records in `Program.cs`: 101 Pending, 102 Shipped, 103 Pending, 104 Cancelled, 105 Shipped |

---

## LLM Tools

| Tool | Implementation |
|------|----------------|
| **GetOrder(orderId)** | `OrderService.GetOrderAsync()`, exposed as OpenAI function tool in `AgentService` |
| **CancelOrder(orderId)** | `OrderService.CancelOrderAsync()`, enforces only Pending can be cancelled |

---

## UI - Chat Interface

- **OrderCard**: `OrderCard.tsx` - Order ID, status badge (green/yellow/grey), customer, total, items
- **Inline rendering**: Agent returns `[ORDER:id]`; `ChatMessage` parses, fetches order, renders `OrderCard` inline
- **Standard text**: Plain text for general answers

---

## User Stories

- **Story 1 (Rich Lookup)**: "Can you pull up order #101?" -> GetOrder(101) -> OrderCard inline
- **Story 2 (Successful Action)**: "Cancel order #101" -> confirmation -> CancelOrder(101) -> success message

---

## Non-Functional Requirements

- **Unit tests**: Backend `KiboCsr.Tests`, Frontend Vitest for OrderCard
- **Docker**: `docker-compose.yml`, one-step `docker compose up --build` with `LLM_API_KEY` in `.env`
