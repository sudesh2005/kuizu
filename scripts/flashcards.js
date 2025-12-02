// Flashcards feature
import { state, saveData } from './state.js';

export function loadFlashcards() {
  const topic = document.getElementById('flashcard-topic-select').value;
  const container = document.getElementById('flashcards-container');
  if (!topic || !state.topics[topic]?.flashcards) {
    container.innerHTML = `
      <div class="no-content">
        <i class="fas fa-cards-blank"></i>
        <h3>No Flashcards Available</h3>
        <p>Generate flashcards from the home page to get started!</p>
      </div>`;
    return;
  }
  state.currentTopic = topic;
  state.currentFlashcards = state.topics[topic].flashcards;
  displayFlashcards();
}

export function displayFlashcards() {
  const container = document.getElementById('flashcards-container');
  const flashcards = state.currentFlashcards;
  function showCard(index) {
    const card = flashcards.cards[index];
    container.innerHTML = `
      <div class="flashcard" onclick="window.flipCard()">
        <div class="flashcard-front">${card.front}</div>
        <div class="flashcard-back hidden">${card.back}</div>
      </div>
      <div class="flashcard-controls">
        <button class="flashcard-btn incorrect" onclick="window.markIncorrect(${index})"><i class="fas fa-times"></i> Incorrect</button>
        <button class="flashcard-btn correct" onclick="window.markCorrect(${index})"><i class="fas fa-check"></i> Correct</button>
        <button class="quiz-btn secondary" onclick="window.nextCard(${index})">Next Card</button>
      </div>
      <div class="text-center mt-2">Card ${index + 1} of ${flashcards.cards.length}</div>`;
  }
  window.showCard = showCard;
  window.currentCardIndex = 0;
  showCard(0);
}

export function flipCard() {
  const card = document.querySelector('.flashcard');
  const front = document.querySelector('.flashcard-front');
  const back = document.querySelector('.flashcard-back');
  if (!card || !front || !back) return;
  if (front.classList.contains('hidden')) {
    front.classList.remove('hidden');
    back.classList.add('hidden');
    card.classList.remove('flipped');
  } else {
    front.classList.add('hidden');
    back.classList.remove('hidden');
    card.classList.add('flipped');
  }
}

export function markCorrect(index) { nextCard(index); }

export function markIncorrect(index) {
  const card = state.currentFlashcards.cards[index];
  state.wrongAnswers.push({
    topic: state.currentTopic,
    question: card.front,
    correctAnswer: card.back,
    userAnswer: 'Incorrect',
    explanation: 'Flashcard marked as incorrect',
    timestamp: new Date().toISOString(),
  });
  saveData();
  nextCard(index);
}

export function nextCard(index) {
  const flashcards = state.currentFlashcards;
  const nextIndex = (index + 1) % flashcards.cards.length;
  window.currentCardIndex = nextIndex;
  window.showCard(nextIndex);
}

// expose to inline handlers
window.flipCard = flipCard;
window.markCorrect = markCorrect;
window.markIncorrect = markIncorrect;
window.nextCard = nextCard;
