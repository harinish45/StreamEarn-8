
import { type FinanceAndMoneyTool } from '@/lib/finance-and-money-data';
import Image from 'next/image';
import Link from 'next/link';

export function FinanceAndMoney({ searchQuery, financeAndMoneyTools = [] }: { searchQuery: string, financeAndMoneyTools: FinanceAndMoneyTool[] }) {
  
  const filteredTools = financeAndMoneyTools.filter(tool =>
    tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (filteredTools.length === 0 && searchQuery) {
    return null;
  }

  return (
    <div className="relative w-full overflow-hidden rounded-xl bg-gradient-to-b from-[#0a101d] to-[#0c1222] p-8 shadow-2xl h-full">
      <Image
        src="https://picsum.photos/seed/wave-bg/1024/300"
        alt="Abstract wave background"
        width={1024}
        height={300}
        className="absolute top-0 left-0 w-full h-auto object-cover opacity-30"
        data-ai-hint="abstract wave"
      />
      <div className="relative z-10">
        <div className="mb-8 text-center">
          <h2 className="text-4xl font-bold tracking-tight text-white">Finance & Money</h2>
          <div className="mt-2 h-1 w-24 bg-[#00A3FF] mx-auto rounded-full" />
        </div>
        <ul className="space-y-5 text-white/80">
          {filteredTools.map((tool) => (
            <li key={tool.number}>
                <Link href={tool.link} target="_blank" rel="noopener noreferrer" className="flex gap-4 group">
                  <span className="text-lg font-medium text-white/60">{tool.number}/</span>
                  <div>
                    <span className="font-bold text-[#00A3FF] transition-colors group-hover:text-white">{tool.name}</span>
                    <span className="text-white/80"> - {tool.description}</span>
                  </div>
                </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
