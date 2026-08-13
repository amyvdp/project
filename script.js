// Global Application State
const appState = {
    fontScale: 1.0,
    darkMode: false
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

// Quiz State
let currentCategory = 'quiz1'; // Starts on Quiz 1
let quizIndex = 0;
let quizScore = 0;

// ==========================================
// COMPLETE 5-QUIZ SCAM SAFETY DATA
// Note for 'answer': 0 = Option A, 1 = Option B, 2 = Option C, 3 = Option D
// ==========================================
const quizCategories = {

    // --------------------------------------
    // QUIZ 1: Scam Safety Basics
    // --------------------------------------
    quiz1: {
        title: "Quiz 1: Scam Safety Basics",
        questions: [
            {
                question: 'Who do scammers often pretend to be?',
                options: [
                    'Friends only',
                    'Trusted organisations like banks or government departments',
                    'Neighbors only',
                    'Teachers'
                ],
                answer: 1, // B
                explanation: 'Scammers frequently impersonate trusted institutions like banks or government departments to create urgency.'
            },
            {
                question: 'Which information should you never share with someone who contacts you unexpectedly?',
                options: [
                    'Your favorite colour',
                    'Your age',
                    'Your PIN, password, or OTP',
                    'Your first name'
                ],
                answer: 2, // C
                explanation: 'Never share sensitive information like PINs, passwords, or OTPs with unknown individuals.'
            },
            {
                question: 'What does OTP stand for?',
                options: [
                    'One-Time Password',
                    'Open Telephone Plan',
                    'Online Text Page',
                    'Official Transfer Process'
                ],
                answer: 0, // A
                explanation: 'OTP stands for One-Time Password.'
            },
            {
                question: 'Legitimate organisations will ask for your banking PIN over the phone.',
                options: [
                    'True',
                    'False'
                ],
                answer: 1, // B
                explanation: 'Legitimate organizations like banks will never ask for your PIN over the phone.'
            },
            {
                question: 'What is a warning sign of a scam?',
                options: [
                    'A message that says you have plenty of time',
                    'A message that creates urgency and tells you to act immediately',
                    'A birthday card from a friend',
                    'A receipt from a shop'
                ],
                answer: 1, // B
                explanation: 'Messages that create urgency and tell you to act immediately are classic signs of scams.'
            },
            {
                question: 'What should you do before clicking on an unexpected link?',
                options: [
                    'Open it straight away',
                    'Share it with your friends',
                    'Make sure it is safe or avoid opening it if you are unsure',
                    'Delete all your contacts'
                ],
                answer: 2, // C
                explanation: 'Avoid opening unexpected links if you are unsure who sent them, as they may lead to phishing sites or malware.'
            },
            {
                question: 'If you receive an unexpected attachment, what should you do?',
                options: [
                    'Open it straight away',
                    'Open it only if someone tells you to',
                    'Avoid opening it if you are unsure who sent it',
                    'Forward it to everyone you know'
                ],
                answer: 2, // C
                explanation: 'Avoid opening unexpected attachments if you are unsure who sent them, as they may contain malware.'
            },
            {
                question: 'If you are unsure whether a message is genuine, what should you do?',
                options: [
                    'Ignore everyone forever',
                    'Contact the organisation directly using official contact information',
                    'Reply with banking details',
                    'Click on the link in the message to verify'
                ],
                answer: 1, // B
                explanation: 'Contact the organisation directly using official contact information from their main website.'
            },
            {
                question: 'Which of the following is the safest action?',
                options: [
                    'Trust every text message you receive',
                    'Share your password with the caller',
                    'Verify the message with the organisation before taking any action',
                    'Send money immediately'
                ],
                answer: 2, // C
                explanation: 'Always verify suspicious messages through trusted channels before taking action.'
            },
            {
                question: 'Why do scammers create a sense of urgency in their messages?',
                options: [
                    'To help you make better decisions',
                    'To make you feel anxious and act quickly',
                    'To provide you with important information',
                    'To build trust with you'
                ],
                answer: 1, // B
                explanation: 'Scammers create a sense of urgency to make you feel anxious and act quickly without thinking.'
            }
        ]
    },

    // --------------------------------------
    // QUIZ 2: Common Types of Scams
    // --------------------------------------
    quiz2: {
        title: "Quiz 2: Common Types of Scams",
        questions: [
            {
                question: "What is the main purpose of a phone scam?",
                options: [
                    "To offer free holidays",
                    "To steal personal information or money from unsuspecting victims",
                    "To conduct a survey",
                    "To remind you of appointments"
                ],
                answer: 1, // B
                explanation: "Scammers aim to steal personal information or money from unsuspecting victims."
            },
            {
                question: "Which type of scam often uses fake links in emails or text messages?",
                options: [
                    "Phone scams",
                    "Lottery scams",
                    "Email and text message scams",
                    "Investment scams"
                ],
                answer: 2, // C
                explanation: "Email and text message scams often use fake links to trick users into revealing personal information or downloading malware."
            },
            {
                question: "What do lottery or prize scams usually ask you to do?",
                options: [
                    "Collect your prize immediately",
                    "Pay a fee before you can claim your winnings",
                    "Visit a local shop",
                    "Fill out a survey"
                ],
                answer: 1, // B
                explanation: "Lottery and prize scams typically ask you to pay an upfront fee to claim fake winnings."
            },
            {
                question: "What is a romance scam?",
                options: [
                    "A scam involving fake dating websites only",
                    "Someone pretending to be a friend at school",
                    "Someone building trust in an online relationship before asking for money",
                    "A scam involving fake flowers"
                ],
                answer: 2, // C
                explanation: "Romance scams involve building an online relationship to gain trust before tricking the victim into sending money."
            },
            {
                question: "Which scam promises high profits with little or no risk?",
                options: [
                    "Phone scams",
                    "Romance scams",
                    "Investment scams",
                    "Delivery scams"
                ],
                answer: 2, // C
                explanation: "Investment scams promise unrealistically high returns with zero risk to lure victims into transferring funds."
            },
            {
                question: "Which of the following is a warning sign of a scam?",
                options: [
                    "Someone asking for money or personal information unexpectedly",
                    "A letter from your doctor",
                    "A family birthday invitation",
                    "A supermarket receipt"
                ],
                answer: 0, // A
                explanation: "Unexpected requests for sensitive details or money should always raise immediate red flags."
            },
            {
                question: "Before sending money or sharing personal information, what should you do?",
                options: [
                    "Act quickly without checking",
                    "Verify that the request is legitimate by contacting the person or organization directly",
                    "Ignore all messages forever",
                    "Tell everyone your banking details"
                ],
                answer: 1, // B
                explanation: "Always verify requests independently before transferring money or sharing credentials."
            },
            {
                question: "Which scam uses the promise of winning money to trick people?",
                options: [
                    "Romance scams",
                    "Phone scams",
                    "Lottery scams",
                    "Investment scams"
                ],
                answer: 2, // C
                explanation: "Lottery scams entice victims with unexpected money, claiming you won a contest you never entered."
            },
            {
                question: "Why do scammers build trust in romance scams?",
                options: [
                    "To become lifelong friends",
                    "To eventually ask for money or personal information",
                    "To help people find jobs",
                    "To sell concert tickets"
                ],
                answer: 1, // B
                explanation: "Scammers manipulate feelings to make victims comfortable enough to send money."
            },
            {
                question: "What is the best way to protect yourself from scams?",
                options: [
                    "Share your banking details only once",
                    "Trust every message you receive",
                    "Verify requests for money or personal information before taking action",
                    "Click every link to check if it is real"
                ],
                answer: 2, // C
                explanation: "Taking time to verify claims independently is your best defense against scammers."
            }
        ]
    },

    // --------------------------------------
    // QUIZ 3: How to use the Internet Safely
    // --------------------------------------
    quiz3: {
        title: "Quiz 3: Internet Safety",
        questions: [
            {
                question: "Why do many people use the internet?",
                options: [
                    "Only to play games",
                    "To communicate, shop, learn, and access services",
                    "Only to watch television",
                    "only to read newspapers"
                ],
                answer: 1, // B
                explanation: "Many people use the internet to communicate, shop, learn, and access various services."
            },
            {
                question: "What type of password should you use?",
                options: [
                    "A strong password that is difficult to guess",
                    "Your first name",
                    "The word 'password'",
                    "Your birthdate"
                ],
                answer: 0, // A
                explanation: "A strong password is difficult to guess and helps protect your accounts from unauthorized access."
            },
            {
                question: "Who should you share your passwords with?",
                options: [
                    "Friends",
                    "Family members",
                    "No one",
                    "People who ask politely"
                ],
                answer: 2, // C
                explanation: "You should never share your passwords with anyone, as this compromises the security of your accounts."
            },
            {
                question: "What kind of websites should you use for online shopping or banking?",
                options: [
                    "Any website you find",
                    "Trusted websites with secure connections (https://)",
                    "Websites with lots of advertisements",
                    "Websites sent by strangers"
                ],
                answer: 1, // B
                explanation: "Trusted websites with secure connections (https://) ensure your data is encrypted and protected."
            },
            {
                question: "What should you look for before entering personal information on a website?",
                options: [
                    "A large picture",
                    "A padlock icon and 'https://' in the address bar",
                    "Bright colors",
                    "A pop-up advertisement"
                ],
                answer: 1, // B
                explanation: " A padlock icon and 'https://' in the address bar indicate a secure connection. Unrecognized login notifications indicate compromised credentials. Change your password immediately."
            },
            {
                question: "Why is it important to keep your device software up to date?",
                options: [
                    "It changes the wallpaper on your device",
                    "It Provides the latest security patches and fixes vulnerabilities",
                    "It makes the screen brighter",
                    "It Increases the volume of your device"
                ],
                answer: 1, // B
                explanation: "Keeping your device software up to date is crucial for maintaining security and protecting against potential threats."
            },
            {
                question: "What should you avoid using for online banking or shopping?",
                options: [
                    "Your home internet connection",
                    "Public Wi-Fi networks",
                    "A secure mobile network",
                    "Your own personal hotspot"
                ],
                answer: 1, // B
                explanation: "Public Wi-Fi networks are often unsecured and can be easily intercepted by cybercriminals."
            },
        
            { question: "What should you do after finishing online banking or shopping?",
                options: [
                    "leave the website open",
                    "Turn off your screen only",
                    "Log out of your account and close the browser",
                    "Share the login credentials with a trusted friend"
                ],
                answer: 2, // C
                explanation: "Closing the browser and clearing the cache helps protect your information from unauthorized access."
            },
            {
                question: "which of the following helps keep your online accounts secure?",
                options: [
                    "USing the same password for all accounts",
                    "Sharing your password with friends",
                    "USing a strong password and keeping it private",
                    "writing your password in a public place"
                ],
                answer: 2, // C
                explanation: "Using a strong password and keeping it private is a fundamental way to protect your online accounts."
            },
            {
                question: "What is the best way to stay safe while using the internet?",
                options: [
                    "Visit trusted websites, use strong passwords, and be cautious of suspicious messages or links",
                    "click every link you receive",
                    "share your personal information freely",
                    "Ignore security updates and warnings"
                ],
                answer: 0, // A
                explanation: "Visiting trusted websites, using strong passwords, and being cautious of suspicious messages or links are essential practices for maintaining online safety."
            }

        ]
    },

    // --------------------------------------
    // QUIZ 4: Useful Apps for everyday life
    // --------------------------------------
    quiz4: {
        title: "Quiz 4: Useful Apps for everyday life",
        questions: [
            {
                question: "What can you do with a banking app?",
                options: [
                    "Watch movies",
                    "Check your balance, transfer money, and pay bills",
                    "Order takeaway only",
                    "Edit photos"
                ],
                answer: 1, // B
                explanation: "you can check your balance, transfer money, and pay bills with a banking app."
            },
            {
                question: "What is the main purpose of the checkers sixty60 app?",
                options: [
                    "Book flights",
                    "Order groceries and have them delivered quickly",
                    "Play games",
                    "Read books"
                ],
                answer: 1, // B
                explanation: "The checkers sixty60 app is primarily used for ordering groceries and having them delivered quickly."
            },
            {
                question: "What can you use the Camera app for?",
                options: [
                    "Take photos",
                    "paying bills",
                    "Finding directions",
                    "Sending emails"
                ],
                answer: 0, // A
                explanation: "The Camera app can be used to take photos, record videos, and scan documents."
            },
            {
                question: "What is WhatsApp mainly used for?",
                options: [
                    "Online banking",
                    "shopping",
                    "Sending messages and making voice or video calls",
                    "Editing docuements"
                ],
                answer: 2, // C
                explanation: "whatsApp is used to send messages and for making voice or video calls."
            },
            {
                question: "Which app helps you find directions and locate places?",
                options: [
                    "Camera",
                    "Google Maps",
                    "Banking Apps",
                    "Checkers Sixty60"
                ],
                answer: 1, // C
                explanation: "Google MAps is used to help user with directions and to locate places."
            }
        ]
    },

    // --------------------------------------
    // QUIZ 5: What to Do If You've Been Scammed
    // --------------------------------------
    quiz5: {
        title: "Quiz 5: What to Do If You've Been Scammed",
        questions: [
            {
                question: "If you realize you shared banking details with a scammer, what is your first step?",
                options: [
                    "Wait a few days to see if money disappears",
                    "Contact your bank or financial institution immediately",
                    "Post about it on social media",
                    "Delete your bank app"
                ],
                answer: 1, // B
                explanation: "Contacting your bank immediately allows them to freeze compromised cards or block unauthorized transfers."
            },
            {
                question: "Should you report scams to local consumer protection or cybersecurity authorities?",
                options: [
                    "Yes, reporting helps protect others and assists law enforcement in tracking scammers",
                    "No, reporting is illegal",
                    "Only if you lost more than $10,000",
                    "No, authorities cannot do anything"
                ],
                answer: 0, // A
                explanation: "Reporting scams helps authorities warn the public and track fraudulent activity networks."
            },
            {
                question: "If you used the same password on a compromised site as other accounts, what should you do?",
                options: [
                    "Nothing, as long as you logged out",
                    "Change the password on all accounts that shared that same password",
                    "Delete all your accounts",
                    "Turn off your internet router"
                ],
                answer: 1, // B
                explanation: "Immediately update all accounts that shared the compromised password to prevent credential stuffing attacks."
            },
            {
                question: "What is 'recovery scamming'?",
                options: [
                    "When a company refunds your money legally",
                    "When scammers target previous scam victims, pretending to help recover lost funds for a fee",
                    "An automatic software backup system",
                    "A discount offered by legitimate retailers"
                ],
                answer: 1, // B
                explanation: "Recovery scammers exploit previous victims by promising to recover lost funds in exchange for upfront payment."
            },
            {
                question: "What is the best way to handle suspicious software installed by a scammer on your computer?",
                options: [
                    "Disconnect from the internet and run a full antivirus scan or seek expert help",
                    "Keep using the computer normally",
                    "Turn the screen brightness down",
                    "Share the screen with another stranger"
                ],
                answer: 0, // A
                explanation: "Disconnecting prevents remote control or data exfiltration while you clean or restore the machine."
            }
        ]
    }
};

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
    renderCategoryButtons();
    renderQuiz();
    applyFontSize();
    applyTheme();

    window.navigateTo = navigateTo;
    window.toggleMobileMenu = toggleMobileMenu;
    window.analyzeLink = analyzeLink;
    window.nextQuestion = nextQuestion;
    window.resetQuiz = resetQuiz;
    window.selectCategory = selectCategory;
}

function renderCategoryButtons() {
    const categoryContainer = document.getElementById('quiz-category-selector');
    if (!categoryContainer) return;

    categoryContainer.innerHTML = '';
    Object.keys(quizCategories).forEach((key) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = `btn ${key === currentCategory ? 'btn-primary' : 'btn-outline-secondary'}`;
        btn.style.margin = '4px';
        btn.textContent = quizCategories[key].title;
        btn.addEventListener('click', () => selectCategory(key));
        categoryContainer.appendChild(btn);
    });
}

function selectCategory(catKey) {
    if (!quizCategories[catKey]) return;
    currentCategory = catKey;
    quizIndex = 0;
    quizScore = 0;

    const quizContainer = document.getElementById('quiz-container');
    if (quizContainer) quizContainer.classList.remove('hidden');

    renderCategoryButtons();
    renderQuiz();
}

function renderQuiz() {
    const categoryTitle = document.getElementById('quiz-category-title');
    const questionNumber = document.getElementById('quiz-question-number');
    const questionText = document.getElementById('quiz-question-text');
    const optionsContainer = document.getElementById('quiz-options-container');
    const feedbackBox = document.getElementById('quiz-feedback-box');
    const resultsContainer = document.getElementById('quiz-results-container');

    const activeQuiz = quizCategories[currentCategory];
    if (!activeQuiz) return;

    if (categoryTitle) categoryTitle.textContent = activeQuiz.title;

    if (!questionNumber || !questionText || !optionsContainer || !feedbackBox || !resultsContainer) return;

    if (quizIndex >= activeQuiz.questions.length) {
        showQuizResults();
        return;
    }

    const currentQuestion = activeQuiz.questions[quizIndex];
    questionNumber.textContent = `Question ${quizIndex + 1} of ${activeQuiz.questions.length}`;
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
    const activeQuiz = quizCategories[currentCategory];
    const currentQuestion = activeQuiz.questions[quizIndex];
    const feedbackBox = document.getElementById('quiz-feedback-box');
    const feedbackStatus = document.getElementById('feedback-status');
    const feedbackExplanation = document.getElementById('feedback-explanation');
    const buttons = document.querySelectorAll('#quiz-options-container button');

    if (!feedbackBox || !feedbackStatus || !feedbackExplanation) return;

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
    const activeQuiz = quizCategories[currentCategory];
    if (quizIndex >= activeQuiz.questions.length) {
        showQuizResults();
    } else {
        renderQuiz();
    }
}

function showQuizResults() {
    const quizContainer = document.getElementById('quiz-container');
    const resultsContainer = document.getElementById('quiz-results-container');
    const score = document.getElementById('final-score');
    const activeQuiz = quizCategories[currentCategory];

    if (quizContainer) quizContainer.classList.add('hidden');
    if (!resultsContainer || !score) return;

    score.textContent = `${quizScore} / ${activeQuiz.questions.length}`;
    resultsContainer.classList.remove('hidden');
}

function resetQuiz() {
    quizIndex = 0;
    quizScore = 0;
    const quizContainer = document.getElementById('quiz-container');
    if (quizContainer) quizContainer.classList.remove('hidden');
    renderQuiz();
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

function loadDailyTip() {
    const tipContainer = document.getElementById('daily-tip-text');
    if (tipContainer) {
        const randomIndex = Math.floor(Math.random() * dailyTips.length);
        tipContainer.innerText = dailyTips[randomIndex];
    }
}
