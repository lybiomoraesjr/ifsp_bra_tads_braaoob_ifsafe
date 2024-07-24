import { OccurrenceStatus } from "../models/Occurrence";

export interface CommentDTO {
  commentId: string;
  userId: string;
  userName: string;
  comment: string;
  commentDate: Date;
}

export interface OccurrenceCardDTO {
  _id: string;
  authorId: string;
  title: string;
  image: string;
  likes: number;
  status: OccurrenceStatus;
  comments: CommentDTO[];
  date: Date;
}

export interface OccurrenceDetailDTO extends OccurrenceCardDTO {
  description: string;
  authorName: string;
  location: string;
}

type Ref = { _id: { toString(): string }; name?: string } | { toString(): string };

/**
 * Converte a entidade Occurrence (com `author` e `comments.author` populados)
 * para os DTOs esperados pelo app: `_id` como string, `likes` como número
 * (contagem) e `comments` no formato CommentDTO.
 */
export class OccurrenceMapper {
  private static refId(ref: Ref | undefined | null): string {
    if (!ref) return "";
    if (typeof ref === "object" && "_id" in ref) return ref._id.toString();
    return ref.toString();
  }

  private static refName(ref: Ref | undefined | null): string {
    if (ref && typeof ref === "object" && "name" in ref && ref.name) return ref.name;
    return "";
  }

  private static toComment(comment: any): CommentDTO {
    return {
      commentId: comment._id.toString(),
      userId: OccurrenceMapper.refId(comment.author),
      userName: OccurrenceMapper.refName(comment.author),
      comment: comment.text,
      commentDate: comment.createdAt,
    };
  }

  static toCard(occurrence: any): OccurrenceCardDTO {
    return {
      _id: occurrence._id.toString(),
      authorId: OccurrenceMapper.refId(occurrence.author),
      title: occurrence.title,
      image: occurrence.image ?? "",
      likes: Array.isArray(occurrence.likes) ? occurrence.likes.length : 0,
      status: occurrence.status,
      comments: (occurrence.comments ?? []).map(OccurrenceMapper.toComment),
      date: occurrence.createdAt,
    };
  }

  static toDetail(occurrence: any): OccurrenceDetailDTO {
    return {
      ...OccurrenceMapper.toCard(occurrence),
      description: occurrence.description,
      authorName: OccurrenceMapper.refName(occurrence.author),
      location: occurrence.location,
    };
  }
}
