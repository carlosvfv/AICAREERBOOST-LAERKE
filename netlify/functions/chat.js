
export const handler = async (event, context) => {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const apiKey = process.env.DEEPSEEK_API_KEY;

    if (!apiKey) {
        console.error("Server Error: DEEPSEEK_API_KEY is missing in environment variables.");
        return {
            statusCode: 500,
            body: JSON.stringify({ error: { message: "Server configuration error provided. DEEPSEEK_API_KEY is undefined/empty." } }),
        };
    }

    try {
        const { messages, model } = JSON.parse(event.body);

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

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error?.message || `API Error: ${response.status}`);
        }

        const data = await response.json();

        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data),
        };

    } catch (error) {
        console.error("DeepSeek Proxy Error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: {
                    message: "Failed to communicate with AI provider.",
                    details: error.message
                }
            }),
        };
    }
};
