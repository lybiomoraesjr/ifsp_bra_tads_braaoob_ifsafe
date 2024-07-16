import { Document, Schema, Types, model } from "mongoose";

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  avatar: string | null;
  admin: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },
    avatar: { type: String, default: null },
    admin: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// O hash da senha é responsabilidade do UserService (via PasswordHasher).
// O model permanece um schema de dados puro.
export const User = model<IUser>("User", userSchema);
