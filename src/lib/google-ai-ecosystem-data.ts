
export type GoogleAiTool = {
  name: string;
  description: string;
  imageKey: string;
  aiHint: string;
  link: string;
};

export const googleAiTools: GoogleAiTool[] = [
  {
    name: 'NOTEBOOKLM',
    description: 'Turns documents into podcasts, mind maps, summaries',
    imageKey: 'notebooklmCardImage',
    aiHint: 'document summary',
    link: 'https://notebooklm.google.com/',
  },
  {
    name: 'GEMINI GEMS',
    description: 'Create custom AI agents',
    imageKey: 'geminiGemsCardImage',
    aiHint: 'abstract shapes',
    link: 'https://gemini.google.com/app',
  },
  {
    name: 'IMAGEN 3',
    description: 'Hyperrealistic image generation',
    imageKey: 'imagen3CardImage',
    aiHint: 'text prompt',
    link: 'https://deepmind.google/technologies/imagen-3/',
  },
  {
    name: 'WHISK',
    description: 'Merge multiple images into one scene',
    imageKey: 'whiskCardImage',
    aiHint: 'image editing',
    link: 'https://deepmind.google/discover/blog/generating-and-editing-images-with-multimodal-large-language-models/',
  },
  {
    name: 'LUMIERE',
    description: 'Natural-motion video generation',
    imageKey: 'lumiereCardImage',
    aiHint: 'video play button',
    link: 'https://lumiere-video.github.io/',
  },
  {
    name: 'NANO BANANA',
    description: 'Fast, creative image generation',
    imageKey: 'nanobananaCardImage',
    aiHint: 'banana image',
    link: 'https://gemini.google.com/overview/image-generation/',
  },
  {
    name: 'AI STUDIO',
    description: 'Access to all Google AI models',
    imageKey: 'aistudioCardImage',
    aiHint: 'blue waves',
    link: 'https://aistudio.google.com/',
  },
  {
    name: 'OPAL',
    description: 'Build AI mini-apps instantly',
    imageKey: 'opalCardImage',
    aiHint: 'code interface',
    link: 'https://opal.dev/',
  },
  {
    name: 'GROQ',
    description: 'Lightning-fast AI inference',
    imageKey: 'groqCardImage',
    aiHint: 'speed circuit',
    link: 'https://groq.com/',
  },
  {
    name: 'OPEN ROUTER',
    description: 'Access hundreds of AI models',
    imageKey: 'openrouterCardImage',
    aiHint: 'network hub',
    link: 'https://openrouter.ai/',
  },
  {
    name: 'DEEPSEEK',
    description: 'Advanced code & language models',
    imageKey: 'deepseekCardImage',
    aiHint: 'brain code',
    link: 'https://www.deepseek.com/',
  },
  {
    name: 'AIMLAPI',
    description: 'A single API for multiple AI models',
    imageKey: 'aimlapiCardImage',
    aiHint: 'api interface',
    link: 'https://www.aimlapi.com/',
  },
];
