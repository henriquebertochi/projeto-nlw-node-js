## pass.in

    O pass.in é uma aplicação de gestão de participantes em eventos presenciais.
    A ferramenta permite que o organizador cadastre um evento e abra uma página pública de inscrição.
    Os participantes inscritos podem emitir uma credencial para check-in no dia do evento.  
    O sistema fará um scan da credencial do participante para permitir a entrada no evento.

## Requisitos

    Requisitos funcionais
        O organizador deve poder cadastrar um novo evento;
        O organizador deve poder visualizar dados de um evento;
        O organizador deve poser visualizar a lista de participantes;
        O participante deve poder se inscrever em um evento;
        O participante deve poder visualizar seu crachá de inscrição;
        O participante deve poder realizar check-in no evento;

    Regras de negócio
        O participante só pode se inscrever em um evento uma única vez;
        O participante só pode se inscrever em eventos com vagas disponíveis;
        O participante só pode realizar check-in em um evento uma única vez;

    Requisitos não-funcionais
        O check-in no evento será realizado através de um QRCode;

## Documentação da API (Swagger)
    Para documentação da API, acesse o link: https://nlw-unite-nodejs.onrender.com/docs

## Banco de dados
    Nessa aplicação vamos utilizar banco de dados relacional (SQL). Para ambiente de desenvolvimento seguiremos com o SQLite pela facilidade do ambiente.

## Anotações
    Métodos HTTP:
        GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS, ...

    Corpo da requisição (Request Body)
    Parâmetros de busca (Search Params / Query Params) “http://localhost:3333/users?name=Diego"
    Parâmetros de rota (Route Params) -> Identificação de recursos “DELETE http://locathost:5533/users/5"
    Cabeçalhos (Headers) => Contexto

    Semânticas = Significado

    Driver nativo / Query Builders / QRMs

    Object Relational Mapping (Hibernate / Doctrine / ActiveRecord)

    JSON - Javascript Object Notation

    Status code error:
        20x => Sucesso
        30x => Redirecionamento
        40x => Erro do cliente (Erro em alguma informação enviada por QUEM está fazendo a chamada p/ API)
        50x => Erro do servidor (Um erro que está acontecendo INDEPENDENTE do que está sendo enviado p/ o servidor)

## Run
    npm i tsx -D
    npx tsx src/server.ts
    tsx prisma studio