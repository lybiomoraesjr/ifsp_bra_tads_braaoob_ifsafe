// Augmenta o Request do Express com dados de autenticação preenchidos
// pelos middlewares ensureAuth / ensureAdmin.
declare global {
  namespace Express {
    interface Request {
      userId?: string;
      userAdmin?: boolean;
    }
  }
}

export {};
