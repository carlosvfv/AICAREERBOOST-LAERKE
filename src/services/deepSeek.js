// Environment detection
const isDev = import.meta.env.DEV;
const API_URL = isDev
    ? 'https://api.deepseek.com/chat/completions'
    : '/.netlify/functions/chat';

/**
 * Sends a message history to the backend and streams the response.
 * @param {Array} messages - Array of message objects
 * @param {Function} onChunk - Callback function called with each new text fragment (string)
 * @returns {Promise<void>}
 */
export const chatWithDeepSeekStream = async (messages, onChunk) => {
    try {
        const headers = {
            'Content-Type': 'application/json'
        };
        const body = {
            model: "deepseek-chat",
            messages: messages,
            stream: true // Start direct streaming
        };

        if (isDev) {
            const localKey = import.meta.env.VITE_DEEPSEEK_API_KEY;
            if (!localKey) throw new Error("Missing VITE_DEEPSEEK_API_KEY in .env.local for local development");
            headers['Authorization'] = `Bearer ${localKey}`;
        }

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API Error: ${response.status} - ${errorText}`);
        }

        // Reader for the stream
        const reader = response.body.getReader();
        const decoder = new TextDecoder("utf-8");
        let buffer = "";

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            buffer += chunk;

            // Process SSE (data: ...) lines
            const lines = buffer.split("\n");
            buffer = lines.pop(); // Keep incomplete line in buffer

            for (const line of lines) {
                const trimmed = line.trim();
                if (!trimmed || trimmed === "data: [DONE]") continue;

                if (trimmed.startsWith("data: ")) {
                    try {
                        const json = JSON.parse(trimmed.replace("data: ", ""));
                        const content = json.choices?.[0]?.delta?.content || "";
                        if (content) {
                            onChunk(content);
                        }
                    } catch (e) {
                        console.warn("Error parsing stream chunk", e);
                    }
                }
            }
        }

    } catch (error) {
        console.error("DeepSeek Stream Error:", error);
        throw error;
    }
};

// Legacy non-streaming function (kept for reference or fallback, mostly unused now)
export const chatWithDeepSeek = async (messages) => {
    let fullText = "";
    await chatWithDeepSeekStream(messages, (chunk) => fullText += chunk);
    return fullText;
};
