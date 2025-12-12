
export type LeadAutomationTool = {
  id: string;
  title: string;
  description: string;
  link: string;
  logo: string;
  recentlySeen?: boolean;
};

const createLogo = (seed: string) => `https://picsum.photos/seed/${seed}/100/100`;

export const leadAutomationTools: LeadAutomationTool[] = [
  {
    id: "clay",
    title: "Clay",
    description: "Data enrichment and outbound automation platform.",
    link: "https://www.clay.com/",
    logo: createLogo('clay-logo'),
    recentlySeen: true,
  },
  {
    id: "apify",
    title: "Apify",
    description: "Web scraping and automation platform to extract data from any website.",
    link: "https://apify.com/",
    logo: createLogo('apify-logo'),
  },
  {
    id: "hunter",
    title: "Hunter.io",
    description: "Find and verify professional email addresses.",
    link: "https://hunter.io/",
    logo: createLogo('hunter-logo'),
  },
  {
    id: "clearbit",
    title: "Clearbit",
    description: "Marketing intelligence to understand customers and find new prospects.",
    link: "https://clearbit.com/",
    logo: createLogo('clearbit-logo'),
  },
  {
    id: "lusha",
    title: "Lusha",
    description: "Get access to B2B contact and company details.",
    link: "https://www.lusha.com/",
    logo: createLogo('lusha-logo'),
  },
  {
    id: "zoominfo",
    title: "ZoomInfo",
    description: "B2B intelligence platform for sales and marketing teams.",
    link: "https://www.zoominfo.com/",
    logo: createLogo('zoominfo-logo'),
  },
];
