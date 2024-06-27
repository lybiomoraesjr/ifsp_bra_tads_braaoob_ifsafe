import { UserDTO } from "@/dtos/UserDTO";
import { ApiClient } from "./ApiClient";

export interface SignInResponse {
  user: UserDTO;
  token: string;
}

export interface UpdateProfileData {
  name?: string;
  oldpassword?: string;
  newpassword?: string;
  avatar?: string;
}

/** Operações de autenticação e conta (endpoints /auth e /users). */
export class AuthService {
  constructor(private readonly api: ApiClient) {}

  async signIn(email: string, password: string): Promise<SignInResponse> {
    const { data } = await this.api.http.post<SignInResponse>("/auth", {
      email,
      password,
    });
    return data;
  }

  async signUp(name: string, email: string, password: string): Promise<void> {
    await this.api.http.post("/users", { name, email, password });
  }

  async updateProfile(userId: string, data: UpdateProfileData): Promise<void> {
    await this.api.http.put(`/users/${userId}`, data);
  }
}
