import { pet_hp } from './pets/hp';
import { pet_st } from './pets/st';
import { pet_pirates } from './pets/pirates';
import { pet_dark } from './pets/dark';
import { pet_spider } from './pets/spider';
import { pet_batman } from './pets/batman';

// Purpose-built transparent companion illustrations for themes that previously
// reused unrelated character art. They are vector-based, so they stay crisp at
// any size and add zero image-background artifacts.
const pet_superman = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240"><defs><linearGradient id="cape" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#e21d2f"/><stop offset="1" stop-color="#8f0f22"/></linearGradient><linearGradient id="body" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#2d8cff"/><stop offset="1" stop-color="#0b3d91"/></linearGradient></defs><g stroke="#0b1736" stroke-width="7" stroke-linejoin="round"><path fill="url(#cape)" d="M65 95c-27 22-39 61-29 95 21-15 44-22 69-18l8-62z"/><circle cx="122" cy="61" r="31" fill="#f5c6a8"/><path fill="#172341" d="M93 55c6-30 59-35 69 2-18-9-42-9-69-2z"/><path fill="url(#body)" d="M82 91l39-16 39 16 14 76-53 25-53-25z"/><path fill="#f0c419" d="M122 104l10 10-10 10-10-10z"/><path fill="#e21d2f" d="M106 119h32l-7 38h-18z"/><path fill="#f5c6a8" d="M75 120l-25 37 17 8 25-24zm94 0l25 37-17 8-25-24z"/><path fill="#f5c6a8" d="M101 174l-21 36 18 4 24-31 24 31 18-4-21-36z"/><circle cx="111" cy="62" r="3" fill="#0b1736" stroke="none"/><circle cx="134" cy="62" r="3" fill="#0b1736" stroke="none"/></g></svg>`)}`;

const pet_light = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240"><defs><radialGradient id="g"><stop stop-color="#ffffff"/><stop offset=".58" stop-color="#dbeafe"/><stop offset="1" stop-color="#93c5fd"/></radialGradient></defs><g stroke="#2563eb" stroke-width="6" stroke-linejoin="round"><path fill="#f8fbff" d="M120 35c21 19 37 25 57 37-16 9-25 18-34 30 22 1 37 8 51 18-18 2-31 10-42 22 16 5 30 14 41 29-18-3-34 0-49 9-5 16-13 27-24 40-11-13-19-24-24-40-15-9-31-12-49-9 11-15 25-24 41-29-11-12-24-20-42-22 14-10 29-17 51-18-9-12-18-21-34-30 20-12 36-18 57-37z"/><circle cx="120" cy="124" r="46" fill="url(#g)"/><path fill="none" d="M97 128c8 10 14 14 23 14s15-4 23-14"/><circle cx="104" cy="116" r="4" fill="#2563eb" stroke="none"/><circle cx="136" cy="116" r="4" fill="#2563eb" stroke="none"/><path fill="none" d="M120 137v9"/></g></svg>`)}`;

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
