import PlannerV4 from '../planner-v4/page';

export const dynamic = 'force-dynamic';

// /planner is the canonical unified Planner entrypoint. Reuse the hardened
// implementation directly instead of adding a client-visible redirect.
export default PlannerV4;
