import { IOccurrence, Occurrence } from "../models/Occurrence";
import {
  CreateOccurrenceData,
  IOccurrenceRepository,
} from "./IOccurrenceRepository";

/** Abstrai o acesso à coleção de ocorrências no MongoDB. */
export class OccurrenceRepository implements IOccurrenceRepository {
  // Popula o autor da ocorrência e o autor de cada comentário (apenas o nome),
  // necessário para montar os DTOs.
  private readonly populate = [
    { path: "author", select: "name" },
    { path: "comments.author", select: "name" },
  ];

  findAll(): Promise<IOccurrence[]> {
    return Occurrence.find().sort({ createdAt: 1 }).populate(this.populate).exec();
  }

  /** Busca por id já com os relacionamentos populados. */
  findByIdPopulated(id: string): Promise<IOccurrence | null> {
    return Occurrence.findById(id).populate(this.populate).exec();
  }

  /** Busca "crua" (sem populate), para alterações antes de salvar. */
  findById(id: string): Promise<IOccurrence | null> {
    return Occurrence.findById(id).exec();
  }

  create(data: CreateOccurrenceData): Promise<IOccurrence> {
    return Occurrence.create(data);
  }

  save(occurrence: IOccurrence): Promise<IOccurrence> {
    return occurrence.save();
  }
}
