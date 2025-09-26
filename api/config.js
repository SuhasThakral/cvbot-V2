export default function handler(req, res) {
    // Only return configuration, not sensitive API keys
    res.status(200).json({
        supabaseUrl: process.env.SUPABASE_URL,
        supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
        // Never expose Perplexity API key to client
        hasPerplexityKey: !!process.env.PERPLEXITY_API_KEY
    });
}