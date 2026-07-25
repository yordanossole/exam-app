import { NextResponse } from 'next/server';
import { answerLetterSchema } from '../../../../../../../lib/db/question-content';
import { getQuestionsForExam } from '../../../../../../../lib/db';

export const runtime = 'nodejs';

export async function POST(
  request: Request,
  context: { params: Promise<{ examId: string; questionId: string }> }
) {
  const { examId, questionId } = await context.params;
  const body = await request.json().catch(() => ({}));
  const selected = answerLetterSchema.safeParse(body?.selected);
  const revealExplanation = Boolean(body?.revealExplanation);

  if (!selected.success) {
    return NextResponse.json({ error: 'Invalid answer option' }, { status: 400 });
  }

  const question = getQuestionsForExam(examId).find(item => item.question_id === questionId);
  if (!question) return NextResponse.json({ error: 'Question not found' }, { status: 404 });

  const correctAnswer = question.content.answer.correct_answer;
  const isCorrect = correctAnswer ? selected.data === correctAnswer : null;

  if (!correctAnswer) {
    return NextResponse.json({
      is_correct: null,
      selected: selected.data,
      correct_answer: null,
      hint: null,
      explanation: null,
      answer_key_available: false,
      needs_review: true,
    });
  }

  return NextResponse.json({
    is_correct: isCorrect,
    selected: selected.data,
    correct_answer: revealExplanation || isCorrect ? correctAnswer : null,
    hint: !isCorrect ? question.content.answer.hint : null,
    explanation: revealExplanation || isCorrect ? question.content.answer.explanation : null,
    answer_key_available: true,
    needs_review: Boolean(question.needs_review),
  });
}
