# Metodologia

## Escopo editorial

Esta ferramenta organiza evidências para uma investigação jornalística em andamento. Ela não é um cadastro imobiliário, não oferece certidão registral e não converte uma referência histórica em afirmação sobre propriedade contemporânea.

## 1. Propriedade histórica e propriedade atual

Uma instituição aparecer em uma doação, sesmaria, livro de tombo, aforamento ou estudo histórico demonstra apenas a relação registrada naquele contexto. A continuidade até o presente precisa ser comprovada por uma cadeia documental própria. Na ausência dela, o registro permanece **em investigação**.

## 2. Senhorio direto e foreiro

Em relações enfitêuticas, o senhorio direto e o foreiro ocupam posições jurídicas diferentes. A base preserva campos separados para ambos e não os trata como sinônimos. Quando a identidade de uma das partes não estiver documentada, o campo fica vazio.

O campo `relacao_fundiaria` pode inicialmente reproduzir a descrição encontrada na fonte. Já os campos estruturados `senhorio_direto` e `foreiro` só serão preenchidos depois da verificação documental da identidade jurídica das partes; eles não são inferidos a partir dessa descrição.

## 3. Enfiteuse e propriedade plena

Enfiteuse ou aforamento não equivale automaticamente a propriedade plena. A interface reproduz o tipo de relação indicado pela documentação e evita substituí-lo por termos genéricos como “propriedade” ou “terra da Igreja”. A instituição específica é nomeada sempre que conhecida.

## 4. Unidade de investigação

A unidade principal é o terreno ou parcela documental, e não cada apartamento de uma edificação. Um edifício pode funcionar como referência contemporânea de localização sem transformar suas unidades em registros fundiários separados.

## 5. Precisão geográfica

Os registros podem ter: geometria verificada; endereço ou topônimo conhecido sem limite de lote; região conhecida sem parcela localizada; ou localização em investigação. Endereço não é polígono, e bairro não permite inferir limites. Registros sem localização segura permanecem na lista, com geometria nula, e fora do mapa.

## 6. Evidência documental

A base diferencia registros contemporâneos, fontes históricas e literatura acadêmica. Fonte indicada em bibliografia não é tratada como documento primário consultado. Matrículas, atos públicos e demais referências mantêm status “a conferir” até auditoria. Campos ausentes ficam nulos: não são completados por inferência.

## 7. Regra para polígonos

Nenhum polígono será publicado como exato sem documentação suficiente e geometria verificável. Plantas históricas georreferenciadas deverão indicar método, margem de erro e correspondência com a malha contemporânea. Não será desenhada uma área genérica como pertencente a uma igreja ou mosteiro.

## 8. Auditoria progressiva

O dataset será progressivamente auditado. Cada revisão deverá registrar fonte, nível de evidência, precisão geográfica e data da última verificação. Divergências serão preservadas e descritas, em vez de resolvidas por suposição.
