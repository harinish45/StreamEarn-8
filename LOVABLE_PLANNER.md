# StreamEarn Planner — Lovable Cloud & AI Configuration

## Purpose

This document is the source-of-truth implementation brief for the **Planner only** when this repository is opened/imported in Lovable.

Do not change the rest of StreamEarn. Do not add AI Browser, AI Workspace, browser automation, or a second application shell.

## Lovable target

Use **Lovable Cloud + Lovable AI** for the Planner's in-app AI capability. Do not require the user to create or paste an OpenAI, Anthropic, Google, or other external LLM API key.

Lovable Cloud/AI manages the provider access for a Lovable-hosted application. Keep secrets out of source code.

## Planner scope

The existing `/planner` route is a complete personal planning workspace. Preserve its current UI and local-first behavior while upgrading the AI layer.

Required Planner areas:

- Today
- Week
- Calendar
- To-Do
- Sticky Wall
- Pages / Notes
- Meeting Notes
- Recurring Tasks
- Database
- Progress
- Xara AI
- Settings

## AI assistant requirements

Create a real Lovable AI-backed Planner assistant. It must never use canned/mock answers.

The assistant must receive the current Planner context and be able to reason over:

- current date
- selected date
- active tasks
- completed tasks
- deleted tasks when relevant
- notes/pages
- meeting notes
- sticky notes
- recurring tasks
- database rows
- progress statistics

The assistant must support these real actions:

1. Create a task
2. Create multiple tasks
3. Update a task
4. Complete a task
5. Delete/archive a task
6. Restore a task
7. Reschedule a task
8. Create recurring tasks
9. Create a calendar event/task block
10. Create a page
11. Create a note
12. Create meeting notes
13. Convert meeting notes into tasks
14. Create sticky notes
15. Search Planner workspace data
16. Summarize Planner state
17. Produce a daily plan
18. Produce a weekly plan
19. Identify overdue work
20. Prioritize tasks
21. Suggest schedule changes
22. Bulk-create a plan from natural language
23. Parse pasted plans into structured tasks
24. Answer questions about the user's Planner data
25. Confirm destructive actions before executing them

## Natural-language examples that must work

- "Plan my day around my pending tasks."
- "Add a high priority pentesting report for tomorrow."
- "Turn these meeting notes into tasks."
- "Move all unfinished tasks to tomorrow."
- "Create a recurring task every weekday to review security alerts."
- "What is overdue?"
- "Show me everything related to my internship applications."
- "Create a study plan for this week from my existing tasks."
- "Make a weekly plan with my highest priority tasks first."
- "Add these five tasks and schedule them across the next three days."

## Tool/action architecture

Use structured tool/function calls rather than asking the model to return arbitrary code.

Every action must validate its input against the Planner data model before mutation.

Suggested action names:

- `create_task`
- `create_tasks`
- `update_task`
- `complete_task`
- `delete_task`
- `restore_task`
- `reschedule_task`
- `create_recurring_task`
- `create_calendar_item`
- `create_page`
- `create_note`
- `create_meeting_note`
- `extract_tasks_from_text`
- `create_sticky_note`
- `search_workspace`
- `get_planner_summary`
- `get_overdue_tasks`
- `build_daily_plan`
- `build_weekly_plan`

## Safety

- Never silently delete or overwrite multiple items.
- Ask for confirmation before destructive bulk operations.
- Never invent task IDs.
- Never claim an action succeeded unless the local/Cloud mutation succeeded.
- Return structured action results and show the user what changed.
- Keep AI failures separate from Planner storage failures.
- If AI is unavailable, all non-AI Planner features must continue working.

## Storage

Keep the existing local-first Planner behavior for the standalone StreamEarn deployment.

When running inside Lovable Cloud, use Lovable Cloud persistence only if the user explicitly enables it. Do not silently replace existing local data.

If Cloud persistence is enabled, provide a migration-safe path from the existing `streamearn-xara-planner-v3` localStorage store.

## Authentication

Do not require authentication for the current single-user local Planner unless the user explicitly asks for accounts/sync.

If authentication is later requested, use Lovable Cloud authentication rather than adding a custom auth provider.

## Deployment rule

This configuration is specifically for the Planner when used in Lovable.

Do not assume Lovable AI is available to a separately deployed Render process. Render must continue to work without a provider key for all non-AI Planner functionality. The Lovable-hosted version is where the Lovable AI connector is expected to execute.

## Implementation instructions for Lovable Agent

When this repository is opened in Lovable:

1. Inspect the existing `/planner` route and preserve its UI.
2. Read this file before making Planner changes.
3. Enable Lovable Cloud/AI for the Planner AI capability.
4. Replace any provider-specific LLM/API implementation used only by Planner with Lovable AI.
5. Keep the AI endpoint/server boundary secure; do not expose credentials in browser code.
6. Implement structured Planner actions with validation.
7. Connect every successful action to the existing Planner state/store.
8. Keep localStorage fallback intact for standalone use.
9. Test all 25 AI capabilities listed above.
10. Test the Planner without AI to ensure normal task/calendar/note functionality still works.
11. Run the production build before publishing.
12. Fix all TypeScript, route, hydration, and runtime errors before publishing.
13. Do not modify unrelated StreamEarn pages.

## Definition of done

The Planner is complete only when:

- Lovable AI can answer Planner questions using real Planner context.
- Lovable AI can perform real Planner mutations.
- Actions are visible immediately in the Planner UI.
- Destructive bulk actions require confirmation.
- No mock responses exist.
- No external LLM API key is required for the Lovable-hosted Planner.
- Standalone Planner functionality still works without AI.
- Production build passes.
- `/planner` loads directly and on refresh.
- Sidebar navigation to `/planner` works.
