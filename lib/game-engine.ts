import { IProfile } from './models/Profile';

export type QuestionCategory = 'romance' | 'trust' | 'compatibility' | 'personality';

export interface AnswerOption {
  text: string;
  value: number; // 0-100
}

export interface Question {
  id: string;
  category: QuestionCategory;
  text: string;
  options: AnswerOption[];
  weight: number; // multiplier within category
}

// Category weights for final score
export const CATEGORY_WEIGHTS: Record<QuestionCategory, number> = {
  romance: 0.30,
  trust: 0.25,
  compatibility: 0.25,
  personality: 0.20,
};

// Base question templates
const BASE_QUESTIONS: Question[] = [
  // ROMANCE
  {
    id: 'r1',
    category: 'romance',
    text: 'How do you prefer to show affection?',
    weight: 1.2,
    options: [
      { text: 'Physical touch (hugs, kisses)', value: 90 },
      { text: 'Words of affirmation', value: 75 },
      { text: 'Acts of service', value: 60 },
      { text: 'Quality time together', value: 85 },
      { text: 'Gift giving', value: 50 },
    ],
  },
  {
    id: 'r2',
    category: 'romance',
    text: 'The perfect date would be…',
    weight: 1.0,
    options: [
      { text: 'Candlelit dinner at home', value: 85 },
      { text: 'Adventure hike or outdoor activity', value: 80 },
      { text: 'Movie marathon under blankets', value: 70 },
      { text: 'Dancing the night away', value: 75 },
      { text: 'Museum or art gallery', value: 65 },
    ],
  },
  {
    id: 'r3',
    category: 'romance',
    text: 'How soon do you say "I love you"?',
    weight: 1.1,
    options: [
      { text: 'When I genuinely feel it, no matter when', value: 90 },
      { text: 'After a few months of dating', value: 80 },
      { text: 'Only when I\'m 100% certain', value: 70 },
      { text: 'I let the other person say it first', value: 60 },
      { text: 'I struggle to say it out loud', value: 40 },
    ],
  },
  {
    id: 'r4',
    category: 'romance',
    text: 'Your partner surprises you with a weekend getaway. Your reaction?',
    weight: 1.0,
    options: [
      { text: 'Absolutely thrilled — I love surprises!', value: 95 },
      { text: 'Happy, but I prefer advance notice', value: 70 },
      { text: 'Nervous — I like planning things', value: 50 },
      { text: 'Depends on where we\'re going', value: 65 },
      { text: 'I\'d rather plan it together', value: 60 },
    ],
  },
  {
    id: 'r5',
    category: 'romance',
    text: 'How do you handle jealousy in a relationship?',
    weight: 1.3,
    options: [
      { text: 'Talk it out calmly with my partner', value: 95 },
      { text: 'Give myself space to process first', value: 85 },
      { text: 'I rarely get jealous', value: 75 },
      { text: 'I tend to get a little possessive', value: 40 },
      { text: 'I shut down emotionally', value: 30 },
    ],
  },

  // TRUST
  {
    id: 't1',
    category: 'trust',
    text: 'How quickly do you trust someone new?',
    weight: 1.2,
    options: [
      { text: 'Slowly — trust is earned over time', value: 85 },
      { text: 'Relatively fast if vibes are good', value: 75 },
      { text: 'I give everyone the benefit of the doubt', value: 65 },
      { text: 'I\'m naturally suspicious', value: 40 },
      { text: 'It depends on what they share first', value: 70 },
    ],
  },
  {
    id: 't2',
    category: 'trust',
    text: 'Your partner is texting a lot and won\'t say who. You…',
    weight: 1.4,
    options: [
      { text: 'Trust them completely — no need to ask', value: 95 },
      { text: 'Ask casually in a non-accusatory way', value: 85 },
      { text: 'Feel anxious but stay quiet', value: 55 },
      { text: 'Try to peek at their phone', value: 20 },
      { text: 'Bring it up as a bigger conversation', value: 75 },
    ],
  },
  {
    id: 't3',
    category: 'trust',
    text: 'If your partner told you a deep secret, what would you do?',
    weight: 1.3,
    options: [
      { text: 'Keep it forever — their secret is safe with me', value: 100 },
      { text: 'Keep it but might tell my closest friend', value: 50 },
      { text: 'Feel honored they shared it', value: 90 },
      { text: 'Ask them why they told me', value: 65 },
      { text: 'Feel overwhelmed by the responsibility', value: 55 },
    ],
  },
  {
    id: 't4',
    category: 'trust',
    text: 'How do you feel about your partner having a close friend of the opposite gender?',
    weight: 1.2,
    options: [
      { text: 'Totally fine — I trust my partner fully', value: 100 },
      { text: 'Fine, as long as I\'ve met them', value: 80 },
      { text: 'A little uncomfortable but manageable', value: 55 },
      { text: 'It bothers me quite a bit', value: 25 },
      { text: 'Depends on the nature of the friendship', value: 75 },
    ],
  },
  {
    id: 't5',
    category: 'trust',
    text: 'A past relationship ended due to betrayal. How has that shaped you?',
    weight: 1.0,
    options: [
      { text: 'Made me stronger and more aware', value: 90 },
      { text: 'I\'m more cautious now', value: 70 },
      { text: 'Still healing from it', value: 55 },
      { text: 'I carry trust issues from it', value: 40 },
      { text: 'I haven\'t experienced that', value: 80 },
    ],
  },

  // COMPATIBILITY
  {
    id: 'c1',
    category: 'compatibility',
    text: 'What\'s your ideal living situation as a couple?',
    weight: 1.1,
    options: [
      { text: 'Cozy apartment in the city', value: 80 },
      { text: 'House with a garden in the suburbs', value: 75 },
      { text: 'Somewhere remote and peaceful', value: 70 },
      { text: 'Traveling together indefinitely', value: 65 },
      { text: 'Maintaining separate spaces initially', value: 60 },
    ],
  },
  {
    id: 'c2',
    category: 'compatibility',
    text: 'On a Friday night, you\'d rather…',
    weight: 1.0,
    options: [
      { text: 'Stay home, cook, and watch something', value: 80 },
      { text: 'Go out to a restaurant or bar', value: 75 },
      { text: 'Attend a social event or party', value: 65 },
      { text: 'Do something spontaneous', value: 70 },
      { text: 'Stay in bed and rest', value: 60 },
    ],
  },
  {
    id: 'c3',
    category: 'compatibility',
    text: 'How important is sharing similar values in a relationship?',
    weight: 1.4,
    options: [
      { text: 'Absolutely essential — non-negotiable', value: 100 },
      { text: 'Very important but room for differences', value: 85 },
      { text: 'Somewhat — opposites attract too', value: 65 },
      { text: 'Not that important if chemistry is there', value: 45 },
      { text: 'I\'m flexible about values', value: 50 },
    ],
  },
  {
    id: 'c4',
    category: 'compatibility',
    text: 'How do you handle disagreements?',
    weight: 1.3,
    options: [
      { text: 'Discuss it immediately and calmly', value: 95 },
      { text: 'Cool off first, then talk', value: 85 },
      { text: 'Write down my thoughts before talking', value: 75 },
      { text: 'Avoid conflict and hope it resolves', value: 30 },
      { text: 'Can get heated but always reconcile', value: 60 },
    ],
  },
  {
    id: 'c5',
    category: 'compatibility',
    text: 'Your career vs. relationship — how do you balance them?',
    weight: 1.2,
    options: [
      { text: 'Relationship always comes first', value: 80 },
      { text: 'Career is my priority right now', value: 55 },
      { text: 'I aim for equal balance', value: 90 },
      { text: 'It fluctuates depending on the season', value: 75 },
      { text: 'They enhance each other for me', value: 85 },
    ],
  },

  // PERSONALITY
  {
    id: 'p1',
    category: 'personality',
    text: 'You\'re described by friends as…',
    weight: 1.0,
    options: [
      { text: 'The funny one who lights up the room', value: 85 },
      { text: 'The loyal, dependable one', value: 90 },
      { text: 'The deep thinker and philosopher', value: 80 },
      { text: 'The adventurous wild card', value: 75 },
      { text: 'The caring, empathetic listener', value: 95 },
    ],
  },
  {
    id: 'p2',
    category: 'personality',
    text: 'After a long day, you recharge by…',
    weight: 1.0,
    options: [
      { text: 'Being alone in quiet and silence', value: 75 },
      { text: 'Talking to loved ones', value: 80 },
      { text: 'Physical exercise or movement', value: 70 },
      { text: 'Creative hobbies like music or art', value: 85 },
      { text: 'Binge-watching comfort content', value: 65 },
    ],
  },
  {
    id: 'p3',
    category: 'personality',
    text: 'Which best describes your emotional style?',
    weight: 1.2,
    options: [
      { text: 'Open book — I share freely', value: 90 },
      { text: 'Selective — only with those I trust', value: 80 },
      { text: 'Private — I process alone', value: 65 },
      { text: 'Logical — I analyze before feeling', value: 70 },
      { text: 'Expressive and intense', value: 75 },
    ],
  },
  {
    id: 'p4',
    category: 'personality',
    text: 'What does success mean to you?',
    weight: 1.0,
    options: [
      { text: 'Deep, meaningful relationships', value: 90 },
      { text: 'Career achievement and recognition', value: 70 },
      { text: 'Freedom and flexibility', value: 75 },
      { text: 'Making a positive impact on others', value: 85 },
      { text: 'Personal growth and self-mastery', value: 80 },
    ],
  },
  {
    id: 'p5',
    category: 'personality',
    text: 'In a group setting, you typically…',
    weight: 1.0,
    options: [
      { text: 'Lead the conversation naturally', value: 80 },
      { text: 'Listen more than I speak', value: 85 },
      { text: 'Go deep with one person', value: 90 },
      { text: 'Keep things light and fun', value: 75 },
      { text: 'Observe and adapt to the group energy', value: 70 },
    ],
  },
];

export function generateQuestionsForProfile(profile: IProfile): Question[] {
  const questions = [...BASE_QUESTIONS];

  // Inject profile-specific questions based on their traits
  if (profile.loveLanguage === 'physical_touch') {
    questions.push({
      id: 'custom_lt_pt',
      category: 'romance',
      text: `${profile.name} feels most loved through physical touch. How do you feel about expressing love this way?`,
      weight: 1.5,
      options: [
        { text: 'I love it — touch is my love language too!', value: 100 },
        { text: 'I\'m comfortable with it', value: 80 },
        { text: 'I\'m somewhat reserved physically', value: 50 },
        { text: 'I prefer other ways to show love', value: 30 },
        { text: 'I need to get comfortable first', value: 60 },
      ],
    });
  }

  if (profile.loveLanguage === 'words_of_affirmation') {
    questions.push({
      id: 'custom_lt_wa',
      category: 'romance',
      text: `${profile.name} thrives on words of affirmation. How naturally does verbal appreciation come to you?`,
      weight: 1.5,
      options: [
        { text: 'Very naturally — I love expressing appreciation', value: 100 },
        { text: 'I try, but sometimes struggle with words', value: 65 },
        { text: 'I show love through actions more than words', value: 50 },
        { text: 'I\'m working on being more expressive', value: 70 },
        { text: 'I find it awkward but I can learn', value: 55 },
      ],
    });
  }

  if (profile.communicationStyle === 'direct') {
    questions.push({
      id: 'custom_comm',
      category: 'compatibility',
      text: `${profile.name} values direct, honest communication. How do you approach difficult conversations?`,
      weight: 1.4,
      options: [
        { text: 'Head-on — honesty is always best', value: 100 },
        { text: 'Carefully but directly', value: 85 },
        { text: 'I soften the message to protect feelings', value: 60 },
        { text: 'I tend to avoid difficult topics', value: 30 },
        { text: 'I need time to prepare what to say', value: 70 },
      ],
    });
  }

  // Add profile custom questions
  profile.customQuestions?.forEach((cq, i) => {
    questions.push({
      id: `cq_${i}`,
      category: 'trust',
      text: cq.question,
      weight: 1.5,
      options: [
        { text: cq.correctAnswer, value: 100 },
        { text: 'Not sure, but I\'d like to find out', value: 60 },
        { text: 'Probably not', value: 30 },
        { text: 'Definitely not', value: 10 },
        { text: 'I\'d need more context', value: 50 },
      ],
    });
  });

  // Shuffle questions deterministically using gameId as seed
  return shuffleArray(questions, profile.gameId).slice(0, 15);
}

// Deterministic shuffle using a string seed
function shuffleArray<T>(array: T[], seed: string): T[] {
  const arr = [...array];
  let seedNum = seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

  for (let i = arr.length - 1; i > 0; i--) {
    seedNum = (seedNum * 1664525 + 1013904223) & 0xffffffff;
    const j = Math.abs(seedNum) % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  return arr;
}
