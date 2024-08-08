import { Types } from "mongoose";
import { OccurrenceService } from "./OccurrenceService";
import { NotFoundError } from "../errors";
import { FakeOccurrenceRepository, makeOccurrence } from "../testing/fakes";

describe("OccurrenceService", () => {
  it("lista as ocorrências como cards", async () => {
    const repo = new FakeOccurrenceRepository([
      makeOccurrence({ title: "A" }),
      makeOccurrence({ title: "B" }),
    ]);
    const service = new OccurrenceService(repo);

    const cards = await service.list();

    expect(cards).toHaveLength(2);
    expect(cards[0]).toHaveProperty("_id");
    expect(cards[0].likes).toBe(0);
  });

  it("findById lança NotFoundError quando não existe", async () => {
    const service = new OccurrenceService(new FakeOccurrenceRepository());

    await expect(
      service.findById(new Types.ObjectId().toString())
    ).rejects.toThrow(NotFoundError);
  });

  it("cria a ocorrência e retorna o detalhe", async () => {
    const service = new OccurrenceService(new FakeOccurrenceRepository());
    const authorId = new Types.ObjectId().toString();

    const detail = await service.create(authorId, {
      title: "Nova ocorrência",
      description: "descrição",
      location: "Bloco C",
      image: null,
    });

    expect(detail.title).toBe("Nova ocorrência");
    expect(detail.authorId).toBe(authorId);
    expect(detail.likes).toBe(0);
  });

  it("toggleLike adiciona e depois remove a curtida", async () => {
    const occurrence = makeOccurrence();
    const id = occurrence._id.toString();
    const service = new OccurrenceService(new FakeOccurrenceRepository([occurrence]));
    const userId = new Types.ObjectId().toString();

    const liked = await service.toggleLike(id, userId);
    expect(liked.likes).toBe(1);

    const unliked = await service.toggleLike(id, userId);
    expect(unliked.likes).toBe(0);
  });

  it("addComment adiciona um comentário", async () => {
    const occurrence = makeOccurrence();
    const id = occurrence._id.toString();
    const service = new OccurrenceService(new FakeOccurrenceRepository([occurrence]));
    const userId = new Types.ObjectId().toString();

    const detail = await service.addComment(id, userId, "primeiro comentário");

    expect(detail.comments).toHaveLength(1);
    expect(detail.comments[0].comment).toBe("primeiro comentário");
    expect(detail.comments[0].userId).toBe(userId);
  });

  it("changeStatus altera o status da ocorrência", async () => {
    const occurrence = makeOccurrence({ status: "Pendente" });
    const id = occurrence._id.toString();
    const service = new OccurrenceService(new FakeOccurrenceRepository([occurrence]));

    const detail = await service.changeStatus(id, {
      status: "Solucionado",
      statusComment: "Resolvido pela manutenção.",
    });

    expect(detail.status).toBe("Solucionado");
  });
});
