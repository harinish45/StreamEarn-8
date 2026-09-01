import type { CurrentAICategory } from './current-ai-directory';

// Curated product-level additions. Keep this file model-name agnostic and avoid speculative releases.
export const currentAIAdditions: CurrentAICategory[] = [
  {
    id: 'assistants-research-2026', name: 'Current Assistants & Research', description: 'Current assistants and research products verified against active product pages.',
    tools: [
      { name: 'ChatGPT', url: 'https://chatgpt.com/', summary: 'General AI assistant for research, writing, analysis, planning and task workflows.', tags: ['assistant','research','productivity'], featured: true },
      { name: 'Claude', url: 'https://claude.ai/', summary: 'Assistant for writing, analysis, coding and long-form knowledge work.', tags: ['assistant','research','coding'], featured: true },
      { name: 'Gemini', url: 'https://gemini.google.com/', summary: 'Google assistant for multimodal research, productivity and connected workflows.', tags: ['assistant','research','multimodal'], featured: true },
      { name: 'Microsoft Copilot', url: 'https://copilot.microsoft.com/', summary: 'Assistant across Microsoft productivity and enterprise workflows.', tags: ['assistant','enterprise','productivity'] },
      { name: 'Perplexity', url: 'https://www.perplexity.ai/', summary: 'Research-first search and synthesis with source-backed answers.', tags: ['research','search','sources'], featured: true },
      { name: 'NotebookLM', url: 'https://notebooklm.google.com/', summary: 'Source-grounded research and study workspace for supplied material.', tags: ['research','documents','study'] },
      { name: 'Kimi', url: 'https://www.kimi.com/', summary: 'General AI assistant for research, documents and complex knowledge tasks.', tags: ['assistant','research','documents'] },
    ],
  },
  {
    id: 'agentic-workflows-2026', name: 'Agents & Task Delegation', description: 'Current products for delegated multi-step work and agentic workflows.',
    tools: [
      { name: 'Manus', url: 'https://manus.im/', summary: 'Delegated agent workflows for research, analysis and multi-step task execution.', tags: ['agents','automation','research'], featured: true },
      { name: 'Genspark', url: 'https://www.genspark.ai/', summary: 'Agentic workspace for research, creation and task execution.', tags: ['agents','research','creation'] },
      { name: 'Devin', url: 'https://devin.ai/', summary: 'Software-engineering agent for delegated implementation and development tasks.', tags: ['agents','coding','software'] },
      { name: 'Replit Agent', url: 'https://replit.com/ai', summary: 'Natural-language application building and iterative software development.', tags: ['agents','coding','app-builder'] },
      { name: 'Lindy', url: 'https://www.lindy.ai/', summary: 'Configurable AI assistants for recurring personal and business workflows.', tags: ['agents','automation','assistants'] },
    ],
  },
  {
    id: 'coding-agents-2026', name: 'Coding Agents & Developer Tools', description: 'Current coding agents, IDEs and terminal workflows.',
    tools: [
      { name: 'GitHub Copilot Coding Agent', url: 'https://github.com/features/copilot', summary: 'Delegated software tasks that can work in the background and return changes for review.', tags: ['coding','agent','github'], featured: true },
      { name: 'GitHub Copilot CLI', url: 'https://github.com/features/copilot/cli', summary: 'Terminal-native agent workflow for repository planning, editing, testing and review.', tags: ['coding','cli','agent'], featured: true },
      { name: 'Claude Code', url: 'https://www.anthropic.com/claude-code', summary: 'Terminal and desktop coding agent for repository-level development.', tags: ['coding','terminal','agent'] },
      { name: 'Codex', url: 'https://openai.com/codex/', summary: 'Agentic coding environment for software development and parallel task workflows.', tags: ['coding','agents','development'] },
      { name: 'Gemini CLI', url: 'https://github.com/google-gemini/gemini-cli', summary: 'Open-source terminal AI agent for code understanding, editing, debugging and workflow automation with Google sign-in support.', tags: ['coding','cli','agent','open-source'], featured: true },
      { name: 'Cursor', url: 'https://www.cursor.com/', summary: 'AI-native code editor with agentic multi-file development workflows.', tags: ['coding','ide','agent'] },
      { name: 'OpenCode', url: 'https://opencode.ai/', summary: 'Open-source terminal coding agent for repository work.', tags: ['coding','terminal','open-source'] },
      { name: 'Cline', url: 'https://cline.bot/', summary: 'Open coding agent with tool use and repository workflows.', tags: ['coding','agent','open-source'] },
      { name: 'Aider', url: 'https://aider.chat/', summary: 'Git-aware terminal pair programming and code editing.', tags: ['coding','git','terminal'] },
    ],
  },
  {
    id: 'gtm-lead-automation-2026', name: 'GTM, Sales & Lead Automation', description: 'Current platforms for prospecting, enrichment, research, signals and automated GTM workflows.',
    tools: [
      { name: 'Apollo', url: 'https://www.apollo.io/', summary: 'GTM platform for prospecting, enrichment, engagement and sales automation.', tags: ['gtm','sales','lead-generation','automation'], featured: true },
      { name: 'Clay', url: 'https://www.clay.com/', summary: 'GTM data and workflow platform for enrichment, signals, research and outbound operations.', tags: ['gtm','enrichment','automation'], featured: true },
      { name: 'Claygent', url: 'https://www.clay.com/claygent', summary: 'AI research agent for account research, enrichment and repeatable GTM workflows.', tags: ['gtm','research','agents'], featured: true },
      { name: 'Common Room', url: 'https://www.commonroom.io/', summary: 'Signal intelligence and GTM workflows for identifying and engaging high-intent prospects.', tags: ['gtm','signals','lead-generation'] },
      { name: 'HubSpot Breeze', url: 'https://www.hubspot.com/products/artificial-intelligence', summary: 'AI capabilities across CRM, marketing, sales and service workflows.', tags: ['gtm','crm','automation'] },
      { name: '6sense', url: 'https://6sense.com/', summary: 'B2B revenue intelligence and intent-driven GTM platform.', tags: ['gtm','intent','sales'] },
    ],
  },
  {
    id: 'creative-media-2026', name: 'Creative, Design & Media', description: 'Current creative platforms for visual, video, design and voice production.',
    tools: [
      { name: 'Adobe Firefly', url: 'https://www.adobe.com/products/firefly.html', summary: 'Generative creative tools integrated into Adobe image, video and design workflows.', tags: ['creative','image','video'], featured: true },
      { name: 'Canva AI', url: 'https://www.canva.com/ai/', summary: 'AI-assisted design for presentations, graphics, documents and social content.', tags: ['creative','design','presentations'] },
      { name: 'Runway', url: 'https://runwayml.com/', summary: 'Generative video and creative production platform.', tags: ['creative','video','media'] },
      { name: 'Figma AI', url: 'https://www.figma.com/ai/', summary: 'AI-assisted interface design, prototyping and product workflows.', tags: ['creative','design','prototyping'] },
      { name: 'ElevenLabs', url: 'https://elevenlabs.io/', summary: 'Voice, speech, dubbing and audio production platform.', tags: ['creative','voice','audio'] },
    ],
  },
  {
    id: 'security-evals-2026', name: 'AI Security, Evaluation & Observability', description: 'Security guidance and production controls for AI and agentic applications.',
    tools: [
      { name: 'OWASP GenAI Security Project', url: 'https://genai.owasp.org/', summary: 'Security guidance, risks and resources for generative AI and agentic applications.', tags: ['security','owasp','agents'], featured: true },
      { name: 'Microsoft Security Copilot', url: 'https://www.microsoft.com/en-us/security/business/ai-machine-learning/microsoft-security-copilot', summary: 'Security-focused AI assistance for investigations and defensive operations.', tags: ['security','soc','defensive-ai'] },
      { name: 'Arize Phoenix', url: 'https://phoenix.arize.com/', summary: 'Open observability and evaluation platform for LLM and agent applications.', tags: ['evals','observability','agents'] },
      { name: 'Langfuse', url: 'https://langfuse.com/', summary: 'Open tracing, evaluation and prompt observability for production AI systems.', tags: ['evals','observability','production'] },
    ],
  },
  {
    id: 'ai-infrastructure-2026', name: 'AI Infrastructure & Serving', description: 'Current infrastructure for inference, model serving and enterprise AI deployment.',
    tools: [
      { name: 'NVIDIA NIM', url: 'https://www.nvidia.com/en-in/ai-data-science/products/nim-microservices/', summary: 'Optimized inference microservices for accelerated AI deployment.', tags: ['inference','gpu','production'], featured: true },
      { name: 'NVIDIA NIM Operator', url: 'https://docs.nvidia.com/nim-operator/latest/', summary: 'Kubernetes operator for managing NIM inference microservices.', tags: ['kubernetes','inference','gpu'] },
      { name: 'AWS Bedrock', url: 'https://aws.amazon.com/bedrock/', summary: 'Managed platform for building and operating generative AI applications.', tags: ['cloud','enterprise','infrastructure'] },
      { name: 'Google Vertex AI', url: 'https://cloud.google.com/vertex-ai', summary: 'Google Cloud platform for building, evaluating, deploying and governing AI applications.', tags: ['cloud','enterprise','infrastructure'] },
      { name: 'Microsoft Foundry', url: 'https://ai.azure.com/', summary: 'Microsoft environment for building, evaluating and governing enterprise AI applications and agents.', tags: ['cloud','agents','enterprise'] },
    ],
  },
];
