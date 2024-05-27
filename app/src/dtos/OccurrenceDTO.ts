import { OccurrenceCardDTO } from "./OccurrenceCardDTO";

export type OccurrenceDTO = OccurrenceCardDTO & {
  description: string;
  authorName: string;
  location: string;
};
