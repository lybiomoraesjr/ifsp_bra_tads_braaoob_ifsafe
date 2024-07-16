import { Document, Schema, Types, model } from "mongoose";

/** Rótulos de status conforme o contrato consumido pelo app (em português). */
export const OCCURRENCE_STATUS = ["Pendente", "Solucionado", "Cancelado"] as const;
export type OccurrenceStatus = (typeof OCCURRENCE_STATUS)[number];

export interface IComment {
  _id: Types.ObjectId;
  author: Types.ObjectId;
  text: string;
  createdAt: Date;
}

export interface IOccurrence extends Document {
  _id: Types.ObjectId;
  title: string;
  description: string;
  image: string | null;
  location: string;
  status: OccurrenceStatus;
  statusComment: string | null;
  author: Types.ObjectId;
  comments: Types.DocumentArray<IComment>;
  likes: Types.Array<Types.ObjectId>;
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new Schema<IComment>(
  {
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

const occurrenceSchema = new Schema<IOccurrence>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    image: { type: String, default: null },
    location: { type: String, required: true },
    status: {
      type: String,
      enum: OCCURRENCE_STATUS,
      default: "Pendente",
    },
    statusComment: { type: String, default: null },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    comments: { type: [commentSchema], default: [] },
    likes: {
      type: [{ type: Schema.Types.ObjectId, ref: "User" }],
      default: [],
    },
  },
  { timestamps: true }
);

export const Occurrence = model<IOccurrence>("Occurrence", occurrenceSchema);
