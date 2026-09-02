const blocked = [
  /\bminor\b/i, /\bunderage\b/i, /\bchild\b/i, /\bnon[- ]?consensual\b/i
];
export function moderatePrompt(text = "") {
  return !blocked.some((rx) => rx.test(text));
}