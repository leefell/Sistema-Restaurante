# Sistema de Gestão para Restaurante

Este é um sistema full-stack para gestão de restaurantes, composto por uma API RESTful para o backend e uma aplicação com Next.js para o frontend.

## Funcionalidades

### Backend (API)
- Autenticação de usuários baseada em JWT.
- Gerenciamento completo (CRUD) de Mesas, Produtos e Usuários.
- Gerenciamento de Comandas com controle de status (Aberta, Fechada, Paga, Cancelada).
- Exclusão lógica (soft delete) implementada em todos os módulos principais.

### Frontend
- Dashboard para visualização e gerenciamento de comandas.
- Seções dedicadas para o CRUD de Mesas e Produtos.
- Formulários para criação e edição de todas as entidades.
- Páginas de login e cadastro de usuários com rotas protegidas.

## Tecnologias Utilizadas

- **Backend**: Node.js, Express.js, Prisma (ORM), PostgreSQL, JWT.
- **Frontend**: Next.js, React, TypeScript, Tailwind CSS, Shadcn/UI.
- **Banco de Dados**: PostgreSQL, gerenciado via Docker Compose.
- **Ferramentas**: Nodemon, ESLint, TypeScript.

## Pré-requisitos

- Node.js (versão 18 ou superior)
- Docker e Docker Compose
- Um gerenciador de pacotes (npm, yarn, ou pnpm)

## Executando Localmente (Sem Docker)

Siga os passos abaixo para configurar e executar o ambiente de desenvolvimento local sem usar Docker para toda a aplicação.

### 1. Iniciar o Banco de Dados (Docker)

O banco de dados PostgreSQL é gerenciado pelo Docker. Para iniciá-lo, execute o seguinte comando a partir da raiz do projeto:

```bash
docker-compose up -d postgres
```
Este comando irá criar e iniciar apenas o container do banco de dados em segundo plano.

### 2. Configurar o Backend (`/api`)

1.  **Navegue até o diretório da API:**
    ```bash
    cd api
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Configure as variáveis de ambiente:**
    Crie um arquivo chamado `.env` na raiz do diretório `/api` e adicione o seguinte conteúdo. Este arquivo é necessário para que a aplicação se conecte ao banco de dados e defina o segredo do JWT.

    ```env
    # String de conexão do banco de dados PostgreSQL
    DATABASE_URL="postgresql://postgres:postgres@localhost:5432/restaurante?schema=public"

    # Chave secreta para geração de tokens JWT
    JWT_SECRET="seu-segredo-jwt-aqui"
    ```

4.  **Execute as migrações do banco de dados:**
    Este comando aplica o schema de banco de dados definido no Prisma.
    ```bash
    npx prisma migrate dev
    ```

5.  **Gere o cliente Prisma:**
    Este comando gera o cliente Prisma com base no seu schema para ser usado na aplicação.
    ```bash
    npx prisma generate
    ```

6.  **Inicie o servidor da API:**
    ```bash
    npm run dev
    ```
    O servidor do backend estará em execução no endereço `http://localhost:3001`.

### 3. Configurar o Frontend (`/frontend`)

1.  **Em um novo terminal, navegue até o diretório do frontend:**
    ```bash
    cd frontend
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Inicie a aplicação Next.js:**
    ```bash
    npm run dev
    ```
    A aplicação frontend estará disponível no endereço `http://localhost:3000`.

## Executando com Docker Compose (Todos os Serviços)

Para executar toda a aplicação (frontend, backend, banco de dados e Adminer) usando Docker Compose, siga os passos abaixo. Certifique-se de que o Docker e o Docker Compose estão instalados e em execução.

1.  **Construir e Iniciar os Serviços:**
    A partir da raiz do projeto, execute o comando para construir as imagens (se ainda não existirem ou se houver mudanças nos Dockerfiles) e iniciar todos os serviços em segundo plano:

    ```bash
    docker-compose up -d --build
    ```
    Isso irá:
    *   Construir a imagem Docker para o backend (`api`).
    *   Construir a imagem Docker para o frontend (`frontend`).
    *   Puxar a imagem do PostgreSQL (`postgres`).
    *   Puxar a imagem do Adminer (`adminer`).
    *   Criar e iniciar os containers para todos os serviços.

2.  **Acessando a Aplicação:**
    Após os containers estarem em execução, você pode acessar:
    *   **Frontend:** `http://localhost:3000`
    *   **Backend (API):** `http://localhost:3001`
    *   **Adminer (Gerenciador de Banco de Dados):** `http://localhost:8080`
        *   **Sistema:** PostgreSQL
        *   **Servidor:** `postgres` (este é o nome do serviço no `docker-compose.yml`)
        *   **Usuário:** `postgres`
        *   **Senha:** `postgres`
        *   **Banco de Dados:** `restaurante`

3.  **Visualizando Logs:**
    Para ver os logs de todos os serviços em tempo real:
    ```bash
    docker-compose logs -f
    ```
    Para ver os logs de um serviço específico (ex: `api`):
    ```bash
    docker-compose logs -f api
    ```

4.  **Parando os Serviços:**
    Para parar e remover os containers, redes e volumes criados pelo `docker-compose`:
    ```bash
    docker-compose down -v
    ```
    O `-v` é importante para remover os volumes de dados do PostgreSQL, garantindo um ambiente limpo se você precisar reiniciar do zero. Se você quiser apenas parar os serviços sem remover os volumes (mantendo seus dados), use:
    ```bash
    docker-compose down
    ```

5.  **Reconstruir Imagens (se necessário):**
    Se você fez alterações nos Dockerfiles do `frontend` ou `api`, ou se deseja garantir que as imagens estejam atualizadas, você pode reconstruí-las antes de iniciar:
    ```bash
    docker-compose build
    ```
    E então iniciar:
    ```bash
    docker-compose up -d
    ```
