import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

/**
 * Legacy compatibility route. The production Planner is /planner-v4.
 * Keeping this route as a redirect preserves the supported Planner entrypoint
 * while preventing obsolete planner-v2 code from blocking production builds.
 */
export default function PlannerV2Page() {
  redirect('/planner-v4');
}
