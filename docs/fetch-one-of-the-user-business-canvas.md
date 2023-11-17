# Busca de Business Canvas por ID

## Descrição

Esta funcionalidade permite aos usuários recuperarem informações detalhadas de um Business Canvas específico com base no ID do Business Canvas.

## Endpoint

`GET /api/business-canvas/:id`

## Parâmetros da Requisição

- **id** (string): O ID único do Business Canvas que o usuário deseja visualizar.

## Cabeçalhos da Requisição

O cabeçalho da requisição deve conter o token de autenticação do usuário para identificar quem está realizando a busca.

- **x-access-token** (string): Token de autenticação do usuário.

## Caso de sucesso

- ❌ Valida o token de autenticação do usuário.
- ❌ Busca no DB as informações do Business Canvas pelo ID do usuário e o ID do Business Canvas.

### Resposta

- ❌ Código de status: **200 OK**
- ❌ Corpo da resposta: Um objeto JSON contendo as informações detalhadas do Business Canvas.

Exemplo:

```json
{
  "customerSegments": [
    "Respostas 1.",
    "Respostas 2."
  ],
  "valuePropositions": [
    "Respostas 1.",
    "Respostas 2.",
    "Respostas 3."
  ],
  "channels": [
    "Respostas 1."
  ],
  "customerRelationships": [
    "Respostas 1."
  ],
  "revenueStreams": [
    "Respostas 1."
  ],
  "keyResources": [
    "Respostas 1."
  ],
  "keyActivities": [
    "Respostas 1."
  ],
  "keyPartnerships": [
    "Respostas 1."
  ],
  "costStructure": [
    "Respostas 1."
  ]
}
```

- Os **componentes** (***costStructure***, ***keyPartnerships***, ***keyActivities***) representam as seções do Business Canvas.
- Cada seção contém um array de respostas correspondentes.

## Casos de Exceção

### Respostas
- Código de status: **400 Bad Request**
  - ❌ Se o ID do Business Canvas informado não for um UUID.
- Código de status: **401 Unauthorized**
  - ❌ Se o cabeçalho de autorização estiver ausente ou inválido.
  - ❌ Se o token de autenticação for inválido ou expirado.
  - ❌ Se o usuário não estiver autenticado na plataforma.
- Código de status: **404 Not Found**
  - ❌ Se o Business Canvas com o ID especificado não for encontrado.
- Código de status: **500 Internal Server Error**
  - ❌ Em caso de erro interno no servidor.
