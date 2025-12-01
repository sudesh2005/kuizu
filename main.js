// App bootstrap and high-level actions
import { loadData, saveData, state } from './state.js';
import { initializeEventListeners, selectGenerateOption } from './events.js';
import { updateDashboard, updateTopicSelectors, switchPage } from './ui.js';
import { generateQuiz, generateFlashcards } from './content.js';
import { showLoading, showError } from './utils.js';
import { loadQuiz } from './quiz.js';
import { loadFlashcards } from './flashcards.js';

// Initialize application
document.addEventListener('DOMContentLoaded', function () {
  loadData();
  initializeEventListeners();
  updateDashboard();
  updateTopicSelectors();
});

// Expose for events.js
export { selectGenerateOption, switchPage };

// File upload handler (supports PDF via PDF.js, text fallback)
export async function handleFileUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  const fileNameEl = document.getElementById('file-name');
  if (fileNameEl) fileNameEl.textContent = file.name;
  validateInput();
  state.lastUploadedFile = { name: file.name, text: null };
  try {
    if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
      if (typeof window.pdfjsLib === 'undefined') {
        console.error('pdfjsLib not found. Include PDF.js in your HTML to extract PDF text.');
        showError('PDF.js not loaded; unable to extract PDF text. Using filename only.');
        return;
      }
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.14.305/pdf.worker.min.js';
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const strings = content.items.map(it => it.str || '').filter(Boolean);
        fullText += strings.join(' ') + '\n\n';
      }
      state.lastUploadedFile = { name: file.name, text: fullText };
      saveData();
      console.log(`Extracted ${fullText.length} characters from PDF ${file.name}.`);
    } else {
      try {
        const text = await file.text();
        state.lastUploadedFile = { name: file.name, text };
        saveData();
        console.log(`Read ${text.length} characters from file ${file.name}.`);
      } catch (err) {
        console.warn('Could not read file as text, falling back to filename.', err);
      }
    }
  } catch (err) {
    console.error('Error extracting file content:', err);
    showError('Failed to extract file content. Using filename as fallback.');
  }
}

// Input validation
export function validateInput() {
  const topicInput = document.getElementById('topic-input')?.value.trim() || '';
  const fileInput = document.getElementById('pdf-upload')?.files[0];
  const generateBtn = document.getElementById('generate-btn');
  if (!generateBtn) return;
  generateBtn.disabled = !(topicInput || fileInput);
}

// Content generation orchestrator
export async function generateContent() {
  const topicInput = document.getElementById('topic-input')?.value.trim() || '';
  const fileInput = document.getElementById('pdf-upload')?.files[0];
  const selectedOption = document.querySelector('.option-btn.selected');
  if (!selectedOption) {
    showError('Please select what to generate (Quiz, Flashcards, or Both)');
    return;
  }
  const generateType = selectedOption.dataset.type;
  const topic = topicInput || (fileInput ? fileInput.name.replace('.pdf', '') : 'Unknown Topic');
  showLoading(true);
  try {
    let content = '';
    if (fileInput) {
      const inputText = state.lastUploadedFile?.text;
      content = inputText && inputText.length > 0
        ? inputText
        : `Generate educational content about ${topic}. This is based on a file: ${fileInput.name}`;
    } else {
      content = `Generate educational content about ${topic}`;
    }
    const promises = [];
    if (generateType === 'quiz' || generateType === 'both') promises.push(generateQuiz(content, topic));
    if (generateType === 'flashcards' || generateType === 'both') promises.push(generateFlashcards(content, topic));
    await Promise.all(promises);
    if (!state.topics[topic]) {
      state.topics[topic] = { quiz: null, flashcards: null, createdAt: new Date().toISOString() };
    }
    saveData();
    updateTopicSelectors();
    if (generateType === 'quiz') {
      switchPage('quiz');
      const sel = document.getElementById('quiz-topic-select');
      if (sel) sel.value = topic;
      loadQuiz();
    } else if (generateType === 'flashcards') {
      switchPage('flashcards');
      const sel = document.getElementById('flashcard-topic-select');
      if (sel) sel.value = topic;
      loadFlashcards();
    } else {
      switchPage('quiz');
      const sel = document.getElementById('quiz-topic-select');
      if (sel) sel.value = topic;
      loadQuiz();
    }
  } catch (error) {
    console.error('Error generating content:', error);
    showError('Failed to generate content. Please try again.');
  } finally {
    showLoading(false);
  }
}
