// ── Quiz data ────────────────────────────────────────────────────────────────
// All question banks live here. QuizScreen calls getQuestionsForCategory(id)
// to get the right set. The daily quiz uses MOCK_QUESTIONS (mixed).
// ────────────────────────────────────────────────────────────────────────────

export const MOCK_USER = {
  id: 'u1',
  display_name: 'Yordanos Tesfaye',
  avatar_url: null,
  active_subscription: null,
};

export const MOCK_STATS = {
  streak: 12,
  points: 1240,
  accuracy: 84,
  overall_accuracy: 84,
  subject_stats: [
    { subject: 'Mathematics', topic: 'Algebra',        accuracy: 91, correct_count: 45, total_count: 49 },
    { subject: 'Physics',     topic: 'Mechanics',      accuracy: 76, correct_count: 38, total_count: 50 },
    { subject: 'Chemistry',   topic: 'Periodic Table', accuracy: 68, correct_count: 34, total_count: 50 },
    { subject: 'English',     topic: 'Grammar',        accuracy: 88, correct_count: 44, total_count: 50 },
    { subject: 'Biology',     topic: 'Cell Biology',   accuracy: 72, correct_count: 36, total_count: 50 },
  ],
};

export const CATEGORIES = [
  { id: 'mathematics', name: 'Mathematics', icon: '📐', color: '#FFF3E0', progress: 72 },
  { id: 'physics',     name: 'Physics',     icon: '⚛️', color: '#F3E5F5', progress: 55 },
  { id: 'chemistry',   name: 'Chemistry',   icon: '🧪', color: '#FFF9E0', progress: 40 },
  { id: 'english',     name: 'English',     icon: '🌍', color: '#E3F2FD', progress: 88 },
  { id: 'biology',     name: 'Biology',     icon: '🧬', color: '#E8F5E9', progress: 60 },
  { id: 'civics',      name: 'Civics',      icon: '⚖️', color: '#EDE7F6', progress: 30 },
];

export const DAILY_QUIZ = {
  id: 'daily-2026-07-25',
  title: 'Daily Challenge',
  subtitle: 'Mixed — 10 questions',
  icon: '⭐',
  isNew: true,
  totalQuestions: 10,
};

// ── Per-subject question banks ───────────────────────────────────────────────

const QUESTIONS_MATHEMATICS = [
  {
    id: 'math-1',
    text: 'What is the derivative of f(x) = 3x² + 2x − 5?',
    options: { A: '6x + 2', B: '3x + 2', C: '6x − 5', D: '3x² + 2' },
    answer: { correct_option: 'A', explanation: 'Using the power rule: d/dx(3x²) = 6x and d/dx(2x) = 2. The constant −5 vanishes. So f′(x) = 6x + 2.' },
  },
  {
    id: 'math-2',
    text: 'If a = 5 and b = −3, what is the value of a² − b²?',
    options: { A: '16', B: '34', C: '−16', D: '64' },
    answer: { correct_option: 'A', explanation: 'a² = 25, b² = 9, so a² − b² = 16. Equivalently, (a+b)(a−b) = (2)(8) = 16.' },
  },
  {
    id: 'math-3',
    text: 'A train travels 360 km in 4 hours. What is its average speed?',
    options: { A: '80 km/h', B: '90 km/h', C: '100 km/h', D: '72 km/h' },
    answer: { correct_option: 'B', explanation: 'Speed = Distance ÷ Time = 360 ÷ 4 = 90 km/h.' },
  },
  {
    id: 'math-4',
    text: 'What is the value of log₂(64)?',
    options: { A: '4', B: '6', C: '8', D: '16' },
    answer: { correct_option: 'B', explanation: '2⁶ = 64, so log₂(64) = 6.' },
  },
  {
    id: 'math-5',
    text: 'Solve for x: 2x + 7 = 15',
    options: { A: '2', B: '3', C: '4', D: '5' },
    answer: { correct_option: 'C', explanation: '2x = 15 − 7 = 8, so x = 4.' },
  },
];

const QUESTIONS_PHYSICS = [
  {
    id: 'phys-1',
    text: 'Which of the following is the SI unit of electric current?',
    options: { A: 'Volt', B: 'Watt', C: 'Ampere', D: 'Ohm' },
    answer: { correct_option: 'C', explanation: 'The ampere (A) is the SI base unit of electric current — one coulomb per second.' },
  },
  {
    id: 'phys-2',
    text: 'Which law states that the pressure of a gas is inversely proportional to its volume at constant temperature?',
    options: { A: "Charles's Law", B: "Boyle's Law", C: "Gay-Lussac's Law", D: "Avogadro's Law" },
    answer: { correct_option: 'B', explanation: "Boyle's Law: P₁V₁ = P₂V₂ at constant temperature." },
  },
  {
    id: 'phys-3',
    text: 'What is the speed of light in a vacuum (approximately)?',
    options: { A: '3 × 10⁶ m/s', B: '3 × 10⁸ m/s', C: '3 × 10¹⁰ m/s', D: '3 × 10¹² m/s' },
    answer: { correct_option: 'B', explanation: 'The speed of light in a vacuum is approximately 3 × 10⁸ m/s (299,792,458 m/s exactly).' },
  },
  {
    id: 'phys-4',
    text: 'An object is dropped from rest. After 3 seconds, what is its velocity? (g = 10 m/s²)',
    options: { A: '10 m/s', B: '20 m/s', C: '30 m/s', D: '40 m/s' },
    answer: { correct_option: 'C', explanation: 'v = u + at = 0 + 10 × 3 = 30 m/s.' },
  },
  {
    id: 'phys-5',
    text: 'Which type of wave does not require a medium to travel?',
    options: { A: 'Sound waves', B: 'Water waves', C: 'Electromagnetic waves', D: 'Seismic waves' },
    answer: { correct_option: 'C', explanation: 'Electromagnetic waves (light, radio, X-rays) travel through a vacuum without any medium.' },
  },
];

const QUESTIONS_CHEMISTRY = [
  {
    id: 'chem-1',
    text: 'What is the chemical formula of glucose?',
    options: { A: 'C₆H₁₂O₆', B: 'C₁₂H₂₂O₁₁', C: 'CH₄', D: 'H₂O₂' },
    answer: { correct_option: 'A', explanation: 'Glucose is a monosaccharide with the molecular formula C₆H₁₂O₆.' },
  },
  {
    id: 'chem-2',
    text: 'Which element has the atomic number 6?',
    options: { A: 'Nitrogen', B: 'Oxygen', C: 'Carbon', D: 'Helium' },
    answer: { correct_option: 'C', explanation: 'Carbon (C) has 6 protons — atomic number 6. It is the backbone of organic chemistry.' },
  },
  {
    id: 'chem-3',
    text: 'What type of bond is formed when electrons are shared between two atoms?',
    options: { A: 'Ionic bond', B: 'Covalent bond', C: 'Metallic bond', D: 'Hydrogen bond' },
    answer: { correct_option: 'B', explanation: 'Covalent bonds form when two atoms share one or more pairs of electrons.' },
  },
  {
    id: 'chem-4',
    text: 'What is the pH of pure water at 25°C?',
    options: { A: '0', B: '5', C: '7', D: '14' },
    answer: { correct_option: 'C', explanation: 'Pure water is neutral with a pH of 7 at 25°C, meaning [H⁺] = [OH⁻] = 10⁻⁷ mol/L.' },
  },
  {
    id: 'chem-5',
    text: 'Which gas is produced when an acid reacts with a metal carbonate?',
    options: { A: 'Oxygen', B: 'Hydrogen', C: 'Carbon dioxide', D: 'Nitrogen' },
    answer: { correct_option: 'C', explanation: 'Acid + metal carbonate → salt + water + CO₂. The CO₂ produced causes effervescence (fizzing).' },
  },
];

const QUESTIONS_ENGLISH = [
  {
    id: 'eng-1',
    text: 'In English grammar, which sentence uses the subjunctive mood correctly?',
    options: {
      A: 'If I was you, I would apologize.',
      B: 'If I were you, I would apologize.',
      C: 'If I am you, I would apologize.',
      D: 'If I be you, I would apologize.',
    },
    answer: { correct_option: 'B', explanation: 'The subjunctive uses "were" for all persons in hypothetical conditions. "If I were you" is correct.' },
  },
  {
    id: 'eng-2',
    text: 'Choose the correct word: "There are ___ people in the room."',
    options: { A: 'less', B: 'fewer', C: 'little', D: 'much' },
    answer: { correct_option: 'B', explanation: '"Fewer" is used with countable nouns (people, chairs). "Less" is used with uncountable nouns (water, time).' },
  },
  {
    id: 'eng-3',
    text: 'Which of the following is a complex sentence?',
    options: {
      A: 'The dog barked.',
      B: 'The dog barked and the cat ran away.',
      C: 'Although it was raining, we went for a walk.',
      D: 'She sang; he danced.',
    },
    answer: { correct_option: 'C', explanation: 'A complex sentence has one independent clause and at least one dependent clause. "Although it was raining" is the dependent clause.' },
  },
  {
    id: 'eng-4',
    text: 'What does the word "benevolent" mean?',
    options: { A: 'Harmful', B: 'Well-meaning and kind', C: 'Angry', D: 'Confused' },
    answer: { correct_option: 'B', explanation: '"Benevolent" comes from Latin bene (well) + volens (wishing) — meaning kind, generous, or well-meaning.' },
  },
  {
    id: 'eng-5',
    text: 'Identify the passive voice: which sentence is in passive voice?',
    options: {
      A: 'The chef cooked the meal.',
      B: 'The meal was cooked by the chef.',
      C: 'The chef is cooking the meal.',
      D: 'The chef will cook the meal.',
    },
    answer: { correct_option: 'B', explanation: 'Passive voice: the subject receives the action. "The meal" (subject) + "was cooked" (past passive verb) + "by the chef" (agent).' },
  },
];

const QUESTIONS_BIOLOGY = [
  {
    id: 'bio-1',
    text: 'What is the powerhouse of the cell?',
    options: { A: 'Nucleus', B: 'Ribosome', C: 'Mitochondria', D: 'Golgi apparatus' },
    answer: { correct_option: 'C', explanation: 'Mitochondria produce ATP through cellular respiration — hence "the powerhouse of the cell."' },
  },
  {
    id: 'bio-2',
    text: 'What type of bond holds the two strands of DNA together?',
    options: { A: 'Ionic bonds', B: 'Covalent bonds', C: 'Hydrogen bonds', D: 'Peptide bonds' },
    answer: { correct_option: 'C', explanation: 'Hydrogen bonds between complementary base pairs (A-T and G-C) hold the two DNA strands together.' },
  },
  {
    id: 'bio-3',
    text: 'Which organelle is responsible for protein synthesis?',
    options: { A: 'Lysosome', B: 'Ribosome', C: 'Vacuole', D: 'Centriole' },
    answer: { correct_option: 'B', explanation: 'Ribosomes read mRNA and assemble amino acids into proteins — they are the site of protein synthesis.' },
  },
  {
    id: 'bio-4',
    text: 'What is the process by which plants make their own food?',
    options: { A: 'Respiration', B: 'Fermentation', C: 'Photosynthesis', D: 'Transpiration' },
    answer: { correct_option: 'C', explanation: 'Photosynthesis: 6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂. Chloroplasts capture light energy to produce glucose.' },
  },
  {
    id: 'bio-5',
    text: 'How many chromosomes does a normal human somatic (body) cell contain?',
    options: { A: '23', B: '44', C: '46', D: '48' },
    answer: { correct_option: 'C', explanation: 'Human somatic cells contain 46 chromosomes — 23 pairs (22 autosomes + 1 sex chromosome pair).' },
  },
];

const QUESTIONS_CIVICS = [
  {
    id: 'civ-1',
    text: 'What does "democracy" literally mean?',
    options: { A: 'Rule by the military', B: 'Rule by the people', C: 'Rule by the wealthy', D: 'Rule by law' },
    answer: { correct_option: 'B', explanation: 'Democracy comes from Greek: demos (people) + kratos (rule/power). It means government by the people.' },
  },
  {
    id: 'civ-2',
    text: 'Which of the following is a fundamental human right according to the UDHR?',
    options: { A: 'Right to own property in other countries', B: 'Right to life, liberty and security of person', C: 'Right to unlimited wealth', D: 'Right to govern others' },
    answer: { correct_option: 'B', explanation: 'Article 3 of the Universal Declaration of Human Rights states: "Everyone has the right to life, liberty and security of person."' },
  },
  {
    id: 'civ-3',
    text: 'What is the separation of powers principle?',
    options: {
      A: 'Dividing the country into states',
      B: 'Distributing government power among legislative, executive, and judicial branches',
      C: 'Separating the military from civilians',
      D: 'Dividing taxes among citizens',
    },
    answer: { correct_option: 'B', explanation: 'Separation of powers divides government into three branches — legislative (makes laws), executive (enforces laws), judicial (interprets laws) — to prevent abuse of power.' },
  },
  {
    id: 'civ-4',
    text: 'What is the role of the constitution in a country?',
    options: { A: 'It sets tax rates', B: 'It is the supreme law that defines the structure and limits of government', C: 'It manages the economy', D: 'It controls the military' },
    answer: { correct_option: 'B', explanation: 'A constitution is the supreme law of the land. It establishes the framework of government, defines rights, and limits governmental power.' },
  },
  {
    id: 'civ-5',
    text: 'What does "rule of law" mean?',
    options: {
      A: 'Only rulers make the laws',
      B: 'Everyone, including government officials, is subject to the law',
      C: 'Laws only apply to criminals',
      D: 'The military enforces all laws',
    },
    answer: { correct_option: 'B', explanation: 'The rule of law means that no person or institution is above the law — government officials and citizens alike must follow the same laws.' },
  },
];

// ── Question bank map ────────────────────────────────────────────────────────
// Maps category id → its question array
const QUESTION_BANKS = {
  mathematics: QUESTIONS_MATHEMATICS,
  physics:     QUESTIONS_PHYSICS,
  chemistry:   QUESTIONS_CHEMISTRY,
  english:     QUESTIONS_ENGLISH,
  biology:     QUESTIONS_BIOLOGY,
  civics:      QUESTIONS_CIVICS,
};

/**
 * Returns the question list for a given category id.
 * Falls back to the mixed daily set if the id is unknown.
 */
export function getQuestionsForCategory(categoryId) {
  return QUESTION_BANKS[categoryId] ?? MOCK_QUESTIONS;
}

// ── Mixed daily question set (one from each subject) ────────────────────────
export const MOCK_QUESTIONS = [
  QUESTIONS_MATHEMATICS[0],
  QUESTIONS_PHYSICS[0],
  QUESTIONS_CHEMISTRY[0],
  QUESTIONS_ENGLISH[0],
  QUESTIONS_BIOLOGY[0],
  QUESTIONS_CIVICS[0],
  QUESTIONS_MATHEMATICS[1],
  QUESTIONS_PHYSICS[1],
  QUESTIONS_CHEMISTRY[1],
  QUESTIONS_BIOLOGY[1],
];
