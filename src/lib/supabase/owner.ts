import crypto from 'node:crypto';
export function applicationOwnerId(username:string){const h=crypto.createHash('sha256').update(`streamearn-owner:${username}`).digest('hex').slice(0,32).split('');h[12]='5';h[16]=((parseInt(h[16],16)&3)|8).toString(16);return `${h.slice(0,8).join('')}-${h.slice(8,12).join('')}-${h.slice(12,16).join('')}-${h.slice(16,20).join('')}-${h.slice(20,32).join('')}`}
