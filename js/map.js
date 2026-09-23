const maps = [];
const pendingScenes = new Map();

function idsFilter(ids = []) {
  return ['in', ['get', 'id'], ['literal', ids]];
}

function applyScene(map, scene) {
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  map.easeTo({ ...scene.camera, duration: reducedMotion ? 0 : 700 });

  if (!map.getLayer('records')) {
    pendingScenes.set(scene.mapIndex, scene);
    return;
  }

  const filter = idsFilter(scene.visibleRecordIds);
  map.setFilter('records', filter);
  map.setFilter('record-halo', filter);
  pendingScenes.delete(scene.mapIndex);
}

export function initMap(geojson, onSelect) {
  if (!globalThis.maplibregl) {
    throw new Error('MapLibre não foi carregado');
  }

  const located = {
    ...geojson,
    features: geojson.features
      .filter(feature => feature.geometry?.type === 'Point')
      .map(feature => ({ ...feature, id: feature.properties.id })),
  };

  document.querySelectorAll('.map').forEach((container, index) => {
    const map = new maplibregl.Map({
      container,
      style: 'https://tiles.openfreemap.org/styles/positron',
      center: [-38.526, -13.003],
      zoom: 13.2,
      attributionControl: true,
    });
    maps[index] = map;
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');

    map.on('load', () => {
      map.addSource('records', { type: 'geojson', data: located, promoteId: 'id' });
      map.addLayer({
        id: 'record-halo',
        type: 'circle',
        source: 'records',
        filter: idsFilter(),
        paint: { 'circle-radius': 16, 'circle-color': '#F47A20', 'circle-opacity': 0.2 },
      });
      map.addLayer({
        id: 'records',
        type: 'circle',
        source: 'records',
        filter: idsFilter(),
        paint: {
          'circle-radius': 7,
          'circle-color': '#F47A20',
          'circle-stroke-color': '#0D0D0D',
          'circle-stroke-width': 1.5,
        },
      });
      map.on('click', 'records', event => onSelect(event.features[0].properties.id));
      map.on('mouseenter', 'records', () => { map.getCanvas().style.cursor = 'pointer'; });
      map.on('mouseleave', 'records', () => { map.getCanvas().style.cursor = ''; });

      const pending = pendingScenes.get(index);
      if (pending) applyScene(map, pending);
    });
  });
}

export function setScene(scene) {
  const map = maps[scene?.mapIndex];
  if (!map || !scene?.camera) return;
  applyScene(map, scene);
}
