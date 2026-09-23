import { initTimeline } from './timeline.js';
import { initMap, setMapPeriod, focusRecord } from './map.js';

const escapeHtml = value => String(value).replace(/[&<>"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[char]));
const has = value => value !== null && value !== undefined && value !== '';
let features = [];

function badges(record) {
  const labels = record.tipo_registro === 'contemporaneo' ? ['REGISTRO CONTEMPORÂNEO'] : ['FONTE HISTÓRICA'];
  const precision = record.grau_correspondencia_geografica || '';
  if (precision.includes('sem localização') || precision.includes('não localiz') || precision.includes('região conhecida')) labels.push('SEM LOCALIZAÇÃO EXATA');
  else if (precision.includes('ponto de referência') || precision.includes('endereço conhecido')) labels.push('REFERÊNCIA ATUAL');
  if (record.status_documental?.includes('pendente')) labels.push('FONTE PRIMÁRIA PENDENTE');
  return [...new Set(labels)].map(label => `<span class="badge">${label}</span>`).join('');
}

function showRecord(id) {
  const feature = features.find(item => item.properties.id === id);
  if (!feature) return;
  const r = feature.properties;
  const period = [r.data_inicio, r.data_fim].filter(has).join('–');
  const location = r.endereco_atual || r.toponimo_historico;
  const source = [r.fonte_primaria, r.folio].filter(has).join(', ') || r.fonte_secundaria;
  const fields = [['Instituição',r.instituicao],['Período',period],['Endereço / topônimo',location],['Relação fundiária',r.relacao_fundiaria],['Matrícula',r.matricula_atual],['Área',r.area],['Dimensões',r.dimensoes],['Fonte',source],['Status documental',r.status_documental],['Precisão geográfica',r.grau_correspondencia_geografica],['Observações',r.observacoes]];
  const panel = document.querySelector('#record-panel');
  panel.innerHTML = `<button class="panel-close" type="button" aria-label="Fechar ficha">Fechar</button><div>${badges(r)}</div><h3 id="panel-title">${escapeHtml(r.titulo)}</h3><dl>${fields.filter(([,v]) => has(v)).map(([label,v]) => `<dt>${label}</dt><dd>${escapeHtml(v)}</dd>`).join('')}</dl>`;
  panel.querySelector('.panel-close').addEventListener('click', () => { panel.innerHTML = '<p class="panel-placeholder">Selecione um registro para consultar sua ficha.</p>'; });
  focusRecord(feature);
}

function renderList(filter = 'todos') {
  const visible = features.filter(feature => filter === 'todos' || feature.properties.tipo_registro === filter);
  document.querySelector('#result-count').textContent = `${visible.length} ${visible.length === 1 ? 'registro' : 'registros'}`;
  const list = document.querySelector('#record-list'); list.innerHTML = '';
  visible.forEach(feature => {
    const r = feature.properties, button = document.createElement('button');
    button.type='button'; button.className='record-button';
    button.innerHTML=`<h3>${escapeHtml(r.titulo)}</h3><span class="record-meta">${escapeHtml(r.instituicao || '')}<br>${escapeHtml(r.endereco_atual || r.toponimo_historico || 'Localização não determinada')}</span><span class="record-status">${feature.geometry ? 'Ver no mapa' : 'Ver ficha'} →</span>`;
    button.addEventListener('click',()=>showRecord(r.id)); list.append(button);
  });
}
async function start(){
 try{
  const [rr,er]=await Promise.all([fetch('./data/registros.geojson'),fetch('./data/eventos.json')]);
  if(!rr.ok||!er.ok) throw new Error('Não foi possível carregar os dados.');
  const [records,events]=await Promise.all([rr.json(),er.json()]); features=records.features;
  initTimeline(events,setMapPeriod); initMap(records,showRecord); renderList();
  document.querySelectorAll('.filter').forEach(button=>button.addEventListener('click',()=>{
   document.querySelectorAll('.filter').forEach(item=>{item.classList.toggle('active',item===button);item.setAttribute('aria-pressed',String(item===button));});
   renderList(button.dataset.filter);
  }));
 }catch(error){document.querySelector('#record-list').innerHTML=`<p role="alert">${escapeHtml(error.message)} Tente recarregar a página.</p>`;}
}
start();