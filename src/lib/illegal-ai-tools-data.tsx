
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

export const illegalAiTools: AiToolCategory[] = [
  {
    name: 'Viral marketing tools',
    tools: [
      { name: 'ViralSky', logoKey: 'viralSkyLogo', link: 'https://viralsky.ai' },
      { name: 'ThreadMaster', logoKey: 'threadMasterLogo', link: 'https://threadmaster.ai' },
      { name: 'VibeFluencer', logoKey: 'vibeFluencerLogo', link: 'https://www.vibefluencer.io' },
      { name: 'VidIQ', logoKey: 'vidIQLogo', link: 'https://vidiq.com' },
      { name: 'Ocoya', logoKey: 'ocoyaLogo', link: 'https://ocoya.com' },
      { name: 'AdCreative', logoKey: 'adCreativeLogo', link: 'https://www.adcreative.ai' },
      { name: 'Freedom Threads', logoKey: 'freedomThreadsLogo', link: 'https://freedomthreads.ai' },
    ],
  },
  {
    name: 'Vibe coding tools',
    tools: [
      { name: 'Emergent', logoKey: 'emergentLogo', link: 'https://emergent.sh' },
      { name: 'Firebase Studio', logoKey: 'firebaseStudioLogo', link: 'https://studio.firebase.google.com/' },
      { name: 'Rocket', logoKey: 'rocketLogo', link: 'https://www.rocket.new' },
      { name: 'Lovable', logoKey: 'lovableLogo', link: 'https://lovable.dev/' },
      { name: 'Bolt', logoKey: 'boltLogo', link: 'https://www.bolt.com/' },
      { name: 'CREAO', logoKey: 'creaoLogo', link: 'https://creao.ai' },
      { name: 'MGX', logoKey: 'mgxLogo', link: 'https://mgx.dev' },
      { name: 'Replit', logoKey: 'replitLogo', link: 'https://replit.com/' },
      { name: 'Base44', logoKey: 'base44Logo', link: 'https://base44.com' },
    ],
  },
  {
    name: 'Vibe design tools',
    tools: [
      { name: 'Nano Banana', logoKey: 'nanoBananaLogo', link: 'https://gemini.google/overview/image-generation/' },
      { name: 'Seedream', logoKey: 'seedreamLogo', link: 'https://seedream.cc' },
      { name: 'Lovart', logoKey: 'lovartLogo', link: 'https://lovart.me' },
      { name: 'Picsart', logoKey: 'picsartLogo', link: 'https://picsart.com' },
      { name: 'VSCO', logoKey: 'vscoLogo', link: 'https://vsco.co' },
      { name: 'ChatGPT', logoKey: 'chatGPTDesignLogo', link: 'https://chatgpt.com' },
      { name: 'Canva', logoKey: 'canvaDesignLogo', link: 'https://www.canva.com' },
    ],
  },
  {
    name: 'Vibe marketing tools',
    tools: [
      { name: 'Notebooks', logoKey: 'notebooksLogo', link: 'https://notebooklm.google.com/' },
      { name: 'Poppy AI', logoKey: 'poppyAiLogo', link: 'https://getpoppyai.com' },
      { name: 'Gamma', logoKey: 'gammaLogo', link: 'https://gamma.com.ai' },
      { name: 'Freepik', logoKey: 'freepikLogo', link: 'https://www.freepik.com' },
      { name: 'Higgsfield', logoKey: 'higgsfieldLogo', link: 'https://higgsfield.ai' },
      { name: 'Reka', logoKey: 'rekaLogo', link: 'https://reka.ai' },
      { name: 'MiniMax', logoKey: 'miniMaxLogo', link: 'https://www.minimax.ai' },
    ],
  },
  {
    name: 'AI image & video tools',
    tools: [
      { name: 'AIVideo', logoKey: 'aiVideoLogo', link: '#' },
      { name: 'ImagineArt', logoKey: 'imagineArtLogo', link: '#' },
      { name: 'Syllaby', logoKey: 'syllabyLogo', link: 'https://www.syllaby.io/' },
      { name: 'HeyGen', logoKey: 'heyGenLogo', link: 'https://www.heygen.com/' },
      { name: 'Runway', logoKey: 'runwayLogo', link: 'https://runwayml.com/' },
      { name: 'Submagic', logoKey: 'submagicLogo', link: 'https://www.submagic.io/' },
      { name: 'Krea AI', logoKey: 'kreaAiLogo', link: 'https://www.krea.ai/' },
      { name: 'Emergent', logoKey: 'emergentVideoLogo', link: 'https://emergent.sh' },
      { name: 'MGX', logoKey: 'mgxVideoLogo', link: 'https://mgx.dev' },
    ],
  },
  {
    name: 'AI coding assistants',
    tools: [
      { name: 'Cursor', logoKey: 'cursorAssistLogo', link: 'https://cursor.com' },
      { name: 'Kilo Code', logoKey: 'kiloCodeLogo', link: 'https://kilo.ai' },
      { name: 'Github Copilot', logoKey: 'githubCopilotLogo', link: 'https://github.com/features/copilot' },
      { name: 'Kiro', logoKey: 'kiroLogo', link: 'https://kiro.dev' },
      { name: 'Tabnine', logoKey: 'tabnineLogo', link: 'https://www.tabnine.com/' },
      { name: 'Devin', logoKey: 'devinLogo', link: 'https://www.cognition.ai/blog/introducing-devin' },
      { name: 'Aider', logoKey: 'aiderLogo', link: 'https://aider.chat' },
    ],
  },
  {
    name: 'Automation tools',
    tools: [
      { name: 'BooSend', logoKey: 'booSendLogo', link: 'https://boosend.ai' },
      { name: 'Manus', logoKey: 'manusLogo', link: 'https://www.manusai.io' },
      { name: 'ChatGPT Tasks', logoKey: 'chatGPTTasksLogo', link: 'https://chatgpt.com' },
      { name: 'N8N', logoKey: 'n8nLogo', link: 'https://n8n.io/' },
      { name: 'Make', logoKey: 'makeLogo', link: 'https://www.make.com/' },
      { name: 'Zapier', logoKey: 'zapierAutoLogo', link: 'https://zapier.com/' },
      { name: 'Apollo', logoKey: 'apolloLogo', link: 'https://www.apollo.io/' },
    ],
  },
  {
    name: 'Health tools',
    tools: [
      { name: 'Foodient', logoKey: 'foodientLogo', link: 'https://apps.apple.com/app/foodient/id6749853669' },
      { name: 'ChatGPT', logoKey: 'chatGPTHealthLogo', link: 'https://chatgpt.com' },
      { name: 'Cal AI', logoKey: 'calAiLogo', link: 'https://www.calai.app' },
      { name: 'Calm', logoKey: 'calmLogo', link: 'https://www.calm.com/' },
      { name: 'Flo', logoKey: 'floLogo', link: 'https://flo.health/' },
      { name: 'Fitbod', logoKey: 'fitbodLogo', link: 'https://fitbod.me/' },
      { name: 'Runna', logoKey: 'runnaLogo', link: 'https://runna.com' },
    ],
  },
];
