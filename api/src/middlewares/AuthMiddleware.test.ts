import type { NextFunction, Request, Response } from "express";
import { AuthMiddleware } from "./AuthMiddleware";
import { ForbiddenError, UnauthorizedError } from "../errors";
import { ITokenProvider } from "../providers/ITokenProvider";
import {
  FakeTokenProvider,
  FakeUserRepository,
  makeUser,
} from "../testing/fakes";

const res = {} as Response;

function makeCtx() {
  const req = { headers: {} } as Request;
  const next = jest.fn() as unknown as NextFunction;
  return { req, next };
}

describe("AuthMiddleware", () => {
  describe("ensureAuth", () => {
    const middleware = () =>
      new AuthMiddleware(new FakeTokenProvider(), new FakeUserRepository());

    it("rejeita quando não há header Authorization", () => {
      const { req, next } = makeCtx();

      expect(() => middleware().ensureAuth(req, res, next)).toThrow(
        UnauthorizedError
      );
      expect(next).not.toHaveBeenCalled();
    });

    it("rejeita header malformado", () => {
      const { req, next } = makeCtx();
      req.headers.authorization = "Token abc";

      expect(() => middleware().ensureAuth(req, res, next)).toThrow(
        UnauthorizedError
      );
    });

    it("rejeita token inválido", () => {
      const throwingTokens: ITokenProvider = {
        sign: () => "",
        verify: () => {
          throw new Error("token inválido");
        },
      };
      const mw = new AuthMiddleware(throwingTokens, new FakeUserRepository());
      const { req, next } = makeCtx();
      req.headers.authorization = "Bearer qualquer";

      expect(() => mw.ensureAuth(req, res, next)).toThrow(UnauthorizedError);
    });

    it("aceita token válido, popula req.userId e chama next", () => {
      const { req, next } = makeCtx();
      req.headers.authorization = "Bearer token-for-abc123";

      middleware().ensureAuth(req, res, next);

      expect(req.userId).toBe("abc123");
      expect(next).toHaveBeenCalledTimes(1);
    });
  });

  describe("ensureAdmin", () => {
    it("rejeita quando o usuário não existe", async () => {
      const mw = new AuthMiddleware(
        new FakeTokenProvider(),
        new FakeUserRepository()
      );
      const { req, next } = makeCtx();
      req.userId = "inexistente";

      await expect(mw.ensureAdmin(req, res, next)).rejects.toThrow(
        UnauthorizedError
      );
    });

    it("rejeita usuário não-admin com ForbiddenError", async () => {
      const user = makeUser({ admin: false });
      const mw = new AuthMiddleware(
        new FakeTokenProvider(),
        new FakeUserRepository([user])
      );
      const { req, next } = makeCtx();
      req.userId = user._id.toString();

      await expect(mw.ensureAdmin(req, res, next)).rejects.toThrow(
        ForbiddenError
      );
    });

    it("permite admin, marca req.userAdmin e chama next", async () => {
      const user = makeUser({ admin: true });
      const mw = new AuthMiddleware(
        new FakeTokenProvider(),
        new FakeUserRepository([user])
      );
      const { req, next } = makeCtx();
      req.userId = user._id.toString();

      await mw.ensureAdmin(req, res, next);

      expect(req.userAdmin).toBe(true);
      expect(next).toHaveBeenCalledTimes(1);
    });
  });
});
