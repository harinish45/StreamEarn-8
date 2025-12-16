
import React from 'react';
import Image from 'next/image';

export type AiTool = {
  name: string;
  logo: React.ReactNode;
  link: string;
};

export type AiToolCategory = {
  name: string;
  tools: AiTool[];
};

const placeholderLogo = (seed: string) => (
  <Image
    src={`https://picsum.photos/seed/${seed}/48/48`}
    alt={`${seed} logo`}
    width={48}
    height={48}
    className="rounded-md object-cover"
    data-ai-hint="logo"
  />
);

export const aiToolsPyramid: AiToolCategory[] = [
  {
    name: 'Code Editor',
    tools: [
      { name: 'Cursor', logo: placeholderLogo('Cursor'), link: 'https://cursor.sh/' },
    ],
  },
  {
    name: 'Market Research',
    tools: [
      { name: 'Perplexity', logo: placeholderLogo('Perplexity'), link: 'https://www.perplexity.ai/' },
      { name: 'Gemini', logo: placeholderLogo('Gemini'), link: 'https://gemini.google.com/' },
    ],
  },
  {
    name: 'Writing Assistant',
    tools: [
      { name: 'ChatGPT', logo: placeholderLogo('ChatGPT'), link: 'https://chat.openai.com/' },
      { name: 'Claude', logo: placeholderLogo('Claude'), link: 'https://claude.ai/' },
      { name: 'Grok', logo: placeholderLogo('Grok'), link: 'https://grok.x.ai/' },
    ],
  },
  {
    name: 'Design Tools',
    tools: [
      { name: 'Midjourney', logo: placeholderLogo('Midjourney'), link: 'https://www.midjourney.com/' },
      { name: 'Recraft', logo: placeholderLogo('Recraft'), link: 'https://www.recraft.ai/' },
      { name: 'Figma', logo: placeholderLogo('Figma'), link: 'https://www.figma.com/' },
      { name: 'Canva', logo: placeholderLogo('Canva'), link: 'https://www.canva.com/' },
    ],
  },
  {
    name: 'Lead Automation',
    tools: [
      { name: 'Clay', logo: placeholderLogo('Clay'), link: 'https://www.clay.com/' },
      { name: 'Apify', logo: placeholderLogo('Apify'), link: 'https://apify.com/' },
      { name: 'Hunter', logo: placeholderLogo('Hunter'), link: 'https://hunter.io/' },
      { name: 'Clearbit', logo: placeholderLogo('Clearbit'), link: 'https://clearbit.com/' },
      { name: 'Lusha', logo: placeholderLogo('Lusha'), link: 'https://www.lusha.com/' },
      { name: 'ZoomInfo', logo: placeholderLogo('ZoomInfo'), link: 'https://www.zoominfo.com/' },
    ],
  },
  {
    name: 'Productivity',
    tools: [
      { name: 'RecCloud', logo: placeholderLogo('RecCloud'), link: 'https://www.reccloud.com/' },
      { name: 'Tidio', logo: placeholderLogo('Tidio'), link: 'https://www.tidio.com/' },
      { name: 'Zapier', logo: placeholderLogo('Zapier'), link: 'https://zapier.com/' },
      { name: 'Calendly', logo: placeholderLogo('Calendly'), link: 'https://calendly.com/' },
      { name: 'PicWish', logo: placeholderLogo('PicWish'), link: 'https://picwish.com/' },
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
