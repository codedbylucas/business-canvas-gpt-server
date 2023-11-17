# Buscar Todos os Business Canvas do Usuário

## Descrição

Esta funcionalidade permite aos usuários recuperarem todos os seus Business Canvas criados anteriormente. Cada Business Canvas pode estar associado a um tipo de negócio específico.

## Endpoint

`GET /api/business-canvas`

## Cabeçalhos da Requisição

O cabeçalho da requisição deve conter o token de autenticação do usuário para identificar quem está realizando a busca.

- **x-access-token** (string): Token de autenticação do usuário.

## Caso de sucesso

- ❌ Valida o token de autenticação do usuário.
- ❌ Busca todos os Business Canvas do usuário.

### Resposta

- ❌ Código de status: **200 OK**
- ❌ Corpo da resposta: Um objeto JSON contendo os Business Canvas do usuário.

Exemplo:

```json
{
  "businessCanvas": [
    {
      "id": "123",
      "name": "Barbearia em São Paulo",
      "createdAt": "2023-11-06"
    },
    {
      "id": "124",
      "name": "Loja Virtual de Roupas",
      "createdAt": "2023-11-07"
    }
  ]
}
```

- **id** (string): O ID único do Business Canvas.
- **name** (string): O nome do tipo de negócio associado ao Business Canvas.
- **createdAt** (string): A data de criação do Business Canvas.


## Casos de Exceção

### Respostas

- Código de status: **401 Unauthorized**
  - ❌ Se o cabeçalho de autorização estiver ausente ou inválido.
  - ❌ Se o token de autenticação for inválido ou expirado.
  - ❌ Se o usuário não estiver autenticado na plataforma.
- Código de status: **404 Not Found**
  - ❌ Se não encontrar nenhum Business Canvas do usuário.
- Código de status: **500 Internal Server Error**
  - ❌ Em caso de erro interno no servidor.