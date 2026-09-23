let map;
let locatedIds = [];
let selectedFilter = 'todos';
let pendingScene = null;

const idFilter = ids => ['in', ['get', 'id'], ['literal', ids]];

function applyPointFilter(ids) {
  if (!map?.getLayer('records')) return;
  map.setFilter('records', idFilter(ids));
  map.setFilter('record-halo', idFilter(ids));
}

export function initMap(geojson, onSelect) {
  if (!globalThis.maplibregl) throw new Error('MapLibre não foi carregado');
  const located = geojson.features.filter(feature => feature.geometry?.type === 'Point');
  locatedIds = located.map(feature => feature.properties.id);
  map = new maplibregl.Map({container:'map',style:'https://tiles.openfreemap.org/styles/positron',center:[-38.526,-13.003],zoom:13.2,attributionControl:true});
  map.addControl(new maplibregl.NavigationControl({showCompass:false}),'top-right');
  map.on('load',()=>{
    map.addSource('records',{type:'geojson',data:{...geojson,features:located},promoteId:'id'});
    map.addLayer({id:'record-halo',type:'circle',source:'records',filter:idFilter([]),paint:{'circle-radius':17,'circle-color':'#F47A20','circle-opacity':.2}});
    map.addLayer({id:'records',type:'circle',source:'records',filter:idFilter([]),paint:{'circle-radius':7,'circle-color':'#F47A20','circle-stroke-color':'#0D0D0D','circle-stroke-width':1.5}});
    map.on('click','records',event=>onSelect(event.features[0].properties.id));
    map.on('mouseenter','records',()=>{map.getCanvas().style.cursor='pointer'});
    map.on('mouseleave','records',()=>{map.getCanvas().style.cursor=''});
    if (pendingScene) applyMapScene(pendingScene);
  });
}

export function applyMapScene(scene) {
  if (!scene) return;
  pendingScene = scene;
  if (!map) return;
  if (scene.camera) map.easeTo({...scene.camera,duration:matchMedia('(prefers-reduced-motion: reduce)').matches?0:650});
  const ids = scene.visibleRecordIds === 'all-located' ? locatedIds : (scene.visibleRecordIds || []);
  applyPointFilter(ids);
  if (map.getLayer('records')) pendingScene = null;
}

export function filterFinalMap(features, filter) {
  selectedFilter = filter;
  const ids = features.filter(feature => {
    if (!feature.geometry) return false;
    const p=feature.properties;
    if(filter==='graca') return p.instituicao==='Mosteiro de Nossa Senhora da Graça';
    if(filter==='sao-bento') return p.instituicao==='Mosteiro de São Bento';
    if(filter==='auditada') return true;
    if(filter==='endereco') return false;
    if(filter==='reconstrucao') return /reconstru/i.test(p.grau_correspondencia_geografica||'');
    if(filter==='verificacao') return /verifica|pendente|investiga/i.test(`${p.status_documental} ${p.grau_correspondencia_geografica}`);
    return true;
  }).map(feature=>feature.properties.id);
  applyPointFilter(ids);
  return selectedFilter;
}
