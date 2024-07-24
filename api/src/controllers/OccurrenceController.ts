import { Request, Response } from "express";
import { z } from "zod";
import { OCCURRENCE_STATUS } from "../models/Occurrence";
import { IOccurrenceService } from "../services/IOccurrenceService";

const createSchema = z.object({
  title: z.string().min(1, "Informe o título."),
  description: z.string().min(1, "Informe a descrição."),
  image: z.string().nullable().optional(),
  location: z.string().min(1, "Informe a localização."),
});

const commentSchema = z.object({
  comment: z.string().min(1, "O comentário não pode ser vazio."),
});

const statusSchema = z.object({
  status: z.enum(OCCURRENCE_STATUS),
  statusComment: z.string().optional(),
});

export class OccurrenceController {
  constructor(private readonly occurrenceService: IOccurrenceService) {}

  // GET /posts
  list = async (_req: Request, res: Response): Promise<void> => {
    res.json(await this.occurrenceService.list());
  };

  // GET /posts/:id
  show = async (req: Request, res: Response): Promise<void> => {
    res.json(await this.occurrenceService.findById(req.params.id));
  };

  // POST /posts
  create = async (req: Request, res: Response): Promise<void> => {
    const data = createSchema.parse(req.body);
    const occurrence = await this.occurrenceService.create(req.userId!, data);
    res.status(201).json(occurrence);
  };

  // POST /posts/likes/:id
  like = async (req: Request, res: Response): Promise<void> => {
    const occurrence = await this.occurrenceService.toggleLike(
      req.params.id,
      req.userId!
    );
    res.json(occurrence);
  };

  // POST /posts/comments/:id
  comment = async (req: Request, res: Response): Promise<void> => {
    const { comment } = commentSchema.parse(req.body);
    const occurrence = await this.occurrenceService.addComment(
      req.params.id,
      req.userId!,
      comment
    );
    res.status(201).json(occurrence);
  };

  // PUT /posts/status/:id (restrito a admin)
  changeStatus = async (req: Request, res: Response): Promise<void> => {
    const data = statusSchema.parse(req.body);
    const occurrence = await this.occurrenceService.changeStatus(
      req.params.id,
      data
    );
    res.json(occurrence);
  };
}
