export type Theme = {
  name: string;
  accent: string;
  description: string;
};

export const themes: Theme[] = [
  { name: 'Light', accent: '#e11d48', description: 'Clean daylight workspace' },
  { name: 'Dark Web Series', accent: '#7c5cff', description: 'Winden-inspired mystery, rain and time-loop atmosphere' },
  { name: 'Harry Potter', accent: '#c8a44d', description: 'Wizarding-library glow with magical ambience' },
  { name: 'Spider-Man', accent: '#ef3340', description: 'Red, blue, midnight and web-swing motion' },
  { name: 'Batman', accent: '#facc15', description: 'Midnight city and signal yellow' },
  { name: 'Pirates of the Caribbean', accent: '#2dd4bf', description: 'Weathered wood, sea-glass cyan and treasure gold' },
  { name: 'Superman', accent: '#dc2626', description: 'Sky blue, crimson and gold' },
  { name: 'Stranger Things', accent: '#ef4444', description: 'Upside-down atmosphere with red neon and cinematic haze' },
];
