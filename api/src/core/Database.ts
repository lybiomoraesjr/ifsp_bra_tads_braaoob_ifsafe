import mongoose from "mongoose";

/** Encapsula a conexão com o MongoDB via Mongoose. */
export class Database {
  constructor(private readonly uri: string) {}

  async connect(): Promise<void> {
    mongoose.set("strictQuery", true);
    await mongoose.connect(this.uri);
    console.log("✅ MongoDB conectado");
  }

  async disconnect(): Promise<void> {
    await mongoose.disconnect();
  }
}
