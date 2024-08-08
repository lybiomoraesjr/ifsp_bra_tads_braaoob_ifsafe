import { Types } from "mongoose";
import { OccurrenceMapper } from "./OccurrenceMapper";

describe("OccurrenceMapper", () => {
  const author = { _id: new Types.ObjectId(), name: "Ana" };
  const commentAuthor = { _id: new Types.ObjectId(), name: "Bruno" };

  // Ocorrência com `author` e `comments.author` populados (como vem do repo).
  const occurrence: any = {
    _id: new Types.ObjectId(),
    author,
    title: "Lâmpada queimada",
    description: "Detalhe da ocorrência",
    image: null,
    location: "Bloco A",
    status: "Pendente",
    statusComment: null,
    likes: [new Types.ObjectId(), new Types.ObjectId()],
    comments: [
      {
        _id: new Types.ObjectId(),
        author: commentAuthor,
        text: "Confirmo o problema.",
        createdAt: new Date(0),
      },
    ],
    createdAt: new Date(0),
  };

  it("toCard serializa para o formato do feed", () => {
    const card = OccurrenceMapper.toCard(occurrence);

    expect(card._id).toBe(occurrence._id.toString());
    expect(card.authorId).toBe(author._id.toString());
    expect(card.image).toBe(""); // null vira ""
    expect(card.likes).toBe(2); // contagem, não array
    expect(card.comments).toHaveLength(1);
    expect(card.comments[0]).toMatchObject({
      userId: commentAuthor._id.toString(),
      userName: "Bruno",
      comment: "Confirmo o problema.",
    });
  });

  it("toDetail inclui descrição, nome do autor e localização", () => {
    const detail = OccurrenceMapper.toDetail(occurrence);

    expect(detail.description).toBe("Detalhe da ocorrência");
    expect(detail.authorName).toBe("Ana");
    expect(detail.location).toBe("Bloco A");
  });
});
