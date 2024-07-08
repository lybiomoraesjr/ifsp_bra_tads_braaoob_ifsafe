import { App } from "./core/App";
import { Database } from "./core/Database";
import { env } from "./config/env";

async function bootstrap() {
  const database = new Database(env.mongoUri);
  await database.connect();

  const app = new App();
  app.listen(env.port);
}

bootstrap().catch((error) => {
  console.error("Falha ao iniciar a API:", error);
  process.exit(1);
});
