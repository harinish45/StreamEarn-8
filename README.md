# StreamEarn AI

StreamEarn AI is a unified personal command centre for discovering current AI tools, following AI technology news, building skills, finding earning opportunities, tracking internships and scholarships, practising cybersecurity, and managing personal work in one responsive web application.

## Project goals

- Keep useful AI, learning, career and security resources in one place.
- Prefer direct official sources for external resources.
- Keep fast-changing ecosystem data curated and date-aware rather than presenting stale entries as current.
- Separate discovery data from personal tracking state.
- Preserve user-created state instead of deleting it during filtering or refreshes.
- Keep interfaces compact, responsive and usable on desktop and mobile.
- Avoid unnecessary external AI/API dependencies for local productivity features.

## Main application areas

### Command Center
The landing dashboard for the combined StreamEarn ecosystem and quick navigation into the major sections.

### AI Intelligence
- **AI Tools** — categorized directory of current assistants, agents, coding tools, research tools, automation, GTM/lead-generation, creative, security and infrastructure products.
- **Resource Hub** — organized learning, research, cybersecurity, career and reference resources.
- **AI News** — short, verified current feed of meaningful AI and technology developments.

### Build & Earn
- **AI Work** — work and productivity-oriented AI resources.
- **Earning Opportunities** — platforms and routes for finding paid opportunities.
- **Directory** — broader useful service and resource directory.

### Opportunities
- **Internships** — verified internship radar with global, India, Tamil Nadu and remote coverage where credible listings are available.
- **Scholarships** — strict undergraduate scholarship radar.

Internships and scholarships are separate workflows even though they share common tracking concepts.

### Personal
- **Planner** — local-first tasks, weekly planning, monthly calendar, notes, progress and Sticky Wall access.

### Security
- **Cybersecurity** — security resources, learning and practice platforms.

## AI news refresh policy

The AI News primary feed is intentionally short and fresh. Daily refreshes prioritize meaningful developments from the most recent verified window and replace stale items in the primary feed rather than allowing old stories to masquerade as current.

Stories should have:

- a real publication date
- a credible source
- a working external link
- a concise, non-invented summary
- a unique visual seed

The Aug 28, 2026 refresh covers verified Aug 27 developments across agentic hardware, AI security, coding-agent abuse, AI infrastructure, enterprise agents and industry strategy.

## AI Tools refresh policy

The AI Tools directory is organized around practical capabilities rather than hype. Current additions cover assistants, agents, coding, research, GTM/lead-generation automation, creative production, AI security, observability and infrastructure.

Fast-moving additions are kept in `src/lib/current-ai-additions.ts`, while the broader stable directory lives in `src/lib/current-ai-directory.ts`.

Excluded by policy:

- AI Browser products as a dedicated StreamEarn feature
- AI Workspace products as a dedicated StreamEarn feature
- browser automation features built into StreamEarn
- API-key-dependent AI features added to local workflows

External tools can still be listed as reference products when they are useful and credible; StreamEarn does not silently integrate them into local functionality.

## Resource Hub maintenance

Resource Hub resources should point to working official destinations. During refreshes, known redirects and moved learning hubs are corrected rather than leaving stale paths in the catalog. For example, Google's AI education destination now resolves through `https://ai.google/learn-ai-skills/` while remaining discoverable through the official Google AI learning entrypoint.

## Internship & Scholarship tracking

Both opportunity pages retain the directory while allowing personal tracking for each individual record.

### Opening status
- Closing soon
- Open now
- Upcoming

The display order is always:

`Closing soon → Open now → Upcoming`

Closed listings are excluded from the active radar.

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
- Official source logos/favicons where available
- Unique visual image seeds per opportunity card
- Persistent personal status
- Favourites
- Last visited marker

Favourites, personal status and the last visited opportunity are stored in browser storage so they remain available when the same browser is used again.

### Internship eligibility policy
The internship radar prioritizes undergraduate technology profiles, especially CSE/cybersecurity, Python, security, AI, research and software roles. Sources are researched globally and across India/Tamil Nadu/remote channels, with preference for recognized companies, startups, universities, research labs, government organizations and credible official portals.

For the Aug 28, 2026 refresh, only two currently verifiable active matches were retained: the Indian Statistical Institute Chennai Winter Internship Programme (deadline Sep 7, 2026; undergraduate applicants must have completed at least year two) and the AICTE Internship Portal's InternNova Cyber Security Intern (deadline Sep 10, 2026; remote, six weeks). Outreachy and old DRDO listings were removed from the active radar after eligibility/deadline verification rather than being presented as current matches.

### Scholarship eligibility policy
The scholarship radar excludes postgraduate and study-abroad programmes. For need-based schemes where household income is an eligibility criterion, the active radar only includes schemes whose published income ceiling is at or below **₹2 lakh**. If no credible current scheme meets the strict criteria, the radar intentionally shows no verified match instead of inventing eligibility.

As of the Aug 28, 2026 refresh, no currently verified scholarship was added to the active radar under the stored strict criteria. The National Scholarship Portal is open for AY 2026-27, but available schemes must still be checked individually for year-of-study, merit, domicile and income eligibility before being surfaced.

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

### Reliability
The canonical `/planner` route now renders the hardened Planner implementation directly rather than performing a client-visible redirect. Planner data is normalized before use so malformed or stale localStorage data does not crash the route. The Planner has a loading-safe client hydration path and preserves valid stored state while ignoring malformed records.

The monthly calendar is rendered as a normal seven-column calendar, while the weekly view and To-Do workflow remain compact and responsive.

Planner functionality does not require an external LLM provider or API key.

## Data and persistence

The application separates curated directory data from personal browser state.

Typical personal state is stored in `localStorage`, including Planner data, Sticky Wall data and opportunity tracking metadata. Data is normalized before use so stale or incomplete browser state does not crash the application.

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
│  │  ├─ directory/               # Directory
│  │  ├─ earnings/                # Earning Opportunities
│  │  ├─ hub/                     # Resource Hub
│  │  ├─ internships/             # Internship workflow
│  │  ├─ scholarships/            # Scholarship workflow
│  │  ├─ news/                    # AI technology news
│  │  ├─ planner/                 # Canonical Planner route
│  │  └─ planner-v4/              # Hardened Planner implementation
│  │
│  ├─ components/
│  │  ├─ unified-sidebar.tsx      # Global navigation
│  │  ├─ planner-sticky-workspace.tsx
│  │  ├─ opportunity-type-page.tsx # Internship/scholarship UI and tracking
│  │  └─ opportunity-tracker-page.tsx
│  │
│  ├─ lib/
│  │  ├─ ai-news.ts
│  │  ├─ current-ai-additions.ts
│  │  ├─ current-ai-directory.ts
│  │  ├─ lead-automation-data.ts
│  │  └─ resource-data.ts
│  │
│  └─ ...
│
├─ public/
├─ README.md
├─ package.json
└─ configuration files
```

## Important routes

| Area | Route |
| --- | --- |
| Command Center | `/` |
| AI Tools | `/ai-tools` |
| Resource Hub | `/hub` |
| AI Work | `/ai-work` |
| Earning Opportunities | `/earnings` |
| Directory | `/directory` |
| Internships | `/internships` |
| Scholarships | `/scholarships` |
| AI Tech News | `/news` |
| Cybersecurity | `/cybersecurity` |
| Planner | `/planner` |

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

## UI principles

- Keep important controls above the fold where practical.
- Avoid unnecessary horizontal scrolling.
- Prefer compact cards and list rows over oversized empty panels.
- Keep list and grid views available where directory browsing benefits from both.
- Do not duplicate controls that already exist in the global header/sidebar.
- Give external resources a clear official-source action.
- Preserve user state across refreshes whenever technically reasonable.
- Give every new visual card a unique non-repeating image seed.

## Daily maintenance policy

Each refresh should:

1. Verify current AI news before replacing the primary feed.
2. Refresh current AI tools without adding prohibited StreamEarn integrations.
3. Review Resource Hub links for obvious stale or broken destinations and correct verified redirects.
4. Re-check internship and scholarship eligibility/deadlines before publishing active listings.
5. Remove closed/stale opportunity records from the active radar while preserving local personal state where IDs remain relevant.
6. Check important internal navigation routes, especially the unified Planner.
7. Verify list/grid controls, official source links, logos and unique visual seeds.
8. Commit verified changes directly to `main` so Render can auto-deploy.

## Security and reliability

- Validate browser-stored data before using array/object methods.
- Do not let malformed localStorage state crash a route.
- Keep external links target-safe with appropriate `rel` attributes.
- Avoid introducing provider/API requirements for features that do not need them.
- Never invent deadlines, eligibility, tools, news, links or functionality.
- Prefer official sources for opportunities and learning.

## Ownership and repository

Repository: `https://github.com/harinish45/StreamEarn-8`

Production: `https://streamearn-ai.onrender.com/`