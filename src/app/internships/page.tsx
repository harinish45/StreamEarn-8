import { OpportunityTypePage } from '@/components/opportunity-type-page';
import { ScheduledOpportunityFeed } from '@/components/scheduled-opportunity-feed';

export const dynamic = 'force-dynamic';

export default function InternshipsPage(){
  return <><OpportunityTypePage kind="Internship"/><div className="mx-auto w-full max-w-[1380px] px-3 pb-10 sm:px-5 lg:px-7"><ScheduledOpportunityFeed kind="Internship"/></div></>;
}
