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

## Telegram Mini App

The root client providers initialize `@telegram-apps/sdk-react` only when Telegram launch parameters are present. Telegram receives `ready()` and `expand()` immediately; its theme and viewport values are bound to CSS variables, and native Back/Main Buttons are used on supported clients. Normal browser visits continue to use the existing theme, navigation, and HTML action buttons.

Copy `.env.example` to `.env.local` and set `TELEGRAM_BOT_TOKEN` to the token from BotFather. The token is server-only and must never use a `NEXT_PUBLIC_` prefix. `TELEGRAM_SESSION_SECRET` is optional but recommended in production so session signing can be rotated separately from the bot token.

On each Telegram launch, raw signed `initData` is posted to `/api/auth/telegram`. The route validates Telegram's two-stage HMAC-SHA256 signature and `auth_date` before reading the Telegram user, then issues a signed HTTP-only session cookie. Invalid, stale, or malformed data receives a `401`; a missing server token receives a `503`.

Verified Telegram users automatically receive the `Telegram Free` plan for Grade 6, so they can open the exam library without payment. Set `TELEGRAM_FREE_GRADE` to `8` or `12` to expose a different grade.

## Routes

- `/` — home
- `/practice` — subjects for the paid grade
- `/practice/grade/[grade]/subject/[subject]` — exam years
- `/practice/exam/[examId]` — legacy redirect to the exam flow
- `/practice/exam/[examId]/[mode]` — question flow
- `/practice/results` — topic score report
- `/profile`, `/settings`, `/upgrade` — account and subscription screens
