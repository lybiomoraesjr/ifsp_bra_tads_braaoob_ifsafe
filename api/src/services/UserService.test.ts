import { UserService } from "./UserService";
import {
  BadRequestError,
  ConflictError,
  ForbiddenError,
  NotFoundError,
} from "../errors";
import {
  FakePasswordHasher,
  FakeUserRepository,
  makeUser,
} from "../testing/fakes";

describe("UserService", () => {
  const buildService = (users = new FakeUserRepository()) =>
    new UserService(users, new FakePasswordHasher());

  describe("create", () => {
    it("cria o usuário e retorna o DTO (admin=false), com senha hasheada", async () => {
      const repo = new FakeUserRepository();
      const service = buildService(repo);

      const dto = await service.create({
        name: "Ana Souza",
        email: "ana@ifsafe.dev",
        password: "senha123",
      });

      expect(dto).toMatchObject({
        name: "Ana Souza",
        email: "ana@ifsafe.dev",
        admin: false,
      });
      expect(dto).not.toHaveProperty("password");

      const stored = await repo.findByEmail("ana@ifsafe.dev");
      expect(stored?.password).toBe("hashed:senha123");
    });

    it("rejeita e-mail duplicado com ConflictError", async () => {
      const repo = new FakeUserRepository([makeUser({ email: "ana@ifsafe.dev" })]);
      const service = buildService(repo);

      await expect(
        service.create({
          name: "Ana",
          email: "ana@ifsafe.dev",
          password: "senha123",
        })
      ).rejects.toThrow(ConflictError);
    });
  });

  describe("update", () => {
    it("impede editar perfil de outro usuário (ForbiddenError)", async () => {
      const user = makeUser();
      const service = buildService(new FakeUserRepository([user]));

      await expect(
        service.update(user._id.toString(), "outro-id", { name: "X" })
      ).rejects.toThrow(ForbiddenError);
    });

    it("lança NotFoundError quando o usuário não existe", async () => {
      const service = buildService(new FakeUserRepository());

      await expect(
        service.update("mesmo-id", "mesmo-id", { name: "X" })
      ).rejects.toThrow(NotFoundError);
    });

    it("atualiza o nome", async () => {
      const user = makeUser({ name: "Ana", email: "ana@ifsafe.dev" });
      const id = user._id.toString();
      const service = buildService(new FakeUserRepository([user]));

      const dto = await service.update(id, id, { name: "Ana Souza" });

      expect(dto.name).toBe("Ana Souza");
    });

    it("rejeita nova senha curta (BadRequestError)", async () => {
      const user = makeUser({ password: "hashed:antiga" });
      const id = user._id.toString();
      const service = buildService(new FakeUserRepository([user]));

      await expect(
        service.update(id, id, { oldpassword: "antiga", newpassword: "123" })
      ).rejects.toThrow(BadRequestError);
    });

    it("rejeita troca de senha quando a senha atual está incorreta", async () => {
      const user = makeUser({ password: "hashed:antiga" });
      const id = user._id.toString();
      const service = buildService(new FakeUserRepository([user]));

      await expect(
        service.update(id, id, {
          oldpassword: "errada",
          newpassword: "novasenha",
        })
      ).rejects.toThrow(BadRequestError);
    });

    it("troca a senha quando a senha atual confere", async () => {
      const user = makeUser({ password: "hashed:antiga" });
      const id = user._id.toString();
      const service = buildService(new FakeUserRepository([user]));

      await service.update(id, id, {
        oldpassword: "antiga",
        newpassword: "novasenha",
      });

      expect(user.password).toBe("hashed:novasenha");
    });
  });
});
