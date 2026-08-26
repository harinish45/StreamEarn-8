'use client';

// Fresh route entry for Planner. This intentionally points at the same
// local-first Planner implementation while giving browsers a new route
// boundary so stale cached /planner error bundles cannot trap the user.
export { default } from '@/app/planner/page';
