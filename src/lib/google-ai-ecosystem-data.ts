
export type GoogleAiTool = {
  name: string;
  description: string;
  image: string;
  aiHint: string;
};

const createImage = (seed: string) => `https://picsum.photos/seed/${seed}/320/180`;

export const googleAiTools: GoogleAiTool[] = [
  {
    name: 'NOTEBOOKLM',
    description: 'Turns documents into podcasts, mind maps, summaries',
    image: createImage('notebooklm-card'),
    aiHint: 'document summary',
  },
  {
    name: 'GEMINI GEMS',
    description: 'Create custom AI agents',
    image: createImage('gemini-gems-card'),
    aiHint: 'abstract shapes',
  },
  {
    name: 'IMAGEN 3',
    description: 'Hyperrealistic image generation',
    image: createImage('imagen3-card'),
    aiHint: 'text prompt',
  },
  {
    name: 'WHISK',
    description: 'Merge multiple images into one scene',
    image: createImage('whisk-card'),
    aiHint: 'image editing',
  },
  {
    name: 'LUMIERE',
    description: 'Natural-motion video generation',
    image: createImage('lumiere-card'),
    aiHint: 'video play button',
  },
  {
    name: 'NANO BANANA',
    description: 'Fast, creative image generation',
    image: createImage('nanobanana-card'),
    aiHint: 'banana image',
  },
  {
    name: 'AI STUDIO',
    description: 'Access to all Google AI models',
    image: createImage('aistudio-card'),
    aiHint: 'blue waves',
  },
  {
    name: 'OPAL',
    description: 'Build AI mini-apps instantly',
    image: createImage('opal-card'),
    aiHint: 'code interface',
  },
];
