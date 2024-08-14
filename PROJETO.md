# IF-Safe — Documentação do Projeto

Aplicativo mobile para **registro e acompanhamento de ocorrências** (incidentes de
segurança/infraestrutura) em um campus do IFSP. Os usuários podem abrir ocorrências
com foto e localização, curtir, comentar e — quando administradores — alterar o
status de cada ocorrência (Pendente, Solucionado, Cancelado).

O repositório é um **monorepo** com duas aplicações, ambas executadas localmente:

- [`app/`](./app) — app mobile (Expo / React Native).
- [`api/`](./api) — API própria (Node + TypeScript + Express + **MongoDB/Mongoose**),
  escrita em **arquitetura orientada a objetos** (contexto da disciplina de AOO).

Este documento descreve **como o projeto foi construído**.

---

## 1. Stack

### App (`app/`)

| Camada | Tecnologia |
|---|---|
| Framework | [Expo](https://expo.dev) `~51` + React Native `0.74.3` |
| Linguagem | TypeScript `~5.1` (modo `strict`) |
| UI | [gluestack-ui](https://gluestack.io) (`@gluestack-ui/themed`) + tema próprio em `config/theme` |
| Navegação | React Navigation (native-stack + bottom-tabs) |
| Formulários | React Hook Form + Yup (`@hookform/resolvers`) |
| HTTP | Axios (encapsulado em `ApiClient`) |
| Armazenamento local | `@react-native-async-storage/async-storage` |
| Mídia | `expo-image-picker`, `expo-file-system` |
| Ícones / fontes | `phosphor-react-native`, `@expo-google-fonts/roboto` |
| Gerenciador de pacotes | **Yarn** |

> Alias de import: `@/*` aponta para `app/src/*` (definido em `app/tsconfig.json`).

### API (`api/`)

| Item | Escolha |
|---|---|
| Runtime | Node.js (LTS ≥ 20) |
| Linguagem | TypeScript |
| Framework HTTP | Express |
| Banco | MongoDB (não relacional) |
| ODM | Mongoose |
| Auth | JWT (`jsonwebtoken`) + `bcryptjs` |
| Validação | Zod |
| Execução local | Docker / Docker Compose |

Detalhes de execução e arquitetura da API estão em [`api/README.md`](./api/README.md).

---

## 2. Estrutura de pastas

```
.
├── app/                      # App mobile (Expo / React Native)
│   ├── App.tsx               # Bootstrap: providers, fontes, GluestackUIProvider, Routes
│   ├── app.json              # Configuração Expo (nome, ícones, permissões, plugins)
│   ├── config/               # Tema do gluestack-ui (tokens + estilos por componente)
│   └── src/
│       ├── assets/           # Logo e imagens padrão
│       ├── components/       # Componentes reutilizáveis (Button, Input, Cards, Modais…)
│       ├── contexts/         # Estado global (adaptadores finos que delegam aos serviços)
│       │   ├── AuthContext.tsx       # Sessão: login, cadastro, logout, perfil
│       │   ├── OccurrenceContext.tsx # Feed/CRUD de ocorrências, likes, comentários, status
│       │   └── PhotoContext.tsx      # Seleção de imagens + UI de erro (toast/alert)
│       ├── dtos/             # Tipos de dados vindos da API (UserDTO, OccurrenceDTO…)
│       ├── hooks/            # useAuth, useOccurrence, usePhoto
│       ├── routes/           # auth.routes (deslogado) e app.routes (logado) + switch
│       ├── screens/          # SignIn, SignUp, Home, NewOccurrence, Occurrence, Profile
│       ├── services/         # Camada de serviços (POO) — ver seção 4
│       │   ├── ApiClient.ts          # Encapsula Axios, token e interceptor de erro
│       │   ├── AuthService.ts        # /auth e /users
│       │   ├── OccurrenceService.ts  # /posts
│       │   ├── PhotoService.ts       # seleção/codificação de imagem (base64)
│       │   └── index.ts              # composition root (singletons)
│       ├── storage/          # TokenStorage e UserStorage (classes sobre AsyncStorage)
│       ├── types/            # Enums (status, filtros), tipos de formulário, declarações
│       └── utils/            # AppError, utilidades de data
│
└── api/                      # API (Express + TypeScript + Mongoose, POO) — ver api/README.md
    └── src/
        ├── core/             # App (Express), Container (DI), Database (Mongoose)
        ├── errors/           # AppError (abstrata) + subclasses por status
        ├── providers/        # PasswordHasher, TokenProvider
        ├── models/           # User, Occurrence
        ├── repositories/     # acesso a dados
        ├── services/         # regra de negócio
        ├── mappers/          # entidade → DTO
        ├── controllers/      # camada HTTP
        ├── middlewares/      # AuthMiddleware, ErrorHandler
        └── routes/           # rotas por recurso
```

### Fluxo de navegação (app)

- **Não autenticado** (`auth.routes.tsx`): `SignIn` → `SignUp`.
- **Autenticado** (`app.routes.tsx`, bottom-tabs): `Home` (feed), `NewOccurrence`,
  `Profile`; e a stack interna abre `Occurrence` (detalhe).
- O switch em `src/routes/index.tsx` escolhe entre os dois conjuntos com base na
  presença do usuário em `AuthContext`. Enquanto `isLoadingUserStorageData` é `true`,
  exibe o `Loading`.

### Sessão / autenticação (app)

- Login (`POST /auth`) retorna `{ user, token }`. O token é salvo no AsyncStorage
  (`@ifsafe:authToken`) e o usuário em (`@ifsafe:user`).
- O `ApiClient` injeta o token no header padrão
  (`Authorization: Bearer <token>`), de modo que os serviços não precisam repassá-lo.
- Um interceptor de resposta converte erros da API em `AppError` (mensagem amigável
  exibida em toast).

---

## 3. Contrato da API

Base URL (padrão, local): `http://localhost:3333`
Autenticação: header `Authorization: Bearer <token>` (JWT).

### Modelos de dados (DTOs)

```ts
// UserDTO
{ id: string; name: string; email: string; avatar: string; admin: boolean }

// CommentDTO
{ commentId: string; userId: string; userName: string; comment: string; commentDate: Date }

// OccurrenceCardDTO  (item do feed)
{ _id: string; authorId: string; title: string; image: string;
  likes: number; status: OccurrenceStatusEnum; comments: CommentDTO[]; date: Date }

// OccurrenceDTO  (detalhe = card + extras)
OccurrenceCardDTO & { description: string; authorName: string; location: string }
```

`OccurrenceStatusEnum`: `"Pendente" | "Solucionado" | "Cancelado"`.

### Endpoints

| Método | Rota | Auth | Body | Retorno |
|---|---|---|---|---|
| `POST` | `/auth` | não | `{ email, password }` | `{ user: UserDTO, token }` |
| `POST` | `/users` | não | `{ name, email, password }` | usuário criado |
| `PUT` | `/users/:id` | sim | `{ name?, oldpassword?, newpassword?, avatar? }` | usuário atualizado |
| `GET` | `/posts/` | sim | — | `OccurrenceCardDTO[]` |
| `GET` | `/posts/:id` | sim | — | `OccurrenceDTO` |
| `POST` | `/posts` | sim | `{ title, description, image, location }` | ocorrência criada |
| `POST` | `/posts/likes/:id` | sim | — | toggle de curtida |
| `POST` | `/posts/comments/:id` | sim | `{ comment }` | comentário criado |
| `PUT` | `/posts/status/:id` | sim (admin) | `{ status, statusComment }` | status atualizado |

- `image` e `avatar` trafegam como **string codificada em base64**.
- A alteração de status é **restrita a administradores** (`user.admin`), garantida no
  servidor pelo middleware `ensureAdmin`.
- O servidor lê o token sempre do header HTTP e ignora campos espúrios no corpo.

---

## 4. Arquitetura orientada a objetos

O projeto foi desenvolvido na disciplina de **Análise Orientada a Objetos (AOO)** e a
POO aparece nas duas pontas.

### API (`api/`) — camadas em classes

```
Routes → AuthMiddleware → Controller → Service → Repository → Model (Mongoose)
                              ↑                                     │
                          Mapper (entidade → DTO) ←─────────────────┘
```

- **Abstração + inversão de dependência (DIP):** cada dependência injetada tem uma
  interface (`I*Repository`, `I*Service`, `IPasswordHasher`, `ITokenProvider`); as
  camadas dependem das interfaces e só o `Container` conhece as implementações.
- **Encapsulamento:** `PasswordHasher`/`TokenProvider` escondem bcrypt e JWT; os
  repositórios escondem o Mongoose.
- **Herança + polimorfismo:** `AppError` (abstrata) → `BadRequestError`,
  `NotFoundError`, `UnauthorizedError`, `ForbiddenError`, `ConflictError`; o
  `ErrorHandler` trata qualquer subclasse lendo `statusCode`.
- **Composição / injeção de dependências:** services recebem repositórios e providers
  pelo construtor; o `Container` (composition root) instancia e injeta tudo.

### App (`app/`) — serviços + componentes funcionais

Os componentes e hooks seguem **funcionais** (idiomático no React). A lógica de
negócio e de IO foi extraída para **classes**:

- `ApiClient`, `AuthService`, `OccurrenceService`, `PhotoService` em `src/services/`
  (instanciados/injetados em `services/index.ts`).
- `TokenStorage` e `UserStorage` encapsulam o AsyncStorage.
- Os **Contexts** viram adaptadores finos: seguram estado do React e delegam aos
  serviços.

### Testes (API)

Testes unitários com **Jest + ts-jest**, sem banco nem rede: os services, o
`AuthMiddleware` e o `OccurrenceMapper` são testados injetando *fakes* das
interfaces (`FakeUserRepository`, `FakePasswordHasher`, `FakeTokenProvider`,
`FakeOccurrenceRepository`) — é a Inversão de Dependência na prática. Rode com
`yarn test` (detalhes em [`api/README.md`](./api/README.md)).

---

## 5. Modelagem de dados (Mongoose)

```ts
// User
{
  name: string;
  email: string;        // único, minúsculo
  password: string;     // hash bcrypt
  avatar: string | null;
  admin: boolean;       // default false
  // timestamps (createdAt/updatedAt)
}

// Occurrence
{
  title: string;
  description: string;
  image: string | null;
  location: string;
  status: "Pendente" | "Solucionado" | "Cancelado";   // default "Pendente"
  statusComment: string | null;
  author: ObjectId;                 // ref User
  comments: [                       // subdocumentos embedados
    { author: ObjectId /* ref User */, text: string, createdAt: Date }
  ];
  likes: ObjectId[];                // ref User (1 curtida por usuário)
  // timestamps (createdAt/updatedAt)
}
```

Os `Mapper`s serializam essas entidades para os DTOs do app: mapeiam `id → _id`,
contam `likes` (tamanho do array), montam `comments` no formato `CommentDTO` e mantêm
o `status` com os rótulos em português.

---

## 6. Pontos de atenção

- **Imagens em base64:** funcional, porém pesado; um próximo passo seria evoluir para
  armazenamento de arquivos (ex.: S3/Supabase).
- **Rede no app:** `http://localhost:3333` só funciona em iOS Simulator e Web. Para
  emulador Android use `http://10.0.2.2:3333` e, em celular físico, o IP da máquina —
  configurável via `EXPO_PUBLIC_API_URL` (ver `app/.env.example`).
