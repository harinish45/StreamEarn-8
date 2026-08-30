export type CuratedResource = {
  id: string;
  title: string;
  url: string;
  description: string;
  category: 'AI Learning' | 'Developer' | 'Cybersecurity' | 'Cloud & Data' | 'Design' | 'Career';
  tags: string[];
  featured?: boolean;
};

/**
 * Curated, platform-first Resource Hub.
 * Only first-party learning/resource platforms are listed here.
 * Individual courses are intentionally excluded unless they are a genuinely
 * important flagship learning destination; this keeps the Hub clean and non-duplicative.
 */
export const curatedResources: CuratedResource[] = [
  { id: 'openai-academy', title: 'OpenAI Academy', url: 'https://academy.openai.com/', description: 'OpenAI’s learning hub for AI foundations, applied AI, agents, workflows, ChatGPT and building with AI.', category: 'AI Learning', tags: ['OpenAI', 'AI', 'Agents', 'ChatGPT'], featured: true },
  { id: 'anthropic-academy', title: 'Anthropic Academy', url: 'https://www.anthropic.com/learn', description: 'Anthropic’s official learning hub for Claude, API development, enterprise use, agents, skills and responsible AI.', category: 'AI Learning', tags: ['Anthropic', 'Claude', 'Agents', 'API'], featured: true },
  { id: 'google-skills', title: 'Google Skills', url: 'https://www.skills.google/', description: 'Google’s current learning platform for AI, Gemini, agents, cloud, hands-on labs, learning paths and credentials.', category: 'AI Learning', tags: ['Google', 'Gemini', 'AI', 'Labs'], featured: true },
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

export const featuredCourses = [
  { id: 'openai-ai-foundations', title: 'OpenAI Academy — AI Foundations', url: 'https://academy.openai.com/pages/courses', provider: 'OpenAI', description: 'The flagship starting point for AI, LLMs, ChatGPT and responsible use.' },
  { id: 'claude-101', title: 'Claude 101', url: 'https://www.anthropic.com/learn/claude-for-work', provider: 'Anthropic', description: 'A concise official starting point for learning Claude and practical workflows.' },
  { id: 'google-agent-learning', title: 'Introduction to Agents & Google’s Agent Ecosystem', url: 'https://cloud.google.com/learn/training', provider: 'Google Cloud', description: 'A current learning path for understanding and building agentic systems.' },
];
