import type { CuratedResource, CommunityResource } from './resource-hub-curated';

/** Additional high-signal platforms verified against their current official sites. */
export const additionalCuratedResources: CuratedResource[] = [
  { id: 'ibm-skillsbuild', title: 'IBM SkillsBuild', url: 'https://skillsbuild.org/', description: '100% free IBM learning for AI, cybersecurity, data, cloud and career skills, with student and university pathways.', category: 'AI Learning', tags: ['IBM', 'AI', 'Cybersecurity', 'Free'], featured: true },
  { id: 'google-ai-skills-2026', title: 'Google AI learning', url: 'https://ai.google/learn-ai-skills/', description: 'Current official Google AI learning destination for practical AI skills and learning resources.', category: 'AI Learning', tags: ['Google', 'AI', 'Learning'], featured: true },
  { id: 'google-developers', title: 'Google for Developers', url: 'https://developers.google.com/', description: 'Google’s developer hub for Gemini, AI Studio, Android, Firebase, Chrome, Cloud, codelabs and developer programs.', category: 'Developer', tags: ['Google', 'Gemini', 'Codelabs', 'AI'], featured: true },
  { id: 'git-pro', title: 'Pro Git', url: 'https://git-scm.com/book/en/v2', description: 'The official Pro Git book, available online for free, covering version control from fundamentals through advanced workflows.', category: 'Developer', tags: ['Git', 'Open Source', 'Free'] },
  { id: 'cs50', title: 'CS50 — Harvard', url: 'https://cs50.harvard.edu/x/', description: 'Harvard’s current CS50x platform with free OpenCourseWare, programming, algorithms, data structures, security, web development and a final project.', category: 'Developer', tags: ['Harvard', 'Computer Science', 'Free'], featured: true },
  { id: 'cisco-networking-academy', title: 'Cisco Networking Academy', url: 'https://www.netacad.com/en', description: 'Cisco’s free learning platform covering cybersecurity, networking, AI, data science, programming and IT.', category: 'Cybersecurity', tags: ['Cisco', 'Networking', 'Cybersecurity', 'Free'], featured: true },
  { id: 'kubernetes-training', title: 'Kubernetes Training', url: 'https://kubernetes.io/training/', description: 'Official Kubernetes learning and certification resources, including free introductory cloud-native courses.', category: 'Cloud & Data', tags: ['Kubernetes', 'Cloud Native', 'DevOps'], featured: true },
  { id: 'linux-foundation-training', title: 'Linux Foundation Training', url: 'https://training.linuxfoundation.org/', description: 'Open-source and cloud-native training across Linux, Kubernetes, networking, security and infrastructure.', category: 'Cloud & Data', tags: ['Linux', 'Open Source', 'Cloud Native'] },
];

export const additionalCommunityResources: CommunityResource[] = [
  { id: 'google-developer-community', title: 'Google Developer Community', url: 'https://developers.google.com/community', description: 'Official Google developer groups, experts, events and community programs for builders.', type: 'Community', tags: ['Google', 'Developers', 'Community'], featured: true },
  { id: 'kubernetes-community', title: 'Kubernetes Community', url: 'https://kubernetes.io/community/', description: 'Official Kubernetes community with working groups, Slack, forums, events and contribution paths.', type: 'Community', tags: ['Kubernetes', 'Cloud Native', 'Open Source'], featured: true },
  { id: 'cisco-community', title: 'Cisco Community', url: 'https://community.cisco.com/', description: 'Cisco community for networking, security, collaboration, certification and troubleshooting discussions.', type: 'Community', tags: ['Cisco', 'Networking', 'Security'] },
];
