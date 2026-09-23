export function initScrolly(scenes, onScene) {
  const steps = [...document.querySelectorAll('.story-step')];
  const scenesById = Object.fromEntries(scenes.map(scene => [scene.id, scene]));

  const activate = step => {
    steps.forEach(item => item.classList.toggle('active', item === step));
    const scene = scenesById[step.dataset.sceneId];
    onScene(scene);
    step.closest('.map-chapter').querySelector('.map-caption').textContent =
      scene.mapCaption || scene.title;
  };

  const observer = new IntersectionObserver(
    entries => entries.forEach(entry => entry.isIntersecting && activate(entry.target)),
    { rootMargin: '-35% 0px -45%', threshold: 0 },
  );
  steps.forEach(step => observer.observe(step));

  addEventListener('scroll', () => {
    const maximum = document.documentElement.scrollHeight - innerHeight;
    document.querySelector('#progress').style.width = `${maximum ? scrollY / maximum * 100 : 0}%`;
  }, { passive: true });
}
