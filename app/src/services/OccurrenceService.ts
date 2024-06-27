import { OccurrenceCardDTO } from "@/dtos/OccurrenceCardDTO";
import { OccurrenceDTO } from "@/dtos/OccurrenceDTO";
import { OccurrenceStatusEnum } from "@/types";
import { ApiClient } from "./ApiClient";

export interface CreateOccurrenceData {
  title: string;
  description: string;
  location: string;
  image: string | null;
}

/** Operações sobre ocorrências (endpoints /posts). */
export class OccurrenceService {
  constructor(private readonly api: ApiClient) {}

  async list(): Promise<OccurrenceCardDTO[]> {
    const { data } = await this.api.http.get<OccurrenceCardDTO[]>("/posts/");
    return data;
  }

  async getById(id: string): Promise<OccurrenceDTO> {
    const { data } = await this.api.http.get<OccurrenceDTO>(`/posts/${id}`);
    return data;
  }

  async create(data: CreateOccurrenceData): Promise<void> {
    await this.api.http.post("/posts", data);
  }

  async toggleLike(id: string): Promise<void> {
    await this.api.http.post(`/posts/likes/${id}`);
  }

  async addComment(id: string, comment: string): Promise<void> {
    await this.api.http.post(`/posts/comments/${id}`, { comment });
  }

  async changeStatus(
    id: string,
    status: OccurrenceStatusEnum,
    statusComment: string
  ): Promise<void> {
    await this.api.http.put(`/posts/status/${id}`, { status, statusComment });
  }
}
