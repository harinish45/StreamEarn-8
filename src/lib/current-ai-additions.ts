import type { CurrentAICategory } from './current-ai-directory';

export const currentAIAdditions: CurrentAICategory[] = [
  {
    id: 'frontier-work',
    name: 'Advanced AI Work & Research',
    description: 'Current AI workspaces and agent products for long-running research, knowledge work, desktop workflows and advanced task execution.',
    tools: [
      { name: 'Claude Cowork', url: 'https://www.anthropic.com/learn/claude-for-work', summary: 'Desktop workflows for working with real files, projects and structured knowledge tasks.', tags: ['work', 'desktop', 'files'], featured: true },
      { name: 'Kimi Work', url: 'https://www.kimi.com/products/kimi-work', summary: 'Desktop knowledge-work agent for local files, browser workflows, skills and scheduled work.', tags: ['work', 'desktop', 'automation'], featured: true },
      { name: 'Comet', url: 'https://www.perplexity.ai/comet', summary: 'AI-native browser for context-aware browsing, research and supervised web workflows.', tags: ['browser', 'research', 'work'], featured: true },
      { name: 'Kimi', url: 'https://www.kimi.com/', summary: 'General AI agent workspace for research, documents, presentations, spreadsheets and complex tasks.', tags: ['agent', 'research', 'documents'] },
      { name: 'Google AI Studio', url: 'https://aistudio.google.com/', summary: 'Interactive environment for building, testing and prototyping AI applications.', tags: ['developer', 'prototyping', 'ai-apps'] },
      { name: 'Google Skills', url: 'https://www.skills.google/', summary: 'Google Cloud and AI learning paths, labs and skill badges.', tags: ['learning', 'google', 'cloud'] },
      { name: 'Anthropic Academy', url: 'https://www.anthropic.com/learn', summary: 'Official learning hub for AI development, enterprise adoption, skills, research and tool use.', tags: ['learning', 'official', 'development'], featured: true },
      { name: 'OpenAI Academy', url: 'https://academy.openai.com/', summary: 'Official practical AI learning covering foundations, applied workflows, agents and work skills.', tags: ['learning', 'official', 'agents'], featured: true },
      { name: 'AWS Skill Builder', url: 'https://skillbuilder.aws/', summary: 'Cloud learning with generative AI, machine learning and production architecture paths.', tags: ['learning', 'aws', 'cloud'] },
      { name: 'IBM SkillsBuild AI', url: 'https://skillsbuild.org/', summary: 'Free AI and technology learning with practical credentials and workforce skills.', tags: ['learning', 'ibm', 'credentials'] },
    ],
  },
  {
    id: 'agent-engineering',
    name: 'Agent Engineering & Production',
    description: 'Advanced engineering resources for agent orchestration, tool use, evaluation, reliability and production operations.',
    tools: [
      { name: 'LangChain Academy', url: 'https://academy.langchain.com/', summary: 'Official courses for agent engineering, reliable agents, observability and deployment.', tags: ['learning', 'agents', 'production'], featured: true },
      { name: 'Hugging Face Agents Course', url: 'https://huggingface.co/learn/agents-course/unit0/introduction', summary: 'Hands-on agent course covering fundamentals, frameworks, agentic RAG, evaluation and a final project.', tags: ['learning', 'agents', 'hands-on'], featured: true },
      { name: 'DeepLearning.AI Agentic AI', url: 'https://www.deeplearning.ai/courses/agentic-ai', summary: 'Practical learning on reflection, tool use, planning, multi-agent workflows and evaluation.', tags: ['learning', 'agents', 'python'] },
      { name: 'Microsoft AI Learning Hub', url: 'https://learn.microsoft.com/en-us/ai/', summary: 'Official AI learning hub covering agents, enterprise AI, infrastructure and production skills.', tags: ['learning', 'agents', 'enterprise'] },
      { name: 'NVIDIA AI Learning Paths', url: 'https://www.nvidia.com/en-us/learn/learning-paths/', summary: 'Technical paths covering generative AI, agentic AI, infrastructure and professional credentials.', tags: ['learning', 'infrastructure', 'certification'] },
      { name: 'Databricks Academy', url: 'https://www.databricks.com/learn/training', summary: 'Learning for data engineering, ML, generative AI and production lakehouse workflows.', tags: ['learning', 'data', 'production'] },
    ],
  },
];
