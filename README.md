# Business Canvas Model

## Descrição

O sistema back-end desenvolvido simplifica a elaboração do Business Canvas ao empregar um questionário para extrair informações-chave dos empreendimentos dos usuários. As respostas são direcionadas a um prompt enviado à API do Chat GPT, responsável por gerar um modelo de negócios detalhado e personalizado. Esta abordagem eficiente agiliza significativamente o processo de planejamento estratégico, proporcionando modelos visuais prontos para análise.

## Princípios de Desenvolvimento

API desenvolvida com uma arquitetura desacoplada, favorecendo a flexibilidade e manutenção. A abordagem Test-Driven Development (TDD), assegurou que cada funcionalidade esteja acompanhada por testes desde o início do desenvolvimento, enquanto a adesão aos princípios SOLID e à Clean Architecture promoveu uma estruturação lógica e modular. Além disso, a aplicação criteriosa de Design Patterns contribuiu para soluções eficientes e elegantes, fortalecendo a base da API em termos de qualidade e escalabilidade.

Essa abordagem integral visa não apenas satisfazer os parâmetros técnicos, mas também estabelecer uma base duradoura para futuras expansões e manutenções da API.

## Casos de Usos Construídos

1. [Criar um Business Canvas](./docs/create-business-canvas.md)
2. [Buscar todos os Business Canvas criados pelo usuário](./docs/fetch-all-of-the-user-business-canvas.md)
3. [Buscar apenas um Business Canvas](./docs/fetch-one-of-the-user-business-canvas.md)
4. [Buscar todas as questões que usuário precisará responder](./docs/fetch-questions.md)
5. [Cadastro de usuário](./docs/sign-up.md)
6. [Login de usuário](./docs/login.md)

## Diagramas de Classes

Esses diagramas destacam as principais classes e componentes envolvidos e suas interações, tornando fácil compreender a lógica central do sistema.
Eles também mostram como as tarefas estão divididas em camadas, como a camada de **Presentation**, **Domain**, **Interactions**, **Infra** e **Main** que ajuda a entender quem faz o quê.

Você pode consultá-los em [**Diagrams.drawio**](https://drive.google.com/file/d/1ShExu4dc4RzFXxk5d574lZHIKPaPuZC8/view?usp=sharing)

## Princípios

- Single Responsibility Principle (SRP)
- Open Closed Principle (OCP)
- Liskov Substitution Principle (LSP)
- Interface Segregation Principle (ISP)
- Dependency Inversion Principle (DIP)
- Separation of Concerns (SOC)
- Don't Repeat Yourself (DRY)
- You Aren't Gonna Need It (YAGNI)
- Keep It Simple, Silly (KISS)
- Composition Over Inheritance
- Small Commits

## Design Patterns

- Factory
- Adapter
- Composite
- Decorator
- Proxy
- Dependency Injection
- Composition Root
- Builder
- Singleton

## Metodologias e Designs

- TDD
- Clean Architecture
- DDD
- Conventional Commits
- GitFlow
- Modular Design
- Dependency Diagrams
- Use Cases

## Bibliotecas e Ferramentas

- NPM
- Typescript
- Git
- Jest
- Prisma
- Prismock
- @prisma/client
- Express
- Supertest
- Eslint
- Sucrase
- PG
- Docker
- Mockdate
- Dotenv
- Ioredis
- Ioredis Mock
- Redis Memory Server
- Git Commit Msg Linter
- Rimraf
- Module Alias
- Jsonwebtoken
- Bcrypt
- OpenAi
- Uuid

## Features do Node

- API Rest com Express
- CORS
- Middlewares

## Features do Git

- Alias
- Log Personalizado
- Branch
- Reset
- Tag
- Stash
- Merge

## Features do Typescript

- POO Avançado
- Interface
- TypeAlias
- Utility Types
- Modularização de Paths
- Configurações
- Build

## Features de Testes

- Testes Unitários
- Testes de Integração (API Rest)
- Cobertura de Testes
- Test Doubles
- Mocks
- Stubs
- Spies
- Fakes

## Features do Prisma

- Connect e Reconnect
- Transaction
- Create
- Create Many
- Find Many
- Find Unique

## Pré-requisitos

É imprescindível que você tenha instalado em seu computador o Docker para que possa executar e testar este projeto.

- **Docker** - [https://www.docker.com/get-started/](https://www.docker.com/get-started/)

Todas dependências para rodar o projeto como Node, MongoDB e Redis estão configuradas no docker compose, então não é necessário instalar nada além de que o Docker.

## Variáveis de Ambiente

Você deverá criar um arquivo .env na raiz do projeto. Poderá usar os dados das variáveis a baixo para setar em seu arquivo:

Para conseguir sua **OPENAI_APY_KEY** acesse: [https://platform.openai.com](https://platform.openai.com)

Estas variáveis são para rodar o projeto em um container docker

```m
DATABASE_URL="postgresql://postgres:admin@postgres-db:5432/bcm"
DB_PASSWORD=admin
POSTGRES_USER=postgres
POSTGRES_DB=bcm
DB_PORT=5432
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=
OPENAI_APY_KEY={sua-api-key}
JWT_SECRET_KEY={string-aleatória}
SERVER_PORT=5050
SERVER_HOST=localhost
```

## Instalação e Execução

**Exemplo**:

Clone esse projeto em seu computador:

Já pasta da aplicação em seu terminal, digite o seguinte comando:

```
	npm run up
```

Este comando irá criar a pasta dist com os arquivos do projeto em JavaScript, instalará as dependências, criará o schema para o prisma, subirá os containers docker e iniciará o servidor.

Após isto, abra um novo terminal e digite o seguinte comando:

```
  docker exec -it api-container sh
```

Este comando abrirá um terminal dentro do container 'api-container', após isto execute o seguinte comando:

```
  npm run seed
```

Será inserida as perguntas pré-definidas no DB e replicadas no Redis, assim sempre que forem buscadas será usado os dados em cache para devolver para o client, além de adicionar os componentes do business canvas a sua tabela.

## Instalação e Execução em Modo de Desnvolvimento Localmente

Altere suas váriaveis de ambiente para que seja possível conectar com o Postgres local, será necessário ter um container docker para o Redis, para que seja possível fazer a conexão. Como as Questions são buscadas sempre no redis é impressíndivel que ele esteja rodando.

Execute o seguinte comando para instalar as dependências:

```
  npm install
```

Para criar gerar o DB:

```
  npx prisma db push
```

Para inserir as perguntas pré-definidas no DB e replicadas no Redis, assim sempre que forem buscadas será usado os dados em cache para devolver para o client, além de adicionar os componentes do business canvas a sua tabela.

```
  npm run dev-seed
```

Para iniciar o servidor:

```
  npm run dev
```

## Execução de Testes

Para executar todos os testes do projeto, execute o comando:

```
	npm test
```

Para executar apenas os testes unitários, execute o comando:

```
	npm run test:unit
```

Para executar apenas os testes de integração, execute o comando:

```
	npm run test:integration
```

Para visualizar a cobertura de testes do projeto, execute o comando:

```
	npm run test:ci
```

Para rodar os testes unitários e visualizar os console.log()

```
	npm run test:verbose-unit
```

Para rodar os testes de integração e visualizar os console.log()

```
	npm run test:verbose-integration
```

Para rodar todos os testes e visualizar os console.log()

```
	npm run test:verbose
```

## Autor

- **Lucas Marques** - Desenvolvedor - [Github](https://github.com/codedbylucas) | [Linkedin](https://www.linkedin.com/in/codedbylucas/)
