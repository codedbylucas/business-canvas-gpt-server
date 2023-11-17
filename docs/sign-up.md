# Cadastro de Usuário

## Descrição

Esta funcionalidade permite aos usuários se cadastrarem em nossa plataforma.

## Endpoint

`POST /api/signup`

## Corpo da Requisição

O corpo da requisição deve conter os seguintes campos:

- **name** (string): O nome do usuário.
- **email** (string): O endereço de e-mail do usuário.
- **password** (string): A senha do usuário.
- **passwordConfirmation** (string): A confirmação da senha do usuário.

Exemplo:

```json
{
  "name": "John",
  "email": "john@example.com",
  "password": "password123",
  "passwordConfirmation": "password123"
}
```

## Caso de sucesso
- ✅ Valida os campos do corpo da requisição.
- ✅ Valida se já existe um usuário com o email fornecido.
- ✅ Gera uma senha criptografada.
- ✅ Gera um ID para o usuário.
- ✅ Gera um token criptografado a partir do ID do usuário.
- ✅ Cria uma conta de usuário.
- ✅ Retorna um token de autenticação para o novo usuário.

### Resposta
- ✅ Código de status: **201 Created**
- ✅ Corpo da resposta: Um objeto JSON contendo o token de autenticação.

Exemplo:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2Vy... (token JWT)"
}
```

## Casos de Exceção

### Respostas
- Código de status: **400 Bad Request**
  - ✅ Se algum campo do corpo da requisição estiver ausente ou for inválido.
  - ✅ Se a senha e a confirmação de senha não coincidirem.
  - ✅ Se o endereço de e-mail já estiver em uso por outro usuário.
  - ✅ Se o client informar mais dados do que os requeridos.
  - ✅ Se o tipo do dado informado não for válido.
- Código de status: **500 Internal Server Error**
  - ✅ Em caso de erro interno no servidor.