export type Theme = {
  name: string;
  accent: string;
  description: string;
};

export const themes: Theme[] = [
  { name: 'Light', accent: '#e11d48', description: 'Clean daylight workspace' },
  { name: 'Dark', accent: '#a855f7', description: 'Deep focus mode' },
  { name: 'Matrix', accent: '#22c55e', description: 'Terminal-inspired green grid' },
  { name: 'Spider-Man', accent: '#ef4444', description: 'Web-slinger red, blue and black' },
  { name: 'Batman', accent: '#facc15', description: 'Midnight and signal yellow' },
  { name: 'Iron Man', accent: '#22d3ee', description: 'Arc-reactor cyan and steel' },
  { name: 'Superman', accent: '#dc2626', description: 'Sky, crimson and gold' },
  { name: 'Hulk', accent: '#84cc16', description: 'Gamma green command mode' },
];
