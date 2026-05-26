import { Question, CATEGORY_WEIGHTS, QuestionCategory } from './game-engine';

export interface AnswerSubmission {
  questionId: string;
  answer: string;
  score: number;
}

export interface ScoreBreakdown {
  compatibilityScore: number;
  personalityMatch: number;
  trustScore: number;
  emotionalAlignment: number;
  finalScore: number;
  matchTitle: string;
  matchDescription: string;
}

const MATCH_TIERS = [
  {
    min: 90,
    title: '✨ Twin Flames',
    description:
      'An extraordinary connection that defies logic. You two are cosmically aligned — rare, electric, and built to last. This is the stuff legends are made of.',
  },
  {
    min: 80,
    title: '💫 Soulmates',
    description:
      'A deep, resonant bond. Your values, rhythms, and hearts beat in beautiful harmony. This connection has real depth and extraordinary potential.',
  },
  {
    min: 70,
    title: '🔥 Magnetic Match',
    description:
      'There\'s undeniable chemistry and a strong foundation here. A few differences make it interesting — you challenge each other in the best ways.',
  },
  {
    min: 60,
    title: '💚 Kindred Spirits',
    description:
      'You share enough common ground to build something meaningful. With open communication and curiosity, this could blossom beautifully.',
  },
  {
    min: 50,
    title: '🌊 Potential Energy',
    description:
      'Different wavelengths, but that doesn\'t mean incompatible. There\'s latent potential here — it just needs nurturing and understanding.',
  },
  {
    min: 35,
    title: '🌱 Growing Ground',
    description:
      'Quite different personalities and preferences. Growth is possible, but it requires intentional effort from both sides.',
  },
  {
    min: 0,
    title: '🌍 Parallel Universes',
    description:
      'You exist in very different worlds right now. That\'s not a bad thing — sometimes the most unexpected connections surprise everyone.',
  },
];

export function calculateScores(
  answers: AnswerSubmission[],
  questions: Question[]
): ScoreBreakdown {
  const categoryScores: Record<QuestionCategory, { total: number; weightSum: number }> = {
    romance: { total: 0, weightSum: 0 },
    trust: { total: 0, weightSum: 0 },
    compatibility: { total: 0, weightSum: 0 },
    personality: { total: 0, weightSum: 0 },
  };

  // Build a map of questions for fast lookup
  const questionMap = new Map(questions.map((q) => [q.id, q]));

  for (const answer of answers) {
    const question = questionMap.get(answer.questionId);
    if (!question) continue;

    const cat = question.category;
    categoryScores[cat].total += answer.score * question.weight;
    categoryScores[cat].weightSum += 100 * question.weight;
  }

  // Normalize each category to 0-100
  const normalize = (cat: QuestionCategory): number => {
    const { total, weightSum } = categoryScores[cat];
    if (weightSum === 0) return 50; // default midpoint if no questions
    return Math.round((total / weightSum) * 100);
  };

  const compatibilityScore = normalize('compatibility');
  const personalityMatch = normalize('personality');
  const trustScore = normalize('trust');
  const emotionalAlignment = normalize('romance');

  // Weighted final score
  const finalScore = Math.round(
    compatibilityScore * CATEGORY_WEIGHTS.compatibility +
      personalityMatch * CATEGORY_WEIGHTS.personality +
      trustScore * CATEGORY_WEIGHTS.trust +
      emotionalAlignment * CATEGORY_WEIGHTS.romance
  );

  // Determine match tier
  const tier = MATCH_TIERS.find((t) => finalScore >= t.min) || MATCH_TIERS[MATCH_TIERS.length - 1];

  return {
    compatibilityScore,
    personalityMatch,
    trustScore,
    emotionalAlignment,
    finalScore,
    matchTitle: tier.title,
    matchDescription: tier.description,
  };
}
