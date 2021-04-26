# visaguas

Uma análise sobre a água na Amazônia Legal

## Pré-requisitos

 - npm 1.4.x
 - node 0.10.x

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

# COMPILAÇÃO / WATCH
Este comando compila os arquivos .jade dentro da pasta dist. Pode ser necessário mover o dist/view/index.html para dist/index.html

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