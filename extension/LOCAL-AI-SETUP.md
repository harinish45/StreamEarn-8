# StreamEarn local AI — no hosted API key

StreamEarn can run its Browser AI without a hosted provider credential by using a local inference engine on the same Windows machine.

## One-time setup

1. Install a local inference runtime from its official installer.
2. Start the runtime.
3. Download at least one chat-capable local model in that runtime.
4. Reload the `StreamEarn Browser Bridge` extension from `chrome://extensions` or `edge://extensions`.
5. Reload `https://streamearn-ai.onrender.com/browser`.

The extension checks `http://127.0.0.1:11434/api/tags` and automatically uses the first installed local model. No API key is sent to StreamEarn or stored in GitHub.

## What is local

- Chat prompts and conversation context sent to the local engine.
- Browser page context supplied to the agent.
- Browser action requests.
- StreamEarn conversation history in IndexedDB.

## What is not local

- The StreamEarn Next.js application is still delivered by Render.
- External websites remain external websites.
- The local engine must be running for local AI responses.

## Safety

The browser bridge does not automatically perform payment, purchase, transfer, deletion, cancellation, OTP, or final submission actions. Those actions must go through an explicit confirmation flow.
