# visaguas

Uma análise sobre a água na Amazônia Legal

## Pré-requisitos

 - npm v6.14.14
 - node v14.17.4

## Instalação

Clone o repositório

```
$ git clone https://github.com/InfoAmazonia/visaguas.git
```

Instale a aplicação digitando:

```
$ cd visaguas
$ npm install
```

Inicie:

```
$ npm start
```

Para visualizar, acesse [http://127.0.0.1:8000](http://127.0.0.1:8000)

Para definir uma porta diferente da padrão, crie um arquivo `.env` na raiz do módulo com a porta:

```
PORT=8888
```

# RODANDO COM DOCKER
Builda a aplicação:

```
docker-compose build
```

Liga a aplicação

```
docker-compose up (-d para rodar em background e liberar o terminal)
```

Desliga a aplicação

```
docker-compose down
```

Ver logs

```
docker-compose logs -f
```

#PASTA DIST 
A pasta dist (na raiz do projeto) é onde os arquivos são compilados e servidos para acessso via web. Sem ela o site não aparece no navegador (ex:localhost:3000)
Esta é a sequência para gerar a pasta dist com os arquivos na primeira vez que o site é montado:

1. GRUNT BUILD (para gerar todos os arquivos compilados dentro da pasta dist)
obs: Será necessário mover o dist/view/index.html para dist/index.html

Faz o build de toda a aplicação na pasta dist considerando o escopo:
- src: ['**', '!app/**', '!**/*.less', '!**/*.jade', '!**/*.js'],

Entrar no bash do docker:

```
docker-compose exec app bash
```

Liga o grunt em modo watch
```
node_modules/.bin/grunt build
```

1. GRUNT WATCH (executado durante desenvolvimento)
Este comando "escuta" e compila os arquivos em desenvolvimento na pasta dist, conforme eles são alterados e salvos. Sem este comando, alterações feitas nos arquivos não entrarão na pasta dist e não surtirão efeito no site.

escopo: 
- src/views/**/*.jade
- src/css/**/*.less
- src/app/**/*.js

Entrar no bash do docker:

```
docker-compose exec app bash
```

Liga o grunt em modo watch
```
node_modules/.bin/grunt watch
```

Para ver a lista de todos os comandos
```
node_modules/.bin/grunt -h 
```