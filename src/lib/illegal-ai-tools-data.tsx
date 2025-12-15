
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

const createLogo = (seed: string) => `https://picsum.photos/seed/${seed}/48/48`;

export const illegalAiTools: AiToolCategory[] = [
  {
    name: 'Viral marketing tools',
    tools: [
      { name: 'ViralSky', logo: createLogo('ViralSky'), link: 'https://viralsky.ai' },
      { name: 'ThreadMaster', logo: createLogo('ThreadMaster'), link: 'https://threadmaster.ai' },
      { name: 'VibeFluencer', logo: createLogo('VibeFluencer'), link: 'https://www.vibefluencer.io' },
      { name: 'VidIQ', logo: createLogo('VidIQ'), link: 'https://vidiq.com' },
      { name: 'Ocoya', logo: createLogo('Ocoya'), link: 'https://ocoya.com' },
      { name: 'AdCreative', logo: createLogo('AdCreative'), link: 'https://www.adcreative.ai' },
      { name: 'Freedom Threads', logo: createLogo('Freedom Threads'), link: 'https://freedomthreads.ai' },
    ],
  },
  {
    name: 'Vibe coding tools',
    tools: [
      { name: 'Emergent', logo: createLogo('Emergent'), link: 'https://emergent.sh' },
      { name: 'Firebase Studio', logo: createLogo('Firebase Studio'), link: 'https://studio.firebase.google.com/' },
      { name: 'Rocket', logo: createLogo('Rocket'), link: 'https://www.rocket.new' },
      { name: 'Lovable', logo: createLogo('Lovable'), link: 'https://lovable.dev/' },
      { name: 'Bolt', logo: createLogo('Bolt'), link: 'https://www.bolt.com/' },
      { name: 'CREAO', logo: createLogo('CREAO'), link: 'https://creao.ai' },
      { name: 'MGX', logo: createLogo('MGX'), link: 'https://mgx.dev' },
      { name: 'Replit', logo: createLogo('Replit'), link: 'https://replit.com/' },
      { name: 'Base44', logo: createLogo('Base44'), link: 'https://base44.com' },
    ],
  },
  {
    name: 'Vibe design tools',
    tools: [
      { name: 'Nano Banana', logo: createLogo('Nano Banana'), link: 'https://deepmind.google/discover/blog/generating-and-editing-images-with-multimodal-large-language-models/' },
      { name: 'Seedream', logo: createLogo('Seedream'), link: 'https://seedream.com/' },
      { name: 'Lovart', logo: createLogo('Lovart'), link: 'https://lovart.ai/' },
      { name: 'Picsart', logo: createLogo('Picsart'), link: 'https://picsart.com/' },
      { name: 'VSCO', logo: createLogo('VSCO'), link: 'https://vsco.co/' },
      { name: 'ChatGPT', logo: createLogo('ChatGPT-design'), link: 'https://chat.openai.com/' },
      { name: 'Canva', logo: createLogo('Canva-design'), link: 'https://www.canva.com/' },
    ],
  },
  {
    name: 'Vibe marketing tools',
    tools: [
      { name: 'Notebooks', logo: createLogo('Notebooks'), link: 'https://notebooklm.google.com/' },
      { name: 'Poppy AI', logo: createLogo('Poppy AI'), link: 'https://www.poppy-ai.com/' },
      { name: 'Gamma', logo: createLogo('Gamma'), link: 'https://gamma.app/' },
      { name: 'Freepik', logo: createLogo('Freepik'), link: 'https://www.freepik.com/' },
      { name: 'Higgsfield', logo: createLogo('Higgsfield'), link: 'https://www.higgsfield.ai/' },
      { name: 'Reka', logo: createLogo('Reka'), link: 'https://reka.ai/' },
      { name: 'MiniMax', logo: createLogo('MiniMax'), link: 'https://www.minimax.com/' },
    ],
  },
  {
    name: 'AI image & video tools',
    tools: [
      { name: 'AIVideo', logo: createLogo('AIVideo'), link: 'https://aivideo.com/' },
      { name: 'ImagineArt', logo: createLogo('ImagineArt'), link: '#' },
      { name: 'Syllaby', logo: createLogo('Syllaby'), link: 'https://www.syllaby.io/' },
      { name: 'HeyGen', logo: createLogo('HeyGen'), link: 'https://www.heygen.com/' },
      { name: 'Runway', logo: createLogo('Runway'), link: 'https://runwayml.com/' },
      { name: 'Submagic', logo: createLogo('Submagic'), link: 'https://www.submagic.co/' },
      { name: 'Krea AI', logo: createLogo('Krea AI'), link: 'https://www.krea.ai/' },
    ],
  },
  {
    name: 'AI coding assistants',
    tools: [
      { name: 'Cursor', logo: createLogo('Cursor-assist'), link: 'https://cursor.sh/' },
      { name: 'Kilo Code', logo: createLogo('Kilo Code'), link: '#' },
      { name: 'Github Copilot', logo: createLogo('Github Copilot'), link: 'https://github.com/features/copilot' },
      { name: 'Kiro', logo: createLogo('Kiro'), link: '#' },
      { name: 'Tabnine', logo: createLogo('Tabnine'), link: 'https://www.tabnine.com/' },
      { name: 'Devin', logo: createLogo('Devin'), link: '#' },
      { name: 'Aider', logo: createLogo('Aider'), link: 'https://github.com/paul-gauthier/aider' },
    ],
  },
  {
    name: 'Automation tools',
    tools: [
      { name: 'BooSend', logo: createLogo('BooSend'), link: '#' },
      { name: 'Manus', logo: createLogo('Manus'), link: 'https://manus.co/' },
      { name: 'ChatGPT Tasks', logo: createLogo('ChatGPT Tasks'), link: '#' },
      { name: 'N8N', logo: createLogo('N8N'), link: 'https://n8n.io/' },
      { name: 'Make', logo: createLogo('Make'), link: 'https://www.make.com/' },
      { name: 'Zapier', logo: createLogo('Zapier-auto'), link: 'https://zapier.com/' },
      { name: 'Apollo', logo: createLogo('Apollo'), link: 'https://www.apollo.io/' },
    ],
  },
  {
    name: 'Health tools',
    tools: [
      { name: 'Foodient', logo: createLogo('Foodient'), link: '#' },
      { name: 'ChatGPT', logo: createLogo('ChatGPT-health'), link: 'https://chat.openai.com/' },
      { name: 'Cal AI', logo: createLogo('Cal AI'), link: '#' },
      { name: 'Calm', logo: createLogo('Calm'), link: 'https://www.calm.com/' },
      { name: 'Flo', logo: createLogo('Flo'), link: 'https://flo.health/' },
      { name: 'Fitbod', logo: createLogo('Fitbod'), link: 'https://fitbod.me/' },
      { name: 'Runna', logo: createLogo('Runna'), link: 'https://www.runna.com/' },
    ],
  },
];
