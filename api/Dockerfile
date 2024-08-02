# Imagem da API IFSafe
FROM node:20-alpine

WORKDIR /app

# Instala dependências primeiro (aproveita cache de camada)
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copia o código e compila o TypeScript
COPY tsconfig.json tsconfig.build.json ./
COPY src ./src
RUN yarn build

EXPOSE 3333

# Cria o admin (idempotente) e sobe a API.
# bcryptjs e mongoose são JS puro, então não precisa de build nativo.
CMD ["sh", "-c", "node dist/seed.js && node dist/server.js"]
