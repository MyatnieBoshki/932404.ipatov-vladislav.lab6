if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((reg) => console.log('SW registered, scope:', reg.scope))
      .catch((err) => console.error('SW registration failed:', err));
  });
}

const form = document.getElementById('calc-form');

if (form) {
  const statusEl = document.getElementById('status');
  const outputEl = document.getElementById('output');

  function show(data, label, isError) {
    statusEl.textContent = label;
    statusEl.className = 'status ' + (isError ? 'error' : 'ok');
    outputEl.textContent = JSON.stringify(data, null, 2);
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const a = form.a.value;
    const b = form.b.value;
    const op = form.op.value;
    const params = new URLSearchParams({ a, b, op });

    try {
      const res = await fetch(`/api/calc?${params}`);
      const data = await res.json();
      show(data, res.ok ? 'Ответ сервера' : `Ошибка ${res.status}`, !res.ok);
    } catch {
      const { status, body } = window.Calc.calculate(a, b, op);
      show(body, `Офлайн: посчитано в браузере${status !== 200 ? ' (ошибка)' : ''}`, status !== 200);
    }
  });
}
