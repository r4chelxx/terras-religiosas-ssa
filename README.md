# Quem foi dono do chão de Salvador?

V0.3 de uma reportagem investigativa em scrollytelling que organiza rastros documentais de relações fundiárias entre terrenos de Salvador e instituições religiosas. **Não é um cadastro imobiliário:** uma relação histórica ou enfitêutica não prova propriedade contemporânea.

## Stack e estrutura

Aplicação estática em HTML, CSS e JavaScript (ES Modules), com MapLibre GL JS, GeoJSON e JSON. Não há framework, backend, gerenciador de pacotes ou etapa de build.

- `index.html`: estrutura editorial e interface;
- `css/style.css`: sistema visual responsivo;
- `js/app.js`: composição das cenas, carregamento dos dados, filtros e fichas;
- `js/map.js`: mapas MapLibre controlados pelas cenas;
- `js/scrolly.js`: progressão narrativa pelo scroll;
- `js/explainers.js`: interação do componente sobre enfiteuse;
- `data/cenas.json`: configuração declarativa da narrativa;
- `data/`: registros, eventos e catálogo de fontes;
- `METODOLOGIA.md`: critérios editoriais e documentais.

## Executar localmente

ES Modules e `fetch` exigem um servidor HTTP. Na raiz do repositório, execute:

```bash
python3 -m http.server 8000
```

Abra `http://localhost:8000`. O mapa e as bibliotecas externas precisam de conexão à internet.

## Publicar no GitHub Pages

Em **Settings → Pages**, selecione **Deploy from a branch**, a branch desejada e a pasta `/ (root)`. Os caminhos são relativos e `.nojekyll` impede processamento desnecessário pelo Jekyll.

## Limitações da V0.3

- Nenhum registro recebeu coordenadas sem verificação; itens sem geometria aparecem na lista documental, mas não como pontos no mapa.
- Não há polígonos nem inferências de limites cadastrais.
- Fontes contemporâneas e cadeias registrais ainda precisam de auditoria.
- Mídias históricas permanecem como slots editoriais até a auditoria de direitos e dos arquivos.
- O basemap e MapLibre são carregados de serviços públicos externos.

## Próximos passos

1. auditoria das fontes contemporâneas;
2. obtenção da planta de Paulo Lachenmayer em alta resolução;
3. georreferenciamento da planta;
4. extração dos Códices 347, 94 e 40;
5. reconstrução de parcelas históricas;
6. ligação entre parcelas históricas e matrículas atuais.

Consulte [METODOLOGIA.md](./METODOLOGIA.md) antes de incluir ou interpretar dados.
