/** Contrato para emissão/verificação de tokens de autenticação. */
export interface ITokenProvider {
  sign(userId: string): string;
  /** Retorna o id do usuário (subject) ou lança em caso de token inválido. */
  verify(token: string): string;
}
