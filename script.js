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

// Page Map
const pageMap = {
    home: 'page-home',
    about: 'page-about',
    safety: 'page-safety',
    factcheck: 'page-factcheck',
    linkchecker: 'page-linkchecker',
    skills: 'page-skills',
    quiz: 'page-quiz',
    resources: 'page-resources',
    apps: 'page-apps',
    whatsapp: 'page-whatsapp',
    gmail: 'page-gmail',
    googlesearch: 'page-googlesearch',
    facebook: 'page-facebook'
};

let currentPage = 'home';
let fontSize = 16;
let highContrast = false;
let quizIndex = 0;
let quizScore = 0;

const quizQuestions = [
    {
        question: 'What should you do before clicking a link in a message?',
        options: ['Click it immediately', 'Verify the sender and URL', 'Share it with everyone', 'Ignore all links'],
        answer: 1,
        explanation: 'Always verify the sender and the URL before clicking.'
    },
    {
        question: 'Which source is usually the safest for checking a news story?',
        options: ['A random social post', 'A trusted news outlet with evidence', 'A forwarded WhatsApp message', 'A fake giveaway ad'],
        answer: 1,
        explanation: 'Trusted outlets with evidence are safer than random posts or forwarded messages.'
    },
    {
        question: 'What should you do if a website asks for your password unexpectedly?',
        options: ['Enter it immediately', 'Close the site and verify the address', 'Send it to a friend', 'Ignore the warning'],
        answer: 1,
        explanation: 'Do not enter personal details on unexpected prompts; verify the site first.'
    }
];

document.addEventListener('DOMContentLoaded', init);

function init() {
    const sections = document.querySelectorAll('.page-section');
    sections.forEach((section) => {
        const shouldShow = section.id === 'page-home';
        section.hidden = !shouldShow;
        section.classList.toggle('active-page', shouldShow);
    });

    setActiveNavLink('home');
    updateProgress();
    bindAccessibilityButtons();
    renderQuiz();
    applyFontSize();
    applyTheme();

    window.navigateTo = navigateTo;
    window.toggleMobileMenu = toggleMobileMenu;
    window.analyzeLink = analyzeLink;
    window.nextQuestion = nextQuestion;
    window.resetQuiz = resetQuiz;
}

function navigateTo(page) {
    const sectionId = pageMap[page];
    if (!sectionId) return;

    currentPage = page;

    const sections = document.querySelectorAll('.page-section');
    sections.forEach((section) => {
        const shouldShow = section.id === sectionId;
        section.hidden = !shouldShow;
        section.classList.toggle('active-page', shouldShow);
    });

    setActiveNavLink(page);
    updateProgress();

    if (page === 'quiz') {
        renderQuiz();
    }
}

function setActiveNavLink(page) {
    document.querySelectorAll('.nav-link').forEach((link) => {
        const onclick = link.getAttribute('onclick') || '';
        link.classList.toggle('active', onclick.includes(`'${page}'`));
    });
}

function toggleMobileMenu() {
    const nav = document.getElementById('nav-menu');
    if (!nav) return;
    nav.classList.toggle('open');
    nav.style.display = nav.classList.contains('open') ? 'flex' : '';
}

function updateProgress() {
    const modules = Object.keys(pageMap);
    let visited = [];

    try {
        visited = JSON.parse(localStorage.getItem('visitedPages') || '[]');
    } catch (e) {
        visited = [];
    }

    if (!Array.isArray(visited)) {
        visited = [];
    }

    if (!visited.includes(currentPage)) {
        visited.push(currentPage);
    }

    localStorage.setItem('visitedPages', JSON.stringify(visited));

    const explored = visited.length;
    const percent = Math.min(100, Math.round((explored / modules.length) * 100));

    const bar = document.getElementById('learning-progress-bar');
    const text = document.getElementById('progress-status-text');

    if (bar) {
        bar.style.width = `${percent}%`;
        bar.textContent = `${percent}%`;
    }

    if (text) {
        text.textContent = `${explored} of ${modules.length} Modules Explored`;
    }
}

function analyzeLink() {
    const input = document.getElementById('link-input');
    const loading = document.getElementById('scan-loading');
    const result = document.getElementById('scan-result');
    const statusBadge = document.getElementById('result-status-badge');
    const title = document.getElementById('result-title');
    const explanation = document.getElementById('result-explanation');

    if (!input || !loading || !result || !statusBadge || !title || !explanation) return;

    const raw = (input.value || '').trim();

    loading.classList.remove('hidden');
    result.classList.add('hidden');

    setTimeout(() => {
        const lower = raw.toLowerCase();
        const suspicious =
            /login|verify|secure|password|bank|pay|urgent|click here|free money/i.test(lower) ||
            /bit\.ly|tinyurl|t\.co|paypal|amazon|apple|google/i.test(lower);

        loading.classList.add('hidden');
        result.classList.remove('hidden');
        statusBadge.textContent = suspicious ? 'SUSPICIOUS' : 'SAFE';
        title.textContent = suspicious ? 'Suspicious Link' : 'Looks Safe';
        explanation.textContent = suspicious
            ? 'This looks like a scam or phishing attempt. Avoid clicking and verify the source directly.'
            : 'This appears to be a normal link, but always double-check the URL before entering personal information.';
    }, 800);
}

function bindAccessibilityButtons() {
    document.getElementById('btn-decrease-font')?.addEventListener('click', () => {
        fontSize = Math.max(14, fontSize - 1);
        applyFontSize();
    });

    document.getElementById('btn-reset-font')?.addEventListener('click', () => {
        fontSize = 16;
        applyFontSize();
    });

    document.getElementById('btn-increase-font')?.addEventListener('click', () => {
        fontSize = Math.min(22, fontSize + 1);
        applyFontSize();
    });

    document.getElementById('btn-toggle-theme')?.addEventListener('click', () => {
        highContrast = !highContrast;
        applyTheme();
    });

    document.getElementById('btn-read-aloud')?.addEventListener('click', () => {
        const text = document.body.innerText.replace(/\s+/g, ' ').trim();
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'en-US';
            window.speechSynthesis.speak(utterance);
        }
    });
}

function applyFontSize() {
    document.body.style.fontSize = `${fontSize}px`;
}

function applyTheme() {
    document.body.classList.toggle('dark-mode', highContrast);
}

function renderQuiz() {
    const questionNumber = document.getElementById('quiz-question-number');
    const questionText = document.getElementById('quiz-question-text');
    const optionsContainer = document.getElementById('quiz-options-container');
    const feedbackBox = document.getElementById('quiz-feedback-box');
    const resultsContainer = document.getElementById('quiz-results-container');

    if (!questionNumber || !questionText || !optionsContainer || !feedbackBox || !resultsContainer) return;

    if (quizIndex >= quizQuestions.length) {
        showQuizResults();
        return;
    }

    const currentQuestion = quizQuestions[quizIndex];
    questionNumber.textContent = `Question ${quizIndex + 1}`;
    questionText.textContent = currentQuestion.question;
    optionsContainer.innerHTML = '';

    feedbackBox.classList.add('hidden');
    resultsContainer.classList.add('hidden');

    currentQuestion.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'btn btn-secondary';
        button.textContent = option;
        button.addEventListener('click', () => submitQuizAnswer(index));
        optionsContainer.appendChild(button);
    });
}

function submitQuizAnswer(index) {
    const currentQuestion = quizQuestions[quizIndex];
    const feedbackBox = document.getElementById('quiz-feedback-box');
    const feedbackStatus = document.getElementById('feedback-status');
    const feedbackExplanation = document.getElementById('feedback-explanation');

    if (!feedbackBox || !feedbackStatus || !feedbackExplanation) return;

    if (index === currentQuestion.answer) {
        quizScore += 1;
    }

    feedbackStatus.textContent = index === currentQuestion.answer ? 'Correct!' : 'Not quite';
    feedbackExplanation.textContent = currentQuestion.explanation;
    feedbackBox.classList.remove('hidden');
}

function nextQuestion() {
    quizIndex += 1;
    if (quizIndex >= quizQuestions.length) {
        showQuizResults();
    } else {
        renderQuiz();
    }
}

function showQuizResults() {
    const resultsContainer = document.getElementById('quiz-results-container');
    const score = document.getElementById('final-score');
    if (!resultsContainer || !score) return;

    score.textContent = quizScore;
    resultsContainer.classList.remove('hidden');
}

function resetQuiz() {
    quizIndex = 0;
    quizScore = 0;
    renderQuiz();
}

// Load a random daily safety tip into the tip box
function loadDailyTip() {
    const tipContainer = document.getElementById('daily-tip-text');
    if (tipContainer) {
        const randomIndex = Math.floor(Math.random() * dailyTips.length);
        tipContainer.innerText = dailyTips[randomIndex];
    }
}