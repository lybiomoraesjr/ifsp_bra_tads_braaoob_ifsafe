import { Types } from "mongoose";
import { NotFoundError } from "../errors";
import {
  OccurrenceCardDTO,
  OccurrenceDetailDTO,
  OccurrenceMapper,
} from "../mappers/OccurrenceMapper";
import { IOccurrence } from "../models/Occurrence";
import { IOccurrenceRepository } from "../repositories/IOccurrenceRepository";
import {
  ChangeStatusInput,
  CreateOccurrenceInput,
  IOccurrenceService,
} from "./IOccurrenceService";

export class OccurrenceService implements IOccurrenceService {
  constructor(private readonly occurrences: IOccurrenceRepository) {}

  async list(): Promise<OccurrenceCardDTO[]> {
    const all = await this.occurrences.findAll();
    return all.map((occurrence) => OccurrenceMapper.toCard(occurrence));
  }

  async findById(id: string): Promise<OccurrenceDetailDTO> {
    const occurrence = await this.requirePopulated(id);
    return OccurrenceMapper.toDetail(occurrence);
  }

  async create(
    authorId: string,
    input: CreateOccurrenceInput
  ): Promise<OccurrenceDetailDTO> {
    const created = await this.occurrences.create({
      title: input.title,
      description: input.description,
      image: input.image ?? null,
      location: input.location,
      author: authorId,
    });

    return this.findById(created._id.toString());
  }

  async toggleLike(
    id: string,
    userId: string
  ): Promise<OccurrenceDetailDTO> {
    const occurrence = await this.requireRaw(id);

    const alreadyLiked = occurrence.likes.some(
      (likeId) => likeId.toString() === userId
    );

    if (alreadyLiked) {
      occurrence.likes.pull(userId);
    } else {
      occurrence.likes.push(new Types.ObjectId(userId));
    }

    await this.occurrences.save(occurrence);
    return this.findById(id);
  }

  async addComment(
    id: string,
    userId: string,
    comment: string
  ): Promise<OccurrenceDetailDTO> {
    const occurrence = await this.requireRaw(id);

    occurrence.comments.push({
      author: new Types.ObjectId(userId),
      text: comment,
    } as never);

    await this.occurrences.save(occurrence);
    return this.findById(id);
  }

  async changeStatus(
    id: string,
    input: ChangeStatusInput
  ): Promise<OccurrenceDetailDTO> {
    const occurrence = await this.requireRaw(id);

    occurrence.status = input.status;
    occurrence.statusComment = input.statusComment ?? null;

    await this.occurrences.save(occurrence);
    return this.findById(id);
  }

  private async requirePopulated(id: string): Promise<IOccurrence> {
    const occurrence = await this.occurrences.findByIdPopulated(id);
    if (!occurrence) {
      throw new NotFoundError("Ocorrência não encontrada.");
    }
    return occurrence;
  }

  private async requireRaw(id: string): Promise<IOccurrence> {
    const occurrence = await this.occurrences.findById(id);
    if (!occurrence) {
      throw new NotFoundError("Ocorrência não encontrada.");
    }
    return occurrence;
  }
}
