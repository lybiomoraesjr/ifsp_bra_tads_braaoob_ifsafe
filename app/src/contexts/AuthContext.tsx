import { ReactNode, createContext, useEffect, useState } from "react";
import { UserDTO } from "@/dtos/UserDTO";
import { apiClient, authService, UpdateProfileData } from "@/services";
import { tokenStorage, userStorage } from "@/storage";

export type AuthContextDataProps = {
  user: UserDTO;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateAccount: (data: UpdateProfileData) => Promise<void>;
  isLoadingUserStorageData: boolean;
};

export const AuthContext = createContext<AuthContextDataProps>(
  {} as AuthContextDataProps
);

type AuthContextProviderProps = {
  children: ReactNode;
};

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const [isLoadingUserStorageData, setIsLoadingUserStorageData] =
    useState(true);
  const [user, setUser] = useState<UserDTO>({} as UserDTO);

  // Aplica a sessão em memória: header de auth + usuário no estado.
  const applySession = (userData: UserDTO, token: string) => {
    apiClient.setAuthToken(token);
    setUser(userData);
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { user: userData, token } = await authService.signIn(
        email,
        password
      );

      if (userData && token) {
        setIsLoadingUserStorageData(true);
        await userStorage.save(userData);
        await tokenStorage.save(token);
        applySession(userData, token);
      }
    } finally {
      setIsLoadingUserStorageData(false);
    }
  };

  const signUp = async (name: string, email: string, password: string) => {
    await authService.signUp(name, email, password);
    await signIn(email, password);
  };

  const signOut = async () => {
    try {
      setIsLoadingUserStorageData(true);
      setUser({} as UserDTO);
      await userStorage.remove();
      await tokenStorage.remove();
      apiClient.clearAuthToken();
    } finally {
      setIsLoadingUserStorageData(false);
    }
  };

  const updateAccount = async (data: UpdateProfileData) => {
    await authService.updateProfile(user.id, data);

    const updated: UserDTO = { ...user };
    if (data.name) updated.name = data.name;
    if (data.avatar) updated.avatar = data.avatar;

    setUser(updated);
    await userStorage.save(updated);
  };

  const loadUserData = async () => {
    try {
      setIsLoadingUserStorageData(true);

      const userLogged = await userStorage.get();
      const token = await tokenStorage.get();

      if (token && userLogged) {
        applySession(userLogged, token);
      }
    } finally {
      setIsLoadingUserStorageData(false);
    }
  };

  useEffect(() => {
    loadUserData();
  }, []);

  useEffect(() => {
    const ejectInterceptor = apiClient.registerErrorInterceptor();
    return () => ejectInterceptor();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        signIn,
        signUp,
        signOut,
        updateAccount,
        isLoadingUserStorageData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
