
import React from 'react';

export type AiTool = {
  name: string;
  logoKey: string;
  link: string;
};

export type AiToolCategory = {
  name: string;
  tools: AiTool[];
};

export const aiToolsPyramid: AiToolCategory[] = [
  {
    name: 'Code Editor',
    tools: [
      { name: 'Cursor', logoKey: 'cursorLogo', link: 'https://cursor.sh/' },
    ],
  },
  {
    name: 'Market Research',
    tools: [
      { name: 'Perplexity', logoKey: 'perplexityLogo', link: 'https://www.perplexity.ai/' },
      { name: 'Gemini', logoKey: 'geminiLogo', link: 'https://gemini.google.com/' },
    ],
  },
  {
    name: 'Writing Assistant',
    tools: [
      { name: 'ChatGPT', logoKey: 'chatGPTLogo', link: 'https://chat.openai.com/' },
      { name: 'Claude', logoKey: 'claudeLogo', link: 'https://claude.ai/' },
      { name: 'Grok', logoKey: 'grokLogo', link: 'https://grok.x.ai/' },
    ],
  },
  {
    name: 'Design Tools',
    tools: [
      { name: 'Midjourney', logoKey: 'midjourneyLogo', link: 'https://www.midjourney.com/' },
      { name: 'Recraft', logoKey: 'recraftLogo', link: 'https://www.recraft.ai/' },
      { name: 'Figma', logoKey: 'figmaLogo', link: 'https://www.figma.com/' },
      { name: 'Canva', logoKey: 'canvaLogo', link: 'https://www.canva.com/' },
    ],
  },
  {
    name: 'Lead Automation',
    tools: [
      { name: 'Clay', logoKey: 'clayLogo', link: 'https://www.clay.com/' },
      { name: 'Apify', logoKey: 'apifyLogo', link: 'https://apify.com/' },
      { name: 'Hunter', logoKey: 'hunterLogo', link: 'https://hunter.io/' },
      { name: 'Clearbit', logoKey: 'clearbitLogo', link: 'https://clearbit.com/' },
      { name: 'Lusha', logoKey: 'lushaLogo', link: 'https://www.lusha.com/' },
      { name: 'ZoomInfo', logoKey: 'zoomInfoLogo', link: 'https://www.zoominfo.com/' },
    ],
  },
  {
    name: 'Productivity',
    tools: [
      { name: 'RecCloud', logoKey: 'recCloudLogo', link: 'https://www.reccloud.com/' },
      { name: 'Tidio', logoKey: 'tidioLogo', link: 'https://www.tidio.com/' },
      { name: 'Zapier', logoKey: 'zapierLogo', link: 'https://zapier.com/' },
      { name: 'Calendly', logoKey: 'calendlyLogo', link: 'https://calendly.com/' },
      { name: 'PicWish', logoKey: 'picWishLogo', link: 'https://picwish.com/' },
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
