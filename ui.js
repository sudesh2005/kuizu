// UI updates and selectors
import { state } from './state.js';

export function updateTopicSelectors() {
  const topics = Object.keys(state.topics);
  const quizSelect = document.getElementById('quiz-topic-select');
  const flashcardSelect = document.getElementById('flashcard-topic-select');
  if (quizSelect)
    quizSelect.innerHTML = '<option value="">Choose a topic...</option>' +
      topics.map(t => `<option value="${t}">${t}</option>`).join('');
  if (flashcardSelect)
    flashcardSelect.innerHTML = '<option value="">Choose a topic...</option>' +
      topics.map(t => `<option value="${t}">${t}</option>`).join('');
}

export function updateDashboard() {
  const topics = Object.keys(state.topics);
  let totalQuestions = 0;
  let totalFlashcards = 0;
  topics.forEach(topic => {
    const t = state.topics[topic];
    if (t.quiz) totalQuestions += t.quiz.questions.length;
    if (t.flashcards) totalFlashcards += t.flashcards.cards.length;
  });
  setText('total-topics', topics.length);
  setText('total-questions', totalQuestions);
  setText('total-flashcards', totalFlashcards);
  setText('wrong-answers', state.wrongAnswers.length);
  updateTopicProgress();
  updateWrongAnswers();
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

export function updateTopicProgress() {
  const container = document.getElementById('topic-progress');
  if (!container) return;
  const topics = Object.keys(state.topics);
  if (topics.length === 0) {
    container.innerHTML = `
      <div class="no-content">
        <i class="fas fa-chart-line"></i>
        <p>No progress data available yet</p>
      </div>`;
    return;
  }
  container.innerHTML = topics.map(topic => {
    const t = state.topics[topic];
    const wrongCount = state.wrongAnswers.filter(wa => wa.topic === topic).length;
    return `
      <div class="topic-item">
        <div class="topic-name">${topic}</div>
        <div class="topic-stats">
          <span>Quiz: ${t.quiz ? t.quiz.questions.length : 0} questions</span>
          <span>Cards: ${t.flashcards ? t.flashcards.cards.length : 0} cards</span>
          <span>Wrong: ${wrongCount}</span>
        </div>
      </div>`;
  }).join('');
}

export function updateWrongAnswers() {
  const container = document.getElementById('wrong-answers-list');
  if (!container) return;
  if (state.wrongAnswers.length === 0) {
    container.innerHTML = `
      <div class="no-content">
        <i class="fas fa-check-circle"></i>
        <p>No wrong answers to review</p>
      </div>`;
    return;
  }
  container.innerHTML = state.wrongAnswers.map(wrong => `
    <div class="wrong-answer-item">
      <div class="wrong-answer-question">${wrong.question}</div>
      <div class="wrong-answer-details">
        <strong>Topic:</strong> ${wrong.topic}<br>
        <strong>Your Answer:</strong> ${wrong.userAnswer}<br>
        <strong>Correct Answer:</strong> ${wrong.correctAnswer}<br>
        <strong>Explanation:</strong> ${wrong.explanation}<br>
        <strong>Date:</strong> ${new Date(wrong.timestamp).toLocaleDateString()}
      </div>
    </div>`).join('');
}

export function switchPage(page) {
  document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
  const activeBtn = document.querySelector(`[data-page="${page}"]`);
  if (activeBtn) activeBtn.classList.add('active');
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const pageEl = document.getElementById(`${page}-page`);
  if (pageEl) pageEl.classList.add('active');
  if (page === 'quiz' || page === 'flashcards') {
    updateTopicSelectors();
  } else if (page === 'dashboard') {
    updateDashboard();
  }
}
