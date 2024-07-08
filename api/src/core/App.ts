import express, { Express } from "express";
import cors from "cors";
import { Container } from "./Container";

/** Encapsula a aplicação Express: middlewares, rotas e tratamento de erros. */
export class App {
  private readonly app: Express = express();

  constructor(private readonly container: Container = new Container()) {
    this.setupMiddlewares();
    this.setupRoutes();
    this.setupErrorHandling();
  }

  private setupMiddlewares(): void {
    this.app.use(cors());
    // Limite alto porque imagens/avatares trafegam como base64 no corpo.
    this.app.use(express.json({ limit: "10mb" }));
  }

  private setupRoutes(): void {
    this.app.get("/health", (_req, res) => res.json({ status: "ok" }));
    this.app.use("/auth", this.container.authRoutes.router);
    this.app.use("/users", this.container.userRoutes.router);
    this.app.use("/posts", this.container.occurrenceRoutes.router);
  }

  private setupErrorHandling(): void {
    this.app.use(this.container.errorHandler.handle);
  }

  /** Instância do Express (útil para testes). */
  get instance(): Express {
    return this.app;
  }

  listen(port: number): void {
    this.app.listen(port, () => {
      console.log(`🚀 API rodando em http://localhost:${port}`);
    });
  }
}
