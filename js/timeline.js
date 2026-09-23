export function initTimeline(events, onSelect = () => {}) {
  const container = document.querySelector('#timeline');
  const detail = document.querySelector('#timeline-detail');
  const select = (event, button) => {
    container.querySelectorAll('button').forEach(item => {
      const active = item === button;
      item.classList.toggle('active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    detail.innerHTML = `<h3>${event.titulo}</h3><p>${event.texto}</p>`;
    onSelect(event);
  };
  events.forEach((event, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = event.rotulo;
    button.setAttribute('aria-pressed', 'false');
    button.addEventListener('click', () => select(event, button));
    container.append(button);
    if (index === 0) select(event, button);
  });
}
