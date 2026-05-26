import mongoose, { Schema, Document } from 'mongoose';

export interface IProfile extends Document {
  gameId: string;
  name: string;
  age: number;
  gender: string;
  personalityTraits: string[];
  favoriteThings: string[];
  dislikes: string[];
  relationshipPreference: string;
  loveLanguage: string;
  communicationStyle: string;
  dealbreakers: string[];
  customQuestions: { question: string; correctAnswer: string }[];
  createdAt: Date;
}

const ProfileSchema = new Schema<IProfile>({
  gameId: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  personalityTraits: [{ type: String }],
  favoriteThings: [{ type: String }],
  dislikes: [{ type: String }],
  relationshipPreference: { type: String, required: true },
  loveLanguage: { type: String, required: true },
  communicationStyle: { type: String, required: true },
  dealbreakers: [{ type: String }],
  customQuestions: [
    {
      question: String,
      correctAnswer: String,
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Profile ||
  mongoose.model<IProfile>('Profile', ProfileSchema);
