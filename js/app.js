import {initMap,applyMapScene,filterFinalMap} from './map.js';
import {initTimeline} from './scrolly.js';
import {initExplainers,initBeforeAfter} from './explainers.js';

const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const prose=value=>esc(value).replace(/\n\n/g,'<br><br>');
const has=value=>value!==null&&value!==undefined&&value!=='';
let records=[],sources=[],media=[];
const storyLinks={'lote-25-clemente-mariani':'documento-predio','mosteiro-graca':'graca','jardim-porto-barra':'sao-bento'};

// Precisão documental tem prioridade sobre completude visual.
function sceneSources(ids=[]){
 const entries=ids.map(id=>sources.find(source=>source.id===id)).filter(Boolean);
 if(!entries.length)return '<p class="source-pending">Fonte específica ainda não incorporada ao catálogo.</p>';
 return `<details class="scene-sources"><summary>Fontes desta passagem</summary>${entries.map(source=>`<p><b>${esc(source.tipo)}</b> · ${esc(source.autor||'Autoria não informada')}<br>${esc(source.titulo||'Título não informado')}${source.codigo?` · código ${esc(source.codigo)}`:''}${source.folios?` · fólio(s) ${esc(source.folios)}`:''}<br>${source.url?`<a href="${esc(source.url)}" target="_blank" rel="noopener">Consultar fonte</a>`:'<small>Referência bibliográfica/arquivística sem URL cadastrada</small>'}</p>`).join('')}</details>`;
}

function archiveSheet(item,compact=false){
 return `<div class="archive-sheet${compact?' compact':''}"><p class="archive-kicker">◫ ACERVO AUDIOVISUAL · ${esc(item.archive||'Acervo a confirmar')}</p><h3>${esc(item.title)}</h3><dl><div><dt>Ano</dt><dd>${esc(item.year)}</dd></div><div><dt>Realização</dt><dd>${esc(item.creator)}</dd></div><div><dt>Catálogo</dt><dd>${esc(item.catalog_code||'não informado')}</dd></div><div><dt>Duração</dt><dd>${esc(item.duration||'não informada')}</dd></div></dl><p>${esc(item.caption||'Material identificado no catálogo; decupagem pendente.')}</p><small>${esc(item.rightsStatus||item.rights_note)}</small>${item.sourceUrl?`<a class="archive-link" href="${esc(item.sourceUrl)}" target="_blank" rel="noopener">Consultar filme no acervo ↗</a>`:''}</div>`;
}

function audiovisual(ids=[]){
 return ids.map(id=>media.find(item=>item.id===id)).filter(Boolean).map(item=>{
  let asset='';
  if(item.videoUrl)asset=`<video controls muted playsinline preload="metadata" aria-label="${esc(item.title)}"><source src="${esc(item.videoUrl)}" type="video/webm"><a href="${esc(item.digital_copy_url||item.sourceUrl)}">Consultar cópia digital</a></video>`;
  else if(item.posterUrl)asset=`<img src="${esc(item.posterUrl)}" alt="${esc(item.caption||item.title)}" loading="lazy">`;
  return `<figure class="av-component${asset?' has-asset':' archive-only'}">${asset?`<div class="av-asset">${asset}</div>`:''}${archiveSheet(item)}<figcaption>${esc(item.rightsStatus||item.rights_note)} · Nenhum timestamp é afirmado nesta versão.</figcaption></figure>`;
 }).join('');
}

function historicalSide(compare){
 const item=media.find(entry=>entry.id===compare.historicalMediaId);
 if(compare.historicalImage)return `<img src="${esc(compare.historicalImage)}" alt="${esc(compare.historicalCaption)}" loading="lazy">`;
 if(item?.videoUrl)return `<video controls muted playsinline preload="metadata" aria-label="${esc(compare.historicalCaption)}"><source src="${esc(item.videoUrl)}" type="video/webm"></video>`;
 return item?archiveSheet(item,true):`<div class="archive-sheet compact"><h3>${esc(compare.historicalCaption)}</h3><a class="archive-link" href="${esc(compare.historicalSourceUrl)}" target="_blank" rel="noopener">Consultar fonte histórica ↗</a></div>`;
}
function currentSide(compare){return compare.currentImage?`<img src="${esc(compare.currentImage)}" alt="${esc(compare.currentCaption)}" loading="lazy">`:`<div class="current-pending"><span>REENQUADRAMENTO ATUAL PLOT</span><b>${esc(compare.currentCaption.replace('REENQUADRAMENTO ATUAL PLOT · ',''))}</b></div>`}
function beforeAfter(scene){const c=scene.compare;return `<figure class="before-after" data-before-after style="--split:50%"><div class="comparison-frame"><div class="comparison-side current">${currentSide(c)}<p><b>${esc(c.dateCurrent)}</b> · ${esc(c.currentCredit)}</p></div><div class="comparison-side historical">${historicalSide(c)}<p><b>${esc(c.dateHistorical)}</b> · ${esc(c.historicalCredit)}</p></div><i aria-hidden="true"></i></div><input type="range" min="0" max="100" value="50" aria-label="Comparar documento histórico e estado contemporâneo"><figcaption>${esc(c.rightsStatus)}${c.historicalSourceUrl?` · <a href="${esc(c.historicalSourceUrl)}" target="_blank" rel="noopener">Fonte histórica ↗</a>`:''}</figcaption></figure>`}

function rightsExplainer(){return `<div class="rights" data-rights><div class="rights-diagram"><p>Senhorio direto <small>domínio direto</small></p><div>TERRENO</div><p>Foreiro / enfiteuta <small>domínio útil</small></p></div><div class="control-row"><button data-prev type="button">← Anterior</button><span data-count></span><button data-next type="button">Avançar →</button></div><output aria-live="polite"></output><p class="legal-note">Novas enfiteuses e subenfiteuses foram proibidas pelo Código Civil de 2002; as existentes foram preservadas até sua extinção segundo o regime anterior. Fonte jurídica adequada pendente antes da publicação.</p><p class="warning">Enfiteuse privada não é sinônimo de terreno de marinha.</p></div>`}
function documentVisual(document){const measured=/braças/.test(document.title);return `<figure class="document${measured?' measured':''}"><span>▣ DOCUMENTO</span>${measured?`<svg viewBox="0 0 700 350" role="img" aria-label="Dois retângulos abstratos representando as proporções documentais sem localização geográfica"><rect x="50" y="80" width="240" height="64"/><text x="50" y="60">8 × 30 braças</text><rect x="380" y="40" width="240" height="180"/><text x="380" y="20">30 × 40 braças</text></svg><strong>ESQUEMA — NÃO GEOGRÁFICO</strong>`:`<blockquote>${esc(document.title)}</blockquote>`}<figcaption>${esc(document.detail)}</figcaption></figure>`}
function technical(scene){return `<div class="technical"><svg viewBox="0 0 420 310" role="img" aria-label="Esquema abstrato do lote 25, não georreferenciado"><path d="M90 50 L320 65 L350 250 L70 235 Z"/><text x="175" y="42">${esc(scene.measurements[0])}</text><text x="324" y="155">${esc(scene.measurements[1])}</text><text x="175" y="274">${esc(scene.measurements[3])}</text><text x="25" y="155">${esc(scene.measurements[2])}</text></svg><div class="technical-data"><p><b>Área declarada</b>${esc(scene.declaredArea)}</p><p><b>Reconstrução máxima aproximada</b>${esc(scene.reconstructedArea)}</p><p><b>Diferença</b>aprox. 5,00 m²<br>0,77%</p><strong>RECONSTRUÇÃO MÉTRICA LOCAL<br>NÃO GEORREFERENCIADA</strong></div></div>`}
function transform(scene){return `<div class="transform-sequence" aria-label="Progressão documental">${scene.stages.map((stage,index)=>`<div><span>${String(index+1).padStart(2,'0')}</span><b>${esc(stage)}</b><i aria-hidden="true">↓</i></div>`).join('')}</div><p class="warning">Matrícula de apartamento não equivale ao perímetro original do terreno. Santa Marta · Santa Maria · matrículas de trabalho 16.511 e 16.505.</p>`}
function pipeline(items){return `<ol class="pipeline">${items.map(item=>`<li>${esc(item)}</li>`).join('')}</ol>`}
function cartography(scene){return `<figure class="located-map"><p>DOCUMENTO CARTOGRÁFICO LOCALIZADO</p><h3>Planta Parcial da Cidade do Salvador</h3><blockquote>destacando terras foreiras aos Mosteiros de São Bento e Nossa Senhora da Graça</blockquote><figcaption>Paulo Lachenmayer · raster publicável em alta resolução ainda não incorporado.</figcaption></figure><p class="ai-rule">Este mapa não será redesenhado por inteligência artificial.</p>${pipeline(scene.pipeline)}`}

function sceneBody(scene){
 let visual='';
 if(scene.mode==='EXPLAINER')visual=rightsExplainer();
 if(scene.mode==='MEDIA')visual=audiovisual(scene.mediaIds);
 if(scene.mode==='COMPARE')visual=beforeAfter(scene);
 if(scene.mode==='DOCUMENT'||scene.mode==='MAP_DOCUMENT')visual=documentVisual(scene.document);
 if(scene.mode==='CARTOGRAPHY')visual=cartography(scene);
 if(scene.mode==='MAP_COMPARE')visual='<div class="map-comparison"><div><b>MAPA HISTÓRICO</b><small>raster auditado pendente</small></div><span>↔</span><div><b>MAPA ATUAL</b><small>comparação suspensa até georreferenciamento</small></div></div>';
 if(scene.mode==='MAP_TECHNICAL')visual=technical(scene);
 if(scene.mode==='TRANSFORM')visual=transform(scene);
 if(scene.mode==='MICROSTORY_LOT')visual=`<ol class="discovery">${scene.reveal.map(item=>`<li>${esc(item)}</li>`).join('')}</ol>`;
 if(scene.metric)visual+=`<div class="metric-row">${scene.metric.map(item=>`<b>${esc(item)}</b>`).join('')}</div>`;
 if(scene.mediaIds&&scene.mode!=='MEDIA')visual+=audiovisual(scene.mediaIds);
 if(scene.known||scene.unknown)visual+=`<div class="certainty"><div><h3>O que os documentos permitem afirmar</h3><p>${prose(scene.known)}</p></div><div><h3>O que ainda estamos investigando</h3><p>${prose(scene.unknown)}</p></div></div>`;
 return visual;
}

function renderScenes(scenes){document.querySelector('#story').innerHTML=scenes.map(scene=>`<section id="${esc(scene.id)}" data-scene="${esc(scene.id)}" class="story-section mode-${scene.mode.toLowerCase()}"><div class="story-copy"><p class="scene-meta">Ato ${esc(scene.act)} · ${esc(scene.eyebrow)}</p><h2>${esc(scene.title)}</h2><p class="scene-body">${prose(scene.body)}</p>${scene.evidenceType?`<p class="evidence ${esc(scene.evidenceType)}">${scene.evidenceType==='located'?'● REFERÊNCIA CONTEMPORÂNEA LOCALIZADA':'○ LOCALIZAÇÃO EXATA DESCONHECIDA'}</p>`:''}${scene.note?`<p class="note">${esc(scene.note)}</p>`:''}${sceneBody(scene)}${sceneSources(scene.sourceIds)}</div></section>`).join('')}

function recordFields(feature){const p=feature.properties;return [['Instituição relacionada',p.instituicao],['Endereço / topônimo',p.endereco_atual||p.toponimo_historico],['Relação encontrada',p.relacao_fundiaria],['Data / período',[p.data_inicio,p.data_fim].filter(Boolean).join('–')],['Matrícula / documento',p.matricula_atual||[p.fonte_primaria,p.folio].filter(Boolean).join(', ')],['Área / dimensões',[p.area,p.dimensoes].filter(Boolean).join(' · ')],['Status documental',p.status_documental],['Precisão geográfica',p.grau_correspondencia_geografica],['O que sabemos',p.relacao_fundiaria],['O que ainda falta verificar',p.observacoes],['Fonte',p.fonte_primaria||'Fonte contemporânea ainda não incorporada ao catálogo']]}
function openRecord(id){const feature=records.find(item=>item.properties.id===id);if(!feature)return;const p=feature.properties;const link=storyLinks[p.id];document.querySelector('#investigation-detail').innerHTML=`<button type="button" data-close>Fechar</button><p class="scene-meta">${evidenceSymbol(feature)} ${evidenceLabel(feature)}</p><h3>${esc(p.titulo)}</h3><dl>${recordFields(feature).filter(([,v])=>has(v)).map(([key,value])=>`<dt>${esc(key)}</dt><dd>${esc(value)}</dd>`).join('')}</dl>${link?`<a href="#${esc(link)}">Ver na história ↑</a>`:''}`;document.querySelector('[data-close]').onclick=()=>document.querySelector('#investigation-detail').innerHTML='<p>Selecione uma pista documental.</p>'}
function evidenceSymbol(feature){if(feature.geometry)return '●';if(feature.properties.endereco_atual)return '◐';return '○'}
function evidenceLabel(feature){if(feature.geometry)return 'NO MAPA · coordenada auditada';if(feature.properties.endereco_atual)return 'ENDEREÇO LOCALIZADO · coordenada pendente de auditoria';return 'LOCALIZAÇÃO HISTÓRICA DESCONHECIDA'}
function matchesRecordFilter(feature,filter){const p=feature.properties;const text=`${p.status_documental||''} ${p.grau_correspondencia_geografica||''}`;if(filter==='graca')return p.instituicao==='Mosteiro de Nossa Senhora da Graça';if(filter==='sao-bento')return p.instituicao==='Mosteiro de São Bento';if(filter==='auditada')return Boolean(feature.geometry);if(filter==='endereco')return Boolean(p.endereco_atual&&!feature.geometry);if(filter==='reconstrucao')return /reconstru/i.test(text);if(filter==='verificacao')return /verifica|pendente|investiga/i.test(text);return true}
function applyFinalFilter(filter){filterFinalMap(records,filter);document.querySelectorAll('[data-record]').forEach(row=>{const feature=records.find(item=>item.properties.id===row.dataset.record);row.hidden=!matchesRecordFilter(feature,filter)})}


function finalInvestigation(){
 const located=records.filter(item=>item.geometry);const counters={documentos:records.filter(item=>/localizad|confirmado/i.test(item.properties.status_documental||'')).length,matriculas:records.filter(item=>has(item.properties.matricula_atual)).length,enderecos:records.filter(item=>has(item.properties.endereco_atual)).length,reconstrucoes:records.filter(item=>/reconstru/i.test(item.properties.grau_correspondencia_geografica||'')).length,primarias:records.filter(item=>/pendente.*consulta|fonte.*pendente/i.test(`${item.properties.status_documental} ${item.properties.observacoes}`)).length,semLocal:records.length-located.length};
 const labels={documentos:'documentos localizados',matriculas:'matrículas identificadas',enderecos:'endereços contemporâneos',reconstrucoes:'geometrias / reconstruções',primarias:'fontes primárias pendentes',semLocal:'casos sem localização exata'};
 const filters=[['todos','Todos'],['graca','Mosteiro da Graça'],['sao-bento','Mosteiro de São Bento'],['auditada','Localização auditada'],['endereco','Endereço conhecido'],['reconstrucao','Reconstrução'],['verificacao','Em verificação']];
 const host=document.querySelector('#final-map .story-copy');host.insertAdjacentHTML('beforeend',`<div class="final-layout"><aside class="investigation"><h3>Investigação em andamento</h3><div class="counters">${Object.entries(counters).map(([key,value])=>`<p><b>${value}</b><span>${esc(labels[key])}</span></p>`).join('')}</div></aside><div class="final-tools"><div class="map-filters" aria-label="Filtros do mapa final">${filters.map(([id,label])=>`<button type="button" data-map-filter="${id}" aria-pressed="${id==='todos'}">${label}</button>`).join('')}</div><div class="evidence-ledger"><header><h3>Faixa documental</h3><p><span>● No mapa</span><span>◐ Endereço localizado</span><span>○ Localização histórica desconhecida</span></p></header>${records.map(item=>`<button type="button" data-record="${esc(item.properties.id)}"><span>${evidenceSymbol(item)}</span><b>${esc(item.properties.titulo)}</b><small>${esc(evidenceLabel(item))}</small><em>${esc(item.properties.endereco_atual||item.properties.toponimo_historico||'sem endereço contemporâneo')}</em></button>`).join('')}</div></div><aside id="investigation-detail" class="investigation-detail"><p>Selecione uma pista documental.</p></aside></div>`);
 document.querySelectorAll('[data-record]').forEach(button=>button.onclick=()=>openRecord(button.dataset.record));
 document.querySelectorAll('[data-map-filter]').forEach(button=>button.onclick=()=>{document.querySelectorAll('[data-map-filter]').forEach(other=>other.setAttribute('aria-pressed',String(other===button)));applyFinalFilter(button.dataset.mapFilter)});
}
function sourceIndex(){const groups={'Fontes primárias':sources.filter(s=>/Códice/i.test(s.tipo)),'Cartografia':sources.filter(s=>s.tipo==='planta'),'Literatura acadêmica':sources.filter(s=>s.tipo==='literatura acadêmica'),'Audiovisual':sources.filter(s=>s.tipo==='audiovisual')};document.querySelector('#source-groups').innerHTML=Object.entries(groups).filter(([,items])=>items.length).map(([title,items])=>`<section><h3>${title}</h3>${items.map(item=>`<p><b>${esc(item.titulo||item.tipo)}</b><br>${esc(item.autor||'Autoria não informada')} · ${esc(item.data||item.folios||'data não informada')}${item.codigo?` · código ${esc(item.codigo)}`:''}<br>${item.url?`<a href="${esc(item.url)}" target="_blank" rel="noopener">Consultar fonte ↗</a>`:''}<small>${esc(item.direitos||(!item.url?'Referência sem URL cadastrada':''))}</small></p>`).join('')}</section>`).join('')}


async function start(){
 const load=name=>fetch(`./data/${name}`).then(response=>{if(!response.ok)throw Error(`${name}: ${response.status}`);return response.json()});
 const [geojson,scenes,sourceData,mediaData]=await Promise.all([load('registros.geojson'),load('cenas.json'),load('fontes.json'),load('midia.json')]);records=geojson.features;sources=sourceData;media=mediaData.items;renderScenes(scenes);finalInvestigation();sourceIndex();initExplainers();initBeforeAfter();initTimeline(scenes,scene=>{document.body.dataset.mode=scene.mode;document.querySelector('#map-layer').textContent=scene.mapLayer||'Mapa em segundo plano';applyMapScene(scene)});try{initMap(geojson,openRecord)}catch(error){document.querySelector('#map-fallback').hidden=false;document.querySelector('#map-fallback').textContent=`Mapa indisponível. ${error.message}`}}
start().catch(error=>{document.querySelector('#story').innerHTML=`<p class="fatal-error">Não foi possível carregar a reportagem: ${esc(error.message)}</p>`});
