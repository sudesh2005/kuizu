// Centralized application state and persistence
export const state = {
  topics: {},
  currentQuiz: null,
  currentFlashcards: null,
  currentTopic: null,
  quizScore: 0,
  quizTotal: 0,
  wrongAnswers: [],
  lastUploadedFile: null,
};

export function saveData() {
  localStorage.setItem('quizFlashcardData', JSON.stringify(state));
}

export function loadData() {
  const saved = localStorage.getItem('quizFlashcardData');
  if (saved) {
    const parsed = JSON.parse(saved);
    Object.assign(state, parsed);
  }
}
