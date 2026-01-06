// Environment detection
const isDev = import.meta.env.DEV;
const API_URL = isDev
    ? 'https://api.deepseek.com/chat/completions'
    : '/.netlify/functions/chat';

/**
 * Sends a message history to the backend proxy (or direct API in Dev).
 * @param {Array} messages - Array of message objects { role: 'user'|'assistant'|'system', content: string }
 * @returns {Promise<string>} - The assistant's response content
 */
export const chatWithDeepSeek = async (messages) => {
    try {
        const headers = {
            'Content-Type': 'application/json'
        };
        const body = {
            model: "deepseek-chat",
            messages: messages
        };

        // Local Dev: Add Authorization header directly
        if (isDev) {
            const localKey = import.meta.env.VITE_DEEPSEEK_API_KEY;
            if (!localKey) throw new Error("Missing VITE_DEEPSEEK_API_KEY in .env.local for local development");
            headers['Authorization'] = `Bearer ${localKey}`;
            // Direct API expects these extra params usually handled by backend
            body.temperature = 0.7;
            body.stream = false;
        }

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error?.message || `API Error: ${response.status}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error("DeepSeek API Call Failed:", error);
        throw error;
    }
};
