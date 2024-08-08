import { AuthService } from "./AuthService";
import { UnauthorizedError } from "../errors";
import {
  FakePasswordHasher,
  FakeTokenProvider,
  FakeUserRepository,
  makeUser,
} from "../testing/fakes";

describe("AuthService", () => {
  const buildService = (users = new FakeUserRepository()) =>
    new AuthService(users, new FakePasswordHasher(), new FakeTokenProvider());

  it("autentica com credenciais válidas e retorna usuário + token", async () => {
    const user = makeUser({
      name: "Ana Souza",
      email: "ana@ifsafe.dev",
      password: "hashed:senha123", // como o FakePasswordHasher "hasheia"
    });
    const service = buildService(new FakeUserRepository([user]));

    const result = await service.login("ana@ifsafe.dev", "senha123");

    expect(result.user).toEqual({
      id: user._id.toString(),
      name: "Ana Souza",
      email: "ana@ifsafe.dev",
      avatar: "",
      admin: false,
    });
    expect(result.token).toBe(`token-for-${user._id.toString()}`);
  });

  it("rejeita quando o e-mail não existe", async () => {
    const service = buildService();

    await expect(service.login("naoexiste@ifsafe.dev", "x")).rejects.toThrow(
      UnauthorizedError
    );
  });

  it("rejeita quando a senha está incorreta", async () => {
    const user = makeUser({
      email: "ana@ifsafe.dev",
      password: "hashed:senha123",
    });
    const service = buildService(new FakeUserRepository([user]));

    await expect(
      service.login("ana@ifsafe.dev", "senha-errada")
    ).rejects.toThrow(UnauthorizedError);
  });
});
