import { PlannerCloud } from '@/components/planner-cloud';

export const dynamic = 'force-dynamic';

// Canonical unified Planner entrypoint. The Planner owns its own shell.
export default function PlannerPage() {
  return <PlannerCloud />;
}
