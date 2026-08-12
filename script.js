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

// ==========================================
// EDIT YOUR QUIZ QUESTIONS HERE
// Note for 'answer': 0 = A, 1 = B, 2 = C, 3 = D
// ==========================================
const quizQuestions = [
    {
        question: 'Who do scammers often pretend to be?',
        options: [
            'Friends only',
            'Trusted organisations like banks or government departments',// A (0)                                    // B (1)
            'Neighbors only',                                              // C (2)
            'Teachers'                                   // D (3)
        ],
        answer: 1, // 1 means option B is correct
        explanation: 'Scammers frequently impersonate trusted institutions like banks or government departments to create urgency.'
    },
    {
        question: 'Which information should you never share with someone who contacts you unexpectedly?',
        options: [
            'Your favorite colour',
            'Your age',
            'Your PIN, password, or OTP', // C (2)
            'Your first name'
        ],
        answer: 2, // 2 means option C is correct
        explanation: 'Never share sensitive information like PINs, passwords, or OTPs with unknown individuals.'
    },
    {
        question: 'What does OTP stand for ?',
        options: [
            'One-Time Password',
            'Open Telephone plan',
            'online Text Page',
            'Official Transfer Process'
        ],
        answer: 0, // 0 means option A is correct
        explanation: 'OTP stands for One-Time Password.'
    },
    {
        question: 'Legitimate organisations will ask for your banking PIN over the phone',
        options: [
            'True',
            'False',
           
        ],
        answer: 1, // 1 means option B is correct
        explanation: 'Unexpected login prompts can be phishing attempts. Always verify the address bar.'
    },
    {
        question: 'What is a warning sign of a scam?',
        options: [
            'A message that says you have plenty of time ',
            'A message that creates urgency and tells you to act immediately',
            'A birthday card from a friend',
            'A receipt from a shop'
        ],
        answer: 1,// 1 means option B is correct
        explanation: 'Messages that create urgency and tell you to act immediately are often signs of scams.'
    },
    {
        question: 'What should you do before clicking on an unexpected link ?',
        options: [
            'open it straight away',
            'share it with your friends',
            'make sure it is safe or avoid opening it if you are unsure',
            'Delete all your contacts'
        ],
        answer: 2,// 2 means option C is correct
        explanation: 'Avoid opening unexpected links if you are unsure who sent them, as they may lead to phishing sites or malware.'
    },
    {
        question: 'If you receive an unexpected attachment, what should you do?',
        options: [
            'open it straight away',
            'Open it only if someone tells you to',
            'Avoid opening it if you are unsure who sent it',
            'Forward it to everyone you know'
        ],
        answer: 2,// 2 means option C is correct
        explanation: 'Avoid opening unexpected attachments if you are unsure who sent them, as they may contain malware.'
    },
    {
        question: 'If you are unsure whether a message is genuine, what should you do?',
        options: [
            'ignore everyone forever',
            'contact the organisation directly using official contact information',
            'reply with banking details',
            'Click on the link in the message to verify'
        ],
        answer: 1,// 1 means option B is correct
        explanation: 'Contact the organisation directly using official contact information.'
    },
    {
        question: 'which of the following is the safest action?',
        options: [
            'Trust every text message you receive',
            'share your password with the caller',
            'Verify the message with the organsisation before taking any action',
            'send money immediately'
        ],
        answer: 2,// 2 means option C is correct
        explanation: 'Verify the message with the organisation before taking any action.'
    },
    {
        question: 'Why do scammers create a sense of urgency in their messages?',
        options: [
            'To help you make better decisions',
            'To make you feel anxious and act quickly',
            'To provide you with important information',
            'To build trust with you'
        ],
        answer: 1,// 1 means option B is correct
        explanation: 'Scammers create a sense of urgency to make you feel anxious and act quickly without thinking things through.'
    }
];

// ==========================================
// APPLICATION LOGIC
// ==========================================
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
    questionNumber.textContent = `Question ${quizIndex + 1} of ${quizQuestions.length}`;
    questionText.textContent = currentQuestion.question;
    optionsContainer.innerHTML = '';

    feedbackBox.classList.add('hidden');
    resultsContainer.classList.add('hidden');

    currentQuestion.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'btn btn-secondary';
        button.style.display = 'block';
        button.style.width = '100%';
        button.style.textAlign = 'left';
        button.style.margin = '8px 0';
        button.textContent = `${String.fromCharCode(65 + index)}. ${option}`;
        button.addEventListener('click', () => submitQuizAnswer(index));
        optionsContainer.appendChild(button);
    });
}

function submitQuizAnswer(index) {
    const currentQuestion = quizQuestions[quizIndex];
    const feedbackBox = document.getElementById('quiz-feedback-box');
    const feedbackStatus = document.getElementById('feedback-status');
    const feedbackExplanation = document.getElementById('feedback-explanation');
    const buttons = document.querySelectorAll('#quiz-options-container button');

    if (!feedbackBox || !feedbackStatus || !feedbackExplanation) return;

    // Prevent selecting multiple options on the same question
    buttons.forEach(btn => btn.disabled = true);

    if (index === currentQuestion.answer) {
        quizScore += 1;
        feedbackStatus.textContent = '✅ Correct!';
    } else {
        feedbackStatus.textContent = '❌ Not quite';
    }

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
    const quizContainer = document.getElementById('quiz-container');
    const resultsContainer = document.getElementById('quiz-results-container');
    const score = document.getElementById('final-score');
    
    if (quizContainer) quizContainer.classList.add('hidden');
    if (!resultsContainer || !score) return;

    score.textContent = `${quizScore} / ${quizQuestions.length}`;
    resultsContainer.classList.remove('hidden');
}

function resetQuiz() {
    quizIndex = 0;
    quizScore = 0;
    const quizContainer = document.getElementById('quiz-container');
    if (quizContainer) quizContainer.classList.remove('hidden');
    renderQuiz();
}

function loadDailyTip() {
    const tipContainer = document.getElementById('daily-tip-text');
    if (tipContainer) {
        const randomIndex = Math.floor(Math.random() * dailyTips.length);
        tipContainer.innerText = dailyTips[randomIndex];
    }
}
