import type { CurrentAICategory } from './current-ai-directory';

export const currentAIAdditions: CurrentAICategory[] = [
  {
    id: 'current-assistants-research',
    name: 'Current Assistants & Research',
    description: 'Current assistants and research products for knowledge work, discovery, documents and advanced technical tasks.',
    tools: [
      { name: 'Claude', url: 'https://claude.ai/', summary: 'General-purpose assistant for writing, analysis, coding and long-form knowledge work.', tags: ['assistant', 'research', 'coding'], featured: true },
      { name: 'Perplexity', url: 'https://www.perplexity.ai/', summary: 'Research-focused answer engine for web discovery, source-backed synthesis and current information.', tags: ['research', 'search', 'sources'], featured: true },
      { name: 'Kimi', url: 'https://www.kimi.com/', summary: 'General AI assistant for research, documents, presentations, spreadsheets and complex tasks.', tags: ['assistant', 'research', 'documents'] },
      { name: 'Google AI Studio', url: 'https://aistudio.google.com/', summary: 'Interactive environment for prototyping and testing AI applications.', tags: ['developer', 'prototyping', 'ai-apps'], featured: true },
      { name: 'NotebookLM', url: 'https://notebooklm.google.com/', summary: 'Source-grounded research and study workspace for working with supplied documents.', tags: ['research', 'documents', 'study'] },
      { name: 'OpenAI Academy', url: 'https://academy.openai.com/', summary: 'Official practical AI learning covering foundations, workflows, agents and builder skills.', tags: ['learning', 'official', 'agents'], featured: true },
      { name: 'Anthropic Academy', url: 'https://www.anthropic.com/learn', summary: 'Official learning hub for AI development, enterprise adoption, research and responsible use.', tags: ['learning', 'official', 'development'], featured: true },
    ],
  },
  {
    id: 'agent-engineering',
    name: 'Agent Engineering & Production',
    description: 'Production-oriented agent frameworks, coding agents, evaluation and infrastructure.',
    tools: [
      { name: 'GitHub Copilot Coding Agent', url: 'https://github.com/features/copilot', summary: 'Delegated coding agent for issues, code changes, tests, reviews and pull requests.', tags: ['coding', 'agent', 'github'], featured: true },
      { name: 'GitHub Copilot CLI', url: 'https://github.com/features/copilot/cli', summary: 'Terminal-native coding agent for planning, editing, testing and reviewing repositories.', tags: ['coding', 'cli', 'agent'], featured: true },
      { name: 'Slack Code', url: 'https://app.slack.com/features/code-channels', summary: 'Team coding channels where developers and supported coding agents collaborate on a task with searchable context and reviewable work.', tags: ['coding', 'agents', 'collaboration'], featured: true },
      { name: 'LangChain Academy', url: 'https://academy.langchain.com/', summary: 'Official courses and production guidance for agents, observability and reliable workflows.', tags: ['learning', 'agents', 'production'] },
      { name: 'Hugging Face Agents Course', url: 'https://huggingface.co/learn/agents-course/unit0/introduction', summary: 'Hands-on agent fundamentals, frameworks, agentic RAG, evaluation and certification.', tags: ['learning', 'agents', 'hands-on'], featured: true },
      { name: 'Hugging Face Context Course', url: 'https://huggingface.co/context-course', summary: 'Hands-on learning for agent context, MCP, skills, plugins, subagents and hooks.', tags: ['learning', 'mcp', 'agents'] },
      { name: 'NVIDIA NIM', url: 'https://www.nvidia.com/en-in/ai-data-science/products/nim-microservices/', summary: 'Optimized inference microservices for deploying AI models on accelerated infrastructure.', tags: ['infrastructure', 'inference', 'self-hosted'], featured: true },
      { name: 'NVIDIA NIM Operator', url: 'https://docs.nvidia.com/nim-operator/latest/', summary: 'Kubernetes operator for managing NVIDIA NIM inference microservices and lifecycle operations.', tags: ['infrastructure', 'kubernetes', 'inference'] },
      { name: 'Arize Phoenix', url: 'https://phoenix.arize.com/', summary: 'Open observability and evaluation platform for LLM and agent applications.', tags: ['evals', 'observability', 'agents'] },
      { name: 'Langfuse', url: 'https://langfuse.com/', summary: 'Open tracing, evaluation and prompt observability for production AI systems.', tags: ['evals', 'observability', 'production'] },
    ],
  },
  {
    id: 'gtm-automation',
    name: 'GTM, Sales & Lead Automation',
    description: 'Current GTM platforms for prospect research, enrichment, sequencing and agentic revenue workflows.',
    tools: [
      { name: 'Apollo', url: 'https://www.apollo.io/', summary: 'AI-native GTM platform for prospecting, enrichment, engagement, sequencing and agentic sales workflows.', tags: ['gtm', 'sales', 'lead-generation', 'automation'], featured: true },
      { name: 'Clay', url: 'https://www.clay.com/', summary: 'GTM data and workflow platform for enrichment, signals, research and automated outbound operations.', tags: ['gtm', 'enrichment', 'automation'], featured: true },
      { name: 'HubSpot Breeze', url: 'https://www.hubspot.com/products/artificial-intelligence', summary: 'AI agents and workflow assistance across marketing, sales, service and CRM operations.', tags: ['gtm', 'crm', 'agents'] },
      { name: 'Common Room', url: 'https://www.commonroom.io/', summary: 'Go-to-market intelligence and signal workflows for identifying and engaging high-intent accounts.', tags: ['gtm', 'signals', 'sales'] },
      { name: 'Runable', url: 'https://runable.ai/', summary: 'AI agent platform focused on building and growing businesses through automated workflows and growth execution.', tags: ['agents', 'gtm', 'growth', 'automation'], featured: true },
    ],
  },
  {
    id: 'creative-current',
    name: 'Creative, Design & Media',
    description: 'Current creative platforms for image, video, design, presentation and media workflows.',
    tools: [
      { name: 'Canva', url: 'https://www.canva.com/ai/', summary: 'AI-assisted design and content creation for presentations, graphics, documents and social media.', tags: ['creative', 'design', 'presentations'] },
      { name: 'Adobe Firefly', url: 'https://www.adobe.com/products/firefly.html', summary: 'Generative creative tools integrated with Adobe workflows for images, video and design.', tags: ['creative', 'image', 'video'], featured: true },
      { name: 'Runway', url: 'https://runwayml.com/', summary: 'Generative video and creative production platform for visual storytelling and editing.', tags: ['creative', 'video', 'media'] },
      { name: 'Figma AI', url: 'https://www.figma.com/ai/', summary: 'AI-assisted design and prototyping workflows inside Figma.', tags: ['creative', 'design', 'prototyping'] },
    ],
  },
  {
    id: 'agent-security',
    name: 'AI Security & Agent Safety',
    description: 'Security guidance, evaluation and infrastructure controls for AI and agentic systems.',
    tools: [
      { name: 'OWASP GenAI Security Project', url: 'https://genai.owasp.org/', summary: 'Security guidance, risks and community resources for generative AI and agentic applications.', tags: ['security', 'owasp', 'agents'], featured: true },
      { name: 'Microsoft Security Copilot', url: 'https://www.microsoft.com/en-us/security/business/ai-machine-learning/microsoft-security-copilot', summary: 'Security-focused AI assistance for investigation, threat analysis and defensive operations.', tags: ['security', 'soc', 'defensive-ai'] },
      { name: 'Arize Phoenix', url: 'https://phoenix.arize.com/', summary: 'Trace, evaluate and inspect AI and agent behavior for quality and safety signals.', tags: ['security', 'evals', 'observability'] },
      { name: 'Langfuse', url: 'https://langfuse.com/', summary: 'Open observability and evaluation for production AI applications.', tags: ['security', 'evals', 'observability'] },
    ],
  },
  {
    id: 'infrastructure-current',
    name: 'AI Infrastructure & Serving',
    description: 'Current infrastructure platforms for model serving, inference, cloud deployment and scalable AI workloads.',
    tools: [
      { name: 'NVIDIA NIM', url: 'https://www.nvidia.com/en-in/ai-data-science/products/nim-microservices/', summary: 'Production inference microservices for accelerated AI serving.', tags: ['inference', 'gpu', 'production'] },
      { name: 'AWS Bedrock', url: 'https://aws.amazon.com/bedrock/', summary: 'Managed foundation-model platform for building and operating production generative AI applications.', tags: ['cloud', 'infrastructure', 'enterprise'] },
      { name: 'Google Vertex AI', url: 'https://cloud.google.com/vertex-ai', summary: 'Google Cloud platform for building, evaluating, deploying and governing AI applications.', tags: ['cloud', 'infrastructure', 'enterprise'] },
      { name: 'Microsoft Foundry', url: 'https://ai.azure.com/', summary: 'Microsoft environment for building, evaluating and governing enterprise AI applications and agents.', tags: ['cloud', 'agents', 'enterprise'] },
      { name: 'Tencent Hy4 preview', url: 'https://www.tencent.com/tencent-releases-and-open-sources-tencent-hy4-preview/', summary: 'New open-source Tencent AI model stack aimed at coding, productivity and scientific research workloads.', tags: ['open-source', 'coding', 'research', 'long-context'], featured: true },
      { name: 'Tencent CodeBuddy', url: 'https://www.codebuddy.ai/', summary: 'Tencent coding environment connected to its current AI development stack for software engineering workflows.', tags: ['coding', 'developer-tools', 'agent'] },
      { name: 'Tencent WorkBuddy', url: 'https://workbuddy.ai/', summary: 'Tencent productivity assistant for work-oriented AI workflows and access to its current model ecosystem.', tags: ['assistant', 'productivity', 'enterprise'] },
    ],
  },
];
