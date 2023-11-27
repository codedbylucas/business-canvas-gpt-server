# Login de Usuário

## Descrição

Esta funcionalidade permite aos usuários fazerem login em nossa plataforma.

## Endpoint

`POST /api/login`

## Corpo da Requisição

O corpo da requisição deve conter os seguintes campos:

- **email** (string): O endereço de e-mail do usuário.
- **password** (string): A senha do usuário.

Exemplo:

```json
{
  "email": "johndoe@example.com",
  "password": "password123"
}
```

## Caso de sucesso

- ✅ Valida os campos do corpo da requisição.
- ✅ Busca um usuário pelo email.
- ✅ Valida se a senha coincide com a hash salva no DB.
- ✅ Gera um token criptografado a partir do ID do usuário.
- ✅ Retorna um token de autenticação para o usuário logado.

### Resposta

- ✅ Código de status: **200 OK**
- ✅ Corpo da resposta: Um objeto JSON contendo o token de autenticação.

```json
{
  "userName": "Nome do usuário",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2vy..."
}
```

## Casos de Exceção

### Respostas

- Código de status: **400 Bad Request**
  - ✅ Se algum campo do corpo da requisição estiver ausente.
  - ✅ Se o tipo do dado informado não for válido.
  - ✅ Se o client informar mais dados do que os requeridos.
  - ✅ Se o e-mail não for um e-mail válido.
- Código de status: **401 Unauthorized**
  - ✅ Se não for possível encontar um usuário com o e-mail fornecido.
  - ✅ Se a senha não coincidir com a hash salva no DB.
- Código de status: **500 Internal Server Error**
  - ✅ Em caso de erro interno no servidor.
