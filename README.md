# MusicalSpace

Neste projeto construimos uma Rede social, cuja temática é Musica.

O projeto MusicalSpace foi desenvolvido pensando na necessidade do nosso usuário de compartilhar
seus gostos musicais, eventos, playlists e tudo relacionado ao mundo da música, além de interagir
com os outros usuários.


Nessa aplicação, utilizamos *HTML5*, *CCS3*, *JavaScript(ES6+)* e *Firebase*

## Objetivo

O objetivo deste projeto é construir uma Rede Social, Single-Page Application (SPA), responsiva na qual podemos escrever, ler, atualizar e deletar dados.

### Planejamento

* Escrever, de maneira colaborativa, as **Definições de pronto** e **Critérios de Aceitação** para cada **História de usuário** que te daremos para este projeto e que deverá considerar em seu planejamento.

* **Priorizar** a implementação de suas funcionalidades, levando em conta o esforço que demandam em relação ao valor que elas têm para o usuário, e executar, em equipe, todas as histórias de usuário dentro do tempo estimado para cada sprint. Levem em conta que ao final de cada sprint deverão ser entregues publicações completamente funcionais.

* Adquirir disciplina na completude, terminando uma história de usuário antes de passar para a seguinte (ou seja, que cumpre com as *Definições de Pronto* e *Critérios de Aceitação* contemplando todos os pontos que são objetivos de aprendizagem para este projeto).

### Desenvolvimento FrontEnd

#### Tecnologias HTML5 e CSS3/SASS

* Aplicar HTML5 semântico em seu projeto.
* Aplicar e reforçar os conceitos fundamentais de CSS3.
* Implemetar seletores de classe evitando a redundância de estilos CSS3.
* Utilizar `flexbox` para alcançar o desenho `mobile first`, implementando um layout que se adapte a **mobile e desktop**

A seguir, te passaremos o layout da tela mobile e desktop que você deverá replicar visualmente e cujo conteúdo, cores e fontes de texto deixaremos a seu critério.

* Tela mobile

    ![mobile](https://user-images.githubusercontent.com/32286663/56174616-ec9f6100-5fb8-11e9-9edb-d5ef7c251d9c.png)

* Tela Desktop

    ![desktop](https://user-images.githubusercontent.com/32286663/56174626-fcb74080-5fb8-11e9-8854-26e8d9c4e25f.png)

#### JavaScript (ES6+)

* Utilizar módulos de ES6 para poder modularizar seu código JavaScript.
* Reforçar seu conhecimento sobre o uso de Template strings.
* Reforçar seu conhecimento da manipulação de DOM através do JavaSript.
* Implementar um sistema de rotas (sem uso de bibliotecas externas) para trocar de uma tela para outra de maneira dinâmica (SPA).

### Persistência de dados

Nos projetos anteriores só consumimos (lemos) dados, por exemplo, através de um arquivo `json` ou utilizando `fetch`.

Neste projeto você desenhará a estrutura destes dados, a forma de consultá-los, atualizá-los, modificá-los e eliminá-los segundo os requerimentos do usuário. Para isto você utilizará `Firestore` do `Firebase` ou `LocalStorage` uma `Web Storage API`.

#### Firebase

O objetivo de usar Firebase neste projeto é que, com ele, você aprederá a manipular e persistir dados através de um banco de dados não relacional, em tempo real e poderá implementar operações CRUD (Criação, Leitura, Atualização e Remoção) de dados.

## Considerações Gerais do Projeto

* Este projeto deve ser desenvolvido em equipes de 3 integrantes.

* A duração proposta do projeto é de **3 sprints**, com duração de uma semana cada uma.

* Te daremos as **histórias de usuário** com o fim de apresentar a vocês os requisitos e funcionalidades que o usuário deseja.

* O **planejamento é vital**, para ele te recomendamos utilizar o trello, para que possa **escrever suas Definições de Pronto** e **Critérios de Aceitação** para cada história de usuário com o objetivo de determinar, em equipe, **o que fazer** no sprint e **como realizar**.

* Para que todos os membros de sua equipe possam alcançar os objetivos de aprendizagem, vocês deverão determinar qual será a estratégia de desenvolvimento que usarão: divisão por sub-histórias, pair programming, code reviews, etc.

## Restrições Técnicas

* Devem utilizar `flexbox` para posicionar seus elementos. Não está permitido o uso de frameworks de CSS (bootstrap), nem de estilização com `float`.

* Já te demos o layout das telas mobile e desktop. Queremos que repliquem estas telas. O conteúdo, paleta de cores e fontes, depende da temática que vão eleger como equipe. A implementação deste layout deverá ser parte da definição de pronto de suas histórias de usuário.

## Histórias de Usuário

* Como usuário novo, devo poder criar uma conta com email e senha válidos para poder iniciar uma sessão e ingressar na Rede Social.

* Como usuário novo, devo poder ter a opção de iniciar sessão com minha conta do Google para ingressar na Rede Social sem necessidade de criar uma conta de email válido.

* Como usuário logado devo poder criar, guardar, modificar no mesmo lugar (in place) e deletar publicações (post) privadas ou públicas.

* Como usuário logado devo poder ver todos os posts públicos e privados que criei até o momento, do mais recente para o mais antigo, assim como a opção de trocar a configuração de privacidade dos meus posts.

* Eu como usuário logado, posso dar like e ver a contagem de likes em minhas publicações

* Eu como usuário logado, posso escrever um comentário nas publicações.

* Ao final devo poder ingressar na Rede Social e poder visualizar os dados de meu perfil criado e editá-los.

## Critérios de aceitação

* Se o email ou senha não forem válidos, ao momento de logar, devo ver uma mensagem de erro.
* Deve ser visível se existir alguma mensagem de erro.
* Devo poder ver esta página de registro em celulares e desktop (responsive).
* Não devo necessitar recarregar a página para criar uma conta (SPA).
   
    > **Definição de pronto**
    > - A funcionalidade cumpre e satisfaz os critérios de aceitação.
    > - O layout está de acordo com o protótipo.
    > - O código desta funcionalidade recebeu code review.
    > - A funcionalidade está publicada para ser testada.
    > - A funcionalidade foi testada manualmente.
    > - Foram feitos testes de usabilidade e foi implementado o feedback, se for
    > necessário

