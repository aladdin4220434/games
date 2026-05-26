import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Profile from '@/lib/models/Profile';
import Result from '@/lib/models/Result';
import { generateQuestionsForProfile } from '@/lib/game-engine';
import { calculateScores } from '@/lib/scoring';
import { nanoid } from 'nanoid';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { gameId, playerName, answers } = body;

    const profile = await Profile.findOne({ gameId });
    if (!profile) {
      return NextResponse.json({ error: 'Game not found' }, { status: 404 });
    }

    const questions = generateQuestionsForProfile(profile);

    // Reconstruct scored answers: match submitted answers to option values
    const scoredAnswers = answers.map((a: { questionId: string; answer: string }) => {
      const question = questions.find((q) => q.id === a.questionId);
      if (!question) return { ...a, score: 0 };

      const option = question.options.find((o) => o.text === a.answer);
      return {
        questionId: a.questionId,
        answer: a.answer,
        score: option?.value ?? 0,
      };
    });

    const scoreBreakdown = calculateScores(scoredAnswers, questions);
    const resultId = nanoid(12);

    await Result.create({
      resultId,
      gameId,
      playerName,
      answers: scoredAnswers,
      ...scoreBreakdown,
    });

    return NextResponse.json({ resultId }, { status: 201 });
  } catch (error) {
    console.error('Submit answers error:', error);
    return NextResponse.json({ error: 'Failed to submit answers' }, { status: 500 });
  }
}
