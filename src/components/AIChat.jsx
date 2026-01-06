import React, { useState, useRef, useEffect } from 'react';
import { chatWithDeepSeek } from '../services/deepSeek';
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';

// Fix for PDF.js worker using Vite's ?url locator
console.log('PDF.js version:', pdfjsLib.version);
console.log('Worker URL:', pdfWorker);
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

const AIChat = ({ onBookingRequest, setShowBackground }) => {
    // Persisted State Initialization
    const [messages, setMessages] = useState(() => {
        const saved = localStorage.getItem('chat_messages');
        return saved ? JSON.parse(saved) : [{
            role: 'assistant',
            content: '👋 **Hi! I am your AI Career Coach.**\n\nI have pre-analyzed your profile. I am here to help you boost your career path. Together we can:\n\n🚀 Explore new career opportunities\n🗣️ Conduct personalized interview simulations\n📝 Optimize your CV to pass ATS filters\n🎯 Define a tailored development plan\n\n**Where would you like to start today?**'
        }];
    });

    const [userContext, setUserContext] = useState(() => {
        const saved = localStorage.getItem('user_context');
        return saved ? JSON.parse(saved) : null;
    });

    const [onboardingView, setOnboardingView] = useState(() => {
        return !localStorage.getItem('user_context');
    });

    // Chat State
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [uploadedFile, setUploadedFile] = useState(null);
    const [fileContent, setFileContent] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);
    const onboardingFileRef = useRef(null);

    // API Key State - Managed by Backend
    // const [apiKey, setApiKey] = useState(...) // REMOVED FOR SECURITY
    // useEffect(...) // REMOVED FOR SECURITY


    // Onboarding Form State
    const [manualForm, setManualForm] = useState({
        name: '',
        role: '',
        experience: '',
        goal: ''
    });

    const quickOptions = [
        { icon: '🎯', label: 'Career Guidance', prompt: 'I need guidance on my professional career' },
        { icon: '💼', label: 'Prep Interview', prompt: 'I want to prepare for a job interview' },
        { icon: '📄', label: 'Review CV', prompt: 'I need help improving my resume' },
        { icon: '📈', label: 'Professional Development', prompt: 'I want to plan my professional development' }
    ];

    // Persistence Effects
    useEffect(() => {
        localStorage.setItem('chat_messages', JSON.stringify(messages));
    }, [messages]);

    useEffect(() => {
        if (userContext) {
            localStorage.setItem('user_context', JSON.stringify(userContext));
        } else {
            localStorage.removeItem('user_context');
        }
    }, [userContext]);

    // Scroll effect
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (!onboardingView) scrollToBottom();
        // Sync background: if not onboarding, hide background (show solid color)
        if (setShowBackground) {
            setShowBackground(onboardingView);
        }
    }, [messages, onboardingView, setShowBackground]);


    // Handlers
    // Handlers
    const handleReset = () => {
        // Immediate reset for "Home" behavior
        localStorage.clear();
        // We no longer need to preserve API key as it is backend-only


        setUserContext(null);
        setMessages([{
            role: 'assistant',
            content: '👋 **Hi! I am your AI Career Coach.**\n\nI have pre-analyzed your profile. I am here to help you boost your career path. Together we can:\n\n🚀 Explore new career opportunities\n🗣️ Conduct personalized interview simulations\n📝 Optimize your CV to pass ATS filters\n🎯 Define a tailored development plan\n\n**Where would you like to start today?**'
        }]);
        setOnboardingView(true);
        setUploadedFile(null);
    };

    const handleOnboardingFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.type !== 'application/pdf') { alert('Only PDF'); return; }

        setIsLoading(true);
        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            let fullText = "";
            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const content = await page.getTextContent();
                const strings = content.items.map(item => item.str);
                fullText += strings.join(' ') + "\n";
            }

            const context = {
                type: 'file',
                fileName: file.name,
                parsed: true,
                summary: `CV uploaded and analyzed: ${file.name}`
            };
            setUserContext(context);
            setUploadedFile(file);
            setFileContent(fullText || `[Empty content in PDF: ${file.name}]`);
            setOnboardingView(false);

            setMessages(prev => [
                ...prev,
                { role: 'system', content: `✅ Profile successfully loaded and analyzed from ${file.name}. My AI engine is now using your actual data.` }
            ]);
        } catch (error) {
            console.error("PDF Parsing Error:", error);
            alert("Could not read PDF text. Please ensure it's a text-based PDF or paste your summary manually.");
        } finally {
            setIsLoading(false);
            e.target.value = ''; // Reset input to allow re-selecting the same file
        }
    };

    const handleManualSubmit = (e) => {
        e.preventDefault();
        if (!manualForm.name || !manualForm.role) return;

        setUserContext({
            type: 'manual',
            ...manualForm
        });
        setOnboardingView(false);

        setMessages(prev => [
            ...prev,
            { role: 'system', content: `✅ Profile created for ${manualForm.name}. I have noted your role as ${manualForm.role} and your goals.` }
        ]);
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.type !== 'application/pdf') {
            alert('Please upload a PDF file.');
            return;
        }

        setIsLoading(true);
        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            let fullText = "";
            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const content = await page.getTextContent();
                const strings = content.items.map(item => item.str);
                fullText += strings.join(' ') + "\n";
            }

            setUploadedFile(file);
            setFileContent(fullText || `[Empty content in PDF: ${file.name}]`);
            setMessages(prev => [...prev, {
                role: 'system',
                content: `📎 New CV attached and analyzed: ${file.name}`
            }]);
        } catch (error) {
            console.error("PDF Parsing Error:", error);
            alert("Could not read PDF text.");
        } finally {
            setIsLoading(false);
            e.target.value = '';
        }
    };

    const handleQuickOption = (prompt) => {
        handleSend(prompt);
    };

    const handleSend = async (customMessage = null) => {
        const messageToSend = customMessage || input.trim();
        if (!messageToSend || isLoading) return;

        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: messageToSend }]);
        setIsLoading(true);

        try {
            // Use the new Generation Logic - passing fileContent now!
            await generateAIResponse(messageToSend, [...messages, { role: 'user', content: messageToSend }], userContext, fileContent);
            // setMessages handled internally by generateAIResponse for streaming
        } catch (error) {
            setMessages(prev => [...prev, { role: 'assistant', content: "I'm sorry, I had a momentary technical problem. Please try again." }]);
        } finally {
            setIsLoading(false);
        }
    };

    // --- AI GENERATION LOGIC (DeepSeek Integration) ---
    // --- AI GENERATION LOGIC (DeepSeek Integration) ---
    const generateAIResponse = async (userMsg, history, context, fileText = null) => {
        // 1. Generation Logic is handled by Backend (Netlify Functions)

        // 3. Build System Prompt with Context
        let contextString = `
        Name: ${context?.name || 'Visitor'}
        Current Role: ${context?.role || 'Not defined'}
        Professional Goal: ${context?.goal || 'Explore options'}
        Experience: ${context?.experience || 'Not specified'}
        `;

        if (fileText) {
            contextString += `\n\nCV CONTENT (PDF EXTRACTED OR SIMULATED):\n${fileText}\n(Use this information to provide personalized feedback)`;
        }

        const systemPrompt = `You are an expert Career Coach and Senior Recruiter called "AI Career Coach".
        
        USER CONTEXT:
        ${contextString}
        
        STRICT RULES:
        1. USE ONLY the information provided in USER CONTEXT or explicit messages.
        2. DO NOT INVENT or assume skills, companies, education, or dates not present in the context.
        3. If you are asked to analyze a CV and the "CV CONTENT" is empty or missing, ASK the user to provide details instead of making them up.
        4. Be empathetic but stick to facts. 
        5. If a user asks something not related to the provided profile, clarify that you only know what they've shared.
        
        INSTRUCTIONS:
        1. Your answers must be structured (use Markdown: **bold**, lists, etc).
        2. Prioritize actionable and specific advice for the user's role (${context?.role}).
        3. **IMPORTANT: JOB SEARCH**
           - You cannot browse in real-time, but you MUST generate direct search links.
           - If the user searches for work, ALWAYS provide these formatted links:
             - [See vacancies on Jobindex](https://www.jobindex.dk/jobsoegning?q=${encodeURIComponent(context?.role || 'job')})
             - [See vacancies on Jobnet](https://job.jobnet.dk/CV/FindWork?SearchString=${encodeURIComponent(context?.role || 'job')})
           - Explain that these links have the most updated offers.
        4. RESPOND ALWAYS IN ENGLISH.
        
        STYLE:
        Use emojis occasionally to be friendly. Be concise but deep.
        `;

        const historyMessages = history.map(m => ({ role: m.role, content: m.content }));

        // Avoid duplicating last user message if it's already in history
        const lastMsg = historyMessages[historyMessages.length - 1];
        if (lastMsg?.role === 'user' && lastMsg?.content === userMsg) {
            // It's already there, don't append
        } else {
            historyMessages.push({ role: 'user', content: userMsg });
        }

        const apiMessages = [
            { role: 'system', content: systemPrompt },
            ...historyMessages.filter(m => m.content && m.content.trim() !== '') // Filter empty messages to prevent 400 error
        ];

        try {
            // Initial empty assistant message for streaming
            setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

            let fullContent = "";
            let messageIndex = history.length + 1; // Index of the new assistant message (history + userMsg is previous, so +1)
            // Correction: history doesn't include the current userMsg yet in state when passed here? 
            // Actually in handleSend we do: [...messages, { role: 'user', content: messageToSend }]
            // So history has N items. The new assistant msg will be at index N+1.
            // But state updates are async. It works better if we update the *last* message.

            // Use the streaming service
            await import('../services/deepSeek').then(module =>
                module.chatWithDeepSeekStream(apiMessages, (chunk) => {
                    fullContent += chunk;
                    setMessages(prevMessages => {
                        const newMessages = [...prevMessages];
                        // Update the last message (which is our assistant placeholder)
                        const lastMsg = newMessages[newMessages.length - 1];
                        if (lastMsg.role === 'assistant') {
                            lastMsg.content = fullContent;
                        }
                        return newMessages;
                    });
                })
            );

            return fullContent;

        } catch (error) {
            console.error(error);
            // Replace the partial/empty message with error
            setMessages(prev => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1] = {
                    role: 'assistant',
                    content: `❌ **Connection Error**\n\nI couldn't connect with DeepSeek. The server might be busy. Please try again in a few seconds.\n\nDetail: ${error.message}`
                };
                return newMessages;
            });
            return null; // Signal error
        }
    };


    const simulateAIResponse = async (message, pdfContext, file, userCtx) => {
        return new Promise(resolve => {
            setTimeout(() => {
                // Normalize: Lowercase
                const lowerMsg = message.toLowerCase();

                // Context-aware variables
                const userName = userCtx?.name || 'Colleague';
                const userRole = userCtx?.role || 'professional';
                const userGoal = userCtx?.goal || 'professional growth';

                // --- 1. GREETINGS & SOCIAL ---
                if (/(hola|buenos|buenas|hi|hello|hey|greetings)/.test(lowerMsg)) {
                    resolve(`Hello again, ${userName}! 👋\n\nI'm ready to continue working on your goal of **${userGoal}**. What should we focus on today: job offers, interview, or CV?`);
                }
                else if (/(thanks|thank you|great|awesome|ok|ready|good|perfect|excellent)/.test(lowerMsg)) {
                    resolve(`I'm glad! 😊 I'm still here. If you think of anything else, just say it.`);
                }
                else if (/(how are you|how is it going|whats up)/.test(lowerMsg)) {
                    resolve(`I'm at 100% and ready to help you! 🚀\n\nMy "mood" depends on your success. How is your search for opportunities as a **${userRole}** going?`);
                }

                // --- 2. IDENTITY & CAPABILITIES ---
                else if (/(what do you do|who are you|are you a robot|are you an ai|what are you)/.test(lowerMsg)) {
                    resolve(`I am your personal **AI Career Coach**. 🤖💼\n\nMy mission is to help you advance in your career as a **${userRole}**. I can:\n\n1.  🔍 **Search for jobs:** Track vacancies in Denmark.\n2.  📄 **Analyze your CV:** Give you feedback to improve your profile.\n3.  🗣️ **Train you:** Simulate job interviews.\n4.  🗺️ **Guide you:** Create personalized career plans.\n\nWhich one do you want to start with?`);
                }
                else if (/(help|what do i do|options)/.test(lowerMsg)) {
                    resolve(`Don't worry, I'm here to guide you. Here are some useful things you can ask me:\n\n*   *"Search for job offers for me"* 🕵️\n*   *"Review my CV"* (if you upload a PDF) 📄\n*   *"Simulate an interview"* 🎤\n*   *"How much should I earn?"* 💰\n\nDo any of these sound good to you?`);
                }

                // --- 3. SPECIFIC CAREER INTENTS ---

                // SALARY
                else if (lowerMsg.includes('how much') || lowerMsg.includes('salary') || lowerMsg.includes('earn') || lowerMsg.includes('pay')) {
                    resolve(`💰 **Salary Analysis: ${userRole}**\n\nAccording to recent market data, a professional with your profile could expect:\n\n*   **Range:** DKK 45,000 - 65,000 / month (Gross)\n*   **Trend:** High demand in Copenhagen and Aarhus.\n\nWould you like to know what specific skills can help you negotiate the high end of this range?`);
                }

                // JOB SEARCH
                else if (lowerMsg.includes('job') || lowerMsg.includes('work') || lowerMsg.includes('search') || lowerMsg.includes('offers') || lowerMsg.includes('vacancies')) {
                    const searchRole = userRole.split(' ')[0];
                    const jobIndexUrl = `https://www.jobindex.dk/jobsoegning?q=${encodeURIComponent(userRole)}`;
                    const jobNetUrl = `https://job.jobnet.dk/CV/FindWork?SearchString=${encodeURIComponent(userRole)}`;

                    resolve(`🔍 **Active Search: ${userRole}**\n\nI have found these opportunities that match your profile:\n\n1. **${userRole} @ Novo Nordisk**\n   📍 Bagsværd • 🕒 Full-time\n   *Match: 95%*\n\n2. **Senior ${searchRole} @ LEGO Group**\n   📍 Billund (Hybrid)\n   *Match: 88%*\n\n🔗 **See more offers:**\n*   [Jobindex.dk](${jobIndexUrl})\n*   [Jobnet.dk](${jobNetUrl})\n\nShall we analyze the requirements of any of these?`);
                }

                // ORIENTATION
                else if (lowerMsg.includes('orientation') || lowerMsg.includes('career') || lowerMsg.includes('future') || lowerMsg.includes('advice')) {
                    resolve(`🎯 **Professional Strategy**\n\nTo boost your career towards **${userGoal}**, I recommend:\n\n1.  **Visibility:** Optimize your LinkedIn with keywords from your sector.\n2.  **Networking:** Contact recruiters specialized in ${userRole}.\n3.  **Training:** Have you considered certifying your most recent skills?\n\nDo you want us to delve into any of these points?`);
                }

                // INTERVIEW
                else if (lowerMsg.includes('interview') || lowerMsg.includes('prep') || lowerMsg.includes('trial')) {
                    resolve(`💼 **Interview Training**\n\nLet's practice! Imagine I am the Hiring Manager.\n\n📢 **Question:**\n*"Describe a recent technical or management challenge and how you solved it."*\n\n(Try to answer using the STAR methodology: Situation, Task, Action, Result). I'm listening!`);
                }

                // CV STUFF
                else if (lowerMsg.includes('cv') || lowerMsg.includes('resume') || lowerMsg.includes('curriculum')) {
                    if (!pdfContext && !userCtx?.parsed) {
                        resolve(`📄 **CV Review**\n\nTo give you valuable feedback, I need to see your information.\n\n📎 **Please attach your CV (PDF) using the clip button.**\n\nThat way I can tell you what keywords you are missing to pass the automatic filters.`);
                    } else {
                        resolve(`📄 **Analysis of your CV**\n\nI see you have good experience. A quick tip:\n\n*   **Quantify your achievements:** Instead of "Process improvement", put "20% reduction in delivery times".\n\nDo you want us to rewrite your professional summary together?`);
                    }
                }

                // DEVELOPMENT / LEARNING
                else if (lowerMsg.includes('development') || lowerMsg.includes('learn') || lowerMsg.includes('course') || lowerMsg.includes('study')) {
                    resolve(`📚 **Continuous Learning**\n\nFor your role as **${userRole}**, the trending skills right now are:\n\n*   **AI Tools & Automation**\n*   **Stakeholder Management**\n\nInvesting time here will get you to your goal of **${userGoal}** faster.`);
                }

                // --- 4. SMART FALLBACK ---
                else {
                    resolve(`I hear you, ${userName}. 🤔\n\nAlthough I'm not sure if you're asking me about jobs, interviews, or your profile, I'm here to help.\n\nTry saying:\n*   *"What do you do?"* (to see my functions)\n*   *"Search for work"* (to see offers)\n*   *"Help with my CV"*\n\nWhere do you want to continue?`);
                }
            }, 800);
        });
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };


    // --- RENDER ---

    if (onboardingView) {
        return (
            <div className="ai-chat-container onboarding-mode">
                <style>{`
                    .onboarding-mode {
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                        padding: 2rem;
                        /* Background removed to show Volcano */
                        height: 100vh;
                        width: 100vw;
                        position: relative;
                        z-index: 20; /* Ensure on top of volcano */
                    }
                    .onboarding-title {
                        font-size: 3rem;
                        font-weight: 800;
                        margin-bottom: 1rem;
                        background: linear-gradient(to right, #fff, #94a3b8);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        text-align: center;
                        text-shadow: 0 4px 12px rgba(0,0,0,0.3);
                    }
                    .onboarding-subtitle {
                        color: #cbd5e1;
                        margin-bottom: 4rem;
                        text-align: center;
                        font-size: 1.25rem;
                        max-width: 600px;
                        line-height: 1.6;
                        text-shadow: 0 2px 4px rgba(0,0,0,0.5);
                    }
                    .cards-container {
                        display: flex;
                        gap: 2rem;
                        width: 100%;
                        max-width: 900px;
                        flex-wrap: wrap;
                        justify-content: center;
                        z-index: 10;
                    }
                    .onboarding-card {
                        flex: 1;
                        min-width: 320px;
                        background: rgba(15, 23, 42, 0.6); /* Translucent */
                        border: 1px solid rgba(255,255,255,0.1);
                        backdrop-filter: blur(12px);
                        border-radius: 24px;
                        padding: 2.5rem;
                        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                        cursor: pointer;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        text-align: center;
                        box-shadow: 0 8px 32px rgba(0,0,0,0.2);
                    }
                    .onboarding-card:hover {
                        transform: translateY(-8px);
                        background: rgba(15, 23, 42, 0.8);
                        border-color: var(--color-primary);
                        box-shadow: 0 20px 50px rgba(0,0,0,0.4);
                    }
                    .card-icon {
                        font-size: 3.5rem;
                        margin-bottom: 1.5rem;
                        background: rgba(139, 92, 246, 0.15);
                        width: 90px;
                        height: 90px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        border-radius: 50%;
                        border: 1px solid rgba(139, 92, 246, 0.2);
                    }
                    .onboarding-card h3 {
                        font-size: 1.75rem;
                        margin-bottom: 1rem;
                        color: white;
                        font-weight: 700;
                    }
                    .onboarding-card p {
                        color: #94a3b8;
                        line-height: 1.6;
                        margin-bottom: 2.5rem;
                        font-size: 1.05rem;
                    }
                    .card-btn {
                        margin-top: auto;
                        padding: 14px 28px;
                        border-radius: 14px;
                        font-weight: 600;
                        font-size: 1rem;
                        width: 100%;
                        transition: all 0.2s;
                        letter-spacing: 0.5px;
                    }
                    .btn-accent {
                        background: linear-gradient(135deg, var(--color-primary), #7c3aed);
                        color: white;
                        border: none;
                        box-shadow: 0 4px 15px rgba(139, 92, 246, 0.4);
                    }
                    .btn-accent:hover {
                        box-shadow: 0 6px 20px rgba(139, 92, 246, 0.6);
                    }
                    .btn-outline {
                        background: transparent;
                        border: 1px solid rgba(255,255,255,0.2);
                        color: white;
                    }
                    .btn-outline:hover {
                        background: rgba(255,255,255,0.05);
                        border-color: white;
                    }
                    .manual-form {
                        width: 100%;
                        display: flex;
                        flex-direction: column;
                        gap: 1.25rem;
                        text-align: left;
                    }
                    .manual-form input {
                        background: rgba(0,0,0,0.3);
                        border: 1px solid rgba(255,255,255,0.1);
                        padding: 14px 16px;
                        border-radius: 12px;
                        color: white;
                        outline: none;
                        font-size: 1rem;
                        transition: border-color 0.2s;
                    }
                    .manual-form input:focus {
                        border-color: var(--color-primary);
                        background: rgba(0,0,0,0.5);
                    }
                `}</style>

                <h1 className="onboarding-title">Welcome to DK Career</h1>
                <p className="onboarding-subtitle">To act as your personal coach and provide the best recommendations, I need to know your starting point.</p>

                <div className="cards-container">
                    {/* Card 1: Upload CV */}
                    <div className="onboarding-card" onClick={() => onboardingFileRef.current?.click()}>
                        <div className="card-icon">📄</div>
                        <h3>I have my CV</h3>
                        <p>Upload your CV in PDF. I will automatically analyze your experience, education, and skills.</p>
                        <input
                            type="file"
                            ref={onboardingFileRef}
                            style={{ display: 'none' }}
                            accept=".pdf"
                            onChange={handleOnboardingFileUpload}
                        />
                        <button className="card-btn btn-accent">
                            {isLoading ? 'Analyzing document...' : 'Upload PDF'}
                        </button>
                    </div>

                    {/* Card 2: Manual Form */}
                    <div className="onboarding-card" style={{ cursor: 'default' }}>
                        <div className="card-icon">✍️</div>
                        <h3>Fill Manually</h3>

                        <form className="manual-form" onSubmit={handleManualSubmit}>
                            <input
                                placeholder="Your Full Name"
                                value={manualForm.name}
                                onChange={e => setManualForm({ ...manualForm, name: e.target.value })}
                                required
                            />
                            <input
                                placeholder="Current Role (e.g. Senior UX Designer)"
                                value={manualForm.role}
                                onChange={e => setManualForm({ ...manualForm, role: e.target.value })}
                                required
                            />
                            <input
                                placeholder="Years of Experience"
                                type="number"
                                value={manualForm.experience}
                                onChange={e => setManualForm({ ...manualForm, experience: e.target.value })}
                            />
                            <input
                                placeholder="Main Goal (e.g. Leadership)"
                                value={manualForm.goal}
                                onChange={e => setManualForm({ ...manualForm, goal: e.target.value })}
                            />
                            <button type="submit" className="card-btn btn-outline" style={{ marginTop: '0.5rem' }}>
                                Start Chat
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }

    // --- MAIN CHAT RENDER (Full Screen) ---
    return (
        <div className="ai-chat-container">
            <div className="chat-header">
                <div
                    className="chat-header-content"
                    onClick={handleReset}
                    style={{ cursor: 'pointer' }}
                    title="Go to Home (Reset)"
                >
                    <div className="ai-avatar">🤖</div>
                    <div>
                        <h3>AI Career Coach</h3>
                        <div className="status-indicator">● AI Online</div>

                    </div>
                </div>
                {userContext && (
                    <button
                        onClick={handleReset}
                        className="text-btn"
                        title="Clear data and restart"
                        style={{ marginLeft: 'auto', fontSize: '0.8rem', opacity: 0.8 }}
                    >
                        🔄 Restart Session
                    </button>
                )}
            </div>



            <div className="messages-container">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`message ${msg.role} ${msg.role === 'system' ? 'system-msg' : ''}`}>
                        <div className="message-content">
                            {msg.content}
                        </div>
                    </div>
                ))}


                <div ref={messagesEndRef} />
            </div>

            <div className="chat-input-container">
                {/* Quick Options Popup Menu - Positioned Absolute to Input Container */}
                {!isLoading && isMenuOpen && (
                    <div className="quick-options-popup">
                        <div className="quick-options-grid">
                            {quickOptions.map((option, idx) => (
                                <button
                                    key={idx}
                                    className="quick-option-mini-btn"
                                    onClick={() => {
                                        handleQuickOption(option.prompt);
                                        setIsMenuOpen(false);
                                    }}
                                    disabled={isLoading}
                                >
                                    <span style={{ fontSize: '1.2rem' }}>{option.icon}</span>
                                    <span>{option.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
                {uploadedFile && (
                    <div className="selected-file-indicator">
                        <span className="file-icon">📎</span>
                        <span className="file-name">{uploadedFile.name}</span>
                        <button
                            className="remove-file-btn-mini"
                            onClick={() => {
                                setUploadedFile(null);
                                setFileContent(null);
                            }}
                        >✕</button>
                    </div>
                )}

                <div className="grok-input-wrapper">
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf"
                        onChange={handleFileUpload}
                        style={{ display: 'none' }}
                    />
                    <button
                        className={`action-btn ${isMenuOpen ? 'active' : ''}`}
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        title="See quick options"
                        style={{ marginRight: '-8px' }}
                    >
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="3" width="7" height="7"></rect>
                            <rect x="14" y="3" width="7" height="7"></rect>
                            <rect x="14" y="14" width="7" height="7"></rect>
                            <rect x="3" y="14" width="7" height="7"></rect>
                        </svg>
                    </button>

                    <button
                        className="action-btn"
                        onClick={() => fileInputRef.current?.click()}
                        title="Attach PDF for analysis"
                    >
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
                        </svg>
                    </button>

                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Ask me anything about your career..."
                        rows={1}
                        disabled={isLoading}
                    />

                    <button
                        className="send-button-grok"
                        onClick={() => handleSend()}
                        disabled={!input.trim() || isLoading}
                    >
                        {isLoading ? (
                            <div className="spinner-mini"></div>
                        ) : (
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="22" y1="2" x2="11" y2="13"></line>
                                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                            </svg>
                        )}
                    </button>
                </div>
                <div className="input-footer">
                    <button className="text-btn" onClick={onBookingRequest}>📅 Book Private Session</button>
                </div>
            </div>

            <style>{`
                /* REFACTOR FOR FULL SCREEN / OPEN UI */
                .ai-chat-container {
                    display: flex;
                    flex-direction: column;
                    /* Full screen dimensions */
                    width: 100vw;
                    height: 100vh;
                    position: fixed;
                    top: 0;
                    left: 0;
                    z-index: 1;
                    /* Transparent background to show Volcano */
                    background: transparent;
                    border: none;
                    box-shadow: none;
                    border-radius: 0;
                    backdrop-filter: none;
                }

                .chat-header {
                    /* Minimal header */
                    background: transparent;
                    padding: 1.5rem 2rem;
                    display: flex;
                    align-items: center;
                    border-bottom: none; /* Removed border */
                    z-index: 10;
                }

                .chat-header-content {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                }

                .ai-avatar {
                    width: 44px;
                    height: 44px;
                    background: rgba(139, 92, 246, 0.2);
                    border: 1px solid rgba(139, 92, 246, 0.4);
                    backdrop-filter: blur(8px);
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.5rem;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                }

                .chat-header h3 {
                    margin: 0;
                    font-size: 1.2rem;
                    font-weight: 700;
                    text-shadow: 0 2px 4px rgba(0,0,0,0.5);
                }

                .status-indicator {
                    font-size: 0.85rem;
                    color: #4ade80;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    text-shadow: 0 1px 2px rgba(0,0,0,0.5);
                }
                
                .status-indicator::before {
                    content: '';
                    display: block;
                    width: 8px;
                    height: 8px;
                    background-color: #4ade80;
                    border-radius: 50%;
                    box-shadow: 0 0 8px #4ade80;
                }

                /* Messages */
                .messages-container {
                    flex: 1;
                    overflow-y: auto;
                    padding: 2rem 15% 4rem 15%; /* Centered wide column */
                    display: flex;
                    flex-direction: column;
                    gap: 2.5rem;
                    scrollbar-width: thin;
                    scrollbar-color: rgba(255,255,255,0.1) transparent;
                }

                /* Hide scrollbar for Chrome/Safari/Opera */
                .messages-container::-webkit-scrollbar {
                    width: 6px;
                }
                .messages-container::-webkit-scrollbar-track {
                    background: transparent;
                }
                .messages-container::-webkit-scrollbar-thumb {
                    background-color: rgba(255,255,255,0.1);
                    border-radius: 20px;
                }

                .message {
                    display: flex;
                    animation: messageFadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                    width: 100%;
                }

                @keyframes messageFadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .message.user {
                    justify-content: flex-end;
                }
                
                .message.assistant {
                    justify-content: flex-start;
                }

                .message-content {
                    max-width: 800px;
                    padding: 24px 32px;
                    border-radius: 24px;
                    white-space: pre-wrap;
                    line-height: 1.8;
                    font-size: 1.05rem;
                    position: relative;
                }
                
                .message.assistant .message-content {
                    /* Glass bubble for assistant */
                    background: rgba(30, 41, 59, 0.4); 
                    border: 1px solid rgba(255,255,255,0.05); /* Very subtle border */
                    backdrop-filter: blur(4px);
                    color: #e2e8f0;
                }

                .message.user .message-content {
                    background: var(--color-primary);
                    color: white;
                    border-radius: 24px 24px 4px 24px;
                    box-shadow: 0 4px 15px rgba(124, 58, 237, 0.3);
                }
                
                .message.system {
                    justify-content: center;
                }

                .message.system .message-content {
                    background: rgba(16, 185, 129, 0.15);
                    border: 1px solid rgba(16, 185, 129, 0.3);
                    color: #6ee7b7;
                    font-size: 0.9rem;
                    text-align: center;
                    padding: 8px 24px;
                    border-radius: 50px;
                }

                /* Quick Options centered overlay */
                .quick-options-container {
                    display: flex;
                    justify-content: center;
                    margin-bottom: 2rem;
                }

                .quick-options {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
                    gap: 20px;
                    width: 100%;
                    max-width: 900px;
                    padding: 0 2rem;
                    background: transparent;
                    border: none;
                }

                .quick-option-btn {
                    display: flex;
                    flex-direction: column;
                    align-items: center; /* Centered content */
                    justify-content: center;
                    gap: 12px;
                    padding: 16px; /* Smaller padding */
                    background: rgba(30, 41, 59, 0.4);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    border-radius: 16px;
                    color: #94a3b8;
                    font-size: 0.9rem; /* Smaller font */
                    transition: all 0.3s ease;
                    text-align: center;
                    backdrop-filter: blur(8px);
                }

                .quick-option-btn:hover {
                    background: rgba(30, 41, 59, 0.7);
                    border-color: var(--color-primary);
                    color: white;
                    transform: translateY(-4px);
                }

                .option-icon {
                    font-size: 2rem;
                }

                /* Input Area */
                .chat-input-container {
                    padding: 1rem 1rem 3rem 1rem;
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                    position: relative;
                    width: 100%;
                    max-width: 850px;
                    margin: 0 auto;
                    z-index: 20;
                }

                .grok-input-wrapper {
                    display: flex;
                    align-items: flex-end;
                    gap: 12px;
                    background: rgba(15, 23, 42, 0.85); /* Darker for input */
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    backdrop-filter: blur(20px);
                    border-radius: 24px; 
                    padding: 12px 20px;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.5);
                    transition: all 0.3s;
                    min-height: 60px;
                    z-index: 50;
                }
                
                .action-btn {
                    width: 40px;
                    height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 12px;
                    color: #94a3b8;
                    transition: all 0.2s;
                    border: none;
                    background: transparent;
                    cursor: pointer;
                }
                .action-btn:hover, .action-btn.active {
                    color: white;
                    background: rgba(255,255,255,0.1);
                }

                .quick-options-popup {
                    position: absolute;
                    bottom: 100%;
                    left: 0;
                    width: 100%;
                    padding-bottom: 20px; /* Space between popup and input */
                    animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                    z-index: 40;
                    display: flex;
                    justify-content: center;
                }

                .quick-options-grid {
                    background: rgba(30, 41, 59, 0.9);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    backdrop-filter: blur(16px);
                    border-radius: 20px;
                    padding: 12px;
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 10px;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.4);
                    min-width: 300px;
                }

                @media (min-width: 640px) {
                    .quick-options-grid {
                        grid-template-columns: repeat(4, 1fr);
                        min-width: 600px;
                    }
                }

                .quick-option-mini-btn {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    gap: 10px;
                    padding: 10px 16px;
                    background: rgba(255, 255, 255, 0.05);
                    border: none;
                    border-radius: 12px;
                    color: #cbd5e1;
                    font-size: 0.85rem;
                    cursor: pointer;
                    transition: all 0.2s;
                    text-align: left;
                }
                .quick-option-mini-btn:hover {
                    background: var(--color-primary);
                    color: white;
                }

                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                .grok-input-wrapper:focus-within {
                    border-color: var(--color-primary);
                    background: rgba(15, 23, 42, 0.9);
                    box-shadow: 0 10px 30px rgba(139, 92, 246, 0.2);
                    transform: translateY(-2px);
                }

                .grok-input-wrapper textarea {
                    font-size: 1.1rem;
                    padding: 6px 0;
                    color: white;
                }
                
                .grok-input-wrapper textarea::placeholder {
                    color: #64748b;
                }

                .attach-btn, .send-button-grok {
                    width: 42px;
                    height: 42px;
                }

                .attach-btn:hover {
                    background: rgba(255,255,255,0.1);
                    color: white;
                }

                .send-button-grok {
                    background: var(--color-primary);
                    color: white;
                    margin-bottom: 0;
                    border-radius: 50%;
                }
                
                .spinner-mini {
                    width: 18px;
                    height: 18px;
                    border: 2px solid rgba(255,255,255,0.3);
                    border-top-color: white;
                    border-radius: 50%;
                    animation: spin 0.8s linear infinite;
                }
                
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }

                .selected-file-indicator {
                    background: rgba(16, 185, 129, 0.15);
                    border: 1px solid rgba(16, 185, 129, 0.3);
                    padding: 8px 16px;
                    border-radius: 20px;
                    margin-left: 20px;
                    backdrop-filter: blur(4px);
                    color: #34d399;
                }
                
                .input-footer {
                    margin-top: 0;
                }
                
                .text-btn {
                    background: rgba(0,0,0,0.3);
                    border: 1px solid rgba(255,255,255,0.1);
                    color: #94a3b8;
                    padding: 8px 20px;
                    border-radius: 30px;
                    font-size: 0.9rem;
                    backdrop-filter: blur(4px);
                }
                .text-btn:hover {
                    background: rgba(255,255,255,0.1);
                    color: white;
                }
                
                @media (max-width: 768px) {
                    .messages-container {
                        padding: 2rem 1rem 4rem 1rem;
                    }
                    .ai-chat-container {
                         /* On mobile, standard flow might be better, but user requested open */
                    }
                    .grok-input-wrapper {
                        padding: 10px 16px;
                        min-height: 56px;
                    }
                    .onboarding-title {
                        font-size: 2rem;
                    }
                    .cards-container {
                        flex-direction: column;
                        align-items: center;
                    }
                    .onboarding-card {
                        width: 100%;
                        min-width: unset;
                    }
                }
            `}</style>
        </div>
    );
};

export default AIChat;
