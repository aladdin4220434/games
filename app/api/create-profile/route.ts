import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Profile from '@/lib/models/Profile';
import { nanoid } from 'nanoid';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    const gameId = nanoid(10);

    const profile = await Profile.create({
      gameId,
      name: body.name,
      age: body.age,
      gender: body.gender,
      personalityTraits: body.personalityTraits || [],
      favoriteThings: body.favoriteThings || [],
      dislikes: body.dislikes || [],
      relationshipPreference: body.relationshipPreference,
      loveLanguage: body.loveLanguage,
      communicationStyle: body.communicationStyle,
      dealbreakers: body.dealbreakers || [],
      customQuestions: body.customQuestions || [],
    });

    return NextResponse.json({ gameId: profile.gameId }, { status: 201 });
  } catch (error) {
    console.error('Create profile error:', error);
    return NextResponse.json({ error: 'Failed to create profile' }, { status: 500 });
  }
}
