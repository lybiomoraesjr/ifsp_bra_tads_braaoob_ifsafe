import { IOccurrence } from "../models/Occurrence";

export interface CreateOccurrenceData {
  title: string;
  description: string;
  image: string | null;
  location: string;
  author: string;
}

/** Contrato de acesso a dados de ocorrências. */
export interface IOccurrenceRepository {
  findAll(): Promise<IOccurrence[]>;
  /** Busca por id já com os relacionamentos populados. */
  findByIdPopulated(id: string): Promise<IOccurrence | null>;
  /** Busca "crua" (sem populate), para alterações antes de salvar. */
  findById(id: string): Promise<IOccurrence | null>;
  create(data: CreateOccurrenceData): Promise<IOccurrence>;
  save(occurrence: IOccurrence): Promise<IOccurrence>;
}
