// lib/debounce.js
export function debounce(fn, delay = 900) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), delay);
  };
}
