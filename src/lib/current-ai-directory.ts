export type CurrentAITool = { name: string; url: string; summary: string; tags: string[]; featured?: boolean };
export type CurrentAICategory = { id: string; name: string; description: string; tools: CurrentAITool[] };
const t = (name: string, url: string, summary: string, tags: string[], featured = false): CurrentAITool => ({ name, url, summary, tags, ...(featured ? { featured: true } : {}) });
const c = (id: string, name: string, description: string, tools: CurrentAITool[]): CurrentAICategory => ({ id, name, description, tools });

export const currentAIDirectory: CurrentAICategory[] = [
  c('assistants','AI Assistants','Current general assistants for research, study, writing, analysis and everyday work.',[
    t('ChatGPT','https://chatgpt.com/','General AI assistant for research, writing, analysis and task execution.',['assistant','research'],true),
    t('Claude','https://claude.ai/','Claude now includes the Fable 5.1 generation for advanced coding and knowledge work.',['assistant','coding','research'],true),
    t('Gemini','https://gemini.google.com/','Multimodal research and Google ecosystem assistance.',['assistant','research']),
    t('Microsoft Copilot','https://copilot.microsoft.com/','AI assistance across Microsoft productivity workflows.',['assistant','enterprise']),
    t('Grok','https://grok.com/','Conversational research and brainstorming.',['assistant','research']),
    t('Meta AI','https://www.meta.ai/','Multimodal assistant with current Muse model capabilities.',['assistant','multimodal'])]),
  c('agents','AI Agents & Delegation','Products focused on multi-step task execution and delegated work.',[
    t('Manus','https://manus.im/','Delegated multi-step agent workflows.',['agents','automation'],true),
    t('Devin','https://devin.ai/','Autonomous software engineering workflows.',['agents','coding']),
    t('OpenHands','https://www.all-hands.dev/','Open software-development agent platform.',['agents','coding','open-source']),
    t('Replit Agent','https://replit.com/ai','Natural-language application building and iteration.',['agents','coding']),
    t('Lindy','https://www.lindy.ai/','Business and personal assistants for repeatable work.',['agents','automation']),
    t('Genspark','https://www.genspark.ai/','Agentic research, creation and task execution.',['agents','research'])]),
  c('coding','AI Coding Agents & IDEs','Terminal agents, IDE agents, code review and software delivery.',[
    t('Codex','https://openai.com/codex/','Agentic software development across terminal, IDE and cloud workflows.',['coding','agents'],true),
    t('Claude Code','https://www.anthropic.com/claude-code','Terminal-native repository coding agent.',['coding','terminal'],true),
    t('Gemini CLI','https://github.com/google-gemini/gemini-cli','Open-source terminal agent for coding and tooling.',['coding','terminal']),
    t('GitHub Copilot','https://github.com/features/copilot','Coding, review and agent-assisted development.',['coding','github']),
    t('Cursor','https://www.cursor.com/','AI-native editor with multi-file agent workflows.',['coding','ide']),
    t('OpenCode','https://opencode.ai/','Open-source terminal coding agent.',['coding','open-source']),
    t('Cline','https://cline.bot/','Open coding agent with tool use.',['coding','open-source']),
    t('Aider','https://aider.chat/','Git-aware terminal pair programming.',['coding','git'])]),
  c('app-builders','AI App Builders','Prompt-to-app tools for prototypes and production web projects.',[
    t('Lovable','https://lovable.dev/','Full-stack app building from natural language.',['app-builder','full-stack'],true),
    t('v0','https://v0.dev/','AI-assisted interface and application generation.',['app-builder','ui']),
    t('Bolt.new','https://bolt.new/','Full-stack application creation in the browser.',['app-builder','full-stack']),
    t('Replit','https://replit.com/','Cloud development with AI-assisted building.',['app-builder','cloud']),
    t('Firebase Studio','https://firebase.studio/','AI-assisted application prototyping in Firebase.',['app-builder','firebase'])]),
  c('research','Research & Knowledge Discovery','Current AI search, literature review and source-grounded research tools.',[
    t('Perplexity','https://www.perplexity.ai/','Answer-focused web research with sources.',['research','search'],true),
    t('NotebookLM','https://notebooklm.google.com/','Source-grounded synthesis over supplied material.',['research','knowledge'],true),
    t('Consensus','https://consensus.app/','Academic search and evidence synthesis.',['research','academic']),
    t('Elicit','https://elicit.com/','Literature review and evidence extraction.',['research','papers']),
    t('Scite','https://scite.ai/','Literature search with citation context.',['research','citations']),
    t('Semantic Scholar','https://www.semanticscholar.org/','AI-assisted academic literature discovery.',['research','academic'])]),
  c('automation','Workflow Automation','AI-enabled workflow automation without adding browser automation features.',[
    t('n8n','https://n8n.io/','Visual workflow automation with AI extensibility.',['automation','workflow'],true),
    t('Zapier','https://zapier.com/','Business automation across connected applications.',['automation','workflow']),
    t('Make','https://www.make.com/','Visual multi-step automation.',['automation','workflow']),
    t('Gumloop','https://www.gumloop.com/','AI-first workflow automation for research and operations.',['automation','agents']),
    t('Relevance AI','https://relevanceai.com/','AI agents and repeatable business workflows.',['automation','agents']),
    t('Relay.app','https://relay.app/','Human-in-the-loop workflow automation.',['automation','workflow'])]),
  c('gtm','Lead Generation & GTM Automation','Current prospecting, enrichment, signal detection and revenue workflows.',[
    t('Clay','https://www.clay.com/','GTM engineering, enrichment and Claygent AI research.',['gtm','sales','research'],true),
    t('Apollo','https://www.apollo.io/','Sales intelligence, prospecting and outbound.',['gtm','sales']),
    t('HubSpot AI','https://www.hubspot.com/artificial-intelligence','AI across CRM, marketing and sales workflows.',['gtm','crm']),
    t('Common Room','https://www.commonroom.io/','Signal-based GTM intelligence.',['gtm','signals']),
    t('Instantly','https://instantly.ai/','Outbound and email campaign automation.',['gtm','outbound']),
    t('Regie.ai','https://www.regie.ai/','AI-assisted sales engagement and outbound.',['gtm','sales'])]),
  c('frameworks','Agent Frameworks & Connectivity','Current frameworks, protocols and tool-connection standards for agents.',[
    t('OpenAI Agents SDK','https://openai.github.io/openai-agents-python/','Tools, handoffs, tracing and structured agents.',['agents','sdk'],true),
    t('Google ADK','https://google.github.io/adk-docs/','Code-first agent development and evaluation.',['agents','sdk']),
    t('LangGraph','https://www.langchain.com/langgraph','Stateful graph-based orchestration.',['agents','orchestration']),
    t('CrewAI','https://www.crewai.com/','Role-based multi-agent workflows.',['agents','multi-agent']),
    t('Pydantic AI','https://ai.pydantic.dev/','Typed Python agents and structured I/O.',['agents','python']),
    t('Model Context Protocol','https://modelcontextprotocol.io/','Open standard for AI-to-tool and context connections.',['mcp','protocol']),
    t('A2A','https://a2a-protocol.org/','Agent-to-agent interoperability protocol.',['agents','protocol']),
    t('Google Agent Skills','https://github.com/google/skills','Official skills repository for adding focused knowledge and workflows to agents.',['agents','skills','open-source'])]),
  c('rag','RAG & AI Data Infrastructure','Retrieval, indexing, vectors and document layers for AI applications.',[
    t('LlamaIndex','https://www.llamaindex.ai/','Data and retrieval framework for AI apps.',['rag','retrieval']),
    t('Haystack','https://haystack.deepset.ai/','Pipeline-based retrieval and AI applications.',['rag','framework']),
    t('Pinecone','https://www.pinecone.io/','Managed vector search infrastructure.',['vector-db','rag'],true),
    t('Weaviate','https://weaviate.io/','Vector database with hybrid search.',['vector-db','rag']),
    t('Qdrant','https://qdrant.tech/','Vector similarity search engine.',['vector-db','open-source']),
    t('Unstructured','https://unstructured.io/','Document ingestion and parsing for AI pipelines.',['documents','rag'])]),
  c('evals','AI Evaluation & Observability','Tracing, evaluation, testing and production quality.',[
    t('Langfuse','https://langfuse.com/','Open tracing, prompts and evaluation; v4 is current.',['observability','evals'],true),
    t('LangSmith','https://smith.langchain.com/','Tracing, evaluation and debugging.',['observability','evals']),
    t('Arize Phoenix','https://phoenix.arize.com/','Open tracing and AI evaluation.',['observability','open-source']),
    t('Helicone','https://www.helicone.ai/','Observability, costs and analytics.',['observability','costs']),
    t('Opik','https://www.comet.com/docs/opik/','Evaluation and tracing.',['evals','observability']),
    t('DeepEval','https://deepeval.com/','Testing and evaluation framework.',['evals','testing'])]),
  c('creative','Creative AI','Current image, design, video, audio and presentation creation.',[
    t('Midjourney','https://www.midjourney.com/','High-end visual creation and ideation.',['image','design'],true),
    t('Adobe Firefly','https://firefly.adobe.com/','Generative creative tools across Adobe workflows.',['image','design']),
    t('Ideogram','https://ideogram.ai/','Image creation with strong typography workflows.',['image','typography']),
    t('Recraft','https://www.recraft.ai/','Brand-aware image and vector creation.',['design','vector']),
    t('Runway','https://runwayml.com/','Generative video and creative production.',['video','creative']),
    t('HeyGen','https://www.heygen.com/','AI avatars, localization and business video.',['video','avatars']),
    t('ElevenLabs','https://elevenlabs.io/','Voice generation, dubbing and speech infrastructure.',['voice','audio']),
    t('Gamma','https://gamma.app/','AI-generated presentations and visual documents.',['presentations','documents'])]),
  c('security','Cybersecurity & AI Security','Security operations, threat hunting and protection for AI systems.',[
    t('Microsoft Security Copilot','https://www.microsoft.com/en-us/security/business/ai-machine-learning/microsoft-security-copilot','AI-assisted security operations.',['security','soc'],true),
    t('CrowdStrike Charlotte AI','https://www.crowdstrike.com/products/charlotte-ai/','AI-assisted investigation and response.',['security','soc']),
    t('SentinelOne Purple AI','https://www.sentinelone.com/platform/purple-ai/','AI-assisted threat hunting.',['security','threat-hunting']),
    t('Lakera','https://www.lakera.ai/','AI security and guardrails.',['ai-security','guardrails']),
    t('Protect AI','https://protectai.com/','Security for AI and ML supply chains.',['ai-security','mlsecops']),
    t('Prompt Security','https://www.prompt.security/','Enterprise controls for generative AI use.',['ai-security','enterprise']),
    t('OWASP GenAI Security Project','https://genai.owasp.org/','Open security guidance for generative AI applications.',['ai-security','owasp'])]),
  c('infra','AI Infrastructure & Serving','Compute, deployment, inference and production AI infrastructure.',[
    t('Vercel AI','https://vercel.com/ai','Deployment and infrastructure for AI applications.',['infra','deployment'],true),
    t('Cloudflare Workers AI','https://developers.cloudflare.com/workers-ai/','Edge AI infrastructure.',['infra','edge']),
    t('Modal','https://modal.com/','Serverless compute for AI workloads.',['infra','compute']),
    t('Replicate','https://replicate.com/','Hosted model inference platform.',['infra','inference']),
    t('RunPod','https://www.runpod.io/','On-demand GPU compute infrastructure.',['infra','compute']),
    t('Baseten','https://www.baseten.co/','Production AI serving infrastructure.',['infra','inference']),
    t('NVIDIA NGC','https://catalog.ngc.nvidia.com/','NVIDIA catalog for current optimized AI containers and models.',['infra','nvidia','models'])])
];

export const currentAICategoryCount = currentAIDirectory.length;
export const currentAIToolCount = currentAIDirectory.reduce((sum, category) => sum + category.tools.length, 0);
