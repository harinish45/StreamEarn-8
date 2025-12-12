import React from 'react';

export type AiTool = {
  name: string;
  logo: string;
};

export type AiToolCategory = {
  name: string;
  tools: AiTool[];
};

const createLogo = (seed: string) => `https://picsum.photos/seed/${seed}/48/48`;

export const illegalAiTools: AiToolCategory[] = [
  {
    name: 'Viral marketing tools',
    tools: [
      { name: 'ViralSky', logo: createLogo('ViralSky') },
      { name: 'ThreadMaster', logo: createLogo('ThreadMaster') },
      { name: 'VibeFluencer', logo: createLogo('VibeFluencer') },
      { name: 'VidIQ', logo: createLogo('VidIQ') },
      { name: 'Ocoya', logo: createLogo('Ocoya') },
      { name: 'AdCreative', logo: createLogo('AdCreative') },
      { name: 'Freedom Threads', logo: createLogo('Freedom Threads') },
    ],
  },
  {
    name: 'Vibe coding tools',
    tools: [
      { name: 'Emergent', logo: createLogo('Emergent') },
      { name: 'Firebase Studio', logo: createLogo('Firebase Studio') },
      { name: 'Rocket', logo: createLogo('Rocket') },
      { name: 'Lovable', logo: createLogo('Lovable') },
      { name: 'Bolt', logo: createLogo('Bolt') },
      { name: 'CREAO', logo: createLogo('CREAO') },
      { name: 'MGX', logo: createLogo('MGX') },
      { name: 'Replit', logo: createLogo('Replit') },
      { name: 'Base44', logo: createLogo('Base44') },
    ],
  },
  {
    name: 'Vibe design tools',
    tools: [
      { name: 'Nano Banana', logo: createLogo('Nano Banana') },
      { name: 'Seedream', logo: createLogo('Seedream') },
      { name: 'Lovart', logo: createLogo('Lovart') },
      { name: 'Picsart', logo: createLogo('Picsart') },
      { name: 'VSCO', logo: createLogo('VSCO') },
      { name: 'ChatGPT', logo: createLogo('ChatGPT-design') },
      { name: 'Canva', logo: createLogo('Canva-design') },
    ],
  },
  {
    name: 'Vibe marketing tools',
    tools: [
      { name: 'Notebooks', logo: createLogo('Notebooks') },
      { name: 'Poppy AI', logo: createLogo('Poppy AI') },
      { name: 'Gamma', logo: createLogo('Gamma') },
      { name: 'Freepik', logo: createLogo('Freepik') },
      { name: 'Higgsfield', logo: createLogo('Higgsfield') },
      { name: 'Reka', logo: createLogo('Reka') },
      { name: 'MiniMax', logo: createLogo('MiniMax') },
    ],
  },
  {
    name: 'AI image & video tools',
    tools: [
      { name: 'AIVideo', logo: createLogo('AIVideo') },
      { name: 'ImagineArt', logo: createLogo('ImagineArt') },
      { name: 'Syllaby', logo: createLogo('Syllaby') },
      { name: 'HeyGen', logo: createLogo('HeyGen') },
      { name: 'Runway', logo: createLogo('Runway') },
      { name: 'Submagic', logo: createLogo('Submagic') },
      { name: 'Krea AI', logo: createLogo('Krea AI') },
    ],
  },
  {
    name: 'AI coding assistants',
    tools: [
      { name: 'Cursor', logo: createLogo('Cursor-assist') },
      { name: 'Kilo Code', logo: createLogo('Kilo Code') },
      { name: 'Github Copilot', logo: createLogo('Github Copilot') },
      { name: 'Kiro', logo: createLogo('Kiro') },
      { name: 'Tabnine', logo: createLogo('Tabnine') },
      { name: 'Devin', logo: createLogo('Devin') },
      { name: 'Aider', logo: createLogo('Aider') },
    ],
  },
  {
    name: 'Automation tools',
    tools: [
      { name: 'BooSend', logo: createLogo('BooSend') },
      { name: 'Manus', logo: createLogo('Manus') },
      { name: 'ChatGPT Tasks', logo: createLogo('ChatGPT Tasks') },
      { name: 'N8N', logo: createLogo('N8N') },
      { name: 'Make', logo: createLogo('Make') },
      { name: 'Zapier', logo: createLogo('Zapier-auto') },
      { name: 'Apollo', logo: createLogo('Apollo') },
    ],
  },
  {
    name: 'Health tools',
    tools: [
      { name: 'Foodient', logo: createLogo('Foodient') },
      { name: 'ChatGPT', logo: createLogo('ChatGPT-health') },
      { name: 'Cal AI', logo: createLogo('Cal AI') },
      { name: 'Calm', logo: createLogo('Calm') },
      { name: 'Flo', logo: createLogo('Flo') },
      { name: 'Fitbod', logo: createLogo('Fitbod') },
      { name: 'Runna', logo: createLogo('Runna') },
    ],
  },
];
