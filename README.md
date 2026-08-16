# NT Exams

NT Exams is a Next.js App Router national-examination practice app for Grade 6, Grade 8, and Grade 12 learners.

## Exam data

All exam content is read from [`nt-exams.db`](nt-exams.db) through `better-sqlite3`. The database stores:

- exams, sections, passages, and media;
- questions with variable content in the validated `questions.content` JSON column;
- answer-key data used by server-side checking and topic scoring.

The app does not use local question-bank data for exams. The practice entry page reads the active user subscription and shows only its paid grade. Subjects and exam years are then loaded from the SQLite database.

## Exam flow

`/practice` → paid grade subjects → exam year → exam → results by topic.

Legacy `/subjects`, `/quiz`, and `/exam` URLs redirect into the database-backed practice flow. `/admin/review` lists questions that need content or answer-key review.

## Importing workbook data

```bash
npm install
npm run db:import
npm run dev
```

The importer reads `exams/Exam_Data_Entry_Template.xlsx`, detects each sheet's real header row, imports passage text from `assets/passages/`, validates question JSON with Zod, and updates `nt-exams.db` idempotently.

## Shared app chrome

The root layout provides the uniform top app bar, logo, subscription-grade badge, and bottom navigation across the application. The active exam screen keeps its question controls above the shared navigation.

## Routes

- `/` — home
- `/practice` — subjects for the paid grade
- `/practice/grade/[grade]/subject/[subject]` — exam years
- `/practice/exam/[examId]` — legacy redirect to the exam flow
- `/practice/exam/[examId]/[mode]` — question flow
- `/practice/results` — topic score report
- `/profile`, `/settings`, `/upgrade` — account and subscription screens
