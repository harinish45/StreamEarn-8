import { pet_hp } from './pets/hp';
import { pet_st } from './pets/st';
import { pet_pirates } from './pets/pirates';
import { pet_dark } from './pets/dark';
import { pet_spider } from './pets/spider';
import { pet_batman } from './pets/batman';

export const themePetImages: Record<string,string> = {
  'hp': pet_hp,
  'st': pet_st,
  'pirates': pet_pirates,
  'dark': pet_dark,
  'spider': pet_spider,
  'batman': pet_batman,
  'superman': pet_spider,
  'light': pet_batman,
};