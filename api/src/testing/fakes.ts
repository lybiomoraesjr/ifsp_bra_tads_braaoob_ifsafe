import { Types } from "mongoose";
import { IUser } from "../models/User";
import { IOccurrence, Occurrence } from "../models/Occurrence";
import { CreateUserData, IUserRepository } from "../repositories/IUserRepository";
import {
  CreateOccurrenceData,
  IOccurrenceRepository,
} from "../repositories/IOccurrenceRepository";
import { IPasswordHasher } from "../providers/IPasswordHasher";
import { ITokenProvider } from "../providers/ITokenProvider";

/**
 * Implementações fake das interfaces, para testes unitários sem banco/rede.
 * Como os services dependem das abstrações (DIP), podemos injetar estes fakes
 * no lugar das implementações reais.
 */

/** Cria um usuário em memória (cast para IUser; sem conexão com o Mongo). */
export function makeUser(partial: Partial<IUser> = {}): IUser {
  return {
    _id: new Types.ObjectId(),
    name: "Usuário Teste",
    email: "teste@ifsafe.dev",
    password: "hashed:secret",
    avatar: null,
    admin: false,
    createdAt: new Date(0),
    updatedAt: new Date(0),
    ...partial,
  } as unknown as IUser;
}

export class FakeUserRepository implements IUserRepository {
  constructor(private readonly store: IUser[] = []) {}

  async findById(id: string): Promise<IUser | null> {
    return this.store.find((u) => u._id.toString() === id) ?? null;
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return this.store.find((u) => u.email === email.toLowerCase()) ?? null;
  }

  async create(data: CreateUserData): Promise<IUser> {
    const user = makeUser({ ...data, admin: data.admin ?? false });
    this.store.push(user);
    return user;
  }

  async save(user: IUser): Promise<IUser> {
    return user;
  }
}

/** Hash determinístico e reversível, só para teste (não usa bcrypt). */
export class FakePasswordHasher implements IPasswordHasher {
  async hash(plain: string): Promise<string> {
    return `hashed:${plain}`;
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    return hash === `hashed:${plain}`;
  }
}

export class FakeTokenProvider implements ITokenProvider {
  sign(userId: string): string {
    return `token-for-${userId}`;
  }

  verify(token: string): string {
    return token.replace("token-for-", "");
  }
}

/**
 * Cria uma Ocorrência em memória usando o próprio model do Mongoose (sem
 * conexão). Assim os arrays de `likes`/`comments` têm o comportamento real
 * (push/pull, _id de subdocumento), permitindo testar os mutadores do service.
 */
export function makeOccurrence(
  partial: Record<string, unknown> = {}
): IOccurrence {
  return new Occurrence({
    title: "Ocorrência teste",
    description: "Descrição de teste",
    image: null,
    location: "Bloco A",
    status: "Pendente",
    statusComment: null,
    author: new Types.ObjectId(),
    comments: [],
    likes: [],
    ...partial,
  }) as unknown as IOccurrence;
}

export class FakeOccurrenceRepository implements IOccurrenceRepository {
  constructor(private readonly store: IOccurrence[] = []) {}

  async findAll(): Promise<IOccurrence[]> {
    return this.store;
  }

  async findByIdPopulated(id: string): Promise<IOccurrence | null> {
    return this.store.find((o) => o._id.toString() === id) ?? null;
  }

  async findById(id: string): Promise<IOccurrence | null> {
    return this.store.find((o) => o._id.toString() === id) ?? null;
  }

  async create(data: CreateOccurrenceData): Promise<IOccurrence> {
    const occurrence = makeOccurrence({ ...data });
    this.store.push(occurrence);
    return occurrence;
  }

  async save(occurrence: IOccurrence): Promise<IOccurrence> {
    return occurrence;
  }
}
