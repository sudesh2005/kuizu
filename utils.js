// Utility helpers
export function sanitizeAndParseJSON(text) {
  if (typeof text !== 'string') throw new TypeError('Expected text response');
  let cleaned = text.replace(/```\s*json\s*/gi, '');
  cleaned = cleaned.replace(/```/g, '');
  cleaned = cleaned.trim();

  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace === -1 || lastBrace === -1 || lastBrace < firstBrace) {
    return JSON.parse(cleaned);
  }
  const jsonString = cleaned.substring(firstBrace, lastBrace + 1);
  return JSON.parse(jsonString);
}

export function showLoading(show) {
  const loading = document.getElementById('loading');
  const generateBtn = document.getElementById('generate-btn');
  if (!loading || !generateBtn) return;
  if (show) {
    loading.classList.remove('hidden');
    generateBtn.disabled = true;
  } else {
    loading.classList.add('hidden');
    generateBtn.disabled = false;
  }
}

export function showError(message) {
  const errorDiv = document.getElementById('error-message');
  if (!errorDiv) return;
  errorDiv.textContent = message;
  errorDiv.classList.remove('hidden');
  setTimeout(() => errorDiv.classList.add('hidden'), 5000);
}
