import { Header } from '@/components/header';
import { NewsSection } from '@/components/news-section';

export const metadata = { title: 'AI Tech News | StreamEarn', description: 'Current AI technology updates, launches and ecosystem trends.' };

export default function NewsPage() {
  return (
    <>
      <Header showSidebarTrigger />
      <div className="mx-auto w-full max-w-[1500px] px-4 py-8 md:px-8 md:py-12">
        <NewsSection />
      </div>
    </>
  );
}
