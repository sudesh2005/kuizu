// Gemini API client
const GEMINI_API_KEY = 'AIzaSyDDos7d6YDb35BCmmF7cwDVw_34iEvDbBo';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

export async function callGeminiAPI(prompt) {
  const fullUrl = `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`;
  console.log('Making API call to:', fullUrl);
  console.log('API Key:', GEMINI_API_KEY.substring(0, 10) + '...');

  if (window.location.href.includes('localhost:8765')) {
    console.warn('Running on localhost - this might cause CORS issues');
  }

  try {
    const response = await fetch(fullUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    console.log('Response status:', response.status);
    console.log('Response URL:', response.url);
    console.log('Request was made to:', fullUrl);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(`API request failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('API Response:', data);
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Fetch error:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });
    throw error;
  }
}
