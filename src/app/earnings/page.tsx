import { Header } from '@/components/header';
import { Hero } from '@/components/hero';
import { earningOpportunities, type EarningCategory } from '@/lib/data';
import { CategoryList } from '@/components/category-list';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { ScheduledEarningsFeed } from '@/components/scheduled-earnings-feed';

async function getEarningData(){ return earningOpportunities as EarningCategory[]; }

export default async function EarningsPage(){ 
  const categories=await getEarningData(); 
  const sorted=[...categories].sort((a,b)=>{if(a.pinned&&!b.pinned)return -1;if(!a.pinned&&b.pinned)return 1;return a.name.localeCompare(b.name);}); 
  return (
    <>
      <Header showSidebarTrigger />
      <div className="space-y-4 p-4 md:p-6">
        <Breadcrumbs path={[{name:'Earnings',href:'/earnings'}]} />
        <Hero />
      </div>
      <div className="space-y-4">
        {sorted.map(category=> <CategoryList key={category.id} category={category} />)}
        <div className="p-4 md:p-6">
          <ScheduledEarningsFeed />
        </div>
      </div>
    </>
  ); 
}
