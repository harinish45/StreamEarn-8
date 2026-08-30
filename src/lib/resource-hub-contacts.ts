export type ResourceContact = {
  email?: string;
  phone?: string;
  url: string;
  label?: string;
};

/**
 * Public contact channels only. We never invent phone numbers or personal contacts.
 * If a provider does not publish a direct email/phone, the official support/contact
 * portal is shown instead.
 */
export const resourceContacts: Record<string, ResourceContact> = {
  'openai-academy': { email: 'support@openai.com', url: 'https://help.openai.com/', label: 'OpenAI Support' },
  'anthropic-academy': { email: 'support@anthropic.com', url: 'https://support.anthropic.com/', label: 'Anthropic Support' },
  'google-skills': { url: 'https://support.google.com/', label: 'Google Support' },
  'microsoft-ai-learning': { url: 'https://support.microsoft.com/contactus', label: 'Microsoft Support' },
  'aws-ai-learning': { url: 'https://aws.amazon.com/contact-us/', label: 'AWS Contact' },
  'nvidia-dli': { phone: '000 800 440 2283', url: 'https://www.nvidia.com/en-us/support/enterprise/', label: 'NVIDIA Enterprise Support (India)' },
  'meta-ai-learn': { url: 'https://www.meta.com/help/', label: 'Meta Help Center' },
  'deeplearning-ai': { url: 'https://www.deeplearning.ai/contact/', label: 'DeepLearning.AI Contact' },
  'huggingface-learn': { email: 'support@huggingface.co', url: 'https://huggingface.co/support', label: 'Hugging Face Support' },
  'github-skills': { url: 'https://support.github.com/', label: 'GitHub Support' },
  'github-docs': { url: 'https://support.github.com/', label: 'GitHub Support' },
  'mdn': { url: 'https://developer.mozilla.org/en-US/docs/MDN/Community', label: 'MDN Community' },
  'freecodecamp': { url: 'https://forum.freecodecamp.org/', label: 'freeCodeCamp Forum' },
  'roadmap-sh': { url: 'https://roadmap.sh/community', label: 'roadmap.sh Community' },
  'docker-learn': { url: 'https://www.docker.com/support/', label: 'Docker Support' },
  'owasp': { email: 'info@owasp.org', url: 'https://owasp.org/contact/', label: 'OWASP Contact' },
  'portswigger-academy': { url: 'https://portswigger.net/support', label: 'PortSwigger Support' },
  'tryhackme': { url: 'https://help.tryhackme.com/', label: 'TryHackMe Help' },
  'htb-academy': { url: 'https://help.hackthebox.com/', label: 'Hack The Box Support' },
  'cisa': { url: 'https://www.cisa.gov/contact-us', label: 'CISA Contact' },
  'nist-cybersecurity': { url: 'https://www.nist.gov/contact-us', label: 'NIST Contact' },
  'google-cloud-training': { url: 'https://cloud.google.com/support', label: 'Google Cloud Support' },
  'aws-skill-builder': { url: 'https://aws.amazon.com/contact-us/', label: 'AWS Contact' },
  'azure-learn': { url: 'https://support.microsoft.com/contactus', label: 'Microsoft Support' },
  'kaggle-learn': { url: 'https://www.kaggle.com/contact', label: 'Kaggle Contact' },
  'figma-community': { url: 'https://help.figma.com/hc/en-us/requests/new', label: 'Figma Support' },
  'canva-design-school': { url: 'https://www.canva.com/help/', label: 'Canva Help' },
  'linkedin-learning': { url: 'https://www.linkedin.com/help/learning', label: 'LinkedIn Learning Help' },
  'github-careers': { url: 'https://support.github.com/', label: 'GitHub Support' },
  'google-careers': { url: 'https://support.google.com/', label: 'Google Support' },
  'microsoft-careers': { url: 'https://support.microsoft.com/contactus', label: 'Microsoft Support' },
  'ibm-skillsbuild': { url: 'https://skillsbuild.org/contact', label: 'IBM SkillsBuild Contact' },
  'google-developers': { url: 'https://developers.google.com/community', label: 'Google Developer Community' },
  'git-pro': { url: 'https://git-scm.com/community', label: 'Git Community' },
  'kubernetes-training': { url: 'https://kubernetes.io/community/', label: 'Kubernetes Community' },
  'linux-foundation-training': { url: 'https://www.linuxfoundation.org/about/contact', label: 'Linux Foundation Contact' },
  'cisco-networking-academy': { url: 'https://www.netacad.com/support', label: 'Cisco Networking Academy Support' },
  'cs50': { email: 'malan@cs50.harvard.edu', url: 'https://cs50.harvard.edu/x/2026/communities/', label: 'CS50 Communities' },
  'openai-community': { email: 'support@openai.com', url: 'https://community.openai.com/', label: 'OpenAI Developer Community' },
  'huggingface-forums': { email: 'support@huggingface.co', url: 'https://discuss.huggingface.co/', label: 'Hugging Face Forums' },
  'huggingface-discord': { email: 'support@huggingface.co', url: 'https://huggingface.co/join/discord', label: 'Hugging Face Support' },
  'github-community': { url: 'https://support.github.com/', label: 'GitHub Support' },
  'devto': { url: 'https://dev.to/contact', label: 'DEV Community Contact' },
  'stackoverflow': { url: 'https://stackoverflow.com/contact', label: 'Stack Overflow Contact' },
  'owasp-community': { email: 'info@owasp.org', url: 'https://owasp.org/contact/', label: 'OWASP Contact' },
  'roadmap-community': { url: 'https://roadmap.sh/community', label: 'roadmap.sh Community' },
  'google-developer-community': { url: 'https://developers.google.com/community', label: 'Google Developer Community' },
  'kubernetes-community': { url: 'https://kubernetes.io/community/', label: 'Kubernetes Community' },
  'cisco-community': { url: 'https://community.cisco.com/', label: 'Cisco Community' },
};
