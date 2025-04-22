import mongoose, { Document, Schema } from 'mongoose';

export interface IMovie extends Document {
  title: string;
  releaseYear: number;
  imdbID: string;
  created_at: Date;
}

const MovieSchema: Schema = new Schema({
  title: { type: String, required: true },
  releaseYear: { type: Number, required: true },
  imdbID: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
});

export default mongoose.model<IMovie>('Movie', MovieSchema);
