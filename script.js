// Global Application State
const appState = {
    fontScale: 1.0,
    darkMode: false,
    quizIndex: 0,
    quizScore: 0
};

// Daily Safety Tips Pool
const dailyTips = [
    "Never share your 6-digit WhatsApp verification code with anyone, even if they claim to be a family member.",
    "Banks will never ask for your PIN, password, or OTP via SMS or email.",
    "If you receive an urgent request for money from a relative on a new number, call their old number first to verify.",
    "Check for 'https://' and a padlock icon in your browser address bar before entering personal information on any website."
];

// Expanded Senior Cyber Safety Quiz
const quizData = [
    {
        question: "You receive an email claiming your bank account is locked with a link to unlock it. What should you do?",
        options: ["Click the link immediately", "Delete email & call bank on official number", "Reply with your account password"],
        correct: 1,
        explanation: "Banks never ask for account verification or password resets through unverified email links."
    },
    {
        question: "What makes a strong, easy-to-remember password?",
        options: ["Your pet's name or birthday", "A passphrase like 'BlueCoffeeTable#99'", "123456"],
        correct: 1,
        explanation: "Passphrases combining 3-4 random words, symbols, and numbers are extremely secure and easier to remember."
    },
    {
        question: "A WhatsApp message from an unknown number says 'Hi Mum, I lost my phone, please send $200'. What is the safest response?",
        options: ["Send the money right away", "Call your child on their regular phone number to check", "Text back your bank details"],
        correct: 1,
        explanation: "Always confirm unexpected money requests verbally using a known, trusted phone number."
    },
    {
        question: "What does the 'S' in 'HTTPS' stand for at the start of a website address?",
        options: ["Special", "Secure", "System"],
        correct: 1,
        explanation: "HTTPS stands for 'HyperText Transfer Protocol Secure' and means the connection between your browser and the site is encrypted."
    }
];

document.addEventListener('DOMContentLoaded', () => {
    
    // -------------------------------------------------------------
    // 1. ACCESSIBILITY: Font Scaling (Resizing Text)
    // -------------------------------------------------------------
    const btnIncrease = document.getElementById('btn-increase-font');
    const btnDecrease = document.getElementById('btn-decrease-font');
    const btnReset = document.getElementById('btn-reset-font');

    if (btnIncrease) {
        btnIncrease.addEventListener('click', () => {
            appState.fontScale += 0.1;
            document.documentElement.style.setProperty('--font-scale', appState.fontScale);
        });
    }

    if (btnDecrease) {
        btnDecrease.addEventListener('click', () => {
            if (appState.fontScale > 0.8) {
                appState.fontScale -= 0.1;
                document.documentElement.style.setProperty('--font-scale', appState.fontScale);
            }
        });
    }

    if (btnReset) {
        btnReset.addEventListener('click', () => {
            appState.fontScale = 1.0;
            document.documentElement.style.setProperty('--font-scale', 1.0);
        });
    }

    // -------------------------------------------------------------
    // 2. ACCESSIBILITY: High Contrast / Dark Mode Toggle
    // -------------------------------------------------------------
    const btnTheme = document.getElementById('btn-toggle-theme');
    if (btnTheme) {
        btnTheme.addEventListener('click', () => {
            appState.darkMode = !appState.darkMode;
            document.body.classList.toggle('dark-mode', appState.darkMode);
        });
    }

    // -------------------------------------------------------------
    // 3. ACCESSIBILITY: Read Aloud / Text-to-Speech Engine
    // -------------------------------------------------------------
    let isReading = false;
    const readBtn = document.getElementById('btn-read-aloud');

    if (readBtn) {
        readBtn.addEventListener('click', () => {
            if ('speechSynthesis' in window) {
                if (isReading) {
                    window.speechSynthesis.cancel();
                    isReading = false;
                    readBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i> Listen to Page';
                } else {
                    const activePage = document.querySelector('.page-section.active-page');
                    if (activePage) {
                        const textToRead = activePage.innerText;
                        const utterance = new SpeechSynthesisUtterance(textToRead);
                        utterance.rate = 0.9; // Slower rate for clear senior listening

                        utterance.onend = () => {
                            isReading = false;
                            readBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i> Listen to Page';
                        };

                        window.speechSynthesis.speak(utterance);
                        isReading = true;
                        readBtn.innerHTML = '<i class="fa-solid fa-square"></i> Stop Listening';
                    }
                }
            } else {
                alert('Text-to-Speech is not supported on this browser.');
            }
        });
    }

    // -------------------------------------------------------------
    // 4. SEARCH FILTER LOGIC
    // -------------------------------------------------------------
    const searchInput = document.getElementById('global-search');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            const cards = document.querySelectorAll('.card, .topic-card, .feature-card');

            cards.forEach(card => {
                const text = card.innerText.toLowerCase();
                if (query === '' || text.includes(query)) {
                    card.style.display = '';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }

    // -------------------------------------------------------------
    // 5. LOAD DAILY SAFETY TIP & INITIALIZE QUIZ
    // -------------------------------------------------------------
    loadDailyTip();
    renderQuiz();
});

// Load a random daily safety tip into the tip box
function loadDailyTip() {
    const tipContainer = document.getElementById('daily-tip-text');
    if (tipContainer) {
        const randomIndex = Math.floor(Math.random() * dailyTips.length);
        tipContainer.innerText = dailyTips[randomIndex];
    }
}

// -------------------------------------------------------------
// 6. SINGLE-PAGE APPLICATION (SPA) NAVIGATION ROUTER
// -------------------------------------------------------------
function navigateTo(pageId) {
    // Hide active section & remove active class from nav
    document.querySelectorAll('.page-section').forEach(sec => sec.classList.remove('active-page'));
    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));

    // Show target section
    const target = document.getElementById(`page-${pageId}`);
    if (target) target.classList.add('active-page');

    // Stop speech synthesis if user switches pages while listening
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const readBtn = document.getElementById('btn-read-aloud');
        if (readBtn) {
            readBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i> Listen to Page';
        }
    }
}

// Mobile Navigation Toggle
function toggleMobileMenu() {
    const navMenu = document.getElementById('nav-menu');
    if (navMenu) {
        navMenu.classList.toggle('mobile-active');
    }
}

// -------------------------------------------------------------
// 7. SCAM LINK ANALYZER SIMULATOR
// -------------------------------------------------------------
function analyzeLink() {
    const inputField = document.getElementById('link-input');
    if (!inputField) return;

    const val = inputField.value.toLowerCase().trim();
    const resultBox = document.getElementById('scan-result');
    const badge = document.getElementById('result-status-badge');
    const title = document.getElementById('result-title');
    const exp = document.getElementById('result-explanation');

    if (!val) {
        alert("Please paste a link or message text first!");
        return;
    }

    resultBox.classList.remove('hidden');

    // Rule-based security analysis heuristic
    if ((val.includes('bank') || val.includes('verify') || val.includes('urgent')) && !val.startsWith('https://')) {
        badge.innerText = "HIGH RISK SCAM DETECTED";
        badge.style.color = "#dc2626";
        title.innerText = "Unsecured & Suspicious Request";
        exp.innerText = "This message or URL contains urgency keywords or banking requests without secure HTTPS encryption. Do not open links or share passwords.";
    } else if (val.startsWith('https://')) {
        badge.innerText = "ENCRYPTED SITE";
        badge.style.color = "#16a34a";
        title.innerText = "Secure Connection Verified";
        exp.innerText = "This address uses an encrypted protocol (HTTPS). Always double check that the domain name matches the official corporate brand name.";
    } else {
        badge.innerText = "UNKNOWN / CAUTION";
        badge.style.color = "#d97706";
        title.innerText = "Proceed with Care";
        exp.innerText = "No immediate phishing markers detected, but exercise caution when clicking unfamiliar web links.";
    }
}

// -------------------------------------------------------------
// 8. INTERACTIVE QUIZ ENGINE
// -------------------------------------------------------------
function renderQuiz() {
    const q = quizData[appState.quizIndex];
    const qNum = document.getElementById('quiz-question-number');
    const qText = document.getElementById('quiz-question-text');
    const container = document.getElementById('quiz-options-container');

    if (!qNum || !qText || !container) return;

    qNum.innerText = `Question ${appState.quizIndex + 1} of ${quizData.length}`;
    qText.innerText = q.question;
    
    container.innerHTML = '';

    q.options.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.className = 'btn btn-secondary';
        btn.style.margin = '8px 5px';
        btn.innerText = opt;
        btn.onclick = () => selectAnswer(idx);
        container.appendChild(btn);
    });
}

function selectAnswer(chosenIdx) {
    const q = quizData[appState.quizIndex];
    const feedbackBox = document.getElementById('quiz-feedback-box');
    const statusText = document.getElementById('feedback-status');
    const expText = document.getElementById('feedback-explanation');

    if (!feedbackBox || !statusText || !expText) return;
    
    feedbackBox.classList.remove('hidden');
    if (chosenIdx === q.correct) {
        appState.quizScore++;
        statusText.innerText = "✓ Correct!";
        statusText.style.color = "#16a34a";
    } else {
        statusText.innerText = "✗ Incorrect";
        statusText.style.color = "#dc2626";
    }
    expText.innerText = q.explanation;
}

function nextQuestion() {
    appState.quizIndex++;
    if (appState.quizIndex < quizData.length) {
        document.getElementById('quiz-feedback-box').classList.add('hidden');
        renderQuiz();
    } else {
        document.getElementById('quiz-container').classList.add('hidden');
        const resultsBox = document.getElementById('quiz-results-container');
        if (resultsBox) resultsBox.classList.remove('hidden');
        
        const finalScore = document.getElementById('final-score');
        if (finalScore) finalScore.innerText = appState.quizScore;
    }
}

function resetQuiz() {
    appState.quizIndex = 0;
    appState.quizScore = 0;
    document.getElementById('quiz-results-container').classList.add('hidden');
    document.getElementById('quiz-feedback-box').classList.add('hidden');
    document.getElementById('quiz-container').classList.remove('hidden');
    renderQuiz();
}