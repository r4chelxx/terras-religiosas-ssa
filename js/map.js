let map;
export function initMap(geojson,onSelect){
 map=new maplibregl.Map({container:'map',style:'https://tiles.openfreemap.org/styles/positron',center:[-38.526,-13.002],zoom:13.7,attributionControl:true});
 map.addControl(new maplibregl.NavigationControl(),'top-right');
 map.on('load',()=>{
  const located={...geojson,features:geojson.features.filter(f=>f.geometry?.type==='Point')};
  map.addSource('registros',{type:'geojson',data:located});
  map.addLayer({id:'registros-halo',type:'circle',source:'registros',paint:{'circle-radius':13,'circle-color':'#F47A20','circle-opacity':.16}});
  map.addLayer({id:'registros',type:'circle',source:'registros',paint:{'circle-radius':7,'circle-color':'#F47A20','circle-stroke-color':'#0D0D0D','circle-stroke-width':1.5}});
  map.on('click','registros',e=>onSelect(e.features[0].properties.id));
  map.on('mouseenter','registros',()=>map.getCanvas().style.cursor='pointer');
  map.on('mouseleave','registros',()=>map.getCanvas().style.cursor='');
 });
 return map;
}
export function focusRecord(feature){
 if(!map||!feature?.geometry) return;
 if(feature.geometry.type==='Point') map.flyTo({center:feature.geometry.coordinates,zoom:16,duration:700});
}
export function setMapPeriod(period){if(map?.loaded()) map.getContainer().dataset.period=period.id;}