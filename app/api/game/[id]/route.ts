import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Profile from '@/lib/models/Profile';
import { generateQuestionsForProfile } from '@/lib/game-engine';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const profile = await Profile.findOne({ gameId: id });

    if (!profile) {
      return NextResponse.json({ error: 'Game not found' }, { status: 404 });
    }

    const questions = generateQuestionsForProfile(profile);

    return NextResponse.json({
      profileName: profile.name,
      questions: questions.map((q) => ({
        id: q.id,
        category: q.category,
        text: q.text,
        options: q.options.map((o) => o.text), // don't expose scores to client
      })),
    });
  } catch (error) {
    console.error('Game fetch error:', error);
    return NextResponse.json({ error: 'Failed to load game' }, { status: 500 });
  }
}
