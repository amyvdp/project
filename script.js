/// Global Application State
const appState = {
    fontScale: 1.0,
    darkMode: false,
    language: localStorage.getItem('silverassist-language') || 'en'
};

const translations = {
    en: {
        accessibility: 'Accessibility', highContrast: 'High Contrast', listenToPage: 'Listen to Page',
        home: 'Home', aboutContact: 'About Us and Contact', informationEthics: 'Information Ethics',
        startLearning: 'Start learning', scamChecker: 'Scam Checker', searchTopics: 'Search safety topics...',
        heroTitle: 'Navigate the Digital World with Confidence & Safety',
        heroSubtitle: 'SilverAssist empowers older adults to access, evaluate, and share digital information safely and responsibly.',
        startLearningNow: 'Start Learning Now', checkLink: 'Check a Link for Scams'
    },
    af: {
        accessibility: 'Toeganklikheid', highContrast: 'Hoe kontras', listenToPage: 'Luister na bladsy',
        home: 'Tuis', aboutContact: 'Oor ons en kontak', informationEthics: 'Inligtingsetiek',
        startLearning: 'Begin leer', scamChecker: 'Bedrogkontroleerder', searchTopics: 'Soek veiligheidsonderwerpe...',
        heroTitle: 'Navigeer die digitale wereld met vertroue en veiligheid',
        heroSubtitle: 'SilverAssist help ouer volwassenes om digitale inligting veilig en verantwoordelik te gebruik, te evalueer en te deel.',
        startLearningNow: 'Begin nou leer', checkLink: 'Kontroleer skakels vir bedrog'
    },
    zu: {
        accessibility: 'Ukufinyeleleka', highContrast: 'Umehluko omkhulu', listenToPage: 'Lalela ikhasi',
        home: 'Ikhaya', aboutContact: 'Mayelana nathi nokuxhumana', informationEthics: 'Izimiso zolwazi',
        startLearning: 'Qala ukufunda', scamChecker: 'Isihloli sobuqili', searchTopics: 'Sesha izihloko zokuphepha...',
        heroTitle: 'Sebenzisa umhlaba wedijithali ngokuzethemba nangokuphepha',
        heroSubtitle: 'SilverAssist isiza abantu abadala ukuthi bathole, bahlole futhi babelane ngolwazi lwedijithali ngokuphepha nangokuzibophezela.',
        startLearningNow: 'Qala ukufunda manje', checkLink: 'Hlola isixhumanisi sobuqili'
    }
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
    facebook: 'page-facebook',
    signup: 'page-signup',
    contact: 'page-contact',
    aboutus: 'page-aboutus'
};

let currentPage = 'home';
let fontSize = 16;
let highContrast = false;

// Quiz State
let currentCategory = 'quiz1'; // Starts on Quiz 1
let quizIndex = 0;
let quizScore = 0;

// ==========================================
// COMPLETE 4-QUIZ SCAM SAFETY DATA (10 Qs EACH)
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
                    "Only to read newspapers"
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
                explanation: "A padlock icon and 'https://' in the address bar indicate a secure connection."
            },
            {
                question: "Why is it important to keep your device software up to date?",
                options: [
                    "It changes the wallpaper on your device",
                    "It provides the latest security patches and fixes vulnerabilities",
                    "It makes the screen brighter",
                    "It increases the volume of your device"
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
            {
                question: "What should you do after finishing online banking or shopping?",
                options: [
                    "Leave the website open",
                    "Turn off your screen only",
                    "Log out of your account and close the browser",
                    "Share the login credentials with a trusted friend"
                ],
                answer: 2, // C
                explanation: "Closing the browser and logging out helps protect your information from unauthorized access."
            },
            {
                question: "Which of the following helps keep your online accounts secure?",
                options: [
                    "Using the same password for all accounts",
                    "Sharing your password with friends",
                    "Using a strong password and keeping it private",
                    "Writing your password in a public place"
                ],
                answer: 2, // C
                explanation: "Using a strong password and keeping it private is a fundamental way to protect your online accounts."
            },
            {
                question: "What is the best way to stay safe while using the internet?",
                options: [
                    "Visit trusted websites, use strong passwords, and be cautious of suspicious messages or links",
                    "Click every link you receive",
                    "Share your personal information freely",
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
        title: "Quiz 4: Useful Apps for Everyday Life",
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
                explanation: "You can check your balance, transfer money, and pay bills with a banking app."
            },
            {
                question: "What is the main purpose of the Checkers Sixty60 app?",
                options: [
                    "Book flights",
                    "Order groceries and have them delivered quickly",
                    "Play games",
                    "Read books"
                ],
                answer: 1, // B
                explanation: "The Checkers Sixty60 app is primarily used for ordering groceries and having them delivered quickly."
            },
            {
                question: "What can you use the Camera app for?",
                options: [
                    "Take photos and scan documents",
                    "Paying bills",
                    "Finding directions",
                    "Sending emails"
                ],
                answer: 0, // A
                explanation: "The Camera app can be used to take photos, record videos, and scan documents or QR codes."
            },
            {
                question: "What is WhatsApp mainly used for?",
                options: [
                    "Online banking",
                    "Shopping",
                    "Sending messages and making voice or video calls",
                    "Editing documents"
                ],
                answer: 2, // C
                explanation: "WhatsApp is used to send text/voice messages and make voice or video calls."
            },
            {
                question: "Which app helps you find directions and locate places?",
                options: [
                    "Camera",
                    "Google Maps",
                    "Banking Apps",
                    "Checkers Sixty60"
                ],
                answer: 1, // B
                explanation: "Google Maps is used to provide navigation directions and help users locate places."
            },
            {
                question: "Which app would you use to check your account balance?",
                options: [
                    "Google maps",
                    "Camera",
                    "Banking app",
                    "WhatsApp"
                ],
                answer: 2, // C
                explanation: "You should always use the banking app when checking your account balance."
            },
            {
                question: "If your are unable to visit the supermarket, which app could you buy groceries?",
                options: [
                    "WhatsApp",
                    "Camera",
                    "Checkers Sixty60",
                    "Google Maps"
                ],
                answer: 2, // C
                explanation: "To buy groceries you can use the Checkers Sixty60 App."
            },
            {
                question: "Which app is best for keeping in touch with family and friends?",
                options: [
                    "WhatsApp",
                    "Banking app",
                    "Camera",
                    "Google Maps"
                ],
                answer: 0, // A
                explanation: "To keep in touch with family and friends use WhatsApp."
            },
            {
                question: "Which app would you use to take a picture of an important document?",
                options: [
                    "Banking App",
                    "Camera",
                    "Google Maps",
                    "Checkers Sixty60"
                ],
                answer: 1, // B
                explanation: "Using the Camera app to take pictures of an important document."
            },
            {
                question: "What is one benefit of learning to use these apps?",
                options: [
                    "They make everyday tasks easier and help you stay independent",
                    "They replace the need for a phone",
                    "They stop all scams automatically",
                    "They make your phone charge faster"
                ],
                answer: 0, // A
                explanation: "They make everyday tasks easier and help you stay independent."
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
    bindLanguageSelector();
    bindWorkshopDateSelector();
    applyLanguage(appState.language);

    window.navigateTo = navigateTo;
    window.toggleMobileMenu = toggleMobileMenu;
    window.analyzeLink = analyzeLink;
    window.nextQuestion = nextQuestion;
    window.resetQuiz = resetQuiz;
    window.selectCategory = selectCategory;
}

function bindLanguageSelector() {
    const selector = document.getElementById('language-select');
    if (selector) selector.addEventListener('change', (event) => applyLanguage(event.target.value));
}

function bindWorkshopDateSelector() {
    const residenceSelector = document.getElementById('old-age-home');
    const dateGroup = document.getElementById('workshop-date-group');
    const dateSelector = document.getElementById('workshop-date');
    if (!residenceSelector || !dateGroup || !dateSelector) return;

    residenceSelector.addEventListener('change', () => {
        const hasResidence = residenceSelector.value !== '';
        dateGroup.classList.toggle('hidden', !hasResidence);
        dateGroup.setAttribute('aria-hidden', (!hasResidence).toString());
        dateSelector.required = hasResidence;

        if (!hasResidence) dateSelector.value = '';
    });
}

function applyLanguage(language) {
    const selectedLanguage = translations[language] ? language : 'en';
    const dictionary = translations[selectedLanguage];
    appState.language = selectedLanguage;
    localStorage.setItem('silverassist-language', selectedLanguage);
    document.documentElement.lang = selectedLanguage;

    document.querySelectorAll('[data-i18n]').forEach((element) => {
        const translation = dictionary[element.dataset.i18n];
        if (translation) element.textContent = translation;
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach((element) => {
        const translation = dictionary[element.dataset.i18nPlaceholder];
        if (translation) element.placeholder = translation;
    });

    const selector = document.getElementById('language-select');
    if (selector) selector.value = selectedLanguage;

    // Translate text that is not tagged with a local data-i18n key.
    syncGoogleLanguage(selectedLanguage);
}

function syncGoogleLanguage(language, attempt = 0) {
    const googleSelector = document.querySelector('.goog-te-combo');
    if (googleSelector) {
        if (googleSelector.value !== language) {
            googleSelector.value = language;
            googleSelector.dispatchEvent(new Event('change'));
        }
        return;
    }

    if (attempt < 10) {
        window.setTimeout(() => syncGoogleLanguage(language, attempt + 1), 250);
    }
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

    // Check if quiz completed
    if (quizIndex >= activeQuiz.questions.length) {
        document.getElementById('quiz-container')?.classList.add('hidden');
        resultsContainer.classList.remove('hidden');

        const finalScore = document.getElementById('final-score');
        const maxScore = document.getElementById('max-score');
        if (finalScore) finalScore.textContent = quizScore;
        if (maxScore) maxScore.textContent = activeQuiz.questions.length;
        return;
    }

    // Hide results, clear feedback, show quiz
    resultsContainer.classList.add('hidden');
    feedbackBox.innerHTML = '';
    feedbackBox.className = 'quiz-feedback hidden';

    const q = activeQuiz.questions[quizIndex];
    questionNumber.textContent = `Question ${quizIndex + 1} of ${activeQuiz.questions.length}`;
    questionText.textContent = q.question;

    optionsContainer.innerHTML = '';
    q.options.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'btn btn-outline-primary option-btn';
        btn.style.display = 'block';
        btn.style.width = '100%';
        btn.style.margin = '8px 0';
        btn.style.textAlign = 'left';
        btn.textContent = opt;
        btn.addEventListener('click', () => handleAnswer(idx));
        optionsContainer.appendChild(btn);
    });
}

function handleAnswer(selectedIndex) {
    const activeQuiz = quizCategories[currentCategory];
    if (!activeQuiz) return;

    const q = activeQuiz.questions[quizIndex];
    const feedbackBox = document.getElementById('quiz-feedback-box');
    const optionsButtons = document.querySelectorAll('#quiz-options-container .option-btn');

    optionsButtons.forEach(btn => btn.disabled = true);

    if (selectedIndex === q.answer) {
        quizScore++;
        if (feedbackBox) {
            feedbackBox.className = 'alert alert-success quiz-feedback';
            feedbackBox.innerHTML = `<strong>Correct!</strong> ${q.explanation}`;
        }
    } else {
        if (feedbackBox) {
            feedbackBox.className = 'alert alert-danger quiz-feedback';
            feedbackBox.innerHTML = `<strong>Incorrect.</strong> ${q.explanation}`;
        }
    }

    if (feedbackBox) feedbackBox.classList.remove('hidden');

    const nextBtn = document.createElement('button');
    nextBtn.type = 'button';
    nextBtn.className = 'btn btn-primary mt-3';
    nextBtn.textContent = quizIndex + 1 < activeQuiz.questions.length ? 'Next Question' : 'See Results';
    nextBtn.addEventListener('click', nextQuestion);
    feedbackBox.appendChild(nextBtn);
}

function nextQuestion() {
    quizIndex++;
    renderQuiz();
}

function resetQuiz() {
    quizIndex = 0;
    quizScore = 0;
    const quizContainer = document.getElementById('quiz-container');
    if (quizContainer) quizContainer.classList.remove('hidden');
    renderQuiz();
}

function navigateTo(pageId) {
    const mappedId = pageMap[pageId] || 'page-home';
    const sections = document.querySelectorAll('.page-section');
    sections.forEach(sec => {
        const show = sec.id === mappedId;
        sec.hidden = !show;
        sec.classList.toggle('active-page', show);
    });
    currentPage = pageId;
    setActiveNavLink(pageId);
    window.scrollTo(0, 0);
}

function setActiveNavLink(pageId) {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('data-page') === pageId);
    });
}

function toggleMobileMenu() {
    const navMenu = document.getElementById('nav-menu');
    if (navMenu) navMenu.classList.toggle('mobile-active');
}

function analyzeLink() {
    const input = document.getElementById('link-input');
    const resultBox = document.getElementById('scan-result');
    if (!input || !resultBox) return;

    const url = input.value.trim().toLowerCase();
    if (!url) {
        resultBox.className = 'alert alert-warning';
        resultBox.textContent = 'Please enter a web link to check.';
        resultBox.classList.remove('hidden');
        return;
    }

    if (!url.startsWith('https://')) {
        resultBox.className = 'alert alert-danger';
        resultBox.textContent = 'Warning: This link does not use secure HTTPS. Be very cautious.';
    } else {
        resultBox.className = 'alert alert-success';
        resultBox.textContent = 'This link uses a secure HTTPS protocol. Always double check domain names for typos.';
    }
    resultBox.classList.remove('hidden');
}

function updateProgress() {}

function bindAccessibilityButtons() {
    const decreaseButton = document.getElementById('btn-decrease-font');
    const resetButton = document.getElementById('btn-reset-font');
    const increaseButton = document.getElementById('btn-increase-font');
    const themeButton = document.getElementById('btn-toggle-theme');
    const readAloudButton = document.getElementById('btn-read-aloud');

    decreaseButton?.addEventListener('click', () => {
        fontSize = Math.max(12, fontSize - 2);
        applyFontSize();
    });

    resetButton?.addEventListener('click', () => {
        fontSize = 16;
        applyFontSize();
    });

    increaseButton?.addEventListener('click', () => {
        fontSize = Math.min(28, fontSize + 2);
        applyFontSize();
    });

    themeButton?.addEventListener('click', () => {
        highContrast = !highContrast;
        applyTheme();
    });

    readAloudButton?.addEventListener('click', () => {
        if (!('speechSynthesis' in window)) {
            window.alert('Text-to-speech is not supported by this browser.');
            return;
        }

        if (window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel();
            readAloudButton.innerHTML = '<i class="fa-solid fa-volume-high"></i> Listen to Page';
            return;
        }

        const pageText = document.querySelector('main')?.innerText.trim();
        if (!pageText) return;

        const speech = new SpeechSynthesisUtterance(pageText);
        speech.rate = 0.9;
        speech.onend = () => {
            readAloudButton.innerHTML = '<i class="fa-solid fa-volume-high"></i> Listen to Page';
        };
        readAloudButton.innerHTML = '<i class="fa-solid fa-stop"></i> Stop Reading';
        window.speechSynthesis.speak(speech);
    });
}

function applyFontSize() {
    const scale = fontSize / 16;
    document.documentElement.style.setProperty('--font-scale', scale.toString());
}

function applyTheme() {
    document.body.classList.toggle('high-contrast', highContrast);
    const themeButton = document.getElementById('btn-toggle-theme');
    themeButton?.setAttribute('aria-pressed', highContrast.toString());
}