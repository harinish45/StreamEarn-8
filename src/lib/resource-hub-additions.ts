import type { CuratedResource, CommunityResource } from './resource-hub-curated';

export const additionalCuratedResources: CuratedResource[] = [
  { id:'google-agent-skills', title:'Google Agent Skills', url:'https://github.com/google/skills', description:'Official Google skills repository for adding focused product knowledge and workflows to compatible agents.', category:'Developer', tags:['Agents','Skills','Google','Open Source'], featured:true },
  { id:'google-agentic-soc-workshops', title:'Google Cloud Agentic SOC Workshops', url:'https://cloud.google.com/security/resources/soc-hub', description:'Current hands-on security workshops covering AI-agent investigation, triage, response and CTF scenarios.', category:'Cybersecurity', tags:['AI Security','SOC','Agents','CTF'], featured:true },
  { id:'google-threat-intelligence-breeze-comet', title:'Google Threat Intelligence — BREEZE COMET', url:'https://cloud.google.com/blog/topics/threat-intelligence/financially-motivated-threat-actor-breeze-comet-targets-brazil', description:'Current threat-intelligence case study on a financially motivated actor targeting payment systems, with detection and mitigation guidance.', category:'Cybersecurity', tags:['Threat Intelligence','Mandiant','Detection'] },
  { id:'aws-agentic-ai-labs', title:'AWS Agentic AI Builder Labs', url:'https://aws.amazon.com/training/learn-about/generative-ai/', description:'Current AWS learning path and labs for agentic AI, Bedrock AgentCore and generative AI application development.', category:'Cloud & Data', tags:['AWS','Agents','Bedrock'] },
  { id:'langfuse-v4', title:'Langfuse v4', url:'https://langfuse.com/changelog/2026-08-17-langfuse-v4', description:'Current Langfuse release for faster tracing, search, monitoring and evaluation of complex LLM and agent applications.', category:'Developer', tags:['LLMOps','Observability','Agents'] },
];

export const additionalCommunityResources: CommunityResource[] = [
  { id:'google-cloud-community', title:'Google Cloud Community', url:'https://www.googlecloudcommunity.com/', description:'Official Google Cloud community for AI, data, infrastructure and developer discussions.', type:'Community', tags:['Google Cloud','AI','Developers'] },
  { id:'aws-repost', title:'AWS re:Post', url:'https://repost.aws/', description:'Official AWS technical Q&A and knowledge community.', type:'Community', tags:['AWS','Cloud','Q&A'] },
];
