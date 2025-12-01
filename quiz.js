// Quiz feature
import { state, saveData } from './state.js';

export function loadQuiz() {
  const topic = document.getElementById('quiz-topic-select').value;
  const container = document.getElementById('quiz-container');
  if (!topic || !state.topics[topic]?.quiz) {
    container.innerHTML = `
      <div class="no-content">
        <i class="fas fa-question-circle"></i>
        <h3>No Quiz Available</h3>
        <p>Generate a quiz from the home page to get started!</p>
      </div>`;
    return;
  }
  state.currentTopic = topic;
  state.currentQuiz = state.topics[topic].quiz;
  state.quizScore = 0;
  state.quizTotal = state.currentQuiz.questions.length;
  displayQuiz();
}

export function displayQuiz() {
  const container = document.getElementById('quiz-container');
  const quiz = state.currentQuiz;
  container.innerHTML = `
    <div class="quiz-header">
      <div class="question-counter">Question 1 of ${quiz.questions.length}</div>
      <div class="score-display">Score: ${state.quizScore}/${state.quizTotal}</div>
    </div>
    <div id="quiz-questions"></div>
    <div class="quiz-actions">
      <button class="quiz-btn secondary" onclick="window.resetQuiz()">Reset Quiz</button>
    </div>`;
  displayQuestion(0);
}

export function displayQuestion(questionIndex) {
  const quiz = state.currentQuiz;
  const question = quiz.questions[questionIndex];
  const container = document.getElementById('quiz-questions');
  container.innerHTML = `
    <div class="question-card">
      <div class="question-text">${question.question}</div>
      <div class="options">
        ${question.options.map((option, index) => `
          <div class="option" data-index="${index}" onclick="window.selectAnswer(${questionIndex}, ${index})">${option}</div>
        `).join('')}
      </div>
    </div>`;
  const counter = document.querySelector('.question-counter');
  if (counter) counter.textContent = `Question ${questionIndex + 1} of ${quiz.questions.length}`;
}

export function selectAnswer(questionIndex, answerIndex) {
  const question = state.currentQuiz.questions[questionIndex];
  const options = document.querySelectorAll('.option');
  options.forEach(opt => opt.classList.remove('selected', 'correct', 'incorrect'));
  options[answerIndex].classList.add('selected');
  setTimeout(() => {
    if (answerIndex === question.correct) {
      options[answerIndex].classList.add('correct');
      state.quizScore++;
    } else {
      options[answerIndex].classList.add('incorrect');
      options[question.correct].classList.add('correct');
      state.wrongAnswers.push({
        topic: state.currentTopic,
        question: question.question,
        correctAnswer: question.options[question.correct],
        userAnswer: question.options[answerIndex],
        explanation: question.explanation,
        timestamp: new Date().toISOString(),
      });
    }
    const scoreEl = document.querySelector('.score-display');
    if (scoreEl) scoreEl.textContent = `Score: ${state.quizScore}/${state.quizTotal}`;
    saveData();
    setTimeout(() => {
      if (questionIndex < state.currentQuiz.questions.length - 1) {
        displayQuestion(questionIndex + 1);
      } else {
        showQuizResults();
      }
    }, 2000);
  }, 500);
}

export function showQuizResults() {
  const container = document.getElementById('quiz-questions');
  const percentage = Math.round((state.quizScore / state.quizTotal) * 100);
  container.innerHTML = `
    <div class="question-card text-center">
      <h3>Quiz Complete!</h3>
      <div style="font-size: 3rem; margin: 1rem 0; color: ${percentage >= 70 ? '#28a745' : '#dc3545'};">${percentage}%</div>
      <p>You scored ${state.quizScore} out of ${state.quizTotal} questions correctly.</p>
      <div class="quiz-actions">
        <button class="quiz-btn primary" onclick="window.resetQuiz()">Take Quiz Again</button>
        <button class="quiz-btn secondary" onclick="window.switchPage('dashboard')">View Dashboard</button>
      </div>
    </div>`;
}

export function resetQuiz() {
  state.quizScore = 0;
  displayQuiz();
}

// expose to inline handlers
window.selectAnswer = selectAnswer;
window.resetQuiz = resetQuiz;
