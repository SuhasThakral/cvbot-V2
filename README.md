# Suhas Thakral - CV Chatbot

An intelligent CV chatbot application built with vanilla JavaScript and Vercel serverless functions. Features token counting, cost tracking, email verification, and smart contextual suggestions.

## Features

- **AI-Powered Chat**: Integrates with Perplexity API for intelligent responses
- **Token Counting**: Accurate token estimation and usage tracking
- **Cost Management**: Hidden API costs with user-friendly pricing ($0.05/question)
- **Question Limits**: 5 free questions, 10 more after email verification
- **Smart Suggestions**: Contextual question suggestions based on conversation
- **Database Integration**: Supabase for storing questions and usage metrics
- **Theme Toggle**: Light and dark mode support
- **Responsive Design**: Works on all devices
- **Typing Animation**: Realistic typing effect for responses

## Tech Stack

- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Backend**: Vercel Serverless Functions
- **Database**: Supabase (PostgreSQL)
- **AI**: Perplexity API (llama-3.1-sonar-small-128k-online)
- **Deployment**: Vercel

## Project Structure

```
cv-chatbot/
├── index.html              # Main HTML file
├── app.js                  # Main application logic
├── style.css              # Complete styling with design system
├── api/
│   ├── chat.js            # Perplexity API integration
│   └── config.js          # Configuration endpoint
├── README.md              # This file
├── package.json           # Dependencies
└── vercel.json            # Deployment configuration
```

## Setup Instructions

### 1. Clone and Deploy

1. Create a new repository on GitHub
2. Upload all files to your repository
3. Connect to Vercel and deploy

### 2. Environment Variables

Add these environment variables in your Vercel project settings:

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
PERPLEXITY_API_KEY=your_perplexity_api_key
```

### 3. Database Setup

Create these tables in your Supabase database:

```sql
-- Questions tracking
CREATE TABLE chat_interactions (
    id SERIAL PRIMARY KEY,
    question_text TEXT NOT NULL,
    estimated_input_tokens INTEGER,
    user_session VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- App visits tracking
CREATE TABLE app_visits (
    id SERIAL PRIMARY KEY,
    visit_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_session VARCHAR(100)
);

-- Usage metrics (for cost tracking)
CREATE TABLE usage_metrics (
    id SERIAL PRIMARY KEY,
    input_tokens INTEGER NOT NULL,
    output_tokens INTEGER NOT NULL,
    actual_cost DECIMAL(10,6),
    displayed_cost DECIMAL(10,2),
    user_session VARCHAR(100),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 4. API Keys Setup

#### Supabase
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Settings > API
4. Copy your URL and anon key

#### Perplexity AI
1. Go to [perplexity.ai](https://perplexity.ai)
2. Sign up for Pro account
3. Get API key from settings
4. Add to environment variables

## Usage

### Local Development

1. Open `index.html` in a browser
2. The app will run in fallback mode without API integration
3. All features work except AI responses (uses fallback responses)

### Production Deployment

1. Deploy to Vercel
2. Add environment variables
3. Set up Supabase database
4. Full functionality with AI responses

## Architecture

### Client-Side (app.js)
- Handles UI interactions
- Manages state and localStorage
- Token estimation
- Fallback response generation

### Server-Side (api/)
- `chat.js`: Secure Perplexity API integration
- `config.js`: Safe configuration endpoint

### Database Layer
- Question storage and analytics
- Usage metrics and cost tracking
- Visit tracking for analytics

## Security Features

- API keys never exposed to client
- Server-side API calls only
- Secure environment variable handling
- Input validation and sanitization

## Browser Support

- Modern browsers (Chrome 90+, Firefox 88+, Safari 14+)
- Mobile responsive design
- Progressive enhancement approach

## License

MIT License - feel free to use and modify as needed.
