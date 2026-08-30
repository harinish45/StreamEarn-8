export type CuratedResource = {
  id: string;
  title: string;
  url: string;
  description: string;
  category: 'AI Learning' | 'Developer' | 'Cybersecurity' | 'Cloud & Data' | 'Design' | 'Career';
  tags: string[];
  featured?: boolean;
};

export type FreeProject = {
  id: string;
  title: string;
  url: string;
  description: string;
  bestFor: string;
  tags: string[];
  featured?: boolean;
};

export type CommunityResource = {
  id: string;
  title: string;
  url: string;
  description: string;
  type: 'Forum' | 'Discord' | 'Community';
  tags: string[];
  featured?: boolean;
};

/**
 * Curated, platform-first Resource Hub.
 * Only first-party learning/resource platforms are listed here.
 * Individual courses are intentionally excluded unless they are genuinely important flagship destinations.
 */
export const curatedResources: CuratedResource[] = [
  { id: 'openai-academy', title: 'OpenAI Academy', url: 'https://academy.openai.com/', description: 'OpenAI’s learning hub for AI foundations, applied AI, agents, workflows, ChatGPT and building with AI.', category: 'AI Learning', tags: ['OpenAI', 'AI', 'Agents', 'ChatGPT'], featured: true },
  { id: 'anthropic-academy', title: 'Anthropic Academy', url: 'https://www.anthropic.com/learn', description: 'Anthropic’s official learning hub for Claude, API development, enterprise use, agents, skills and responsible AI.', category: 'AI Learning', tags: ['Anthropic', 'Claude', 'Agents', 'API'], featured: true },
  { id: 'google-skills', title: 'Google Skills', url: 'https://www.skills.google/', description: 'Google’s learning platform for AI, Gemini, agents, cloud, hands-on labs, learning paths and credentials.', category: 'AI Learning', tags: ['Google', 'Gemini', 'AI', 'Labs'], featured: true },
  { id: 'microsoft-ai-learning', title: 'Microsoft Learn — AI', url: 'https://learn.microsoft.com/en-us/ai/', description: 'Microsoft’s AI learning hub covering Copilot, agents, Azure AI, Foundry and technical AI skills.', category: 'AI Learning', tags: ['Microsoft', 'Copilot', 'Azure', 'Agents'], featured: true },
  { id: 'aws-ai-learning', title: 'AWS Skill Builder — AI', url: 'https://aws.amazon.com/ai/learn/', description: 'AWS-created AI learning, tutorials, labs and hands-on training for builders and AI engineers.', category: 'AI Learning', tags: ['AWS', 'Generative AI', 'Cloud', 'Labs'], featured: true },
  { id: 'nvidia-dli', title: 'NVIDIA Deep Learning Institute', url: 'https://www.nvidia.com/en-in/training/', description: 'NVIDIA training for deep learning, generative AI, data science, accelerated computing and AI infrastructure.', category: 'AI Learning', tags: ['NVIDIA', 'Deep Learning', 'GenAI', 'GPU'], featured: true },
  { id: 'meta-ai-learn', title: 'Meta AI Learning Hub', url: 'https://ai.meta.com/learn/', description: 'Meta’s practical AI guides covering fundamentals, Meta AI and everyday AI use cases.', category: 'AI Learning', tags: ['Meta', 'AI', 'Fundamentals'], featured: true },
  { id: 'deeplearning-ai', title: 'DeepLearning.AI', url: 'https://www.deeplearning.ai/', description: 'Industry-focused AI education with practical courses, short courses and professional learning paths.', category: 'AI Learning', tags: ['AI', 'Machine Learning', 'LLMs'], featured: true },
  { id: 'huggingface-learn', title: 'Hugging Face Learn', url: 'https://huggingface.co/learn', description: 'Open-source AI learning across LLMs, agents, robotics, computer vision, audio, diffusion and more.', category: 'AI Learning', tags: ['Open Source', 'LLMs', 'Agents', 'ML'], featured: true },

  { id: 'github-skills', title: 'GitHub Skills', url: 'https://skills.github.com/', description: 'Hands-on GitHub learning for developers, automation, collaboration and modern software workflows.', category: 'Developer', tags: ['GitHub', 'Git', 'DevOps'], featured: true },
  { id: 'github-docs', title: 'GitHub Docs', url: 'https://docs.github.com/', description: 'Official documentation for GitHub development, Actions, security, collaboration and repositories.', category: 'Developer', tags: ['GitHub', 'Documentation', 'Actions'] },
  { id: 'mdn', title: 'MDN Web Docs', url: 'https://developer.mozilla.org/', description: 'Authoritative web platform documentation and learning resources for HTML, CSS and JavaScript.', category: 'Developer', tags: ['Web', 'JavaScript', 'HTML', 'CSS'], featured: true },
  { id: 'freecodecamp', title: 'freeCodeCamp', url: 'https://www.freecodecamp.org/', description: 'Free hands-on programming and developer education with projects and certifications.', category: 'Developer', tags: ['Coding', 'Web', 'Projects'] },
  { id: 'roadmap-sh', title: 'roadmap.sh', url: 'https://roadmap.sh/', description: 'Community-built developer roadmaps covering software engineering, cloud, DevOps and cybersecurity.', category: 'Developer', tags: ['Roadmaps', 'Software', 'Career'] },
  { id: 'docker-learn', title: 'Docker Learn', url: 'https://www.docker.com/101-tutorial/', description: 'Official Docker tutorials and practical container-development resources.', category: 'Developer', tags: ['Docker', 'Containers', 'DevOps'] },

  { id: 'owasp', title: 'OWASP', url: 'https://owasp.org/', description: 'Open security standards, projects, guidance and application-security learning resources.', category: 'Cybersecurity', tags: ['AppSec', 'OWASP', 'Security'], featured: true },
  { id: 'portswigger-academy', title: 'PortSwigger Web Security Academy', url: 'https://portswigger.net/web-security', description: 'Free hands-on web security training with interactive labs and practical vulnerability research.', category: 'Cybersecurity', tags: ['Web Security', 'Labs', 'AppSec'], featured: true },
  { id: 'tryhackme', title: 'TryHackMe', url: 'https://tryhackme.com/', description: 'Guided cybersecurity learning paths, rooms and practical labs.', category: 'Cybersecurity', tags: ['Cybersecurity', 'Labs', 'CTF'] },
  { id: 'htb-academy', title: 'Hack The Box Academy', url: 'https://academy.hackthebox.com/', description: 'Structured offensive and defensive security training with practical labs.', category: 'Cybersecurity', tags: ['Security', 'Labs', 'Pentesting'] },
  { id: 'cisa', title: 'CISA Cybersecurity Resources', url: 'https://www.cisa.gov/topics/cybersecurity-best-practices', description: 'Official U.S. cybersecurity guidance, best practices and defensive resources.', category: 'Cybersecurity', tags: ['CISA', 'Defense', 'Standards'] },
  { id: 'nist-cybersecurity', title: 'NIST Cybersecurity', url: 'https://www.nist.gov/cybersecurity', description: 'Cybersecurity frameworks, standards, guidance and technical resources from NIST.', category: 'Cybersecurity', tags: ['NIST', 'Standards', 'Risk'] },

  { id: 'google-cloud-training', title: 'Google Cloud Training', url: 'https://cloud.google.com/learn/training', description: 'Google Cloud learning through Google Skills, labs, learning paths, AI training and certifications.', category: 'Cloud & Data', tags: ['Google Cloud', 'AI', 'Cloud', 'Labs'] },
  { id: 'aws-skill-builder', title: 'AWS Skill Builder', url: 'https://skillbuilder.aws/', description: 'AWS training platform for cloud, AI, machine learning, architecture and hands-on skills.', category: 'Cloud & Data', tags: ['AWS', 'Cloud', 'AI', 'Certification'] },
  { id: 'azure-learn', title: 'Microsoft Learn', url: 'https://learn.microsoft.com/training/', description: 'Microsoft’s main technical learning platform for Azure, AI, security, developer tools and certifications.', category: 'Cloud & Data', tags: ['Microsoft', 'Azure', 'Cloud', 'AI'] },
  { id: 'kaggle-learn', title: 'Kaggle Learn', url: 'https://www.kaggle.com/learn', description: 'Short practical learning for Python, data science, machine learning and AI.', category: 'Cloud & Data', tags: ['Kaggle', 'Data Science', 'ML'] },

  { id: 'figma-community', title: 'Figma Community', url: 'https://www.figma.com/community', description: 'Design resources, templates, plugins and community-built files for product design.', category: 'Design', tags: ['Figma', 'UI/UX', 'Design'] },
  { id: 'canva-design-school', title: 'Canva Design School', url: 'https://www.canva.com/designschool/', description: 'Canva’s official design education and practical creative resources.', category: 'Design', tags: ['Canva', 'Design', 'Creative'] },

  { id: 'linkedin-learning', title: 'LinkedIn Learning', url: 'https://www.linkedin.com/learning/', description: 'Professional learning across technology, business, leadership, AI and career skills.', category: 'Career', tags: ['LinkedIn', 'Career', 'Technology'] },
  { id: 'github-careers', title: 'GitHub Careers', url: 'https://github.com/careers', description: 'Official GitHub careers and technology opportunities.', category: 'Career', tags: ['GitHub', 'Jobs', 'Technology'] },
  { id: 'google-careers', title: 'Google Careers', url: 'https://www.google.com/about/careers/applications/jobs/results/', description: 'Official Google technology, AI, engineering and business opportunities.', category: 'Career', tags: ['Google', 'Jobs', 'AI'] },
  { id: 'microsoft-careers', title: 'Microsoft Careers', url: 'https://jobs.careers.microsoft.com/', description: 'Official Microsoft technology, AI, cloud and business opportunities.', category: 'Career', tags: ['Microsoft', 'Jobs', 'AI'] },
];

/** High-value projects that can be started at $0 using an explicitly free tier or open-source/free platform. */
export const freeProjects: FreeProject[] = [
  { id: 'github-projects', title: 'GitHub + GitHub Pages', url: 'https://pages.github.com/', description: 'Build and publish portfolios, documentation sites, static web apps and open-source projects directly from GitHub.', bestFor: 'Portfolios, web projects, open source', tags: ['Free', 'Git', 'Hosting'], featured: true },
  { id: 'github-codespaces', title: 'GitHub Codespaces', url: 'https://github.com/features/codespaces', description: 'Cloud development environments with a monthly free personal quota; excellent for coding projects without local setup.', bestFor: 'Cloud development, assignments, open source', tags: ['Free quota', 'VS Code', 'Cloud IDE'], featured: true },
  { id: 'huggingface-spaces', title: 'Hugging Face Spaces', url: 'https://huggingface.co/spaces', description: 'Publish AI demos and static projects for free; static Spaces are free and community GPU grants may be available for strong demos.', bestFor: 'AI demos, ML apps, portfolios', tags: ['Free', 'AI', 'Open Source'], featured: true },
  { id: 'google-colab', title: 'Google Colab', url: 'https://colab.research.google.com/', description: 'Browser-based Python notebooks with free accelerator access, ideal for ML experiments, data analysis and prototypes.', bestFor: 'ML, data science, experiments', tags: ['Free', 'GPU', 'Python'], featured: true },
  { id: 'kaggle-projects', title: 'Kaggle Notebooks & Competitions', url: 'https://www.kaggle.com/', description: 'Build public data-science projects using notebooks, datasets and competitions with free compute options.', bestFor: 'Data science, ML, datasets', tags: ['Free', 'Datasets', 'ML'], featured: true },
  { id: 'cloudflare-workers', title: 'Cloudflare Workers Free', url: 'https://developers.cloudflare.com/workers/', description: 'Deploy lightweight APIs, edge apps and automation on the free Workers plan within its published usage limits.', bestFor: 'APIs, edge apps, serverless', tags: ['Free tier', 'Serverless', 'Edge'] },
  { id: 'supabase-free', title: 'Supabase Free', url: 'https://supabase.com/pricing', description: 'Build real applications with Postgres, authentication, storage and APIs on the free plan within its published limits.', bestFor: 'Full-stack apps, auth, databases', tags: ['Free tier', 'Postgres', 'Auth'], featured: true },
  { id: 'freecodecamp-projects', title: 'freeCodeCamp Projects', url: 'https://www.freecodecamp.org/learn/', description: 'Build portfolio-ready projects while learning web development, JavaScript, Python, data and more.', bestFor: 'Student portfolios, web development', tags: ['Free', 'Projects', 'Portfolio'] },
];

/** High-signal communities only: active, useful places to learn, build, ask and showcase. */
export const communityResources: CommunityResource[] = [
  { id: 'openai-community', title: 'OpenAI Developer Community', url: 'https://community.openai.com/', description: 'Official developer community for OpenAI API, ChatGPT, Apps SDK, Codex, prompting and building with OpenAI.', type: 'Forum', tags: ['OpenAI', 'Developers', 'AI'], featured: true },
  { id: 'huggingface-forums', title: 'Hugging Face Forums', url: 'https://discuss.huggingface.co/', description: 'Active community discussion for models, Spaces, datasets, research, agents and open-source AI.', type: 'Forum', tags: ['Hugging Face', 'Open Source', 'AI'], featured: true },
  { id: 'huggingface-discord', title: 'Hugging Face Discord', url: 'https://huggingface.co/join/discord', description: 'Official Hugging Face Discord for community collaboration, open-source AI and project discussion.', type: 'Discord', tags: ['Hugging Face', 'Discord', 'AI'], featured: true },
  { id: 'github-community', title: 'GitHub Community', url: 'https://github.com/orgs/community/discussions', description: 'Community discussions around GitHub, development workflows, Actions, security and collaboration.', type: 'Community', tags: ['GitHub', 'Developers', 'Open Source'] },
  { id: 'devto', title: 'DEV Community', url: 'https://dev.to/', description: 'Large developer community for programming, projects, career growth and technical writing.', type: 'Community', tags: ['Developers', 'Coding', 'Career'] },
  { id: 'stackoverflow', title: 'Stack Overflow', url: 'https://stackoverflow.com/', description: 'High-signal technical Q&A for programming problems, debugging and implementation questions.', type: 'Community', tags: ['Q&A', 'Programming', 'Debugging'], featured: true },
  { id: 'owasp-community', title: 'OWASP Community', url: 'https://owasp.org/community/', description: 'Application-security community, projects, chapters and collaborative security work.', type: 'Community', tags: ['Cybersecurity', 'AppSec', 'OWASP'], featured: true },
  { id: 'roadmap-community', title: 'roadmap.sh Community', url: 'https://roadmap.sh/community', description: 'Developer community around roadmaps, career paths and learning progression.', type: 'Community', tags: ['Roadmaps', 'Career', 'Developers'] },
];

export const featuredCourses = [
  { id: 'openai-ai-foundations', title: 'OpenAI Academy — AI Foundations', url: 'https://academy.openai.com/pages/courses', provider: 'OpenAI', description: 'A focused starting point for AI foundations, LLMs, ChatGPT and responsible AI use.' },
  { id: 'claude-101', title: 'Claude 101', url: 'https://www.anthropic.com/learn/claude-for-work', provider: 'Anthropic', description: 'A concise official starting point for learning Claude and practical workflows.' },
  { id: 'google-agent-learning', title: 'Introduction to Agents & Google’s Agent Ecosystem', url: 'https://cloud.google.com/learn/training', provider: 'Google Cloud', description: 'A current starting point for understanding and building agentic systems.' },
];
