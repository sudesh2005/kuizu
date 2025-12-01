// Content generation orchestrators
import { callGeminiAPI } from './api.js';
import { sanitizeAndParseJSON, showError } from './utils.js';
import { state } from './state.js';

export async function generateQuiz(content, topic) {
  const prompt = `${content}. Create a quiz with 5 multiple choice questions. Each question should have 4 options (A, B, C, D) with only one correct answer. Format the response as JSON with this structure:\n    {\n        "questions": [\n            {\n                "question": "Question text",\n                "options": ["Option A", "Option B", "Option C", "Option D"],\n                "correct": 0,\n                "explanation": "Explanation of the correct answer"\n            }\n        ]\n    }`;
  const response = await callGeminiAPI(prompt);
  let quizData;
  try { quizData = sanitizeAndParseJSON(response); }
  catch (err) { console.error('Failed to parse quiz JSON:', err, 'raw response:', response); showError('Failed to parse quiz data from API. See console for details.'); throw err; }
  state.topics[topic] = state.topics[topic] || {};
  state.topics[topic].quiz = quizData;
}

export async function generateFlashcards(content, topic) {
  const prompt = `${content}. Create 10 flashcards. Each flashcard should have a front (question/concept) and back (answer/explanation). Format the response as JSON with this structure:\n    {\n        "cards": [\n            {\n                "front": "Front of the card",\n                "back": "Back of the card"\n            }\n        ]\n    }`;
  const response = await callGeminiAPI(prompt);
  let flashcardData;
  try { flashcardData = sanitizeAndParseJSON(response); }
  catch (err) { console.error('Failed to parse flashcards JSON:', err, 'raw response:', response); showError('Failed to parse flashcards data from API. See console for details.'); throw err; }
  state.topics[topic] = state.topics[topic] || {};
  state.topics[topic].flashcards = flashcardData;
}
