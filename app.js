// CV Chatbot Application
class CVChatbot {
    constructor() {
        this.resumeContent = `SUHAS THAKRAL
📧 suhas.thakral@whu.edu
Head of Business Intelligence & AI

PROFESSIONAL SUMMARY
Experienced data leader with a track record of generating business impact through insights and algorithms. Strong team management skills and ability to collaborate across departments. Proficient in AI concepts and applications including prompt engineering, with expertise in driving AI adoption and integrating large language models into BI workflows for automated insights and human-centered data interactions.

CORE COMPETENCIES
AI & Advanced Analytics: AI concepts, Prompt engineering, Large Language Models, "Vibe coding" techniques, Automated insights, RAG, AI Chatbot with vector search, Vector search, Vector Databses, Rerieval Augnemented Generation
Data Technologies: BigQuery, AWS, SQL, Python, Data warehousing, ETL (Fivetran, Stitch Data, DBT, Airflow)
Visualization & BI: Tableau, Looker Studio, QlikSense, Metabase, Dashboard design, Reporting frameworks
CRM & Platforms: Salesforce, Hubspot, Pipedrive, Cloud Functions, Cloud Scheduler, ZeroETL

PROFESSIONAL EXPERIENCE

Head of Business Intelligence | HYGH AG | Apr 2022 - Current Role 
Key Business Impact Achievements:
• Revenue Impact: Built attribution model to attribute revenue to each screen, providing cleaner investor reporting
• Cost Optimization: Analyzed late closers and early shutting shops, built proportional system for fair rent, reducing OPEX by 10%
• Revenue Growth: Negotiated higher CMP with measuring authorities, directly increasing revenue potential by 11%
• AI Innovation: Built AI automation for TEXT to SQL on N*N for simple Salesforce data
• Sales Efficiency: Assisted in quoting tool development with automated offer building, saving sales team ~30 minutes per offer
• Strategic Planning and Business Partnership - Collaborating with senior leadership to define and align the BI department strategy with company goals
• Driving AI adoption and prompt engineering: integrating AI into BI workflows—leveraging large language models for automated insights
• Salesforce Admin and product owner - Custom building apps on Salesforce to bring all systems under one ecosystem
• Reporting and Visualization - Designing and implementing reporting frameworks and dashboards for clients, stakeholders, and investors
• Analysis of revenue data and modeling for forecasting and setting targets
• Design, implementation, and rollout of incentive models
• Managing the master reporting project to make data accessible to all stakeholders
• Training of new hires and mentoring the team to improve data skills on TABLEAU and SQL

Business Intelligence Team Lead | Atheneum | Jan 2020 - Apr 2022 (2 years 10 months)
Key Business Impact Achievements:
• Revenue Growth: Built compensation model based on net revenue, increasing gross revenue by 50%
• Team Building: Expanded data team from 1 person to 8 across Berlin, London, and Lahore
• Strategic Alignment: Worked with upper management to align financial goals with BI for direct measurable impact
• Data Control and Management - Coordinating with engineering and product team to enforce data governance, accuracy, and consistency

Business Intelligence Controller | Atheneum | Jun 2019 - Jan 2020

CRM Manager | SMUNCH | Nov 2018 - Jun 2019 (8 months)
• Data migration and cleaning between CRM systems
• Implementation of sales process and lead research process
• Optimizing sales process using MarketingCloud automation
• Creating reports on Tableau and Salesforce to track new KPIs

Business Intelligence Analyst | Medigo GmbH | Nov 2017 - Nov 2018 (1 year 1 month)
• Automation of controlling tasks using TABLEAU and Zapier
• Creation of dashboards on TABLEAU to visualize data in the most understandable ways
• Analysis of data to find trends of seasonality and calculation of team compensation
• Data extraction and transformation using SQL and various ad-hoc analysis
• CRM Owner and trainer, improving sales processes through data analysis
• Analyzing conversion rates and implementing new technologies for optimization
• Creation of various dashboards using QlikSense for operational and financial KPIs

Consultant | Aon | Jun 2014 - Feb 2015 (9 months)
• Worked as junior analyst in consulting operations with team of 20 analysts and project leads
• Managed team engagement projects in South East Asian and European markets
• Analyzed statistical data and worked on ROI presentations for clients including McDonald's

EDUCATION
Master in Management | WHU – Otto Beisheim School of Management | 2015 - 2017
Master's degree, Business, Management, Marketing | University of South Carolina Darla Moore School of Business | 2016
Bachelor of Arts (B.A.), Economics | Delhi University Hansraj College | 2011 - 2014`;

        this.state = {
            theme: 'light',
            questionsRemaining: 5,
            isEmailVerified: false,
            totalCost: 0.0,
            chatHistory: [],
            isTyping: false,
            conversationContext: []
        };

        this.costPerQuestion = 0.05;

        // API Configuration
        this.PERPLEXITY_API_URL = 'https://api.perplexity.ai/chat/completions';
        this.SUPABASE_URL = window.SUPABASE_URL || process.env.SUPABASE_URL;
        this.SUPABASE_ANON_KEY = window.SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
        this.PERPLEXITY_API_KEY = window.PERPLEXITY_API_KEY || process.env.PERPLEXITY_API_KEY;

        // Initialize Supabase client
        if (this.SUPABASE_URL && this.SUPABASE_ANON_KEY && window.supabase) {
            this.supabaseClient = window.supabase.createClient(this.SUPABASE_URL, this.SUPABASE_ANON_KEY);
        }

        this.fallbackSuggestions = [
            "What is Suhas's current role at HYGH AG?",
            "What are his key AI and ML competencies?",
            "Tell me about his team leadership experience at Atheneum",
            "What business impact has he achieved in his roles?",
            "What's his educational background from WHU?",
            "Which BI tools and platforms does he specialize in?",
            "What AI automation projects has he worked on?",
            "How did he grow the data team at Atheneum?",
            "What cost optimization results has he achieved?",
            "What are his Salesforce and CRM skills?"
        ];

        this.currentSuggestions = this.fallbackSuggestions.slice(0, 3);

        this.init();
    }

    init() {
        this.loadFromStorage();
        this.initializeTheme();
        this.bindEvents();
        this.updateUI();
        this.loadChatHistory();
    }

    loadFromStorage() {
        const stored = localStorage.getItem('cvChatbotState');
        if (stored) {
            try {
                const parsedState = JSON.parse(stored);
                this.state = { ...this.state, ...parsedState };
            } catch (e) {
                console.warn('Failed to parse stored state');
            }
        }
    }

    saveToStorage() {
        try {
            localStorage.setItem('cvChatbotState', JSON.stringify(this.state));
        } catch (e) {
            console.warn('Failed to save state to localStorage');
        }
    }

    loadChatHistory() {
        if (this.state.chatHistory.length > 1) {
            const chatMessages = document.getElementById('chatMessages');
            // Clear existing messages except the welcome message
            chatMessages.innerHTML = `
                <div class="message assistant-message welcome-message">
                    <div class="message-content">
                        <div class="message-text">
                            Hello! I'm here to help you learn about Suhas Thakral's professional background. You can ask me about his experience, skills, education, or any other details from his CV. I'll be frank about what information I can or cannot find.
                        </div>
                        <div class="message-time">Now</div>
                    </div>
                </div>
            `;

            // Add stored messages
            this.state.chatHistory.forEach((msg, index) => {
                if (index > 0) { // Skip the welcome message
                    this.addMessageToDOM(msg.content, msg.type, msg.timestamp, false);
                }
            });

            this.scrollToBottom();
        }
    }

    initializeTheme() {
        if (this.state.theme) {
            document.documentElement.setAttribute('data-color-scheme', this.state.theme);
        } else {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            this.state.theme = prefersDark ? 'dark' : 'light';
            document.documentElement.setAttribute('data-color-scheme', this.state.theme);
        }
        this.updateThemeIcon();
    }

    bindEvents() {
        // Theme toggle
        document.getElementById('themeToggle').addEventListener('click', () => {
            this.toggleTheme();
        });

        // Send message
        document.getElementById('sendButton').addEventListener('click', () => {
            this.sendMessage();
        });

        // Enter key to send
        document.getElementById('messageInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Auto-resize textarea
        document.getElementById('messageInput').addEventListener('input', (e) => {
            this.autoResizeTextarea(e.target);
        });

        // Suggestion buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('suggestion-btn')) {
                const question = e.target.dataset.question;
                this.sendSuggestion(question);
            }
        });

        // Modal events
        document.getElementById('closeModal').addEventListener('click', () => {
            this.hideModal();
        });

        document.getElementById('cancelButton').addEventListener('click', () => {
            this.hideModal();
        });

        document.getElementById('verifyButton').addEventListener('click', () => {
            this.verifyEmail();
        });

        // Close modal on backdrop click
        document.getElementById('emailModal').addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-backdrop')) {
                this.hideModal();
            }
        });
    }

    toggleTheme() {
        this.state.theme = this.state.theme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-color-scheme', this.state.theme);
        this.updateThemeIcon();
        this.saveToStorage();
    }

    updateThemeIcon() {
        const icon = document.querySelector('.theme-icon');
        icon.textContent = this.state.theme === 'light' ? '🌙' : '☀️';
    }

    autoResizeTextarea(textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    }

    async sendSuggestion(question) {
        const input = document.getElementById('messageInput');
        input.value = question;
        this.autoResizeTextarea(input);
        await this.sendMessage();
    }

    async sendMessage() {
        const input = document.getElementById('messageInput');
        const message = input.value.trim();

        if (!message || this.state.isTyping) return;

        if (this.state.questionsRemaining <= 0 && !this.state.isEmailVerified) {
            this.showModal();
            return;
        }

        // Check cost limit
        if (this.state.totalCost >= 5.0) {
            this.addMessageToDOM("I'm sorry, but you've reached the monthly cost limit of $5.00. Please try again next month.", 'assistant');
            return;
        }

        // Store question in Supabase
        await this.storeQuestion(message);

        // Add user message
        this.addMessageToDOM(message, 'user');
        input.value = '';
        input.style.height = 'auto';

        // Update state
        if (this.state.questionsRemaining > 0) {
            this.state.questionsRemaining--;
        }
        this.state.totalCost += this.costPerQuestion;
        this.state.conversationContext.push(message);

        this.updateUI();
        this.saveToStorage();

        // Show typing indicator
        this.showTypingIndicator();

        try {
            // Generate response using Perplexity API
            const response = await this.generateResponseWithPerplexity(message);
            this.hideTypingIndicator();
            await this.addMessageWithTyping(response, 'assistant');
        } catch (error) {
            console.error('Error generating response:', error);
            this.hideTypingIndicator();

            // Fallback to local response generation
            const fallbackResponse = await this.generateResponse(message);
            await this.addMessageWithTyping(fallbackResponse, 'assistant');
        }

        // Update suggestions based on conversation
        await this.updateSuggestions();
    }

    async storeQuestion(question) {
        if (!this.supabaseClient) {
            console.warn('Supabase not configured, skipping question storage');
            return;
        }

        try {
            const { data, error } = await this.supabaseClient
                .from('questions')
                .insert([
                    { text: question }
                ]);

            if (error) {
                console.error('Error storing question:', error);
            }
        } catch (error) {
            console.error('Failed to store question in Supabase:', error);
        }
    }

    async generateResponseWithPerplexity(question) {
        if (!this.PERPLEXITY_API_KEY) {
            throw new Error('Perplexity API key not configured');
        }

        const response = await fetch(this.PERPLEXITY_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.PERPLEXITY_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'llama-3.1-sonar-small-128k-online',
                messages: [
                    {
                        role: 'system',
                        content: `You are an AI assistant helping people learn about Suhas Thakral's professional background. Here is his CV information:

${this.resumeContent}

Answer questions about Suhas's experience, skills, education, achievements, and background based on this information. If the question cannot be answered from the CV, politely explain what information is available. Keep responses conversational and informative.`
                    },
                    {
                        role: 'user',
                        content: question
                    }
                ],
                max_tokens: 500,
                temperature: 0.7,
                top_p: 0.9,
                stream: false
            })
        });

        if (!response.ok) {
            throw new Error(`Perplexity API error: ${response.status}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    }

    addMessageToDOM(content, type, timestamp = null, animate = true) {
        const chatMessages = document.getElementById('chatMessages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}-message`;

        if (!animate) {
            messageDiv.style.animation = 'none';
        }

        const messageTime = timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        messageDiv.innerHTML = `
            <div class="message-content">
                <div class="message-text">${content}</div>
                <div class="message-time">${messageTime}</div>
            </div>
        `;

        chatMessages.appendChild(messageDiv);
        this.scrollToBottom();

        // Store in chat history
        this.state.chatHistory.push({ content, type, timestamp: messageTime });
        this.saveToStorage();
    }

    async addMessageWithTyping(content, type) {
        const chatMessages = document.getElementById('chatMessages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}-message`;

        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        messageDiv.innerHTML = `
            <div class="message-content">
                <div class="message-text">
                    <span class="typewriter-text"></span>
                </div>
                <div class="message-time">${timestamp}</div>
            </div>
        `;

        chatMessages.appendChild(messageDiv);
        this.scrollToBottom();

        // Typing animation
        const textElement = messageDiv.querySelector('.typewriter-text');
        await this.typeText(textElement, content);
        textElement.classList.remove('typewriter-text');

        // Store in chat history
        this.state.chatHistory.push({ content, type, timestamp });
        this.saveToStorage();
    }

    async typeText(element, text) {
        const words = text.split(' ');
        let currentText = '';

        for (let i = 0; i < words.length; i++) {
            currentText += (i > 0 ? ' ' : '') + words[i];
            element.textContent = currentText;
            this.scrollToBottom();

            // Variable speed - faster for common words
            const delay = words[i].length < 4 ? 50 : 100;
            await this.delay(delay + Math.random() * 50);
        }
    }

    showTypingIndicator() {
        this.state.isTyping = true;
        const chatMessages = document.getElementById('chatMessages');
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message assistant-message typing-message';
        typingDiv.id = 'typingIndicator';

        typingDiv.innerHTML = `
            <div class="message-content">
                <div class="message-text">
                    <div class="typing-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            </div>
        `;

        chatMessages.appendChild(typingDiv);
        this.scrollToBottom();
    }

    hideTypingIndicator() {
        this.state.isTyping = false;
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    async generateResponse(question) {
        // Simulate API delay for realistic feel
        await this.delay(1000 + Math.random() * 2000);

        const lowerQuestion = question.toLowerCase();

        // Check if the question can be answered from the CV
        const response = this.searchResumeContent(lowerQuestion);

        if (response) {
            return response;
        } else {
            return "I'm being frank with you - I couldn't find specific information about that in Suhas's CV. I can help you with questions about his work experience, skills, education, achievements, or personal projects. What would you like to know?";
        }
    }

    searchResumeContent(question) {
        const content = this.resumeContent.toLowerCase();

        // Experience-related queries
        if (question.includes('experience') || question.includes('work') || question.includes('job') || question.includes('company')) {
            if (question.includes('current') || question.includes('latest') || question.includes('recent')) {
                return "Suhas is currently working as Head of Business Intelligence at HYGH AG since April 2022. In this role, he's built attribution models for revenue tracking, optimized costs reducing OPEX by 10%, negotiated revenue increases of 11%, and led AI automation initiatives including TEXT to SQL solutions for Salesforce data. He's also assisted in developing quoting tools that save the sales team ~30 minutes per offer.";
            }
            return "Suhas has extensive experience in data analytics and business intelligence. His career includes Head of Business Intelligence at HYGH AG (2022-Present), Business Intelligence Team Lead at Atheneum (2020-2022), Business Intelligence Controller at Atheneum (2019-2020), CRM Manager at SMUNCH (2018-2019), Business Intelligence Analyst at Medigo GmbH (2017-2018), and Consultant at Aon (2014-2015).";
        }

        // Skills-related queries
        if (question.includes('skill') || question.includes('technology') || question.includes('tool') || question.includes('programming')) {
            if (question.includes('ai') || question.includes('machine learning') || question.includes('ml')) {
                return "Suhas has strong AI and ML expertise including AI concepts, Prompt engineering, Large Language Models, 'Vibe coding' techniques, Automated insights, RAG (Retrieval Augmented Generation), AI Chatbot with vector search, and Vector databases. He's actively driving AI adoption and integrating LLMs into BI workflows for automated insights and human-centered data interactions.";
            }
            if (question.includes('salesforce') || question.includes('crm')) {
                return "Suhas has extensive Salesforce expertise - he serves as a Salesforce Admin and product owner at HYGH AG, custom building apps on Salesforce to bring all systems under one ecosystem. He's also worked with Hubspot, Pipedrive, and has experience with CRM data migration and cleaning, sales process optimization using MarketingCloud automation.";
            }
            return "Suhas has comprehensive technical skills across AI & Advanced Analytics (LLMs, RAG, Vector search, Prompt engineering), Data Technologies (BigQuery, AWS, SQL, Python, ETL tools like Fivetran, Stitch Data, DBT, Airflow), Visualization & BI (Tableau, Looker Studio, QlikSense, Metabase), and CRM & Platforms (Salesforce, Hubspot, Pipedrive, Cloud Functions, Cloud Scheduler, ZeroETL).";
        }

        // Education queries
        if (question.includes('education') || question.includes('degree') || question.includes('university') || question.includes('study') || question.includes('whu')) {
            return "Suhas has a strong educational background with a Master in Management from WHU – Otto Beisheim School of Management (2015-2017), a Master's degree in Business, Management, Marketing from University of South Carolina Darla Moore School of Business (2016), and a Bachelor of Arts in Economics from Delhi University Hansraj College (2011-2014).";
        }

        // Achievements queries
        if (question.includes('achievement') || question.includes('accomplish') || question.includes('success') || question.includes('impact') || question.includes('business impact')) {
            return "Suhas has impressive business impact achievements: built attribution models for cleaner investor reporting, reduced OPEX by 10% through cost optimization analysis, increased revenue potential by 11% through CMP negotiations, expanded a data team from 1 to 8 people across Berlin, London, and Lahore, increased gross revenue by 50% through compensation modeling at Atheneum, and implemented AI automation for TEXT to SQL processes. He's also saved sales teams significant time through automated offer building tools.";
        }

        // Leadership/Management queries
        if (question.includes('leadership') || question.includes('team') || question.includes('manage') || question.includes('mentor')) {
            return "Suhas has strong leadership experience, particularly at Atheneum where he expanded the data team from 1 person to 8 across Berlin, London, and Lahore. At HYGH AG, he collaborates with senior leadership to define BI department strategy, trains new hires and mentors the team to improve data skills on Tableau and SQL. He's skilled in managing cross-functional projects and aligning financial goals with BI for direct measurable impact.";
        }

        // Location/Contact queries
        if (question.includes('location') || question.includes('where') || question.includes('based') || question.includes('contact') || question.includes('email')) {
            return "You can contact Suhas at suhas.thakral@whu.edu. Based on his experience with companies across different regions and his educational background, he has worked internationally.";
        }

        // AI/Automation specific queries
        if (question.includes('automation') || question.includes('text to sql') || question.includes('ai innovation')) {
            return "Suhas has built AI automation for TEXT to SQL on N*N for simple Salesforce data at HYGH AG. He's driving AI adoption and prompt engineering by integrating AI into BI workflows, leveraging large language models for automated insights and human-centered data interactions. His expertise includes RAG systems, AI chatbots with vector search, and various 'vibe coding' techniques.";
        }

        // BI Tools specific queries
        if (question.includes('tableau') || question.includes('looker') || question.includes('qlik') || question.includes('metabase') || question.includes('dashboard')) {
            return "Suhas is highly skilled in BI and visualization tools including Tableau, Looker Studio, QlikSense, and Metabase. At his various roles, he's created comprehensive dashboards to visualize data in the most understandable ways, designed reporting frameworks for clients and stakeholders, managed master reporting projects to make data accessible, and trained team members on Tableau and SQL skills.";
        }

        // Company-specific queries
        if (question.includes('hygh') || question.includes('atheneum') || question.includes('smunch') || question.includes('medigo') || question.includes('aon')) {
            if (question.includes('hygh')) {
                return "At HYGH AG (April 2022-Present), Suhas serves as Head of Business Intelligence. His key achievements include building attribution models for revenue tracking, reducing OPEX by 10%, increasing revenue potential by 11%, implementing AI automation for TEXT to SQL, and developing automated offer building tools that save sales teams ~30 minutes per offer.";
            }
            if (question.includes('atheneum')) {
                return "At Atheneum, Suhas worked as Business Intelligence Team Lead (Jan 2020 - Apr 2022) and Business Intelligence Controller (Jun 2019 - Jan 2020). His major achievements include building compensation models that increased gross revenue by 50%, expanding the data team from 1 to 8 people across Berlin, London, and Lahore, and working with upper management to align financial goals with BI.";
            }
            return "Suhas has worked at several notable companies: HYGH AG (current, Head of BI), Atheneum (BI Team Lead), SMUNCH (CRM Manager), Medigo GmbH (BI Analyst), and Aon (Consultant). Each role involved significant data analytics, business intelligence, and process optimization work.";
        }

        return null;
    }

    async updateSuggestions() {
        const suggestionsLoading = document.getElementById('suggestionsLoading');
        suggestionsLoading.classList.remove('hidden');

        // Simulate suggestion generation delay
        await this.delay(1500 + Math.random() * 1000);

        // Generate contextual suggestions based on conversation
        const newSuggestions = this.generateContextualSuggestions();
        this.currentSuggestions = newSuggestions;

        suggestionsLoading.classList.add('hidden');
        this.renderSuggestions();
    }

    generateContextualSuggestions() {
        const recentQuestions = this.state.conversationContext.slice(-3);
        let suggestions = [];

        // Analyze recent conversation context
        const hasAskedAboutExperience = recentQuestions.some(q => 
            q.toLowerCase().includes('experience') || q.toLowerCase().includes('work') || q.toLowerCase().includes('job')
        );

        const hasAskedAboutSkills = recentQuestions.some(q => 
            q.toLowerCase().includes('skill') || q.toLowerCase().includes('technology') || q.toLowerCase().includes('programming')
        );

        const hasAskedAboutEducation = recentQuestions.some(q => 
            q.toLowerCase().includes('education') || q.toLowerCase().includes('degree') || q.toLowerCase().includes('university')
        );

        const hasAskedAboutAI = recentQuestions.some(q => 
            q.toLowerCase().includes('ai') || q.toLowerCase().includes('automation') || q.toLowerCase().includes('machine learning')
        );

        // Generate contextual suggestions
        if (!hasAskedAboutExperience) {
            suggestions.push("What is Suhas's current role at HYGH AG?");
        } else {
            suggestions.push("Tell me about his team leadership experience at Atheneum");
        }

        if (!hasAskedAboutSkills) {
            suggestions.push("What are his core BI and data visualization skills?");
        } else if (!hasAskedAboutAI) {
            suggestions.push("What AI and automation projects has he worked on?");
        } else {
            suggestions.push("What Salesforce and CRM expertise does he have?");
        }

        if (!hasAskedAboutEducation) {
            suggestions.push("What's his educational background from WHU?");
        } else {
            suggestions.push("What business impact has he achieved in his roles?");
        }

        // Fill remaining slots with relevant questions
        const additionalSuggestions = [
            "How did he grow the data team from 1 to 8 people?",
            "What cost optimization results has he achieved?",
            "Which BI tools does he specialize in?",
            "What AI chatbot and RAG experience does he have?",
            "Tell me about his TEXT to SQL automation work",
            "What revenue growth has he delivered?",
            "How can I contact Suhas?",
            "What companies has he worked for?"
        ];

        // Add additional suggestions if we need more
        while (suggestions.length < 3) {
            const randomSuggestion = additionalSuggestions[Math.floor(Math.random() * additionalSuggestions.length)];
            if (!suggestions.includes(randomSuggestion)) {
                suggestions.push(randomSuggestion);
            }
        }

        return suggestions.slice(0, 3);
    }

    renderSuggestions() {
        const suggestionsList = document.getElementById('suggestionsList');
        suggestionsList.innerHTML = '';

        this.currentSuggestions.forEach(suggestion => {
            const button = document.createElement('button');
            button.className = 'suggestion-btn';
            button.dataset.question = suggestion;
            button.textContent = suggestion;
            suggestionsList.appendChild(button);
        });
    }

    showModal() {
        document.getElementById('emailModal').classList.remove('hidden');
    }

    hideModal() {
        document.getElementById('emailModal').classList.add('hidden');
        document.getElementById('verificationStatus').classList.add('hidden');
        document.getElementById('emailInput').value = '';
    }

    async verifyEmail() {
        const email = document.getElementById('emailInput').value.trim();

        if (!email || !this.isValidEmail(email)) {
            alert('Please enter a valid email address.');
            return;
        }

        // Simulate email verification
        document.getElementById('verifyButton').disabled = true;
        document.getElementById('verifyButton').textContent = 'Verifying...';

        await this.delay(2000);

        this.state.isEmailVerified = true;
        this.state.questionsRemaining = 10;

        document.getElementById('verificationStatus').classList.remove('hidden');
        document.getElementById('verifyButton').textContent = 'Verified!';

        this.updateUI();
        this.saveToStorage();

        setTimeout(() => {
            this.hideModal();
            document.getElementById('verifyButton').disabled = false;
            document.getElementById('verifyButton').textContent = 'Verify Email';
        }, 2000);
    }

    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    updateUI() {
        // Update question count
        const questionCount = document.getElementById('questionCount');
        questionCount.textContent = this.state.questionsRemaining;

        // Update cost
        const currentCost = document.getElementById('currentCost');
        currentCost.textContent = `$${this.state.totalCost.toFixed(2)}`;

        // Check if approaching cost limit
        if (this.state.totalCost >= 4.50) {
            currentCost.style.color = 'var(--color-warning)';
        } else if (this.state.totalCost >= 4.90) {
            currentCost.style.color = 'var(--color-error)';
        }
    }

    scrollToBottom() {
        const chatMessages = document.getElementById('chatMessages');
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new CVChatbot();
});
