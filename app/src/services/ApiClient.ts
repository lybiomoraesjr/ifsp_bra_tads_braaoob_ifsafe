import axios, { AxiosInstance } from "axios";
import { AppError } from "@/utils/AppError";

/**
 * Encapsula a instância do Axios: URL base, header de autenticação e o
 * interceptor que converte erros da API em `AppError`.
 *
 * O token é mantido no header padrão (`Authorization`), de modo que os serviços
 * não precisam repassá-lo a cada chamada.
 */
export class ApiClient {
  private readonly instance: AxiosInstance;

  constructor(baseURL: string) {
    this.instance = axios.create({ baseURL });
  }

  /** Instância do Axios para uso pelos serviços. */
  get http(): AxiosInstance {
    return this.instance;
  }

  setAuthToken(token: string): void {
    this.instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }

  clearAuthToken(): void {
    delete this.instance.defaults.headers.common["Authorization"];
  }

  /**
   * Instala o interceptor de resposta que normaliza erros em `AppError`.
   * Retorna uma função para removê-lo (eject).
   */
  registerErrorInterceptor(): () => void {
    const interceptorId = this.instance.interceptors.response.use(
      (response) => response,
      (requestError: any) => {
        if (requestError.response && requestError.response.data) {
          return Promise.reject(new AppError(requestError.response.data));
        }
        return Promise.reject(requestError);
      }
    );

    return () => this.instance.interceptors.response.eject(interceptorId);
  }
}
