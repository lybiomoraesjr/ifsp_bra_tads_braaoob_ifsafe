import AsyncStorage from "@react-native-async-storage/async-storage";
import { AUTH_TOKEN_STORAGE } from "./storageConfig";

/** Encapsula a persistência do token de autenticação no AsyncStorage. */
export class TokenStorage {
  async save(token: string): Promise<void> {
    await AsyncStorage.setItem(AUTH_TOKEN_STORAGE, token);
  }

  async get(): Promise<string | null> {
    return AsyncStorage.getItem(AUTH_TOKEN_STORAGE);
  }

  async remove(): Promise<void> {
    await AsyncStorage.removeItem(AUTH_TOKEN_STORAGE);
  }
}
