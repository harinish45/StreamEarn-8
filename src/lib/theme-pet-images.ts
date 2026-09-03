const svg = (content: string) => `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">${content}</svg>`)}`;

// Lightweight transparent mascot companions. No raster photo backgrounds, no canvas
// processing, and no external assets: crisp at every size with minimal runtime cost.
const pet_hp = svg(`
<defs><linearGradient id="c" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#7f1d1d"/><stop offset="1" stop-color="#b91c1c"/></linearGradient></defs>
<path d="M66 188c-10-31 1-62 24-80 8-7 14-16 18-28 5-16 16-23 20-23s15 7 20 23c4 12 10 21 18 28 23 18 34 49 24 80-20 17-40 25-62 25s-42-8-62-25Z" fill="#d9a37f" stroke="#241b1b" stroke-width="8"/>
<path d="M92 89c-4-17-3-32 6-46l20 25 10-18 14 18 20-25c9 14 10 29 6 46-18-8-51-8-76 0Z" fill="#b45309" stroke="#241b1b" stroke-width="8"/>
<path d="M73 139c14 12 24 16 47 16s33-4 47-16v35c-14 10-29 14-47 14s-33-4-47-14Z" fill="url(#c)"/>
<circle cx="103" cy="126" r="6" fill="#241b1b"/><circle cx="153" cy="126" r="6" fill="#241b1b"/>
<path d="M116 145c7 5 17 5 24 0" fill="none" stroke="#241b1b" stroke-width="6" stroke-linecap="round"/>`);

const pet_st = svg(`
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#65111b"/><stop offset="1" stop-color="#d62f42"/></linearGradient></defs>
<path d="M62 190c-7-37 5-68 28-87 10-8 17-17 22-31 3-9 9-14 16-14s13 5 16 14c5 14 12 23 22 31 23 19 35 50 28 87-19 16-42 23-66 23s-47-7-66-23Z" fill="url(#g)" stroke="#210b0f" stroke-width="8"/>
<path d="M87 105 71 70l31 15 18-35 17 35 31-15-16 35c-14-7-32-11-48-10-6 0-12 1-17 2Z" fill="#84202f" stroke="#210b0f" stroke-width="7" stroke-linejoin="round"/>
<circle cx="105" cy="133" r="7" fill="#ffd7d7" stroke="#210b0f" stroke-width="4"/><circle cx="151" cy="133" r="7" fill="#ffd7d7" stroke="#210b0f" stroke-width="4"/>
<path d="M99 158c12 10 46 10 58 0" fill="none" stroke="#ffd7d7" stroke-width="7" stroke-linecap="round"/>
<path d="M92 188c21 8 51 8 72 0" fill="none" stroke="#ed5a67" stroke-width="9" stroke-linecap="round"/>`);

const pet_pirates = svg(`
<path d="M64 189c-11-32 1-69 27-87 11-8 17-17 21-28 6-15 17-23 24-23s18 8 24 23c4 11 10 20 21 28 26 18 38 55 27 87-20 16-42 24-72 24s-52-8-72-24Z" fill="#b65f30" stroke="#2a1810" stroke-width="8"/>
<path d="M83 88c17-26 74-26 91 0-20-6-71-6-91 0Z" fill="#161616" stroke="#2a1810" stroke-width="7"/>
<path d="M104 81c3-22 9-36 15-43 6 7 12 21 15 43" fill="#222" stroke="#2a1810" stroke-width="7"/>
<path d="M119 42c16 3 27 10 34 20-16-5-26-4-34-1" fill="#d2a23a"/>
<circle cx="105" cy="132" r="6" fill="#23150e"/><circle cx="151" cy="132" r="6" fill="#23150e"/>
<path d="M111 152c8 7 26 7 34 0" fill="none" stroke="#23150e" stroke-width="6" stroke-linecap="round"/>
<path d="M96 188c15 8 49 8 64 0" fill="none" stroke="#e0ad52" stroke-width="8" stroke-linecap="round"/>`);

const pet_dark = svg(`
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#a855f7"/><stop offset="1" stop-color="#3b0764"/></linearGradient></defs>
<path d="M65 185c-8-35 4-68 30-85 13-9 20-20 24-35 3-11 8-17 13-17s10 6 13 17c4 15 11 26 24 35 26 17 38 50 30 85-20 18-41 26-67 26s-47-8-67-26Z" fill="#15111f" stroke="#8b5cf6" stroke-width="8"/>
<path d="M89 103 75 70l29 17 28-39 17 39 30-17-15 33c-25-10-51-10-75 0Z" fill="#211532" stroke="#8b5cf6" stroke-width="7" stroke-linejoin="round"/>
<circle cx="105" cy="130" r="7" fill="#c4b5fd"/><circle cx="151" cy="130" r="7" fill="#c4b5fd"/>
<path d="M106 155h44" stroke="#a78bfa" stroke-width="7" stroke-linecap="round"/>
<path d="M95 187c17 8 49 8 66 0" fill="none" stroke="#7c3aed" stroke-width="9" stroke-linecap="round"/>
<path d="M128 59v116" stroke="#ffffff" stroke-opacity=".2" stroke-width="2"/>`);

const pet_spider = svg(`
<path d="M77 182c-17-14-24-34-18-52 5-15 18-26 37-32-1-26 11-39 32-39s33 13 32 39c19 6 32 17 37 32 6 18-1 38-18 52-17 14-34 21-52 21s-35-7-50-21Z" fill="#d92534" stroke="#101827" stroke-width="8"/>
<path d="M96 97c9-9 34-9 44 0v47c-12 9-32 9-44 0Z" fill="#13213c"/>
<path d="M79 121 52 101M77 139l-30 5M179 121l27-20M181 139l30 5" stroke="#111827" stroke-width="9" stroke-linecap="round"/>
<circle cx="111" cy="120" r="5" fill="#fff"/><circle cx="145" cy="120" r="5" fill="#fff"/>
<path d="M128 98v86M104 111l48 55M152 111l-48 55" stroke="#fff" stroke-opacity=".22" stroke-width="3"/>`);

const pet_batman = svg(`
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#333b4c"/><stop offset="1" stop-color="#090b10"/></linearGradient></defs>
<path d="M62 185c-8-36 4-67 27-86 11-9 18-19 22-33 4-14 10-22 17-22s13 8 17 22c4 14 11 24 22 33 23 19 35 50 27 86-18 18-41 26-66 26s-48-8-66-26Z" fill="url(#g)" stroke="#050608" stroke-width="9"/>
<path d="M83 92 68 56l39 17 21-33 20 33 40-17-16 36c-23-9-51-9-69 0Z" fill="#171b24" stroke="#050608" stroke-width="8" stroke-linejoin="round"/>
<path d="M99 126c17-13 41-13 58 0v26c-17 10-41 10-58 0Z" fill="#202735"/>
<path d="M108 132h-12l-10 7h22M148 132h12l10 7h-22" fill="#f7c948"/>
<circle cx="111" cy="139" r="4" fill="#050608"/><circle cx="145" cy="139" r="4" fill="#050608"/>`);

const pet_superman = svg(`
<path d="M70 190c-10-35 2-68 26-87 10-8 17-18 22-31 4-11 11-17 18-17s14 6 18 17c5 13 12 23 22 31 24 19 36 52 26 87-19 17-42 25-66 25s-47-8-66-25Z" fill="#2876d6" stroke="#14213d" stroke-width="8"/>
<path d="M91 102c15-11 59-11 74 0l-7 78c-17 8-43 8-60 0Z" fill="#1450a3"/>
<path d="M99 144h58l-8 38c-14 7-28 7-42 0Z" fill="#d62e3e"/>
<path d="M128 108 140 121 128 134 116 121Z" fill="#ffd64d" stroke="#6b4a00" stroke-width="3"/>
<path d="M88 102c-12-12-18-27-15-43 10 8 19 11 30 12M168 102c12-12 18-27 15-43-10 8-19 11-30 12" fill="#e13b46" stroke="#7b1623" stroke-width="7"/>
<circle cx="112" cy="88" r="5" fill="#f6d0b5"/><circle cx="145" cy="88" r="5" fill="#f6d0b5"/>`);

const pet_light = svg(`
<defs><radialGradient id="g"><stop stop-color="#fff"/><stop offset=".6" stop-color="#dbeafe"/><stop offset="1" stop-color="#60a5fa"/></radialGradient></defs>
<path d="M128 29c9 24 24 35 48 44-16 8-29 14-37 25 20 1 39 10 57 26-22 1-38 7-52 17 18 7 34 18 46 34-22-4-39 1-55 11-4 18-14 31-25 43-11-12-21-25-25-43-16-10-33-15-55-11 12-16 28-27 46-34-14-10-30-16-52-17 18-16 37-25 57-26-8-11-21-17-37-25 24-9 39-20 48-44z" fill="#f8fbff" stroke="#2563eb" stroke-width="7" stroke-linejoin="round"/>
<circle cx="128" cy="132" r="45" fill="url(#g)" stroke="#2563eb" stroke-width="5"/>
<circle cx="112" cy="124" r="4" fill="#2563eb"/><circle cx="144" cy="124" r="4" fill="#2563eb"/>
<path d="M116 143c7 7 17 7 24 0" fill="none" stroke="#2563eb" stroke-width="5" stroke-linecap="round"/>
<path d="M128 133v9" stroke="#2563eb" stroke-width="4" stroke-linecap="round"/>`);

export const themePetImages: Record<string,string> = {
  hp: pet_hp,
  st: pet_st,
  pirates: pet_pirates,
  dark: pet_dark,
  spider: pet_spider,
  batman: pet_batman,
  superman: pet_superman,
  light: pet_light,
};
