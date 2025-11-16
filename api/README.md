# API - Sistema de Restaurante

Este documento descreve os endpoints disponíveis na API do sistema.

**URL Base:** `http://localhost:3000`

---

## Mesas

### Listar todas as mesas
- **Método:** `GET`
- **Endpoint:** `/mesa`
- **Descrição:** Retorna um array com todas as mesas não removidas.

### Obter uma mesa por ID
- **Método:** `GET`
- **Endpoint:** `/mesa/:id`
- **Descrição:** Retorna os dados de uma mesa específica.

### Criar uma nova mesa
- **Método:** `POST`
- **Endpoint:** `/mesa`
- **Descrição:** Cria uma nova mesa no sistema.
- **Request Body:**
  ```json
  {
    "numero": 10,
    "descricao": "Mesa próxima à janela"
  }
  ```

### Atualizar uma mesa
- **Método:** `PUT`
- **Endpoint:** `/mesa/:id`
- **Descrição:** Atualiza os dados de uma mesa existente.
- **Request Body:**
  ```json
  {
    "numero": 12,
    "descricao": "Mesa na área externa"
  }
  ```

### Remover uma mesa
- **Método:** `DELETE`
- **Endpoint:** `/mesa/:id`
- **Descrição:** Realiza a exclusão lógica da mesa (soft delete).

---

## Produtos

### Listar todos os produtos
- **Método:** `GET`
- **Endpoint:** `/produto`
- **Descrição:** Retorna um array com todos os produtos não removidos.

### Obter um produto por ID
- **Método:** `GET`
- **Endpoint:** `/produto/:id`
- **Descrição:** Retorna os dados de um produto específico.

### Criar um novo produto
- **Método:** `POST`
- **Endpoint:** `/produto`
- **Descrição:** Cria um novo produto no sistema.
- **Request Body:**
  ```json
  {
    "nome": "Pizza de Calabresa",
    "descricao": "Molho de tomate, queijo, calabresa e orégano",
    "quantidade": 50,
    "preco": 49.90
  }
  ```

### Atualizar um produto
- **Método:** `PUT`
- **Endpoint:** `/produto/:id`
- **Descrição:** Atualiza os dados de um produto existente.
- **Request Body:**
  ```json
  {
    "quantidade": 45,
    "preco": 52.00
  }
  ```

### Remover um produto
- **Método:** `DELETE`
- **Endpoint:** `/produto/:id`
- **Descrição:** Realiza a exclusão lógica do produto (soft delete).

---

## Comandas

### Listar todas as comandas
- **Método:** `GET`
- **Endpoint:** `/comanda`
- **Descrição:** Retorna um array com todas as comandas não removidas.

### Listar comandas abertas
- **Método:** `GET`
- **Endpoint:** `/comanda/abertas`
- **Descrição:** Retorna um array com todas as comandas com status `ABERTA`.

### Listar comandas fechadas
- **Método:** `GET`
- **Endpoint:** `/comanda/fechadas`
- **Descrição:** Retorna um array com todas as comandas com status `FECHADA`.

### Listar comandas pagas
- **Método:** `GET`
- **Endpoint:** `/comanda/pagas`
- **Descrição:** Retorna um array com todas as comandas com status `PAGA`.

### Obter uma comanda por ID
- **Método:** `GET`
- **Endpoint:** `/comanda/:id`
- **Descrição:** Retorna os dados de uma comanda específica.

### Listar comandas por mesa
- **Método:** `GET`
- **Endpoint:** `/comanda/mesa/:mesaId`
- **Descrição:** Retorna um array com todas as comandas de uma mesa específica.

### Criar uma nova comanda
- **Método:** `POST`
- **Endpoint:** `/comanda`
- **Descrição:** Cria uma nova comanda, associada a uma mesa. O status inicial será sempre `ABERTA`.
- **Request Body (Exemplo simples):**
  ```json
  {
    "mesaId": 1
  }
  ```
- **Request Body (Exemplo com produtos):**
  ```json
  {
    "mesaId": 1,
    "observacao": "Cliente pediu para não adicionar cebola.",
    "produtos": {
      "create": [
        {
          "produtoId": 1,
          "quantidade": 2
        },
        {
          "produtoId": 2,
          "quantidade": 1
        }
      ]
    }
  }
  ```

### Atualizar uma comanda
- **Método:** `PUT`
- **Endpoint:** `/comanda/:id`
- **Descrição:** Atualiza os dados de uma comanda, como seu status, observações ou a lista de produtos.
- **Request Body (Exemplo para alterar status):**
  ```json
  {
    "status": "FECHADA",
    "observacao": "Conta impressa para o cliente."
  }
  ```
- **Request Body (Exemplo para adicionar novos produtos):**
  ```json
  {
    "produtos": {
      "create": [
        {
          "produtoId": 3,
          "quantidade": 1
        }
      ]
    }
  }
  ```

### Remover uma comanda
- **Método:** `DELETE`
- **Endpoint:** `/comanda/:id`
- **Descrição:** Realiza a exclusão lógica da comanda (soft delete).
