export type ResourceContact = {
  email?: string;
  phone?: string;
  url: string;
  label?: string;
};

/** Public contact channels only. */
export const resourceContacts: Record<string, ResourceContact> = {
  'openai-academy': { email: 'support@openai.com', url: 'https://help.openai.com/', label: 'OpenAI Support' },
  'claude-academy': { email: 'support@anthropic.com', url: 'https://support.anthropic.com/', label: 'Anthropic Support' },
  'google-skills': { url: 'https://support.google.com/', label: 'Google Support' },
  'microsoft-ai-learning': { url: 'https://support.microsoft.com/contactus', label: 'Microsoft Support' },
  'microsoft-ai103': { url: 'https://support.microsoft.com/contactus', label: 'Microsoft Support' },
  'aws-ai-learning': { url: 'https://aws.amazon.com/contact-us/', label: 'AWS Contact' },
  'nvidia-dli': { url: 'https://www.nvidia.com/en-us/support/enterprise/', label: 'NVIDIA Support' },
  'nvidia-certifications': { url: 'https://www.nvidia.com/en-us/contact/', label: 'NVIDIA Contact' },
  'deeplearning-ai': { url: 'https://www.deeplearning.ai/contact/', label: 'DeepLearning.AI Contact' },
  'huggingface-agents': { email: 'support@huggingface.co', url: 'https://huggingface.co/support', label: 'Hugging Face Support' },
  'huggingface-context': { email: 'support@huggingface.co', url: 'https://huggingface.co/support', label: 'Hugging Face Support' },
  'github-skills': { url: 'https://support.github.com/', label: 'GitHub Support' },
  'github-docs': { url: 'https://support.github.com/', label: 'GitHub Support' },
  'mdn': { url: 'https://developer.mozilla.org/en-US/docs/MDN/Community', label: 'MDN Community' },
  'freecodecamp': { url: 'https://forum.freecodecamp.org/', label: 'freeCodeCamp Forum' },
  'roadmap-sh': { url: 'https://roadmap.sh/community', label: 'roadmap.sh Community' },
  'docker-learn': { url: 'https://www.docker.com/support/', label: 'Docker Support' },
  'owasp': { email: 'info@owasp.org', url: 'https://owasp.org/contact/', label: 'OWASP Contact' },
  'owasp-genai': { email: 'info@owasp.org', url: 'https://owasp.org/contact/', label: 'OWASP Contact' },
  'portswigger-academy': { url: 'https://portswigger.net/support', label: 'PortSwigger Support' },
  'tryhackme': { url: 'https://help.tryhackme.com/', label: 'TryHackMe Help' },
  'htb-academy': { url: 'https://help.hackthebox.com/', label: 'Hack The Box Support' },
  'cisa': { url: 'https://www.cisa.gov/contact-us', label: 'CISA Contact' },
  'nist-cybersecurity': { url: 'https://www.nist.gov/contact-us', label: 'NIST Contact' },
  'google-cloud-training': { url: 'https://cloud.google.com/support', label: 'Google Cloud Support' },
  'aws-skill-builder': { url: 'https://aws.amazon.com/contact-us/', label: 'AWS Contact' },
  'kaggle-learn': { url: 'https://www.kaggle.com/contact', label: 'Kaggle Contact' },
  'figma-community': { url: 'https://help.figma.com/hc/en-us/requests/new', label: 'Figma Support' },
  'canva-design-school': { url: 'https://www.canva.com/help/', label: 'Canva Help' },
  'github-careers': { url: 'https://support.github.com/', label: 'GitHub Support' },
  'google-careers': { url: 'https://support.google.com/', label: 'Google Support' },
  'microsoft-careers': { url: 'https://support.microsoft.com/contactus', label: 'Microsoft Support' },
  'openai-community': { email: 'support@openai.com', url: 'https://community.openai.com/', label: 'OpenAI Developer Community' },
  'huggingface-forums': { email: 'support@huggingface.co', url: 'https://discuss.huggingface.co/', label: 'Hugging Face Forums' },
  'huggingface-discord': { email: 'support@huggingface.co', url: 'https://huggingface.co/join/discord', label: 'Hugging Face Support' },
  'github-community': { url: 'https://support.github.com/', label: 'GitHub Support' },
  'stackoverflow': { url: 'https://stackoverflow.com/contact', label: 'Stack Overflow Contact' },
  'owasp-community': { email: 'info@owasp.org', url: 'https://owasp.org/contact/', label: 'OWASP Contact' },
};
