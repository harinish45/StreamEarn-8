
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
    link: 'https://notebooklm.google.com/',
  },
  {
    name: 'GEMINI GEMS',
    description: 'Create custom AI agents',
    image: createImage('gemini-gems-card'),
    aiHint: 'abstract shapes',
    link: 'https://gemini.google.com/app',
  },
  {
    name: 'IMAGEN 3',
    description: 'Hyperrealistic image generation',
    image: createImage('imagen3-card'),
    aiHint: 'text prompt',
    link: 'https://deepmind.google/technologies/imagen-3/',
  },
  {
    name: 'WHISK',
    description: 'Merge multiple images into one scene',
    image: createImage('whisk-card'),
    aiHint: 'image editing',
    link: 'https://deepmind.google/discover/blog/generating-and-editing-images-with-multimodal-large-language-models/',
  },
  {
    name: 'LUMIERE',
    description: 'Natural-motion video generation',
    image: createImage('lumiere-card'),
    aiHint: 'video play button',
    link: 'https://lumiere-video.github.io/',
  },
  {
    name: 'NANO BANANA',
    description: 'Fast, creative image generation',
    image: createImage('nanobanana-card'),
    aiHint: 'banana image',
    link: 'https://gemini.google.com/overview/image-generation/',
  },
  {
    name: 'AI STUDIO',
    description: 'Access to all Google AI models',
    image: createImage('aistudio-card'),
    aiHint: 'blue waves',
    link: 'https://aistudio.google.com/',
  },
  {
    name: 'OPAL',
    description: 'Build AI mini-apps instantly',
    image: createImage('opal-card'),
    aiHint: 'code interface',
    link: 'https://opal.dev/',
  },
  {
    name: 'GROQ',
    description: 'Lightning-fast AI inference',
    image: createImage('groq-card'),
    aiHint: 'speed circuit',
    link: 'https://groq.com/',
  },
  {
    name: 'OPEN ROUTER',
    description: 'Access hundreds of AI models',
    image: createImage('openrouter-card'),
    aiHint: 'network hub',
    link: 'https://openrouter.ai/',
  },
  {
    name: 'DEEPSEEK',
    description: 'Advanced code & language models',
    image: createImage('deepseek-card'),
    aiHint: 'brain code',
    link: 'https://www.deepseek.com/',
  },
  {
    name: 'AIMLAPI',
    description: 'A single API for multiple AI models',
    image: createImage('aimlapi-card'),
    aiHint: 'api interface',
    link: 'https://www.aimlapi.com/',
  },
];
