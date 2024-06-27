import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserDTO } from "@/dtos/UserDTO";
import { USER_STORAGE } from "./storageConfig";

/** Encapsula a persistência do usuário logado no AsyncStorage. */
export class UserStorage {
  async save(user: UserDTO): Promise<void> {
    await AsyncStorage.setItem(USER_STORAGE, JSON.stringify(user));
  }

  async get(): Promise<UserDTO | null> {
    const raw = await AsyncStorage.getItem(USER_STORAGE);
    return raw ? (JSON.parse(raw) as UserDTO) : null;
  }

  async remove(): Promise<void> {
    await AsyncStorage.removeItem(USER_STORAGE);
  }
}
