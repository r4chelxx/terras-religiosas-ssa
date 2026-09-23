let map;

export function initMap(geojson, onSelect) {
  map = new maplibregl.Map({
    container: 'map',
    style: 'https://tiles.openfreemap.org/styles/positron',
    center: [-38.525, -13.005],
    zoom: 13,
    attributionControl: true
  });
  map.addControl(new maplibregl.NavigationControl(), 'top-right');
  map.on('load', () => {
    const located = {...geojson, features: geojson.features.filter(feature => feature.geometry?.type === 'Point')};
    map.addSource('registros', {type: 'geojson', data: located});
    map.addLayer({id: 'registros', type: 'circle', source: 'registros', paint: {'circle-radius': 8, 'circle-color': '#c44b20', 'circle-stroke-color': '#fffdf8', 'circle-stroke-width': 2}});
    map.on('click', 'registros', event => onSelect(event.features[0].properties.id));
    map.on('mouseenter', 'registros', () => { map.getCanvas().style.cursor = 'pointer'; });
    map.on('mouseleave', 'registros', () => { map.getCanvas().style.cursor = ''; });
  });
  return map;
}

// Hook reservado para que períodos controlem camadas quando houver geometria auditada.
export function setMapPeriod(period) {
  if (map?.loaded()) map.getContainer().dataset.period = period.id;
}
