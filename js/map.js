let map, data, selectedId=null;
const scenes={
 today:{center:[-38.526,-13.003],zoom:13.2,caption:'Graça · Barra · Vitória — Salvador'},
 graca:{center:[-38.52382,-12.999528],zoom:16,caption:'Mosteiro da Graça · âncora institucional',ids:['mosteiro-graca']},
 mato:{center:[-38.5238,-12.9995],zoom:14.8,caption:'Graça · localização exata do Mato da Costa ainda não determinada',ids:['mosteiro-graca']},
 aforamentos:{center:[-38.5238,-12.9995],zoom:14.5,caption:'Graça · parcelas de 1832 ainda sem georreferenciamento',ids:['mosteiro-graca']},
 '1930':{center:[-38.527,-13.002],zoom:13.6,caption:'Graça e Barra · escala territorial da rede de foreiros'},
 clemente:{center:[-38.5305,-13.004],zoom:15,caption:'Área de investigação do Loteamento Clemente Mariani · perímetro em reconstrução'},
 lote25:{center:[-38.531,-13.004],zoom:16,caption:'João Pondé · posição do lote 25 ainda em reconstrução'},
 network:{center:[-38.528,-13.004],zoom:13.8,caption:'Rede documental · pontos entram somente quando a localização é auditável',ids:['mosteiro-graca','antigo-hospital-espanhol']}
};
export function initMap(geojson,onSelect){
 data=geojson; map=new maplibregl.Map({container:'map',style:'https://tiles.openfreemap.org/styles/positron',center:scenes.today.center,zoom:scenes.today.zoom,attributionControl:true});
 map.addControl(new maplibregl.NavigationControl({showCompass:false}),'top-right');
 map.on('load',()=>{const located={...geojson,features:geojson.features.filter(f=>f.geometry?.type==='Point')};map.addSource('records',{type:'geojson',data:located});map.addLayer({id:'record-halo',type:'circle',source:'records',paint:{'circle-radius':['case',['boolean',['feature-state','active'],false],17,12],'circle-color':'#F47A20','circle-opacity':['case',['boolean',['feature-state','active'],false],.22,.10]}});map.addLayer({id:'records',type:'circle',source:'records',paint:{'circle-radius':['case',['boolean',['feature-state','active'],false],8,6],'circle-color':'#F47A20','circle-stroke-color':'#0D0D0D','circle-stroke-width':1.5,'circle-opacity':['case',['boolean',['feature-state','dim'],false],.2,1]}});map.on('click','records',e=>onSelect(e.features[0].properties.id));map.on('mouseenter','records',()=>map.getCanvas().style.cursor='pointer');map.on('mouseleave','records',()=>map.getCanvas().style.cursor='');});
 return map;
}
export function setScene(name){if(!map)return;const s=scenes[name]||scenes.today;map.flyTo({center:s.center,zoom:s.zoom,duration:900,essential:true});const caption=document.querySelector('#map-caption');if(caption)caption.textContent=s.caption;if(!map.getSource('records'))return;const ids=s.ids||[];data.features.filter(f=>f.geometry).forEach(f=>{const id=f.properties.id;try{map.setFeatureState({source:'records',id},{active:ids.includes(id),dim:ids.length>0&&!ids.includes(id)})}catch{}});}
export function focusRecord(feature){if(!map||!feature?.geometry)return;map.flyTo({center:feature.geometry.coordinates,zoom:16,duration:700});}