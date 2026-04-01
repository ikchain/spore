const NO_COLOR = 'NO_COLOR' in process.env;

function wrap(code, text) {
  if (NO_COLOR) return text;
  return `\x1b[${code}m${text}\x1b[0m`;
}

export const bold = (t) => wrap('1', t);
export const dim = (t) => wrap('2', t);
export const green = (t) => wrap('32', t);
export const yellow = (t) => wrap('33', t);
export const red = (t) => wrap('31', t);
export const cyan = (t) => wrap('36', t);
export const magenta = (t) => wrap('35', t);
export const white = (t) => wrap('37', t);
