# ✅ Autonomous Implementation Checklist (Vibe Coding Guide)

This checklist is structured for AI coding agents (Antigravity, Cursor, Claude Code, Copilot). Pick the first unchecked item `[ ]`, implement, test, and mark as `[x]`.

---

## 🎯 Phase 1: Opportunity Pipeline Export
- [ ] `src/lib/export-tracker.ts`: Export personal opportunity pipeline
  - [ ] Implement CSV and JSON export for user application history
  - [ ] Support importing prior backup JSON into localStorage

## 🎯 Phase 2: AI News Automated Verification
- [ ] `scripts/verify-news.js`: Automated link checker for AI news items
  - [ ] Verify HTTP 200 on all source URLs before build
  - [ ] Flag stale items older than 7 days

## 🎯 Phase 3: Planner Mobile Gestures
- [ ] `src/components/planner/swipeable-todo.tsx`: Touch gesture support for mobile task completion
