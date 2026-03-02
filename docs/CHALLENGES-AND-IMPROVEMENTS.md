# Challenges & Improvements

Challenges faced during implementation and suggested next steps.

---

## Challenges

### 1. LLM Consistency with "cancel it"

**Problem:** The model sometimes asked for the order number or used the wrong order when the user said "cancel it" after viewing an order.

**Approach:** Added deterministic logic in the backend:
- Parse last `[ORDER:id]` from conversation history
- When user says "cancel it" (no explicit ID), inject resolved order into the prompt and force a `GetOrder` tool call
- Override the order ID in tool execution if the model still uses the wrong one

### 2. Stale Closure in React

**Problem:** Chat history was empty when sent to the API because `handleSend` closed over an outdated `messages` value (missing from the `useCallback` dependency array).

**Approach:** Added `messages` to the dependency array so the latest history is used.

### 3. Status vs Cancellation Intent

**Problem:** The model sometimes treated "order status of 101" as a cancellation request.

**Approach:** Clear prompt rules: "status", "details", "look up" → lookup only; "cancel" → cancellation flow. No overlap.

### 4. Empty Order Card for Non-Existent Orders

**Problem:** When an order did not exist, the model still returned `[ORDER:id]`, producing an empty card.

**Approach:** Prompt rule: when GetOrder returns an error, respond with a clear "not found" message and do not include `[ORDER:id]`.

---

## Suggested Improvements

### Short Term

1. **Conversation persistence** – Store chats in a DB so CSRs can resume or search past sessions
2. **Keyboard shortcuts** – e.g. `Ctrl+K` to open/focus chat
3. **Copy transcript** – One-click copy for tickets or escalation
4. **Suggested prompts** – Show example queries when the chat is empty

### Medium Term

1. **Multi-language** – Support Spanish, French, etc. for global CSRs
2. **Order ID autocomplete** – Suggest known order IDs as the user types
3. **Analytics** – Usage metrics (lookups vs cancellations, avg resolution time)
4. **Rate limiting** – Throttle API calls per user/session

### Longer Term

1. **Auth** – Login and per-CSR history
2. **Integrations** – Connect to CRM or ticketing systems
3. **Observability** – Logging and tracing for LLM calls and tool usage
