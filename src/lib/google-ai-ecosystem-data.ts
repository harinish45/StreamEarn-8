
export type GoogleAiTool = {
  name: string;
  description: string;
  image: string;
  aiHint: string;
  link: string;
};

const createImage = (seed: string) => `https://picsum.photos/seed/${seed}/320/180`;

export const googleAiTools: GoogleAiTool[] = [
  {
    name: 'NOTEBOOKLM',
    description: 'Turns documents into podcasts, mind maps, summaries',
    image: createImage('notebooklm-card'),
    aiHint: 'document summary',
    link: '#',
  },
  {
    name: 'GEMINI GEMS',
    description: 'Create custom AI agents',
    image: createImage('gemini-gems-card'),
    aiHint: 'abstract shapes',
    link: '#',
  },
  {
    name: 'IMAGEN 3',
    description: 'Hyperrealistic image generation',
    image: createImage('imagen3-card'),
    aiHint: 'text prompt',
    link: '#',
  },
  {
    name: 'WHISK',
    description: 'Merge multiple images into one scene',
    image: createImage('whisk-card'),
    aiHint: 'image editing',
    link: '#',
  },
  {
    name: 'LUMIERE',
    description: 'Natural-motion video generation',
    image: createImage('lumiere-card'),
    aiHint: 'video play button',
    link: '#',
  },
  {
    name: 'NANO BANANA',
    description: 'Fast, creative image generation',
    image: createImage('nanobanana-card'),
    aiHint: 'banana image',
    link: '#',
  },
  {
    name: 'AI STUDIO',
    description: 'Access to all Google AI models',
    image: createImage('aistudio-card'),
    aiHint: 'blue waves',
    link: '#',
  },
  {
    name: 'OPAL',
    description: 'Build AI mini-apps instantly',
    image: createImage('opal-card'),
    aiHint: 'code interface',
    link: '#',
  },
];
