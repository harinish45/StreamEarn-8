import type { ResourceLink } from './resource-data';

/**
 * Small, reviewed overrides for high-value directory entries.
 * URLs are kept on first-party/official domains where available.
 */
export const DIRECTORY_OVERRIDES: Record<string, Partial<ResourceLink>> = {
  '57': { title: '99acres', url: 'https://www.99acres.com/', description: 'Indian property discovery platform for buying, renting, selling and researching residential and commercial real estate.' },
  '58': { title: 'Housing.com', url: 'https://housing.com/', description: 'Indian real-estate platform for buying, renting and selling homes, plots and commercial property.' },
  '59': { title: 'MagicBricks', url: 'https://www.magicbricks.com/', description: 'Indian property marketplace with active sale and rental listings, market tools and real-estate insights.' },
  '60': { title: 'NoBroker', url: 'https://www.nobroker.in/', description: 'Indian property platform for buying, renting and selling homes with broker-free discovery services.' },
  '61': { title: 'Square Yards', url: 'https://www.squareyards.com/', description: 'Integrated real-estate and mortgage platform covering property search, transactions, valuation, loans and management.' },
  '62': { title: 'JLL India', url: 'https://www.jll.com/en-in/', description: 'Commercial real-estate services, investment advisory, workplace solutions and market research in India.' },
  '63': { title: 'CBRE India', url: 'https://www.cbre.co.in/', description: 'Commercial real-estate services, property advisory, research and investment solutions across India.' },
  '64': { title: 'Godrej Properties', url: 'https://www.godrejproperties.com/', description: 'Indian residential and commercial real-estate developer with active projects across major cities.' },
  '65': { title: 'Prestige Group', url: 'https://www.prestigeconstructions.com/', description: 'Indian real-estate developer with residential, commercial, retail, hospitality and mixed-use projects.' },
  '66': { title: 'DLF', url: 'https://www.dlf.in/', description: 'Indian real-estate developer and manager spanning residential, commercial and retail properties.' },
};

export function applyDirectoryOverrides(item: ResourceLink): ResourceLink {
  return { ...item, ...(DIRECTORY_OVERRIDES[item.id] || {}) };
}
