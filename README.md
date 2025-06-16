# 🚀 E-commerce Challenge - Backend

 API RESTful desenvolvida com **NestJS** como parte do Desafio Técnico da Waving Test.  Este projeto serve como a base de dados e lógica de negócio para uma aplicação de e-commerce.

## 🛠️ Tecnologias Utilizadas

-   **Framework:** [NestJS](https://nestjs.com/) 
-   **ORM:** [Prisma](https://www.prisma.io/) 
-   **Banco de Dados:** [PostgreSQL](https://www.postgresql.org/) (rodando em Docker)
-   **Autenticação:** [JWT](https://jwt.io/) (JSON Web Tokens)
-   **Containerização:** [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/)
-   **Validação:** [Zod](https://zod.dev/) (usado implicitamente pelo `nestjs-zod`)

---

## 🏁 Rodando o Projeto

Para executar o backend, siga os passos abaixo.

### Pré-requisitos
-   [Docker](https://www.docker.com/products/docker-desktop/)
-   [Docker Compose](https://docs.docker.com/compose/install/)

### Guia de Instalação

1.  **Clone o repositório:**
    ```bash
    git clone <URL_DO_SEU_REPOSITORIO_BACKEND>
    cd <PASTA_DO_PROJETO>
    ```

2.  **Configure as variáveis de ambiente:**
    Crie uma cópia do arquivo de exemplo `.env.example` e preencha seu .env.
    ```bash
    cp .env.example .env
    ```

3.  **Inicie os contêineres com Docker Compose:**
    Este comando irá construir a imagem e iniciar os serviços do NestJS e do PostgreSQL em segundo plano.
    ```bash
    docker compose up --build -d
    ```

4.  **Aplique as migrações do banco de dados:**
    ```bash
    docker compose exec app npx prisma migrate dev
    ```

✅ Pronto! A API estará rodando em `http://localhost:3000`.

## 🧠 Decisões de Arquitetura e Boas Práticas

Nesta seção, explico brevemente algumas das decisões técnicas e os princípios de design de software aplicados no desenvolvimento do backend.

* **Arquitetura e SOLID:** A estrutura do projeto foi baseada nos princípios da **Arquitetura Hexagonal** e do **Repository Pattern**. Isso resultou em uma separação clara de responsabilidades, alinhada com os **princípios SOLID**:
    * **Princípio da Responsabilidade Única (S):** Cada classe tem um propósito bem definido. `Controllers` lidam com as requisições HTTP, `Services` contêm a lógica de negócio, e `Repositories` abstraem o acesso aos dados.
    * **Princípio da Inversão de Dependência (D):** Para garantir o desacoplamento, a arquitetura utiliza extensivamente o mecanismo de **Injeção de Dependência (DI)** nativo do NestJS. As camadas de serviço dependem de abstrações (as interfaces/classes abstratas dos repositórios), e não de implementações concretas, permitindo maior flexibilidade e testabilidade.

* **Autenticação Segura:** O sistema de autenticação foi baseado em **JWT**, utilizando um par de `accessToken` (curta duração) e `refreshToken` (longa duração). Essa abordagem melhora a segurança e a experiência do usuário, permitindo que a sessão seja renovada de forma transparente sem exigir um novo login.

* **Consistência do Banco de Dados:** Para operações críticas que envolvem múltiplas escritas no banco — como a finalização de um pedido que requer a criação de `OrderItem`s e a atualização do estoque de `Product`s — utilizei as **transações do Prisma (`$transaction`)**. Isso garante a **atomicidade** da operação: ou todas as etapas são concluídas com sucesso, ou nenhuma é, mantendo a integridade dos dados.

---
