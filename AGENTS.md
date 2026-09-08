# 🤖 AI Agent Engineering Guidelines

1. **Strict Hydration Safety:** Always use client-side hydration wrappers when accessing `localStorage` to prevent React SSR hydration mismatches.
2. **Never Invent Data:** Never hallucinate scholarship deadlines, internship requirements, or news stories. Only use verified real-world sources.
3. **Zero External API Lock-in for Planner:** Planner features must remain local-first and fully functional offline without requiring API keys.
