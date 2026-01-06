
export default async (request, context) => {
    // Only allow POST requests
    if (request.method !== 'POST') {
        return new Response('Method Not Allowed', { status: 405 });
    }

    const apiKey = Netlify.env.get("DEEPSEEK_API_KEY") || Netlify.env.get("VITE_DEEPSEEK_API_KEY");

    if (!apiKey) {
        console.error("Server Error: API Key missing.");
        return new Response(JSON.stringify({ error: { message: "Server configuration error provided. API Key missing." } }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }

    try {
        const { messages, model } = await request.json();

        // 1. Call DeepSeek with stream: true
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
                stream: true // Enable streaming upstream
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`DeepSeek API Error: ${response.status} - ${errorText}`);
        }

        // 2. Return the stream directly to the client
        // This "pipes" the upstream response to the user immediately, keeping connection alive
        return new Response(response.body, {
            headers: {
                "Content-Type": "text/event-stream",
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
            }
        });

    } catch (error) {
        console.error("Stream Proxy Error:", error);
        return new Response(JSON.stringify({
            error: {
                message: "Failed to establish stream.",
                details: error.message
            }
        }), {
            status: 502,
            headers: { "Content-Type": "application/json" }
        });
    }
};


