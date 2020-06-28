# Gameland.io

Webapp para divulgação e avaliação de games. Principais tecnologias de **front-end** utilizadas foram:

 - Typescript;
 - React js (hooks);
 - Material ui (*framework* de componentes);
 - Animações com lottie-web;
 - React context API (em substituição do redux);
 - Axios como cliente HTTP.

A aplicação foi contruída desde a autenticação, até o completo CRUD dos produtos com 4 (quatro) níveis de acesso. São eles:

||TIPO           |PERMISSÕES |                        
|----------------|-------------------------------|-------------
|1| Usuário jogador|avaliar, ver conteúdo, filtrar, buscar, fazer comentários e apagá-los
|2| Usuário admin|demais funções de 1 e exclusão de cartões (controle de conteúdo), além de exclusão de comentários de outros usuários
|3| Usuário produtor|Todas as demais funções, podendo adicionar, editar, comentar suas adições. Além de poder excluir qualquer comentário feito em suas publicações
|4| Usuário master|atribui ao usuário jogador o papel de adm, tem todas suas funções também. Não pode adicionar conteúdo e nem editar o conteúdo de nenhum produtor.

Por se tratar de uma aplicação pequena, e por o react hooks + context api fornecerem de forma mais prática o gerenciamento de estado global, utilizou-se desses mecanismos em lugar do redux.

## Melhorias
Alguns pontos de melhorias podem ser inseridos, a exemplo de:

 1. Busca na barra de topo para maior facilidade de acesso;
 2. Abrir imagem em modal/drawer para visualizar melhor as informações do produto;
 3. Scroll infinito para otimização de requests em caso do aumento do número de produtos na página;
 4. Melhor otimização da responsividade para mobile, apesar de já apresentar uma responsividade deboa parte dos componentes;
 5. Níveis de permissão atribuídos;
 6. I18n;
 7. Etc.

## Observações

**O sistema de avaliação é dinâmico, isto é, o usuário pode reavaliar que a nota média será sempre recalculada e exibida com o novo resultado, desconsiderando o anterior.**

**O envio de email pelo cliente smtp demora um pouco**
