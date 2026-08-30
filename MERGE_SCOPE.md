# Unified StreamEarn merge

This release combines the supplied project archives into the existing StreamEarn application.

Included:
- StreamEarn AI discovery, earning and directory surfaces
- Resource Hub: learning links, cybersecurity, careers, platforms, favorites and business/real-estate dashboard tools
- AI News, Internships and Scholarships workflows
- Xara Planner: Planner, Calendar, To-Do, Notes and Sticky Wall
- Refreshed AI directory organized by current workflow categories

Product boundaries:
- AI Browser is not a StreamEarn feature and has no application route or navigation entry.
- AI Workspace is not a StreamEarn feature and has no application route or navigation entry.
- Browser automation is not silently enabled as a StreamEarn workflow.
- Courses are not a StreamEarn feature and are not exposed as a route or navigation entry.
- Scheduler content is append-only and deduplicated; it never replaces or automatically deletes stored scheduler items.
- Internships and Scholarships remain separate workflows.

The deployment remains the existing Render web service.
