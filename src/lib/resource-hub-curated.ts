export type CuratedResource = {
  id: string;
  title: string;
  url: string;
  description: string;
  category: 'AI Learning' | 'Developer' | 'Cybersecurity' | 'Cloud & Data' | 'Design' | 'Career';
  tags: string[];
  featured?: boolean;
};
export type CommunityResource = { id: string; title: string; url: string; description: string; type: 'Forum' | 'Discord' | 'Community'; tags: string[]; featured?: boolean };

/** Curated first-party and high-signal destinations checked for the current refresh. */
export const curatedResources: CuratedResource[] = [
  { id:'openai-academy', title:'OpenAI Academy', url:'https://academy.openai.com/', description:'Official courses covering AI foundations, applied AI, agents and workflows, plus current builder sessions.', category:'AI Learning', tags:['AI','Agents','Learning'], featured:true },
  { id:'claude-academy', title:'Claude Academy', url:'https://academy.claude.com/', description:'Current Anthropic learning hub for Claude, Claude Code, AI Fluency, platform and team workflows.', category:'AI Learning', tags:['Anthropic','Claude','Coding'], featured:true },
  { id:'google-skills', title:'Google Skills', url:'https://www.skills.google/', description:'Google learning platform with current AI, Gemini, Vertex AI, labs, certificates and skill badges.', category:'AI Learning', tags:['Google','AI','Labs'], featured:true },
  { id:'microsoft-ai-learning', title:'Microsoft Learn — AI', url:'https://learn.microsoft.com/en-us/ai/', description:'Official Microsoft AI learning for Azure AI, Foundry, Copilot, agents and responsible AI.', category:'AI Learning', tags:['Microsoft','Azure','AI'], featured:true },
  { id:'microsoft-ai103', title:'Microsoft AI-103 Study Guide', url:'https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-103', description:'Current Developing AI Apps and Agents on Azure study guide covering Python, RAG, agents, evaluation and AI security.', category:'AI Learning', tags:['Microsoft','AI-103','Agents','Python'], featured:true },
  { id:'aws-ai-learning', title:'AWS AI Learning', url:'https://aws.amazon.com/ai/learn/', description:'Official AWS AI courses and hands-on resources for generative AI, agents and cloud AI engineering.', category:'AI Learning', tags:['AWS','GenAI','Cloud'], featured:true },
  { id:'aws-skill-builder', title:'AWS Skill Builder', url:'https://skillbuilder.aws/', description:'AWS learning for cloud, AI, machine learning and certification preparation.', category:'Cloud & Data', tags:['AWS','Cloud','Certification'] },
  { id:'nvidia-dli', title:'NVIDIA Deep Learning Institute', url:'https://www.nvidia.com/en-in/training/', description:'Current NVIDIA training for deep learning, generative AI, accelerated computing and AI infrastructure.', category:'AI Learning', tags:['NVIDIA','Deep Learning','GPU'], featured:true },
  { id:'nvidia-certifications', title:'NVIDIA Certification', url:'https://www.nvidia.com/en-in/learn/certification/', description:'Current NVIDIA certifications across AI infrastructure, generative AI, agentic AI, data science and physical AI.', category:'AI Learning', tags:['NVIDIA','Certification','Agentic AI'], featured:true },
  { id:'huggingface-agents', title:'Hugging Face Agents Course', url:'https://huggingface.co/agents-course', description:'Hands-on agent course covering fundamentals, frameworks, agentic RAG, evaluation and certification.', category:'AI Learning', tags:['Agents','Python','Open Source'], featured:true },
  { id:'huggingface-context', title:'Hugging Face Context Course', url:'https://huggingface.co/context-course', description:'Current hands-on course covering agent context, skills, MCP, plugins, subagents, hooks and ML projects.', category:'AI Learning', tags:['Agents','MCP','Python','Context Engineering'], featured:true },
  { id:'deeplearning-ai', title:'DeepLearning.AI', url:'https://www.deeplearning.ai/', description:'Practical AI education with short courses and advanced learning paths.', category:'AI Learning', tags:['AI','Machine Learning','LLMs'], featured:true },
  { id:'github-skills', title:'GitHub Skills', url:'https://skills.github.com/', description:'Hands-on GitHub learning for repositories, Actions, automation and modern development.', category:'Developer', tags:['GitHub','Git','DevOps'], featured:true },
  { id:'mdn', title:'MDN Web Docs', url:'https://developer.mozilla.org/', description:'Authoritative web platform documentation for HTML, CSS, JavaScript and APIs.', category:'Developer', tags:['Web','JavaScript','HTML','CSS'], featured:true },
  { id:'freecodecamp', title:'freeCodeCamp', url:'https://www.freecodecamp.org/', description:'Free hands-on programming education with projects and certifications.', category:'Developer', tags:['Coding','Web','Projects'] },
  { id:'roadmap-sh', title:'roadmap.sh', url:'https://roadmap.sh/', description:'Developer roadmaps for software, DevOps, cloud and cybersecurity.', category:'Developer', tags:['Roadmaps','Career','Software'] },
  { id:'docker-learn', title:'Docker Learn', url:'https://www.docker.com/101-tutorial/', description:'Official Docker tutorials and container-development resources.', category:'Developer', tags:['Docker','Containers','DevOps'] },
  { id:'owasp', title:'OWASP', url:'https://owasp.org/', description:'Open security standards, projects and application-security resources.', category:'Cybersecurity', tags:['AppSec','OWASP','Security'], featured:true },
  { id:'owasp-genai', title:'OWASP GenAI Security Project', url:'https://genai.owasp.org/', description:'Current open security guidance for generative AI applications and agentic systems.', category:'Cybersecurity', tags:['GenAI','Security','OWASP'], featured:true },
  { id:'portswigger-academy', title:'PortSwigger Web Security Academy', url:'https://portswigger.net/web-security', description:'Free hands-on web security training with interactive labs.', category:'Cybersecurity', tags:['Web Security','Labs','AppSec'], featured:true },
  { id:'tryhackme', title:'TryHackMe', url:'https://tryhackme.com/', description:'Guided cybersecurity learning paths, rooms and practical labs.', category:'Cybersecurity', tags:['Cybersecurity','Labs','CTF'] },
  { id:'htb-academy', title:'Hack The Box Academy', url:'https://academy.hackthebox.com/', description:'Structured offensive and defensive security training with practical labs.', category:'Cybersecurity', tags:['Security','Labs','Pentesting'] },
  { id:'cisa', title:'CISA Cybersecurity Resources', url:'https://www.cisa.gov/topics/cybersecurity-best-practices', description:'Official U.S. cybersecurity guidance and defensive resources.', category:'Cybersecurity', tags:['CISA','Defense','Standards'] },
  { id:'nist-cybersecurity', title:'NIST Cybersecurity', url:'https://www.nist.gov/cybersecurity', description:'Cybersecurity frameworks, standards and technical resources.', category:'Cybersecurity', tags:['NIST','Standards','Risk'] },
  { id:'google-cloud-training', title:'Google Cloud Training', url:'https://cloud.google.com/learn/training', description:'Google Cloud learning through labs, AI paths and certifications.', category:'Cloud & Data', tags:['Google Cloud','AI','Cloud'] },
  { id:'kaggle-learn', title:'Kaggle Learn', url:'https://www.kaggle.com/learn', description:'Short practical learning for Python, data science, machine learning and AI.', category:'Cloud & Data', tags:['Kaggle','Python','ML'] },
  { id:'figma-community', title:'Figma Community', url:'https://www.figma.com/community', description:'Design resources, templates and plugins for product design.', category:'Design', tags:['Figma','UI/UX','Design'] },
  { id:'canva-design-school', title:'Canva Design School', url:'https://www.canva.com/designschool/', description:'Official design education and creative resources.', category:'Design', tags:['Canva','Design','Creative'] },
  { id:'github-careers', title:'GitHub Careers', url:'https://github.com/careers', description:'Official GitHub technology and engineering opportunities.', category:'Career', tags:['GitHub','Jobs','Technology'] },
  { id:'google-careers', title:'Google Careers', url:'https://www.google.com/about/careers/applications/jobs/results/', description:'Official Google engineering, AI and technology opportunities.', category:'Career', tags:['Google','Jobs','AI'] },
  { id:'microsoft-careers', title:'Microsoft Careers', url:'https://jobs.careers.microsoft.com/', description:'Official Microsoft engineering, AI, cloud and security opportunities.', category:'Career', tags:['Microsoft','Jobs','AI'] },
];

export const communityResources: CommunityResource[] = [
  { id:'openai-community', title:'OpenAI Developer Community', url:'https://community.openai.com/', description:'Official developer community for building with OpenAI products.', type:'Forum', tags:['OpenAI','Developers','AI'], featured:true },
  { id:'huggingface-forums', title:'Hugging Face Forums', url:'https://discuss.huggingface.co/', description:'Community discussion for models, datasets, agents and open-source AI.', type:'Forum', tags:['Hugging Face','Open Source','AI'], featured:true },
  { id:'huggingface-discord', title:'Hugging Face Discord', url:'https://huggingface.co/join/discord', description:'Official Hugging Face community collaboration space.', type:'Discord', tags:['Hugging Face','Discord','AI'], featured:true },
  { id:'github-community', title:'GitHub Community', url:'https://github.com/orgs/community/discussions', description:'Community discussions around GitHub development, Actions and security.', type:'Community', tags:['GitHub','Developers','Open Source'] },
  { id:'owasp-community', title:'OWASP Community', url:'https://owasp.org/community/', description:'Application-security projects, chapters and collaborative security work.', type:'Community', tags:['Cybersecurity','AppSec','OWASP'], featured:true },
  { id:'stackoverflow', title:'Stack Overflow', url:'https://stackoverflow.com/', description:'Technical Q&A for programming, debugging and implementation questions.', type:'Community', tags:['Q&A','Programming','Debugging'], featured:true },
];

export const featuredCourses = [
  { id:'openai-academy-2026', title:'OpenAI Academy — Agents and Workflows', url:'https://academy.openai.com/', provider:'OpenAI', description:'Current structured course path for directing agents through repeatable workflows, reviewing outputs and refining results.' },
  { id:'claude-academy-2026', title:'Claude Academy — AI Fluency and Claude Code', url:'https://academy.claude.com/', provider:'Anthropic', description:'Current Anthropic learning hub covering AI Fluency, Claude, Claude Code, platform and team workflows.' },
  { id:'hf-context-2026', title:'Hugging Face Context Course', url:'https://huggingface.co/context-course', provider:'Hugging Face', description:'Advanced context engineering with skills, MCP, plugins, subagents and hooks plus hands-on ML projects.' },
  { id:'hf-agents-2026', title:'Hugging Face Agents Course', url:'https://huggingface.co/agents-course', provider:'Hugging Face', description:'Certified hands-on path covering agent fundamentals, frameworks, agentic RAG, evaluation and deployment.' },
  { id:'microsoft-ai103-2026', title:'Microsoft AI-103 — Developing AI Apps and Agents on Azure', url:'https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-103', provider:'Microsoft', description:'Current certification preparation path covering Python, Foundry, RAG, agentic solutions, evaluation and AI security.' },
  { id:'nvidia-certification-2026', title:'NVIDIA Certification — Generative AI & Agentic AI', url:'https://www.nvidia.com/en-in/learn/certification/', provider:'NVIDIA', description:'Current certification paths for generative AI, agentic AI and AI infrastructure.' },
  { id:'aws-agentic-ai-2026', title:'AWS Builder Labs — Agentic AI on AWS', url:'https://aws.amazon.com/training/learn-about/generative-ai/', provider:'AWS', description:'Current AWS hands-on learning for generative AI, Bedrock AgentCore and agentic application development.' },
];
