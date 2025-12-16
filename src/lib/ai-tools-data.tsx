
import React from 'react';

export type AiTool = {
  name: string;
  logo: string;
  link: string;
};

export type AiToolCategory = {
  name: string;
  tools: AiTool[];
};

const createLogo = (seed: string) => `https://picsum.photos/seed/${seed}/60/60`;

export const aiToolsPyramid: AiToolCategory[] = [
  {
    name: 'Code Editor',
    tools: [
      { name: 'Cursor', logo: createLogo('Cursor'), link: 'https://cursor.sh/' },
    ],
  },
  {
    name: 'Market Research',
    tools: [
      { name: 'Perplexity', logo: createLogo('Perplexity'), link: 'https://www.perplexity.ai/' },
      { name: 'Gemini', logo: createLogo('Gemini'), link: 'https://gemini.google.com/' },
    ],
  },
  {
    name: 'Writing Assistant',
    tools: [
      { name: 'ChatGPT', logo: createLogo('ChatGPT'), link: 'https://chat.openai.com/' },
      { name: 'Claude', logo: createLogo('Claude'), link: 'https://claude.ai/' },
      { name: 'Grok', logo: createLogo('Grok'), link: 'https://grok.x.ai/' },
    ],
  },
  {
    name: 'Design Tools',
    tools: [
      { name: 'Midjourney', logo: createLogo('Midjourney'), link: 'https://www.midjourney.com/' },
      { name: 'Recraft', logo: createLogo('Recraft'), link: 'https://www.recraft.ai/' },
      { name: 'Figma', logo: createLogo('Figma'), link: 'https://www.figma.com/' },
      { name: 'Canva', logo: createLogo('Canva'), link: 'https://www.canva.com/' },
    ],
  },
  {
    name: 'Lead Automation',
    tools: [
      { name: 'Clay', logo: createLogo('Clay'), link: 'https://www.clay.com/' },
      { name: 'Apify', logo: createLogo('Apify'), link: 'https://apify.com/' },
      { name: 'Hunter', logo: createLogo('Hunter'), link: 'https://hunter.io/' },
      { name: 'Clearbit', logo: createLogo('Clearbit'), link: 'https://clearbit.com/' },
      { name: 'Lusha', logo: createLogo('Lusha'), link: 'https://www.lusha.com/' },
      { name: 'ZoomInfo', logo: createLogo('ZoomInfo'), link: 'https://www.zoominfo.com/' },
    ],
  },
  {
    name: 'Productivity',
    tools: [
      { name: 'RecCloud', logo: createLogo('RecCloud'), link: 'https://www.reccloud.com/' },
      { name: 'Tidio', logo: createLogo('Tidio'), link: 'https://www.tidio.com/' },
      { name: 'Zapier', logo: createLogo('Zapier'), link: 'https://zapier.com/' },
      { name: 'Calendly', logo: createLogo('Calendly'), link: 'https://calendly.com/' },
      { name: 'PicWish', logo: createLogo('PicWish'), link: 'https://picwish.com/' },
    ],
  },
];

export const toolSubLabels: Record<string, string> = {
    RecCloud: 'Video Translation',
    Tidio: 'Customer Service',
    Zapier: 'Multi-platform',
    Calendly: 'Schedule Management',
    PicWish: 'Image Generation',
};
