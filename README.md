# StreamEarn AI

StreamEarn AI is a unified personal command centre for discovering AI tools and resources, following AI technology news, building skills, finding earning opportunities, tracking internships and scholarships, practising cybersecurity, and managing personal work in one responsive web application.

## Project goals

- Keep useful AI, learning, career and security resources in one place.
- Prefer direct official sources for external resources.
- Separate discovery data from personal tracking state.
- Preserve user-created state instead of deleting it during filtering or refreshes.
- Keep interfaces compact, responsive and usable on desktop and mobile.
- Avoid unnecessary dependencies on external AI providers for local productivity features.

## Main application areas

### Command Center
The landing dashboard for the combined StreamEarn ecosystem and quick navigation into the major sections.

### AI Intelligence
- **AI Tools** — categorized directory of current AI products and services.
- **Resource Hub** — organized learning, research and reference resources.
- **Learning & Courses** — structured courses and learning paths.

### Build & Earn
- **AI Work** — work and productivity-oriented AI resources.
- **Earning Opportunities** — platforms and routes for finding paid opportunities.
- **Directory** — broader useful service and resource directory.

### Opportunities
- **Internships** — dedicated internship discovery and tracking workflow.
- **Scholarships** — dedicated scholarship discovery and tracking workflow.

Internships and scholarships are intentionally separate workflows even though they share common tracking concepts.

### Personal
- **Planner** — tasks, weekly planning, monthly calendar, notes, Sticky Wall and progress tracking.

### Security
- **Cybersecurity** — security resources, learning and practice platforms.

## Internship & Scholarship tracking

Both opportunity pages retain the directory while allowing personal tracking for each individual record.

### Opening status
- Closing soon
- Open now
- Upcoming

### Personal status
- Not reviewed
- Interested
- Applied
- Interview / Selection
- Selected
- Not selected
- Saved for later

### Opportunity usability
- Search
- Opening-status filtering
- List / grid presentation
- Official-source links
- Individual opportunity imagery
- Persistent personal status
- Favourites
- Last visited marker

Favourites and personal statuses are stored in browser storage so they remain available when the same browser is used again.

## Planner

The Planner is a local-first productivity workspace designed to keep everyday work in one interface.

### Planner tabs
- Today
- Week
- Calendar
- To-Do
- Notes
- Sticky Wall
- Progress

### Task capabilities
- Checkbox completion
- Status: Not started / In progress / Done / Blocked
- Priority: None / Low / Medium / High
- Due date
- Tags
- Description
- Search
- Filtering
- Sorting
- Manual ordering
- Move up / move down
- Archive / restore
- Task detail panel
- Monthly calendar integration

### Sticky Wall
Sticky Wall is embedded inside Planner rather than requiring another application route.

- Multiple pages/boards
- Independent notes per page
- Dragging
- Completion checkbox
- Search
- Archive / restore
- Randomized note colour/design/rotation
- Persistent browser storage

## Data and persistence

The application separates curated directory data from personal browser state.

Typical personal state is stored in `localStorage`, including Planner data, Sticky Wall data and opportunity tracking metadata. Data is normalized before use so stale or incomplete browser state does not crash the application.

The application does not require an external LLM provider for Planner functionality.

## Technology

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- shadcn/ui-style components
- Lucide icons
- Browser `localStorage` for local personal state
- Render for deployment
- GitHub for source control

## Repository organization

```text
StreamEarn-8/
├─ src/
│  ├─ app/
│  │  ├─ page.tsx                 # Command Center
│  │  ├─ ai-tools/                # AI Tools directory
│  │  ├─ ai-work/                 # AI Work
│  │  ├─ cybersecurity/           # Cybersecurity area
│  │  ├─ courses/                 # Learning & Courses
│  │  ├─ directory/               # Directory
│  │  ├─ earnings/                # Earning Opportunities
│  │  ├─ hub/                     # Resource Hub
│  │  ├─ internships/             # Internship workflow
│  │  ├─ scholarships/            # Scholarship workflow
│  │  ├─ news/                    # AI technology news
│  │  ├─ opportunities/            # Shared/legacy opportunities route
│  │  └─ planner-v4/               # Planner entry route
│  │
│  ├─ components/
│  │  ├─ unified-sidebar.tsx      # Global navigation
│  │  ├─ planner-sticky-workspace.tsx
│  │  ├─ opportunity-type-page.tsx # Shared opportunity UI/data layer
│  │  └─ opportunity-tracker-page.tsx # Enhanced internship/scholarship tracker
│  │
│  ├─ lib/
│  │  ├─ ai-tools-data.tsx
│  │  ├─ current-ai-additions.ts
│  │  ├─ current-ai-directory.ts
│  │  ├─ courses-data.ts
│  │  ├─ google-ai-ecosystem-data.ts
│  │  ├─ jobs-and-careers-data.ts
│  │  ├─ lead-automation-data.ts
│  │  ├─ local-store.ts
│  │  └─ resource-data.ts
│  │
│  └─ ...
│
├─ public/
├─ README.md
├─ package.json
└─ configuration files
```

The repository also contains additional component and data modules used by the individual sections. The list above highlights the main application structure rather than every generated/supporting file.

## Local development

```bash
npm install
npm run dev
```

Open the local Next.js development server shown by the terminal, normally:

`http://localhost:3000`

## Production build

```bash
npm run build
npm start
```

## Deployment

The production application is deployed from the `main` branch to Render.

Normal workflow:

```text
change code
   ↓
commit / push to main
   ↓
Render auto-deploy
   ↓
build
   ↓
production
```

Always verify the Render deployment status after pushing a production change.

## Current important routes

| Area | Route |
| --- | --- |
| Command Center | `/` |
| AI Tools | `/ai-tools` |
| Resource Hub | `/hub` |
| Learning & Courses | `/courses` |
| AI Work | `/ai-work` |
| Earning Opportunities | `/earnings` |
| Directory | `/directory` |
| Internships | `/internships` |
| Scholarships | `/scholarships` |
| AI Tech News | `/news` |
| Cybersecurity | `/cybersecurity` |
| Planner | `/planner-v4` |

## UI principles

- Keep important controls above the fold where practical.
- Avoid unnecessary horizontal scrolling.
- Prefer compact cards and list rows over oversized empty panels.
- Keep list and grid views available where directory browsing benefits from both.
- Do not duplicate controls that already exist in the global header/sidebar.
- Give external resources a clear official-source action.
- Preserve user state across refreshes whenever technically reasonable.

## Opportunity update policy

New opportunity records should be **additive**. A new daily update should append or update records rather than clearing the existing directory. Personal favourites and application status must remain attached to the relevant opportunity id.

When an opportunity is no longer suitable for discovery, it can be represented with an appropriate opening status or retained as historical/reference data rather than silently deleting a user's tracking history.

## Security and reliability

- Validate browser-stored data before using array/object methods.
- Do not let malformed localStorage state crash a route.
- Keep external links target-safe with appropriate `rel` attributes.
- Avoid introducing provider/API requirements for features that do not need them.
- Check production build logs before declaring a deployment successful.

## Ownership and repository

Repository: `https://github.com/harinish45/StreamEarn-8`

Production: `https://streamearn-ai.onrender.com/`

## Maintenance checklist

Before merging a significant change:

1. Verify the affected route locally.
2. Verify the production build.
3. Check for stale or incompatible localStorage schemas when changing client state.
4. Confirm all navigation links point to existing routes.
5. Check Render deployment status.
6. Test the affected page after deployment, including refresh and direct URL navigation.
