import { z } from 'zod';

export const answerLetterSchema = z.enum(['a', 'b', 'c', 'd', 'e']);

const optionsSchema = z.object({
  a: z.string().min(1),
  b: z.string().min(1),
  c: z.string().min(1),
  d: z.string().min(1),
  e: z.string().min(1).optional(),
});

export const questionContentSchema = z.object({
  options: optionsSchema,
  option_media: z.record(z.string(), z.string()).optional(),
  media_ids: z.array(z.string()).optional(),
  image_position: z.enum(['before_question', 'after_question', 'in_options', 'in_passage']).nullable().optional(),
  passage_ref: z.string().nullable().optional(),
  passage_question_number: z.number().nullable().optional(),
  answer: z.object({
    correct_answer: answerLetterSchema,
    explanation: z.string(),
    hint: z.string(),
    source_reference: z.string().nullable().optional(),
  }),
});

export const storedQuestionContentSchema = z.object({
  options: optionsSchema,
  option_media: z.record(z.string(), z.string()).optional(),
  media_ids: z.array(z.string()).optional(),
  image_position: z.enum(['before_question', 'after_question', 'in_options', 'in_passage']).nullable().optional(),
  passage_ref: z.string().nullable().optional(),
  passage_question_number: z.number().nullable().optional(),
  answer: z.object({
    correct_answer: answerLetterSchema.nullable(),
    explanation: z.string().nullable(),
    hint: z.string().nullable(),
    source_reference: z.string().nullable().optional(),
  }),
});

export type QuestionContent = z.infer<typeof questionContentSchema>;
export type StoredQuestionContent = z.infer<typeof storedQuestionContentSchema>;
export type AnswerLetter = z.infer<typeof answerLetterSchema>;
