// Event bindings and user interactions
import { switchPage, updateTopicSelectors, updateDashboard } from './ui.js';
import { handleFileUpload, validateInput, generateContent } from './main.js';
import { loadQuiz } from './quiz.js';
import { loadFlashcards } from './flashcards.js';

export function initializeEventListeners() {
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', (e) => switchPage(e.target.dataset.page));
  });
  const upload = document.getElementById('pdf-upload');
  if (upload) upload.addEventListener('change', handleFileUpload);
  const topicInput = document.getElementById('topic-input');
  if (topicInput) topicInput.addEventListener('input', validateInput);
  document.querySelectorAll('.option-btn').forEach(btn => {
    btn.addEventListener('click', (e) => selectGenerateOption(e.target));
  });
  const generateBtn = document.getElementById('generate-btn');
  if (generateBtn) generateBtn.addEventListener('click', generateContent);
  const quizSelect = document.getElementById('quiz-topic-select');
  if (quizSelect) quizSelect.addEventListener('change', loadQuiz);
  const flashSelect = document.getElementById('flashcard-topic-select');
  if (flashSelect) flashSelect.addEventListener('change', loadFlashcards);
}

export function selectGenerateOption(button) {
  document.querySelectorAll('.option-btn').forEach(btn => btn.classList.remove('selected'));
  button.classList.add('selected');
}

// expose some functions for inline handlers used in HTML
window.switchPage = switchPage;
window.updateTopicSelectors = updateTopicSelectors;
window.updateDashboard = updateDashboard;
