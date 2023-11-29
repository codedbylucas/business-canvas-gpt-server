# Criar um Business Canvas a partir das Respostas do Usuário

## Descrição

Esta funcionalidade permite aos usuários responderem às questões relevantes com base no tipo de negócio que possuem. As respostas serão usadas para criar um Business Canvas personalizado.

## Endpoint

`POST /api/business-canvas`

## Cabeçalhos da Requisição

O cabeçalho da requisição pode conter o token de autenticação do usuário para identificar quem está respondendo às perguntas.
O token não é obrigatório, caso o usuário não esteja cadastrado será possível responder as perguntas como convidado.

- **x-access-token** (string): Token de autenticação do usuário.

## Corpo da Requisição

O corpo da requisição deve conter um array de objetos, cada um representando uma resposta a uma pergunta.

Exemplo:

```json
[
  {
    "questionId": "123",
    "answer": "Presencial"
  },
  {
    "questionId": "1234",
    "answer": "Em São Paulo"
  },
  {
    "questionId": "1235",
    "alternativeId": "4567"
  },
  {
    "questionId": "1236",
    "answer": "Somos um restaurante de comida italiana."
  }
]
```

- **questionId** (string): O ID da questão à qual a resposta está relacionada.
- **alternativeId** (string, opcional): O ID da alternativa selecionada se a pergunta tiver alternativas.
- **answer** (string, opcional): A resposta do usuário se a pergunta não tiver alternativas.
- **alternativeId** e **answer** são opcionais, porém um deles deve ser informado obrigatóriamente em cada resposta.

## Caso de sucesso

- ✅ Valida o token de autenticação do usuário.
- ✅ Valida se o ID de cada questão representam uma Question no banco de dados.
- ✅ Valida se a questão que contém alternativas foi preenchida com um ID de alternativa válido.
- ✅ Cria um novo usuário aleatório caso não receba um token de autenticação.
- ✅ Cria um ID para a resposta.
- ✅ Registra as respostas do usuário no DB.
- ✅ Gera um Input para o GPT a partir das respostas dadas pelo usuário.
- ✅ Chama a API do GPT para criar o Business Canvas enviando o input gerado.
- ✅ Cria um ID para o Business Canvas.
- ✅ Adiciona o Business Canvas no DB.
- ✅ Retorna o Business Canvas gerado pelo Chat GPT.

### Resposta

- ✅ Código de status: **201 Created**
- ✅ Corpo da resposta: O Business Canvas gerado pelo GPT.

Exemplo:

```json
{
  "id": "1234",
  "name": "Escola de Inglês",
  "customerSegments": ["Respostas 1.", "Respostas 2."],
  "valuePropositions": ["Respostas 1.", "Respostas 2.", "Respostas 3."],
  "channels": ["Respostas 1."],
  "customerRelationships": ["Respostas 1."],
  "revenueStreams": ["Respostas 1."],
  "keyResources": ["Respostas 1."],
  "keyActivities": ["Respostas 1."],
  "keyPartnerships": ["Respostas 1."],
  "costStructure": ["Respostas 1."]
}
```

- **name** (string): O nome gerado baseado na descrição e tipo de negócio associado ao Business Canvas.
- Os _Componentes_ (**_customerSegments_**, **_valueProposition_**, **_revenueStreams_** ...) representam algumas das seções do Business Canvas.
- Cada seção contém um array de respostas correspondentes.

#### Usuário sem cadastro

- Caso o usuário não esteja cadastrado será retornado junto com as respostas um **userId** como um usuário convidado.

Exemplo:

```json
{
  "userName": "Nome do usuário",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2vy...",
  ... //Dados da resposta
}
```

## Casos de Exceção

### Respostas

- Código de status: **400 Bad Request**
  - ✅ Se algum campo do corpo da requisição estiver ausente ou for inválido.
  - ✅ Se o client informar mais dados do que os requeridos.
  - ✅ Se o tipo do dado informado não for válido.
- Código de status: **401 Unauthorized**
  - ✅ Se o existir um _x-acess-token_ no headers com token inválido ou expirado.
- Código de status: **404 Not Found**
  - ✅ Se não encontrar as questões para as respostas.
- Código de status: **500 Internal Server Error**
  - ✅ Em caso de erro interno no servidor.
