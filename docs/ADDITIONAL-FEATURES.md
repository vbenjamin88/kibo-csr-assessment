# Additional Features - Implementation & Rationale

Bonus and extra features beyond the assessment requirements.

---

## Bonus Features (from Assessment)

**Confirmation Step Before Cancellation** - Agent prompt instructs model to ask "Are you sure you want to cancel Order #X? (Yes/No)" and only call CancelOrder when user affirms. Reduces accidental cancellations.

**Streaming** - AgentService yields chunks; ChatController streams SSE; frontend appends to message. Snappier feel.

---

## Extra Features

**Voice-to-Text Input** - useVoiceInput hook (Web Speech API), microphone button in ChatInput. For hands-free CSR workflows.

**Dark/Light Mode** - useTheme hook, Tailwind dark: classes, toggle in header. User preference.

**Conversation History** - Chat sends previous messages to backend; AgentService builds full message list for LLM. Enables contextual replies.

**Order Context Resolution** - Backend parses last [ORDER:id] from history; when user says "cancel it" without ID, injects resolved order and forces GetOrder. Avoids "which order?" when context is clear.

**Status vs Cancellation Intent** - Prompt distinguishes "order status of X" (lookup) from "cancel X" (action). Prevents wrong actions.

**Order-Not-Found Handling** - Prompt tells model not to output [ORDER:id] when order missing; show "Order #X was not found". No empty cards.

**Floating Chat Widget** - ChatWidget with floating button and expandable pane. Quick lookups without leaving workflow.

**Page Structure** - React Router: Home (landing), Chat (full page). Nav in header. Room for future pages.

**Mobile Header** - Hide title and subtitle on small screens. Cleaner mobile layout.

**Typo Tolerance** - Normalize "canel"/"cancle" to "cancel" before intent detection. More forgiving.
