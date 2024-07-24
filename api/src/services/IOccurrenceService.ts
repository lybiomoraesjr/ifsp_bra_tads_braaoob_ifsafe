import {
  OccurrenceCardDTO,
  OccurrenceDetailDTO,
} from "../mappers/OccurrenceMapper";
import { OccurrenceStatus } from "../models/Occurrence";

export interface CreateOccurrenceInput {
  title: string;
  description: string;
  image?: string | null;
  location: string;
}

export interface ChangeStatusInput {
  status: OccurrenceStatus;
  statusComment?: string;
}

/** Contrato do serviço de ocorrências. */
export interface IOccurrenceService {
  list(): Promise<OccurrenceCardDTO[]>;
  findById(id: string): Promise<OccurrenceDetailDTO>;
  create(authorId: string, input: CreateOccurrenceInput): Promise<OccurrenceDetailDTO>;
  toggleLike(id: string, userId: string): Promise<OccurrenceDetailDTO>;
  addComment(id: string, userId: string, comment: string): Promise<OccurrenceDetailDTO>;
  changeStatus(id: string, input: ChangeStatusInput): Promise<OccurrenceDetailDTO>;
}
