import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Result from '@/lib/models/Result';
import Profile from '@/lib/models/Profile';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const result = await Result.findOne({ resultId: id });

    if (!result) {
      return NextResponse.json({ error: 'Result not found' }, { status: 404 });
    }

    const profile = await Profile.findOne({ gameId: result.gameId });

    return NextResponse.json({
      playerName: result.playerName,
      profileName: profile?.name || 'Unknown',
      compatibilityScore: result.compatibilityScore,
      personalityMatch: result.personalityMatch,
      trustScore: result.trustScore,
      emotionalAlignment: result.emotionalAlignment,
      finalScore: result.finalScore,
      matchTitle: result.matchTitle,
      matchDescription: result.matchDescription,
      gameId: result.gameId,
      createdAt: result.createdAt,
    });
  } catch (error) {
    console.error('Result fetch error:', error);
    return NextResponse.json({ error: 'Failed to load result' }, { status: 500 });
  }
}
