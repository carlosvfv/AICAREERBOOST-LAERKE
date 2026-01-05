/**
 * DeepSeek API Service
 * Handles communication with the DeepSeek API for chat completions.
 */

const API_URL = 'https://api.deepseek.com/chat/completions';

/**
 * Sends a message history to DeepSeek and gets a response.
 * @param {Array} messages - Array of message objects { role: 'user'|'assistant'|'system', content: string }
 * @param {string} apiKey - The DeepSeek API Key
 * @returns {Promise<string>} - The assistant's response content
 */
export const chatWithDeepSeek = async (messages, apiKey) => {
    if (!apiKey) {
        throw new Error("API Key is missing");
    }

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "deepseek-chat", // or "deepseek-coder" depending on preference, "deepseek-chat" is safer for general
                messages: messages,
                temperature: 0.7,
                max_tokens: 2000,
                stream: false
            })
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
