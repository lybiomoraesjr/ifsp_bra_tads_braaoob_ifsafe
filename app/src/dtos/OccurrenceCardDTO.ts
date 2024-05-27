import { OccurrenceStatusEnum } from "@/types";
import { CommentDTO } from "./CommentDTO";

export type OccurrenceCardDTO = {
  _id: string;
  authorId: string;
  title: string;
  image: string;
  likes: number;
  status: OccurrenceStatusEnum;
  comments: CommentDTO[];
  date: Date;
};
