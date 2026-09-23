const stages = [
  ['1 / 6', 'Terreno: uma mesma parcela pode reunir posições jurídicas distintas.'],
  ['2 / 6', 'Domínio direto: posição do senhorio direto.'],
  ['3 / 6', 'Domínio útil: posição do foreiro ou enfiteuta — não é sinônimo de inquilino.'],
  ['4 / 6', 'Foro: prestação periódica associada à enfiteuse.'],
  ['5 / 6', 'Na transferência onerosa, pode incidir laudêmio. Laudêmio não é imposto.'],
  ['6 / 6', 'O Código Civil de 2002 proibiu novas enfiteuses e subenfiteuses; as existentes foram preservadas até sua extinção segundo o regime anterior.'],
];

export function initExplainers() {
  document.querySelectorAll('[data-explainer]').forEach(explainer => {
    let current = 0;
    const draw = () => {
      explainer.dataset.stage = current;
      explainer.querySelector('[data-counter]').textContent = stages[current][0];
      explainer.querySelector('[data-explainer-text]').textContent = stages[current][1];
      explainer.querySelector('[data-prev]').disabled = current === 0;
      explainer.querySelector('[data-next]').textContent =
        current === stages.length - 1 ? 'Recomeçar ↺' : 'Avançar →';
    };
    explainer.querySelector('[data-prev]').addEventListener('click', () => {
      current = Math.max(0, current - 1);
      draw();
    });
    explainer.querySelector('[data-next]').addEventListener('click', () => {
      current = (current + 1) % stages.length;
      draw();
    });
    draw();
  });
}
