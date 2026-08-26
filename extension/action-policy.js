const IRREVERSIBLE_PATTERNS = [
  /\b(pay|purchase|buy|order|book|confirm booking|place order)\b/i,
  /\b(send|submit application|submit form|transfer|withdraw|delete|cancel)\b/i,
  /\b(final|checkout|payment|upi|card|otp|one[- ]time password)\b/i
];

export function requiresConfirmation(action) {
  const text = JSON.stringify(action || '');
  return IRREVERSIBLE_PATTERNS.some(pattern => pattern.test(text));
}
