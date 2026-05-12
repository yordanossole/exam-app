// Replace fetchSubjects / fetchExam with real API calls later.
// Shape is intentionally identical to what an API would return.

export const subjects = [
  { id: 'biology',   name: 'Biology',       icon: '🧪', color: '#e6f4ea', examCount: 12, category: 'Science' },
  { id: 'calculus',  name: 'Calculus',      icon: '📐', color: '#fff3e0', examCount: 8,  category: 'Math'    },
  { id: 'history',   name: 'World History', icon: '🌍', color: '#e3f2fd', examCount: 15, category: 'History' },
  { id: 'literature',name: 'Literature',    icon: '📖', color: '#f3e5f5', examCount: 10, category: 'Science' },
];

export const exams = {
  biology: [
    {
      id: 'bio-exam-1',
      subjectId: 'biology',
      title: 'Biology Exam 1',
      questions: [
        {
          id: 'q1',
          text: 'What is the primary function of mitochondria?',
          image: null,
          options: [
            { id: 'a', text: 'To store genetic information in the form of DNA.' },
            { id: 'b', text: 'To generate chemical energy in the form of ATP.' },
            { id: 'c', text: 'To synthesize proteins from amino acids.' },
            { id: 'd', text: 'To filter waste products out of the cytoplasm.' },
          ],
          correctId: 'b',
          explanation: 'Mitochondria are known as the powerhouses of the cell because they generate most of the cell\'s supply of adenosine triphosphate (ATP), which is used as a source of chemical energy. This process occurs through cellular respiration, where nutrients are converted into usable biological fuel.',
        },
        {
          id: 'q2',
          text: 'Which organelle is responsible for protein synthesis?',
          image: null,
          options: [
            { id: 'a', text: 'Nucleus' },
            { id: 'b', text: 'Golgi apparatus' },
            { id: 'c', text: 'Ribosome' },
            { id: 'd', text: 'Lysosome' },
          ],
          correctId: 'c',
          explanation: 'Ribosomes are the molecular machines responsible for protein synthesis. They translate messenger RNA (mRNA) sequences into polypeptide chains, which then fold into functional proteins.',
        },
        {
          id: 'q3',
          text: 'What is the process by which plants make their own food?',
          image: null,
          options: [
            { id: 'a', text: 'Cellular respiration' },
            { id: 'b', text: 'Fermentation' },
            { id: 'c', text: 'Photosynthesis' },
            { id: 'd', text: 'Osmosis' },
          ],
          correctId: 'c',
          explanation: 'Photosynthesis is the process by which green plants and some other organisms use sunlight, water, and carbon dioxide to produce oxygen and energy in the form of glucose.',
        },
        {
          id: 'q4',
          text: 'Which molecule carries genetic information in most living organisms?',
          image: null,
          options: [
            { id: 'a', text: 'RNA' },
            { id: 'b', text: 'ATP' },
            { id: 'c', text: 'Protein' },
            { id: 'd', text: 'DNA' },
          ],
          correctId: 'd',
          explanation: 'DNA (deoxyribonucleic acid) is the molecule that carries the genetic instructions for the development, functioning, growth, and reproduction of all known organisms.',
        },
        {
          id: 'q5',
          text: 'What is the basic unit of life?',
          image: null,
          options: [
            { id: 'a', text: 'Atom' },
            { id: 'b', text: 'Cell' },
            { id: 'c', text: 'Tissue' },
            { id: 'd', text: 'Organ' },
          ],
          correctId: 'b',
          explanation: 'The cell is the basic structural and functional unit of all living organisms. It is the smallest unit of life that can replicate independently.',
        },
      ],
    },
  ],
  calculus: [
    {
      id: 'calc-exam-1',
      subjectId: 'calculus',
      title: 'Calculus Exam 1',
      questions: [
        {
          id: 'q1',
          text: 'What is the derivative of f(x) = x²?',
          image: null,
          options: [
            { id: 'a', text: 'f\'(x) = x' },
            { id: 'b', text: 'f\'(x) = 2x' },
            { id: 'c', text: 'f\'(x) = 2' },
            { id: 'd', text: 'f\'(x) = x²' },
          ],
          correctId: 'b',
          explanation: 'Using the power rule, the derivative of xⁿ is n·xⁿ⁻¹. For x², n=2, so the derivative is 2·x²⁻¹ = 2x.',
        },
        {
          id: 'q2',
          text: 'What does the integral of a function represent geometrically?',
          image: null,
          options: [
            { id: 'a', text: 'The slope of the tangent line' },
            { id: 'b', text: 'The maximum value of the function' },
            { id: 'c', text: 'The area under the curve' },
            { id: 'd', text: 'The rate of change' },
          ],
          correctId: 'c',
          explanation: 'The definite integral of a function over an interval represents the net signed area between the function\'s graph and the x-axis over that interval.',
        },
        {
          id: 'q3',
          text: 'What is the limit of (sin x)/x as x approaches 0?',
          image: null,
          options: [
            { id: 'a', text: '0' },
            { id: 'b', text: 'Undefined' },
            { id: 'c', text: '∞' },
            { id: 'd', text: '1' },
          ],
          correctId: 'd',
          explanation: 'This is a fundamental trigonometric limit. As x approaches 0, sin(x)/x approaches 1. This can be proven using the squeeze theorem.',
        },
      ],
    },
  ],
  history: [
    {
      id: 'hist-exam-1',
      subjectId: 'history',
      title: 'World History Exam 1',
      questions: [
        {
          id: 'q1',
          text: 'In which year did World War II end?',
          image: null,
          options: [
            { id: 'a', text: '1943' },
            { id: 'b', text: '1944' },
            { id: 'c', text: '1945' },
            { id: 'd', text: '1946' },
          ],
          correctId: 'c',
          explanation: 'World War II ended in 1945. Germany surrendered on May 8, 1945 (V-E Day), and Japan surrendered on September 2, 1945 (V-J Day), following the atomic bombings of Hiroshima and Nagasaki.',
        },
        {
          id: 'q2',
          text: 'Which ancient wonder was located in Alexandria, Egypt?',
          image: null,
          options: [
            { id: 'a', text: 'The Colossus of Rhodes' },
            { id: 'b', text: 'The Lighthouse of Alexandria' },
            { id: 'c', text: 'The Hanging Gardens' },
            { id: 'd', text: 'The Temple of Artemis' },
          ],
          correctId: 'b',
          explanation: 'The Lighthouse of Alexandria (Pharos of Alexandria) was one of the Seven Wonders of the Ancient World. Built in the 3rd century BC on the island of Pharos, it guided sailors into the harbor.',
        },
      ],
    },
  ],
  literature: [
    {
      id: 'lit-exam-1',
      subjectId: 'literature',
      title: 'Literature Exam 1',
      questions: [
        {
          id: 'q1',
          text: 'Who wrote "To Kill a Mockingbird"?',
          image: null,
          options: [
            { id: 'a', text: 'Ernest Hemingway' },
            { id: 'b', text: 'F. Scott Fitzgerald' },
            { id: 'c', text: 'Harper Lee' },
            { id: 'd', text: 'John Steinbeck' },
          ],
          correctId: 'c',
          explanation: '"To Kill a Mockingbird" was written by Harper Lee and published in 1960. It won the Pulitzer Prize in 1961 and has become a classic of modern American literature.',
        },
        {
          id: 'q2',
          text: 'In Shakespeare\'s "Hamlet", what is the name of Hamlet\'s father\'s ghost?',
          image: null,
          options: [
            { id: 'a', text: 'Claudius' },
            { id: 'b', text: 'King Hamlet' },
            { id: 'c', text: 'Polonius' },
            { id: 'd', text: 'Horatio' },
          ],
          correctId: 'b',
          explanation: 'The ghost in Hamlet is the spirit of King Hamlet, Hamlet\'s deceased father. The ghost reveals that he was murdered by Claudius, Hamlet\'s uncle, who then married Hamlet\'s mother Gertrude.',
        },
      ],
    },
  ],
};

export function fetchSubjects() {
  return Promise.resolve(subjects);
}

export function fetchExamsBySubject(subjectId) {
  return Promise.resolve(exams[subjectId] ?? []);
}

export function fetchExam(examId) {
  const all = Object.values(exams).flat();
  return Promise.resolve(all.find(e => e.id === examId) ?? null);
}
