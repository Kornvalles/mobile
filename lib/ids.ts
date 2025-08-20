export const uuid = () =>
  global.crypto?.randomUUID?.() ||
  Math.random().toString(36).slice(2) + Date.now();
