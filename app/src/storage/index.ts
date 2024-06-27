import { TokenStorage } from "./TokenStorage";
import { UserStorage } from "./UserStorage";

// Instâncias compartilhadas (singletons) usadas pelos contexts/serviços.
export const tokenStorage = new TokenStorage();
export const userStorage = new UserStorage();

export { TokenStorage, UserStorage };
