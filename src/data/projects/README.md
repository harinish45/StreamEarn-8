# Project persistence

Supabase is the production source of truth for project data. The legacy JSON file is retained during migration and must never be treated as an overwrite target.

Rules:
- Create new records; do not replace the collection.
- Archive instead of destructive deletion.
- Keep project activity append-only.
- Keep scheduler data separate from Planner and Projects.
- Never let a failed scheduler run truncate or reset existing records.
- Take a verified backup/export before destructive infrastructure changes.

Required production environment variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- Server-only Supabase secret key only where privileged ingestion is required; never expose it to the browser.
