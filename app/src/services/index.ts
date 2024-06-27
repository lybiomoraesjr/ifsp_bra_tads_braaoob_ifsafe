import { ApiClient } from "./ApiClient";
import { AuthService } from "./AuthService";
import { OccurrenceService } from "./OccurrenceService";
import { PhotoService } from "./PhotoService";

// URL base da API. Por padrão aponta para a API LOCAL (http://localhost:3333).
// Para emulador Android, celular físico, etc., defina EXPO_PUBLIC_API_URL no
// arquivo app/.env (veja app/.env.example).
const BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3333";

// Composition root do app: instancia e injeta as dependências (singletons).
export const apiClient = new ApiClient(BASE_URL);
export const authService = new AuthService(apiClient);
export const occurrenceService = new OccurrenceService(apiClient);
export const photoService = new PhotoService();

export type { SignInResponse, UpdateProfileData } from "./AuthService";
export type { CreateOccurrenceData } from "./OccurrenceService";
export { PhotoPermissionError, PhotoTooLargeError } from "./PhotoService";
export { ApiClient, AuthService, OccurrenceService, PhotoService };
