export type Course = { id: string; title: string; description: string; icon: string; imageKey: string; url: string; provider: string; level: 'Beginner' | 'Intermediate' | 'Advanced'; format?: string };
export type CourseCategory = { id: string; name: string; courses: Course[] };
const c=(id:string,title:string,description:string,url:string,provider:string,level:Course['level'],icon='BrainCircuit',format='Self-paced')=>({id,title,description,url,provider,level,icon,format,imageKey:`course-${id}`} as Course);
export const coursesData: CourseCategory[] = [
 { id:'official-academies', name:'Official AI Academies', courses:[
  c('anthropic-academy','Anthropic Academy','Official learning hub for AI development, work adoption, skills, research and tool use.','https://www.anthropic.com/learn','Anthropic','Beginner','BookOpen','Official academy'),
  c('openai-academy-foundations','AI Foundations','Practical AI foundations covering clear instructions, context, review and responsible use.','https://academy.openai.com/pages/courses','OpenAI Academy','Beginner','BookOpen','Course'),
  c('openai-academy-applied','Applied AI Foundations','Turn recurring work into repeatable AI workflows with review points and practical application.','https://academy.openai.com/pages/courses','OpenAI Academy','Intermediate','Workflow','Course'),
  c('openai-academy-agents','Agents and Workflows','Direct structured AI workflows with context, outputs, boundaries and review.','https://academy.openai.com/pages/courses','OpenAI Academy','Advanced','Workflow','Course'),
  c('google-ai-essentials','Google AI Essentials','Five-module practical course covering AI basics, productivity, prompt engineering, responsible use and staying current.','https://grow.google/intl/en_in/ai-essentials/','Google','Beginner','GraduationCap','Certificate'),
  c('microsoft-ai-hub','Microsoft AI Learning Hub','Curated learning for agents, enterprise AI, productivity, infrastructure and AI workloads.','https://learn.microsoft.com/en-us/ai/','Microsoft Learn','Intermediate','Cloud','Learning hub'),
  c('microsoft-ai-901','Azure AI Fundamentals AI-901','Current Microsoft certification path covering AI concepts and implementation with Microsoft Foundry; the exam guide was updated April 15, 2026.','https://learn.microsoft.com/en-us/credentials/certifications/exams/ai-901/','Microsoft Learn','Intermediate','Cloud','Certification'),
  c('microsoft-ai-103','Developing AI Apps and Agents on Azure','Advanced certification study path for building and deploying AI apps and agents with Python and Microsoft Foundry.','https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-103','Microsoft Learn','Advanced','Code','Certification')
 ]},
 { id:'agents-agentic', name:'Agents & Agent Engineering', courses:[
  c('hf-agents','AI Agents Course','Hands-on agent fundamentals, tools, frameworks, agentic RAG, evaluation and a final project with certification.','https://huggingface.co/learn/agents-course/unit0/introduction','Hugging Face','Intermediate','Bot','Certified course'),
  c('langchain-deep-agents','Introduction to Deep Agents','Learn long-running agent workflows, agent harnesses and production-oriented development.','https://academy.langchain.com/collections?q=Agent','LangChain Academy','Advanced','Workflow','Foundation'),
  c('langchain-reliable','Building Reliable Agents','Take agents from first run to production through iterative improvement, tracing and evaluation.','https://academy.langchain.com/collections?q=Agent','LangChain Academy','Advanced','ShieldCheck','Foundation'),
  c('langchain-monitoring','Monitoring Production Agents','Monitor costs, quality, latency and trace data for deployed agent systems.','https://academy.langchain.com/collections?q=Agent','LangChain Academy','Advanced','Activity','Foundation'),
  c('deeplearning-agentic','Agentic AI','Intermediate hands-on learning in reflection, tool use, planning, multi-agent workflows and evaluation.','https://www.deeplearning.ai/courses/agentic-ai','DeepLearning.AI','Intermediate','Workflow','Course'),
  c('microsoft-agent-solutions','Introduction to Microsoft AI Agent Solutions','Compare agent options, customization paths and when to build custom agent applications.','https://learn.microsoft.com/en-us/training/modules/introduction-microsoft-ai-agent-solutions/','Microsoft Learn','Intermediate','Cloud','Module'),
  c('microsoft-agent-development','Get started with AI agent development','Build and test an AI agent and understand core development options.','https://learn.microsoft.com/en-us/training/modules/ai-agent-fundamentals/','Microsoft Learn','Intermediate','Code','Module'),
  c('microsoft-foundry-agents','Build and extend AI agents','Extend agents with trusted knowledge, tools, functions, APIs and remote tool connections.','https://learn.microsoft.com/en-us/training/modules/build-extend-ai-agents/','Microsoft Learn','Advanced','Code','Module')
 ]},
 { id:'rag-evals-production', name:'RAG, Evaluation & Production AI', courses:[
  c('nvidia-rag','RAG Learning Path','Production-oriented retrieval architecture, implementation and deployment learning.','https://www.nvidia.com/en-us/learn/learning-path/generative-ai-llm/','NVIDIA','Intermediate','Database','Learning path'),
  c('nvidia-eval-rag','Evaluating RAG and Semantic Search Systems','Advanced retrieval-quality evaluation and semantic-search testing.','https://www.nvidia.com/en-us/learn/learning-path/generative-ai-llm/','NVIDIA','Advanced','ChartNoAxesCombined','Course'),
  c('nvidia-agentic','Agentic AI Learning Paths','Advanced agentic application development, governance and production considerations.','https://www.nvidia.com/en-us/learn/learning-paths/','NVIDIA','Advanced','Bot','Learning path'),
  c('nvidia-infrastructure','AI Infrastructure Training','Deploy, operate and optimize scalable AI infrastructure and production platforms.','https://www.nvidia.com/en-us/training/academy/','NVIDIA','Advanced','Server','Professional training'),
  c('hf-agent-evals','Agent Observability & Evaluation','Advanced observability and evaluation learning within the Agents Course.','https://huggingface.co/learn/agents-course/unit0/introduction','Hugging Face','Advanced','Activity','Course unit')
 ]},
 { id:'developer-ai', name:'AI Development & Application Building', courses:[
  c('google-ai-developer','Google AI developer learning','Official developer resources for building AI applications and agentic solutions.','https://ai.google.dev/','Google','Intermediate','Code','Developer learning'),
  c('microsoft-build-agents','Introduction to building AI agents','Plan, ground, connect and govern an agent solution end to end.','https://learn.microsoft.com/en-us/training/courses/ms-4014','Microsoft Learn','Beginner','Code','Course'),
  c('anthropic-build','Build with Claude','API development, tool use, MCP, code workflows and advanced application resources.','https://www.anthropic.com/learn/build-with-claude','Anthropic Academy','Advanced','Code','Official academy'),
  c('hf-agent-frameworks','Agentic Frameworks','Study practical agent frameworks and how they support agentic applications.','https://huggingface.co/learn/agents-course/unit2/introduction','Hugging Face','Intermediate','Code','Course unit')
 ]},
 { id:'cyber-ai', name:'AI Security, Governance & Responsible Use', courses:[
  c('google-responsible-ai','Responsible AI Foundations','Practical responsible-AI skills covering limitations, bias awareness and safe application.','https://grow.google/intl/en_in/ai-essentials/','Google','Beginner','ShieldCheck','Certificate'),
  c('microsoft-ai-security','AI-ready security learning','Security and compliance guidance for adopting AI safely in enterprise environments.','https://learn.microsoft.com/en-us/ai/','Microsoft Learn','Intermediate','ShieldCheck','Learning hub'),
  c('nvidia-trustworthy-ai','Trustworthy AI learning path','Build practical awareness of trustworthy AI, governance and responsible AI considerations.','https://www.nvidia.com/en-us/learn/learning-paths/','NVIDIA','Advanced','ShieldCheck','Learning path')
 ]}
];
