# CODEX BRIEF — Protótipo scrollytelling V0.3

## Missão

Transformar a branch `prototype-v02-multissitio` em um protótipo editorial navegável de alta fidelidade para a investigação **Quem foi dono do chão de Salvador?**, seguindo `STORYBOARD_V01.md`.

O objetivo não é construir um dashboard. É construir uma reportagem investigativa longform com comportamento de documentário interativo.

## Antes de alterar código

Leia integralmente:

1. `STORYBOARD_V01.md`
2. `METODOLOGIA.md`
3. `data/registros.geojson`
4. `data/eventos.json`
5. `data/fontes.json`
6. `data/midia.json`
7. `README.md`

Trate esses arquivos como fonte de verdade do protótipo.

## Stack

Manter arquitetura estática e simples:

- HTML sem framework;
- CSS próprio;
- JavaScript ES modules;
- MapLibre GL JS;
- GeoJSON/JSON local;
- GitHub Pages.

Não migrar para React, Next, Mapbox ou CMS nesta etapa.

Não adicionar dependências pesadas sem necessidade demonstrável.

## Objetivo visual

Aplicar o sistema visual do PLOT:

- laranja: #F47A20;
- preto: #0D0D0D;
- neutral 900: #222;
- neutral 600: #6B6B6B;
- neutral 300: #D9D9D9;
- neutral 100: #F5F5F5;
- branco: #FFF;
- Fraunces para display/editorial quando disponível;
- Inter para corpo/UI quando disponível;
- layout editorial, retangular, sem decoração gratuita;
- dados e fontes antes de ornamentação;
- motion funcional e discreto.

Se as webfonts não estiverem hospedadas/licenciadas no projeto, usar fallbacks seguros sem baixar ou incorporar arquivos de fonte.

## Arquitetura narrativa

O mapa deve permanecer sticky nas cenas cartográficas, mas **não deve dominar toda a reportagem**.

Precisamos de pelo menos quatro modos de cena:

### 1. MAP
Mapa sticky + texto rolando. Câmera/layers respondem à cena.

### 2. DOCUMENT
Documento/fotografia ocupa papel central. Mapa pode recuar ou desaparecer.

### 3. EXPLAINER
Componente visual explicativo sem depender do mapa. Primeiro uso: “UM TERRENO. DOIS DIREITOS.”

### 4. MICROSTORY
Interlúdio biográfico/institucional. Primeiro uso: Catarina Paraguaçu; segundo previsto: Mosteiro/São Bento.

Criar arquitetura de componentes/classes reutilizável para esses modos.

## Estado das cenas

Preferir configuração declarativa em `data/cenas.json`.

Cada cena deve poder declarar, quando aplicável:

- id;
- act;
- mode;
- eyebrow;
- title;
- body;
- camera: center/zoom/bearing/pitch;
- visibleRecordIds;
- evidenceType;
- media;
- sourceIds;
- status;
- notes.

Não colocar fatos novos apenas dentro do JavaScript.

## Gramática de evidência

Usar de forma consistente:

- **● referência atual localizada**
- **╍ geometria reconstruída**
- **○ evento documental sem localização exata**

Essa gramática deve existir visualmente e também semanticamente nos dados.

### Regras invioláveis

1. Nunca gerar coordenadas para um registro com `geometry: null`.
2. Nunca transformar endereço atual em perímetro histórico.
3. Nunca tratar sobreposição espacial como cadeia de propriedade.
4. Nunca afirmar situação enfitêutica atual quando a fonte comprova apenas situação histórica.
5. Nunca completar limites históricos por estética.
6. Nunca usar IA generativa para reconstruir informação ausente de mapa/documento/fotografia.
7. Nunca criar citação, matrícula, fólio, data, dimensão ou personagem não presente nas fontes do repositório.
8. Placeholders são preferíveis a invenção.

## Componente “Um terreno. Dois direitos.”

Construir explainer acessível e responsivo.

Estado inicial: uma parcela visual neutra.

Progressão pelo scroll/clique:

1. terreno;
2. domínio direto / senhorio direto;
3. domínio útil / foreiro-enfiteuta;
4. foro;
5. transferência e laudêmio;
6. nota: novas enfiteuses/subenfiteuses foram proibidas pelo Código Civil de 2002; as existentes foram preservadas até extinção segundo o regime anterior.

Não representar foreiro como locatário.

Não chamar laudêmio de imposto.

Não misturar terrenos de marinha.

Em `prefers-reduced-motion`, mostrar os estados sem animações dependentes de movimento.

## Micro-história Catarina

Criar o componente e a posição narrativa, mas **não preencher lacunas genealógicas**.

O protótipo deve suportar:

- retrato/foto/documento ou placeholder;
- pequena cadeia genealógica;
- marco 1628;
- caixas “O que os documentos permitem afirmar” e “O que ainda estamos investigando”;
- fontes da cena.

Enquanto a cadeia não estiver integralmente registrada em dados/fontes, sinalizar conteúdo como em apuração.

## Audiovisual

`data/midia.json` contém o inventário.

Vídeo é opcional.

Requisitos:

- nunca autoplay com áudio;
- fornecer poster/fallback;
- cena precisa funcionar integralmente sem vídeo;
- respeitar reduced motion;
- não incorporar arquivo cuja permissão de reprodução esteja pendente;
- não usar o filme de 1953 marcado como descartado;
- preparar componente para substituir facilmente placeholder por arquivo licenciado posteriormente.

## Fotografias e documentos

Criar slots de mídia com:

- legenda;
- data;
- autoria/acervo;
- crédito;
- sourceId;
- status de direitos quando necessário.

Sem asset real, renderizar placeholder editorial textual, não imagem genérica.

## MapLibre

Manter mapa atual.

Refatorar controlador para cenas declarativas.

Ao mudar de cena:

- flyTo/easeTo somente quando necessário;
- controlar opacidade/visibilidade de layers;
- destacar registros explicitamente associados à cena;
- não mostrar todos os pontos em todas as cenas;
- preservar controles básicos;
- evitar animação excessiva.

Preparar layers futuros para:

- eixos oficiais de logradouros;
- perímetro Clemente Mariani;
- lote 25;
- Lachenmayer reconstruído;
- incerteza espacial.

Se os GeoJSONs ainda não existirem, não criar geometrias substitutas.

## Transformação território → lote → edifício → unidade

Criar um componente/estrutura visual para a Cena 14.

No protótipo pode ser esquemático, desde que marcado como tal e não geográfico.

Deve deixar clara a mudança de unidade documental:

TERRITÓRIO  
→ AFORAMENTO  
→ LOTEAMENTO  
→ LOTE 25  
→ EDIFÍCIO  
→ UNIDADE  
→ MATRÍCULA

A animação não pode sugerir que matrícula de apartamento equivale à matrícula/perímetro de todo o terreno.

## Caderno de evidências

Manter o explorador como epílogo, não como página principal.

Melhorar fichas para exibir:

- instituição;
- relação fundiária;
- período/data;
- endereço/topônimo;
- matrícula;
- área/dimensões;
- status documental;
- precisão geográfica;
- fonte;
- observações/limitações.

Registros sem geometria continuam acessíveis na base.

## Fontes por cena

Toda afirmação relevante deve ser capaz de apontar para `sourceIds`.

Implementar bloco compacto “Fontes desta cena”.

Não inventar URL ausente.

Quando a fonte ainda for apenas referência bibliográfica/arquivística, mostrar isso explicitamente.

## Responsividade

Desktop:
- mapa sticky e narrativa lateral quando for modo MAP;
- largura editorial controlada;
- imagens/documentos podem romper a coluna quando justificado.

Mobile:
- mapa sticky com altura moderada;
- texto nunca deve ficar escondido atrás do mapa;
- evitar dependência de hover;
- fichas e explainer devem funcionar por toque;
- nenhuma rolagem horizontal da página.

## Acessibilidade

- HTML semântico;
- navegação por teclado;
- contraste adequado;
- foco visível;
- alt/legendas;
- botões reais para interações;
- `aria-live` somente onde fizer sentido;
- reduced motion;
- não depender apenas de cor para comunicar status.

## Performance

- lazy-load de imagens;
- vídeo somente quando necessário;
- assets otimizados;
- evitar bibliotecas para efeitos que CSS/JS simples resolvem;
- não carregar mídia histórica de alta resolução antes da cena correspondente.

## Arquivos esperados

O Codex pode refatorar a estrutura, mas a entrega deve incluir algo equivalente a:

```
index.html
css/style.css
js/app.js
js/map.js
js/scrolly.js
js/explainers.js
data/cenas.json
data/registros.geojson
data/eventos.json
data/fontes.json
data/midia.json
STORYBOARD_V01.md
METODOLOGIA.md
```

## Critérios de aceite do protótipo

O trabalho está pronto para revisão quando:

- o storyboard inteiro pode ser percorrido do início ao fim;
- mapa não é o único recurso narrativo;
- Catarina possui micro-história/placeholder estruturado;
- “Um terreno. Dois direitos.” funciona;
- 1827/1832 aparecem sem falsa geolocalização;
- 1924/1939/1949 possuem slots editoriais de mídia sem violar direitos;
- 1956/Clemente Mariani aceita geometria futura sem precisar redesenhar a página;
- lote 25 está separado conceitualmente de edifício/unidade;
- outros casos desembocam no caderno de evidências;
- fontes e limitações aparecem na experiência;
- desktop e mobile funcionam;
- nenhuma geometria ou fato foi inventado.

## Não fazer nesta rodada

- não resolver CMS;
- não integrar WordPress/Sanity;
- não criar backend;
- não implementar sistema de usuários;
- não inventar geometria para “deixar bonito”;
- não baixar mídia sem direitos definidos;
- não transformar o protótipo em dashboard;
- não alterar o recorte editorial sem justificar no PR.

## Entrega esperada do Codex

1. implementar o protótipo;
2. executar testes/lint disponíveis;
3. verificar console do navegador;
4. revisar mobile;
5. registrar no PR:
   - o que foi implementado;
   - placeholders restantes;
   - dados/geometrias que ainda dependem da apuração/QGIS;
   - decisões técnicas relevantes.

Prioridade: **fidelidade editorial > efeito visual**.
