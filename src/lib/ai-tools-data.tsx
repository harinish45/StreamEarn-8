
import React from 'react';

export type AiTool = {
  name: string;
  logo: React.ReactNode;
};

export type AiToolCategory = {
  name: string;
  tools: AiTool[];
};

const placeholderLogo = (seed: string) => (
  <img
    src={`https://picsum.photos/seed/${seed}/48/48`}
    alt={`${seed} logo`}
    className="h-12 w-12 rounded-full object-cover"
    data-ai-hint="logo"
  />
);

export const aiToolsPyramid: AiToolCategory[] = [
  {
    name: 'Code Editor',
    tools: [
      { name: 'Cursor', logo: placeholderLogo('Cursor') },
    ],
  },
  {
    name: 'Market Research',
    tools: [
      { name: 'Perplexity', logo: placeholderLogo('Perplexity') },
      { name: 'Gemini', logo: placeholderLogo('Gemini') },
    ],
  },
  {
    name: 'Writing Assistant',
    tools: [
      { name: 'ChatGPT', logo: placeholderLogo('ChatGPT') },
      { name: 'Claude', logo: placeholderLogo('Claude') },
      { name: 'Grok', logo: placeholderLogo('Grok') },
    ],
  },
  {
    name: 'Design Tools',
    tools: [
      { name: 'Midjourney', logo: placeholderLogo('Midjourney') },
      { name: 'Recraft', logo: placeholderLogo('Recraft') },
      { name: 'Figma', logo: placeholderLogo('Figma') },
      { name: 'Canva', logo: placeholderLogo('Canva') },
    ],
  },
  {
    name: 'Productivity',
    tools: [
      { name: 'RecCloud', logo: placeholderLogo('RecCloud') },
      { name: 'Tidio', logo: placeholderLogo('Tidio') },
      { name: 'Zapier', logo: placeholderLogo('Zapier') },
      { name: 'Calendly', logo: placeholderLogo('Calendly') },
      { name: 'PicWish', logo: placeholderLogo('PicWish') },
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
