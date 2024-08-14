# IF-Safe API

API própria do IF-Safe, parte deste monorepo. Implementa o contrato consumido
pelo app mobile (autenticação JWT, usuários e ocorrências). A especificação
completa está em [`../PROJETO.md`](../PROJETO.md).

## Stack

- **Node.js** + **TypeScript**
- **Express** (HTTP)
- **MongoDB** + **Mongoose** (banco não relacional, como na API original)
- **JWT** (`jsonwebtoken`) + **bcryptjs** (auth)
- **Zod** (validação de body; ignora campos espúrios como o `headers` que o app
  às vezes manda no corpo)

## Arquitetura (Orientada a Objetos)

A API foi escrita em **POO**, em camadas, no contexto da disciplina de Análise
Orientada a Objetos (AOO). Princípios demonstrados:

- **Abstração + Inversão de Dependência (DIP):** cada dependência injetada tem
  uma **interface** (`IUserRepository`, `IOccurrenceRepository`, `IPasswordHasher`,
  `ITokenProvider`, `IAuthService`, `IUserService`, `IOccurrenceService`). As
  camadas dependem das interfaces, não das classes concretas — só o `Container`
  conhece as implementações. Isso permite trocar a implementação (ex.: um
  repositório in-memory para testes) sem tocar nos serviços.
- **Encapsulamento:** providers (`PasswordHasher`, `TokenProvider`) e
  repositórios escondem bcrypt, JWT e Mongoose atrás dessas interfaces.
- **Herança + polimorfismo:** `AppError` (abstrata) → `BadRequestError`,
  `NotFoundError`, `UnauthorizedError`… O `ErrorHandler` trata qualquer
  subclasse lendo `statusCode` sem conhecer o tipo concreto.
- **Composição / Injeção de Dependências:** services recebem repositórios e
  providers pelo construtor; o `Container` (composition root) instancia e injeta
  tudo num único lugar.
- **Separação de responsabilidades:** Controller (HTTP) → Service (regra de
  negócio) → Repository (dados); `Mapper` converte entidade → DTO.

## Como rodar

O banco roda **localmente** num container Docker (não há dependência de banco
remoto). Há dois modos:

### Opção A — Tudo no Docker (1 comando)

Sobe **MongoDB + API** juntos. A pessoa só precisa do Docker instalado; o seed
(admin) roda automaticamente.

```bash
cd api
docker compose --profile full up --build
# API em http://localhost:3333 — usuários e feed de exemplo já criados (ver abaixo)
```

> O `MONGODB_URI` e o `JWT_SECRET` da API em container são definidos no próprio
> `docker-compose.yml` (troque o `JWT_SECRET` para um valor forte).

### Opção B — Mongo no Docker + API no host (hot reload, p/ desenvolvimento)

```bash
cd api
cp .env.example .env        # ajuste JWT_SECRET
docker compose up -d        # sobe SÓ o MongoDB local
yarn install
yarn seed                   # popula usuários + feed de exemplo
yarn dev                    # http://localhost:3333 (recarrega ao salvar)
```

Scripts: `dev` (watch), `build` (tsc), `start` (produção), `typecheck`, `seed`,
`test` / `test:watch` / `test:coverage`.

## Testes (Jest)

Testes unitários com **Jest + ts-jest**, sem banco nem rede. São cobertos os
**services**, o **`AuthMiddleware`** e o **`OccurrenceMapper`**, injetando
**fakes** das interfaces (`FakeUserRepository`, `FakePasswordHasher`,
`FakeTokenProvider`, `FakeOccurrenceRepository` em `src/testing/`). É a Inversão
de Dependência na prática — trocar a implementação real por uma fake sem alterar
o código testado.

```bash
yarn test            # roda os testes uma vez
yarn test:watch      # modo watch
yarn test:coverage   # com relatório de cobertura
```

Convenção: arquivos `*.test.ts` ao lado do código (ex.:
`src/services/AuthService.test.ts`).

### Dados iniciais (seed)

O seed cria usuários e um feed de exemplo (ocorrências com status variados,
comentários e curtidas), para já logar numa "rede" pronta:

| Usuário | Senha | Papel |
|---|---|---|
| `admin@ifsafe.dev` | `admin123` | administrador (pode alterar status) |
| `ana@ifsafe.dev` | `senha123` | usuário |
| `bruno@ifsafe.dev` | `senha123` | usuário |
| `carla@ifsafe.dev` | `senha123` | usuário |

O seed é **idempotente**: garante os usuários e só cria as ocorrências se ainda
não houver nenhuma (restart não duplica nem apaga dados).

> Os dados ficam no volume `ifsafe_mongo_data`. Para **recriar do zero**:
> `docker compose down -v` e suba novamente (no modo Docker o seed roda sozinho;
> no modo host, rode `yarn seed`).

## Estrutura

```
src/
├── server.ts            # bootstrap: new Database().connect() + new App().listen()
├── core/
│   ├── App.ts           # classe App: middlewares, rotas, error handler
│   ├── Container.ts     # composition root (injeção de dependências)
│   └── Database.ts      # classe Database: conexão Mongoose
├── config/env.ts        # configuração via variáveis de ambiente
├── errors/              # AppError (abstrata) + subclasses (hierarquia)
├── providers/           # IPasswordHasher/PasswordHasher, ITokenProvider/TokenProvider
├── models/              # User, Occurrence (comentários embedados, likes por usuário)
├── repositories/        # I*Repository (contratos) + implementações Mongoose
├── services/            # I*Service (contratos) + implementações (negócio)
├── mappers/             # UserMapper, OccurrenceMapper (entidade → DTO)
├── controllers/         # AuthController, UserController, OccurrenceController
├── middlewares/         # AuthMiddleware (ensureAuth/ensureAdmin), ErrorHandler
├── routes/              # AuthRoutes, UserRoutes, OccurrenceRoutes
├── utils/               # asyncHandler
└── seed.ts              # usuário admin de desenvolvimento
```

## Endpoints (contrato do app)

| Método | Rota | Auth | Corpo | Retorno |
|---|---|---|---|---|
| `POST` | `/auth` | não | `{ email, password }` | `{ user, token }` |
| `POST` | `/users` | não | `{ name, email, password }` | usuário criado |
| `PUT` | `/users/:id` | sim | `{ name?, oldpassword?, newpassword?, avatar? }` | usuário atualizado |
| `GET` | `/posts` | sim | — | `OccurrenceCardDTO[]` |
| `GET` | `/posts/:id` | sim | — | `OccurrenceDTO` |
| `POST` | `/posts` | sim | `{ title, description, image, location }` | ocorrência criada |
| `POST` | `/posts/likes/:id` | sim | — | toggle de curtida |
| `POST` | `/posts/comments/:id` | sim | `{ comment }` | comentário criado |
| `PUT` | `/posts/status/:id` | sim (admin) | `{ status, statusComment }` | status atualizado |

Healthcheck em `GET /health`.

### Notas de compatibilidade

- O token é lido **sempre** do header HTTP `Authorization: Bearer <token>`.
- Respostas de erro têm o corpo como **string** (o app lê `response.data`
  diretamente como mensagem).
- `_id` é serializado como string e `likes` como número (contagem).
- `status` usa os rótulos em português: `Pendente`, `Solucionado`, `Cancelado`.
