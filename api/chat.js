export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { messages } = req.body;

    if (!process.env.PERPLEXITY_API_KEY) {
        return res.status(500).json({ error: 'API key not configured' });
    }

    try {
        const response = await fetch('https://api.perplexity.ai/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'llama-3.1-sonar-small-128k-online',
                messages: messages,
                max_tokens: 500,
                temperature: 0.7,
                top_p: 0.9,
                stream: false
            })
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();

        // Return response with usage data for billing
        res.status(200).json({
            content: data.choices[0].message.content,
            usage: data.usage || { 
                prompt_tokens: 0, 
                completion_tokens: 0, 
                total_tokens: 0 
            }
        });
    } catch (error) {
        console.error('Perplexity API error:', error);
        res.status(500).json({ error: 'Failed to generate response' });
    }
}
