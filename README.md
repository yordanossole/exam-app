# Exam App — React Architecture

A mobile-first multiple-choice exam web application built with React, React Router, and Context API.

---

## 1. Project Structure & Component Hierarchy

```
src/
├── components/       # Reusable UI components (atomic design)
│   ├── Button.jsx
│   ├── ExplanationBlock.jsx
│   ├── OptionItem.jsx
│   ├── ProgressBar.jsx
│   ├── Screen.jsx
│   ├── StatCard.jsx
│   ├── SubjectCard.jsx
│   └── TabBar.jsx
├── pages/            # Page-level components (route targets)
│   ├── HomePage.jsx
│   ├── SubjectsPage.jsx
│   ├── ExamListPage.jsx
│   ├── ExamPage.jsx
│   ├── ResultsPage.jsx
│   └── ProfilePage.jsx
├── context/          # Global state management
│   └── AppContext.jsx
├── hooks/            # Custom React hooks
│   └── useExam.js
├── data/             # Mock data (swap for API calls)
│   └── mockData.js
├── App.jsx           # Router setup
├── main.jsx          # Entry point
└── index.css         # Global styles
```

**Component Breakdown:**
- **Atomic Components**: Button, ProgressBar, StatCard, OptionItem, ExplanationBlock, SubjectCard
- **Layout Components**: Screen (max-width container), TabBar (bottom navigation)
- **Page Components**: HomePage, SubjectsPage, ExamListPage, ExamPage, ResultsPage, ProfilePage

---

## 2. Routing Strategy

**User Flow:**
```
Home → Subjects → ExamList → Exam Session → Results
                                ↓
                          (Question Loop with inline Explanation)
```

**Routes (React Router DOM):**
- `/` — Home (stats, recent activity, CTA)
- `/subjects` — Subject selection (search, filter, list)
- `/subjects/:subjectId` — Exam list for a subject
- `/exam/:examId` — Exam session (question loop + explanation inline)
- `/results/:examId` — Final score + per-question breakdown
- `/profile` — User profile, progress, settings

**Deep Linking & Refresh Handling:**
- `currentSession` is persisted to `localStorage` on every state change.
- If a user refreshes mid-exam, the session is restored from localStorage.
- If the session is lost (e.g., cleared storage), the user is redirected to `/subjects`.

---

## 3. State Management Strategy

**Global State (Context API + useReducer):**
- `user` — name, email, avatar
- `stats` — examsCompleted, avgScore, streak, studyTime
- `recentActivity` — list of completed exams
- `subjectProgress` — per-subject progress percentages
- `currentSession` — { examId, subjectId, currentIndex, answers: {qId: optionId}, submitted }

**Local State:**
- `showExplanation` (ExamPage) — toggles between question and explanation view
- `query`, `category` (SubjectsPage) — search and filter state

**Why Context + useReducer?**
- App is small-to-medium size; no need for Redux.
- Context provides global access to session state.
- useReducer centralizes state transitions (START_EXAM, SET_ANSWER, NEXT_QUESTION, etc.).
- localStorage integration is simple and effective for persistence.

---

## 4. Data Structure & Mock Data

**JSON Schema:**
```js
{
  subjects: [
    { id, name, icon, color, examCount, category }
  ],
  exams: {
    [subjectId]: [
      {
        id, subjectId, title,
        questions: [
          {
            id, text, image,
            options: [{ id, text }],
            correctId, explanation
          }
        ]
      }
    ]
  }
}
```

**API Replacement:**
- `fetchSubjects()`, `fetchExamsBySubject(subjectId)`, `fetchExam(examId)` are mock functions in `data/mockData.js`.
- Replace these with real `fetch()` or `axios` calls to your backend.
- The shape is intentionally identical to what an API would return.

---

## 5. Asset Integration & Styling

**Styling Approach:**
- Inline styles using the design tokens from DESIGN.md.
- No Tailwind or CSS-in-JS library — minimal dependencies.
- Google Fonts (Inter + Newsreader) imported in `index.css`.

**Design Tokens:**
- Colors: `#0058bc` (primary), `#006e28` (success), `#bc000a` (error), `#fffde7` (explanation bg)
- Typography: Inter (UI), Newsreader (questions)
- Spacing: 8px base, 20px mobile margin, 12px gap between cards
- Border radius: 0.5rem (cards), 0.75rem (modals), 9999px (pills)

**Responsive:**
- Mobile-first: max-width 420px container.
- Tablet: same container (design is optimized for handheld).

---

## 6. User Experience (UX) Logic

**Question → Explanation → Next Question:**
1. User selects an answer (radio button).
2. User clicks "Check Answer" → `showExplanation` = true.
3. Explanation block appears inline (yellow bg, blue left border).
4. User clicks "Next" → `currentIndex++`, `showExplanation` = false.
5. Repeat until last question → "Finish" → navigate to `/results`.

**Progress Persistence (localStorage):**
- `currentSession` is saved to localStorage on every state change.
- If the user closes the tab and returns, the session is restored.
- If the user navigates away (e.g., clicks "Exit"), the session is cleared.

**Accessibility:**
- Keyboard navigation: 1-4 keys select options, Enter submits, Arrow keys navigate.
- ARIA labels: `role="radiogroup"`, `aria-checked`, `aria-label`, `aria-current`.
- Focus management: buttons are keyboard-accessible.
- Semantic HTML: `<nav>`, `<main>`, `<header>`, `<footer>`.

---

## Installation & Usage

```bash
cd exam-app
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Future Enhancements

- Replace mock data with real API calls.
- Add user authentication (login/signup).
- Implement timer for timed exams.
- Add analytics (track time per question, retry count).
- Support for image-based questions.
- Dark mode toggle.
- Offline support (Service Worker + IndexedDB).

---

## License

MIT
