/**
 * Classe base (abstrata) da hierarquia de erros da aplicação.
 *
 * Cada subclasse define seu próprio `statusCode`. O `ErrorHandler` trata
 * qualquer instância de `AppError` de forma polimórfica, lendo `statusCode` e
 * `message` sem precisar conhecer a subclasse concreta.
 */
export abstract class AppError extends Error {
  public abstract readonly statusCode: number;

  protected constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}
