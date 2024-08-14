# IF-Safe 📱

Aplicativo mobile (Expo / React Native) para **registro e acompanhamento de
ocorrências** em um campus do IFSP — abertura de ocorrências com foto e localização,
feed, curtidas, comentários e gestão de status por administradores.

Este repositório é um **monorepo** com duas partes:

- [`app/`](./app) — o app mobile (Expo / React Native).
- [`api/`](./api) — a API própria (Node + TypeScript + Express + **MongoDB/Mongoose**),
  escrita em arquitetura orientada a objetos. Veja [`api/README.md`](./api/README.md).

> 📄 Para a arquitetura completa e o contrato da API, veja [`PROJETO.md`](./PROJETO.md).

---

## 🎓 Projeto acadêmico

Projeto desenvolvido por alunos do **IFSP — Câmpus Bragança Paulista (BRA)** no curso
de **Tecnologia em Análise e Desenvolvimento de Sistemas (TADS)**, na disciplina de
**Análise Orientada a Objetos (AOO)**.

- **Instituição:** Instituto Federal de São Paulo (IFSP) — Câmpus Bragança Paulista
- **Curso:** Tecnologia em Análise e Desenvolvimento de Sistemas
- **Disciplina:** Análise Orientada a Objetos (AOO)
- **Professora:** Ana Paula Muller Giancoli

### Integrantes

| Aluno | Prontuário |
|---|---|
| Inácio Fernandes Santana | BP3039307 |
| Lybio Croton de Moraes Junior | BP303934X |
| Thales Miranda dos Santos | BP3039668 |

---

## ✨ Destaques técnicos

- **Monorepo** com app mobile (`app/`) e API própria (`api/`), 100% executável localmente.
- **API orientada a objetos** em camadas (Controller → Service → Repository), com
  **interfaces** em todas as dependências injetadas (Inversão de Dependência) e uma
  hierarquia de erros polimórfica.
- **Testes unitários** (Jest + ts-jest) dos serviços e middlewares via injeção de
  *fakes* — sem banco nem rede.
- **MongoDB + API sobem com um comando** (Docker Compose), com seed de um feed de
  exemplo (usuários, ocorrências, comentários e curtidas).
- **App** com camada de serviços em classes e componentes/hooks idiomáticos do React.

---

## Pré-requisitos

- **Node.js** LTS (≥ 18; recomendado 20)
- **Yarn** (gerenciador de pacotes usado neste projeto)
- **Docker** (para rodar o backend — MongoDB + API — localmente)
- **Expo Go** instalado no celular (Android/iOS) — ou um emulador Android / simulador iOS
- App do Expo: <https://expo.dev/go>

---

## Como rodar

O projeto roda inteiramente na sua máquina: o **backend** (MongoDB + API) sobe via
Docker e o **app** roda no host com o Expo.

### 1. Backend (MongoDB + API)

```bash
cd api
docker compose --profile full up --build   # sobe Mongo + API em http://localhost:3333
```

Detalhes, modos alternativos e credenciais do admin estão em
[`api/README.md`](./api/README.md).

### 2. App (mobile)

```bash
cd app
yarn          # instala as dependências
yarn start    # inicia o bundler do Expo (Metro)
```

Ao rodar `yarn start`, o Expo abre um painel no terminal com um **QR Code**:

- **Celular físico:** abra o app **Expo Go** e escaneie o QR Code
  (Android: pelo próprio app; iOS: pela câmera).
- **Android (emulador):** pressione `a` no terminal.
- **iOS (simulador, somente macOS):** pressione `i` no terminal.
- **Web:** pressione `w` no terminal.

> O celular e o computador precisam estar na **mesma rede Wi-Fi**. Em redes restritas,
> rode em modo túnel: `yarn start --tunnel`.

---

## Scripts disponíveis (app)

> Rode dentro da pasta `app/`.

| Comando | Descrição |
|---|---|
| `yarn start` | Inicia o bundler do Expo (escolha a plataforma pelo terminal) |
| `yarn android` | Abre direto no emulador/dispositivo Android |
| `yarn ios` | Abre direto no simulador iOS (macOS) |
| `yarn web` | Abre a versão web |

---

## Configuração da API

O app consome a **API local** por padrão. A `baseURL` é definida em
[`app/src/services/index.ts`](./app/src/services/index.ts) e aponta para
`http://localhost:3333`, podendo ser sobrescrita pela variável de ambiente
`EXPO_PUBLIC_API_URL`:

```bash
# app/.env  (copie de app/.env.example) — variáveis EXPO_PUBLIC_* vão para o app
EXPO_PUBLIC_API_URL=http://localhost:3333
```

Ajuste a URL conforme onde o app roda — `localhost` só vale para iOS Simulator e Web:

| Ambiente | URL |
|---|---|
| iOS Simulator / Web | `http://localhost:3333` |
| Emulador Android (AVD) | `http://10.0.2.2:3333` |
| Celular físico (Expo Go) | `http://<IP-DA-MÁQUINA>:3333` (ex.: `http://192.168.0.10:3333`) |

> Lembre de subir o backend antes (veja [Como rodar](#como-rodar)).

Consulte [`PROJETO.md`](./PROJETO.md) para o contrato completo dos endpoints.

---

## Stack principal

Expo SDK 51 · React Native 0.74 · TypeScript · gluestack-ui · React Navigation ·
React Hook Form + Yup · Axios · AsyncStorage.

---

## Estrutura resumida

```
.
├── app/                     # App mobile (Expo / React Native)
│   ├── App.tsx              # Providers, fontes e navegação
│   ├── config/              # Tema do gluestack-ui
│   └── src/
│       ├── components/      # Componentes reutilizáveis
│       ├── contexts/        # Estado global (Auth, Occurrence, Photo)
│       ├── dtos/ types/     # Tipos de dados e enums
│       ├── hooks/           # useAuth, useOccurrence, usePhoto
│       ├── routes/          # Navegação (auth vs app)
│       ├── screens/         # Telas (SignIn, Home, Profile, …)
│       ├── services/        # Camada de serviços (ApiClient, Auth/Occurrence/Photo)
│       └── storage/         # TokenStorage e UserStorage (AsyncStorage)
└── api/                     # API (Express + TypeScript + Mongoose, OOP)
```

Detalhes da API (arquitetura, endpoints, testes, Docker) em
[`api/README.md`](./api/README.md).

---

## Solução de problemas

- **QR Code não conecta:** garanta a mesma rede Wi-Fi ou use `yarn start --tunnel`.
- **Erros estranhos de bundle:** limpe o cache com `yarn start --clear`.
- **Dependências quebradas:** apague `node_modules` e rode `yarn` novamente.
- **Versões incompatíveis com o SDK:** rode `npx expo install --check`.
