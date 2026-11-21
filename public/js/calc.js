(function (root) {
  const OPS = {
    '+': (a, b) => a + b,
    '-': (a, b) => a - b,
    '*': (a, b) => a * b,
    '/': (a, b) => a / b,
  };

  const ALIASES = { ' ': '+', add: '+', sub: '-', mul: '*', div: '/' };

  function parseNumber(value) {
    if (typeof value !== 'string' || value.trim() === '') return NaN;
    return Number(value.trim().replace(',', '.'));
  }

  function fail(error, expression = null) {
    return { status: 400, body: { result: null, expression, error } };
  }

  function calculate(aRaw, bRaw, opRaw) {
    if (typeof opRaw !== 'string') return fail('Parameter "op" is required');

    const op = Object.hasOwn(ALIASES, opRaw) ? ALIASES[opRaw] : opRaw;
    if (!Object.hasOwn(OPS, op)) return fail(`Unknown operator "${opRaw}". Allowed: + - * /`);

    const a = parseNumber(aRaw);
    const b = parseNumber(bRaw);
    if (!Number.isFinite(a)) return fail('Invalid number "a"');
    if (!Number.isFinite(b)) return fail('Invalid number "b"');

    const expression = `${a}${op}${b < 0 ? `(${b})` : b}`;
    if (op === '/' && b === 0) return fail('Division by zero', expression);

    const raw = OPS[op](a, b);
    if (!Number.isFinite(raw)) return fail('Result is out of range', expression);

    const result = Number(raw.toPrecision(15));
    return { status: 200, body: { result, expression, error: null } };
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { calculate };
  } else {
    root.Calc = { calculate };
  }
})(this);
