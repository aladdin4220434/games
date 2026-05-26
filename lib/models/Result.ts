import mongoose, { Schema, Document } from 'mongoose';

export interface IResult extends Document {
  resultId: string;
  gameId: string;
  playerName: string;
  answers: { questionId: string; answer: string; score: number }[];
  compatibilityScore: number;
  personalityMatch: number;
  trustScore: number;
  emotionalAlignment: number;
  finalScore: number;
  matchTitle: string;
  matchDescription: string;
  createdAt: Date;
}

const ResultSchema = new Schema<IResult>({
  resultId: { type: String, required: true, unique: true, index: true },
  gameId: { type: String, required: true, index: true },
  playerName: { type: String, required: true },
  answers: [
    {
      questionId: String,
      answer: String,
      score: Number,
    },
  ],
  compatibilityScore: { type: Number, required: true },
  personalityMatch: { type: Number, required: true },
  trustScore: { type: Number, required: true },
  emotionalAlignment: { type: Number, required: true },
  finalScore: { type: Number, required: true },
  matchTitle: { type: String, required: true },
  matchDescription: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Result ||
  mongoose.model<IResult>('Result', ResultSchema);
