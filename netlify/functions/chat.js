
export const handler = async (event, context) => {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    // Support both standard and VITE_ prefixed env vars for flexibility
    const apiKey = process.env.DEEPSEEK_API_KEY || process.env.VITE_DEEPSEEK_API_KEY;

    if (!apiKey) {
        console.error("Server Error: DEEPSEEK_API_KEY is missing.");
        return {
            statusCode: 500,
            body: JSON.stringify({ error: { message: "Server configuration error provided. API Key missing." } }),
        };
    }

    try {
        const { messages, model } = JSON.parse(event.body);
        const MAX_RETRIES = 3;
        const RETRY_DELAY_MS = 1000;

        let lastErrorResponse = null;

        // RETRY LOOP
        for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
            try {
                console.log(`Attempt ${attempt} calling DeepSeek...`);

                const response = await fetch('https://api.deepseek.com/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${apiKey}`
                    },
                    body: JSON.stringify({
                        model: model || "deepseek-chat",
                        messages: messages,
                        temperature: 0.7,
                        max_tokens: 2000,
                        stream: false
                    })
                });

                // If success, return immediately
                if (response.ok) {
                    const data = await response.json();
                    return {
                        statusCode: 200,
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(data),
                    };
                }

                // If it's a 5xx error (Server Error from DeepSeek), we throw to verify retry
                if (response.status >= 500) {
                    const errorText = await response.text();
                    throw new Error(`DeepSeek 5xx Error: ${response.status} - ${errorText}`);
                }

                // If it's a 4xx error (Client Error), do NOT retry, return immediately
                const errorData = await response.json().catch(() => ({}));
                return {
                    statusCode: response.status,
                    body: JSON.stringify(errorData),
                };

            } catch (err) {
                console.warn(`Attempt ${attempt} failed:`, err.message);
                lastErrorResponse = err;

                // If this was the last attempt, don't wait, just loop to exit
                if (attempt < MAX_RETRIES) {
                    await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
                }
            }
        }

        // If we exit the loop, all retries failed
        throw lastErrorResponse || new Error("Unknown error after retries");

    } catch (error) {
        console.error("DeepSeek Proxy Final Error:", error);
        return {
            statusCode: 502, // Bad Gateway (since upstream failed)
            body: JSON.stringify({
                error: {
                    message: "DeepSeek is currently overloaded or unreachable. Please try again in a moment.",
                    details: error.message
                }
            }),
        };
    }
};
