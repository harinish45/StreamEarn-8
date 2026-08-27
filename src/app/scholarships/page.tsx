import { OpportunityTrackerPage } from '@/components/opportunity-tracker-page';
import { ScheduledOpportunityFeed } from '@/components/scheduled-opportunity-feed';

export const dynamic = 'force-dynamic';

export default function ScholarshipsPage(){
  return <><OpportunityTrackerPage kind="Scholarship"/><div className="mx-auto w-full max-w-[1380px] px-3 pb-10 sm:px-5 lg:px-7"><ScheduledOpportunityFeed kind="Scholarship"/></div></>;
}
