# Middleware de Autenticação

## Descrição

Este middleware é responsável por autenticar os usuários por meio do token presente no cabeçalho da requisição. Ele descriptografa o token e adiciona o ID do usuário ao cabeçalho da requisição para posterior processamento.

## Funcionamento

O middleware verifica a presença do token de autenticação no cabeçalho da requisição em "x-access-token". Se o token estiver presente, ele será descriptografado para obter as informações do usuário. Em seguida, o ID do usuário é adicionado ao cabeçalho da requisição em "userId" para ser utilizado nas rotas subsequentes.

## Uso

Este middleware é usado antes das rotas que requerem autenticação. Ele adiciona informações do usuário ao cabeçalho da requisição, permitindo que as rotas subsequentes acessem o ID do usuário para autorização e processamento.


### Cabeçalho de Requisição

`GET /api/rota-protegida`

O cabeçalho da requisição deve conter o token de autenticação do usuário para identificar quem está realizando a busca.

### Headers:

- **x-access-token** (string): Token de autenticação do usuário.

## Caso de sucesso
- Descriptografa o token.
- Busca no DB se existe um usuário com o ID que estava no token.
- Adiciona na requisição um objeto com o ID do usuário.
- Continua o fluxo da requisição.

### Resposta
- ✅ Código de status: **200 Ok**
- ✅ Corpo da resposta: Um objeto com o ID do usuário.

Exemplo:

```json
{
  "userId": "any_user_id"
}
```


## Middleware Processado

Após o middleware ser executado, o cabeçalho de requisição será modificado da seguinte forma:

`GET /api/rota-protegida`

### Headers:
- **x-access-token** (string): Token de autenticação do usuário.
- **userId** (string): Id do usuário que estava criptografado no Token.


## Casos de Exceção
- Código de status: **401 Unauthorized**
  - ✅ Se o cabeçalho de autorização estiver ausente ou inválido.
  - ✅ Se o token de autenticação for inválido ou expirado.
- Código de status: **403 Forbidden**
  - ✅ Se o usuário não tiver permissão de acessar a rota protegida.
- Código de status: **500 Internal Server Error**
  - ✅ Em caso de erro interno no servidor.
