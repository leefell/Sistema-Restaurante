# Sistema de Gestão para Restaurante

Este é um sistema full-stack para gestão de restaurantes, composto por uma API RESTful para o backend e uma aplicação com Next.js para o frontend.

## Funcionalidades

### Backend (API)
- Autenticação de usuários com JWT (Login/Cadastro).
- Gerenciamento completo (CRUD) de Mesas.
- Gerenciamento completo (CRUD) de Produtos.
- Gerenciamento de Comandas:
  - Abertura e fechamento de comandas.
  - Associação de comandas a mesas.
  - Adição e remoção de produtos em uma comanda.
  - Alteração de status (Aberta, Fechada, Paga, Cancelada).
  - Exclusão lógica (soft delete) para todos os módulos.

### Frontend
- Dashboard principal para visualização de comandas ativas.
- Páginas dedicadas para o gerenciamento de Mesas e Produtos, com tabelas para listagem e ações de criar, editar e remover.
- Formulários para criação e edição de Mesas e Produtos.
- Sistema de criação de comandas com busca de produtos e associação a mesas.
- Edição de comandas para adicionar/remover produtos e alterar status.
- Páginas de Login e Cadastro de usuários.
- Roteamento protegido para garantir que apenas usuários autenticados acessem as áreas de gerenciamento.

## Tecnologias Utilizadas

- **Backend**: Node.js, Express.js, Prisma (ORM), PostgreSQL, JWT para autenticação.
- **Frontend**: Next.js, React, TypeScript, Tailwind CSS, Shadcn/UI.
- **Banco de Dados**: PostgreSQL (gerenciado via Docker Compose).

## Estrutura do Projeto

O projeto é um monorepo dividido em duas pastas principais:

- `/api`: Contém todo o código-fonte do backend, incluindo rotas, controllers, serviços e configurações do Prisma.
- `/frontend`: Contém a aplicação Next.js, com todas as páginas, componentes e hooks.

## Como Executar o Projeto

### Pré-requisitos
- Node.js (v18 ou superior)
- Docker e Docker Compose
- npm, yarn ou pnpm

### 1. Backend (`/api`)

1.  **Navegue até a pasta da API:**
    ```bash
    cd api
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Configure as variáveis de ambiente:**
    Crie um arquivo `.env` na raiz da pasta `/api` e preencha com base no exemplo abaixo.

4.  **Inicie o banco de dados com Docker:**
    Na raiz do projeto, execute:
    ```bash
    docker-compose up -d
    ```

5.  **Execute as migrações do banco de dados:**
    ```bash
    npx prisma migrate dev
    ```

6.  **Inicie o servidor da API:**
    ```bash
    npm run dev
    ```
    O servidor estará rodando em `http://localhost:3001`.

### 2. Frontend (`/frontend`)

1.  **Navegue até a pasta do frontend:**
    ```bash
    cd frontend
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Inicie a aplicação:**
    ```bash
    npm run dev
    ```
    A aplicação estará disponível em `http://localhost:3000`.

## Variáveis de Ambiente (`/api/.env`)

Crie um arquivo `.env` na pasta `/api` com o seguinte conteúdo:

```env
# Porta da API
PORT=3001

# String de conexão do banco de dados PostgreSQL
DATABASE_URL="postgresql://docker:docker@localhost:5432/restaurante?schema=public"

# Chave secreta para geração de tokens JWT
JWT_SECRET="SUA_CHAVE_SECRETA_AQUI"
```

## Rotas da API

<details>
<summary><strong>Clique para expandir a documentação dos endpoints</strong></summary>

A URL base para todas as rotas é `http://localhost:3001`.

### Usuários

-   **`POST /usuarios`**: Cria um novo usuário.
    *   **Corpo da Requisição (JSON):**
        ```json
        {
          "nome": "Nome do Usuario",
          "email": "usuario@email.com",
          "senha": "senha123"
        }
        ```

-   **`POST /usuarios/login`**: Autentica um usuário e retorna um token JWT.
    *   **Corpo da Requisição (JSON):**
        ```json
        {
          "email": "usuario@email.com",
          "senha": "senha123"
        }
        ```

-   **`GET /usuarios/me`**: Retorna os dados do usuário autenticado. (Requer token de autorização `Bearer`).

### Mesas

-   **`GET /mesa`**: Lista todas as mesas.

-   **`POST /mesa`**: Cria uma nova mesa.
    *   **Corpo da Requisição (JSON):**
        ```json
        {
          "numero": 15,
          "descricao": "Mesa perto do bar"
        }
        ```

-   **`PUT /mesa/:id`**: Atualiza uma mesa.
    *   **Corpo da Requisição (JSON):**
        ```json
        {
          "descricao": "Nova descrição"
        }
        ```

-   **`DELETE /mesa/:id`**: Remove (soft delete) uma mesa.

### Produtos

-   **`GET /produto`**: Lista todos os produtos.

-   **`POST /produto`**: Cria um novo produto.
    *   **Corpo da Requisição (JSON):**
        ```json
        {
          "nome": "X-Burger",
          "descricao": "Pão, bife, queijo e salada",
          "quantidade": 100,
          "preco": 25.50
        }
        ```

-   **`PUT /produto/:id`**: Atualiza um produto.
    *   **Corpo da Requisição (JSON):**
        ```json
        {
          "preco": 28.00
        }
        ```

-   **`DELETE /produto/:id`**: Remove (soft delete) um produto.

### Comandas

-   **`GET /comanda`**: Lista todas as comandas.

-   **`POST /comanda`**: Cria uma nova comanda com produtos.
    *   **Corpo da Requisição (JSON):**
        ```json
        {
          "mesaId": 1,
          "observacao": "Sem cebola",
          "produtos": {
            "create": [
              { "produtoId": 1, "quantidade": 2 },
              { "produtoId": 2, "quantidade": 1 }
            ]
          }
        }
        ```

-   **`PUT /comanda/:id`**: Atualiza uma comanda (status, observação ou produtos).
    *   **Corpo da Requisição (JSON):**
        ```json
        {
          "status": "FECHADA",
          "produtos": {
            "deleteMany": {},
            "create": [
              { "produtoId": 1, "quantidade": 1 }
            ]
          }
        }
        ```

-   **`DELETE /comanda/:id`**: Remove (soft delete) uma comanda.

</details>
