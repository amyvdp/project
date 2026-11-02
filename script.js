const appState = {
  fontScale: 1.0,
  darkMode: false,
  language: localStorage.getItem('silverassist-language') || 'en'
};

const translations = {
  en: {
    accessibility: 'Accessibility', darkMode: 'Dark Mode', highContrast: 'High Contrast', listenToPage: 'Listen to Page',
    home: 'Home', aboutContact: 'About Us and Contact',
    startLearning: 'Start learning', scamChecker: 'Scam Checker', searchTopics: 'Search safety topics...',
    heroTitle: 'Navigate the Digital World with Confidence & Safety',
    heroSubtitle: 'SilverAssist empowers older adults to access, evaluate, and share digital information safely and responsibly.',
    startLearningNow: 'Start Learning Now', checkLink: 'Check a Link for Scams'
  },
  af: {
    accessibility: 'Toeganklikheid', darkMode: 'Donker modus', highContrast: 'Hoe kontras', listenToPage: 'Luister na bladsy',
    home: 'Tuis', aboutContact: 'Oor ons en kontak',
    startLearning: 'Begin leer', scamChecker: 'Bedrogkontroleerder', searchTopics: 'Soek veiligheidsonderwerpe...',
    heroTitle: 'Navigeer die digitale wereld met vertroue en veiligheid',
    heroSubtitle: 'SilverAssist help ouer volwassenes om digitale inligting veilig en verantwoordelik te gebruik, te evalueer en te deel.',
    startLearningNow: 'Begin nou leer', checkLink: 'Kontroleer skakels vir bedrog'
  },
  zu: {
    accessibility: 'Ukufinyeleleka', darkMode: 'Imodi emnyama', highContrast: 'Umehluko omkhulu', listenToPage: 'Lalela ikhasi',
    home: 'Ikhaya', aboutContact: 'Mayelana nathi nokuxhumana',
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

// Search index — used to power the global search bar in the header.
// Each entry maps a set of keywords to a page in pageMap.
const searchIndex = [
  { keywords: 'home welcome', page: 'home', label: 'Home' },
  { keywords: 'about us contact team university pretoria', page: 'aboutus', label: 'About Us and Contact' },
  { keywords: 'start learning safety stay safe topics', page: 'safety', label: 'Start Learning' },
  { keywords: 'workshop in person sign up retirement village schedule', page: 'factcheck', label: 'In-Person Workshops' },
  { keywords: 'scam checker link checker phishing url analyze', page: 'linkchecker', label: 'Scam Link Checker' },
  { keywords: 'digital skills tutorials apps whatsapp gmail google facebook', page: 'skills', label: 'Digital Skills' },
  { keywords: 'quiz avoid scamming test questions', page: 'quiz', label: 'Avoid Scamming Quiz' },
  { keywords: 'resources faq checklist guides', page: 'resources', label: 'Resources & FAQs' },
  { keywords: 'download apps app store google play install', page: 'apps', label: 'Downloadable Apps' },
  { keywords: 'whatsapp messaging voice call chat', page: 'whatsapp', label: 'How to Use WhatsApp' },
  { keywords: 'gmail email writing sending account', page: 'gmail', label: 'Writing & Sending Gmail' },
  { keywords: 'google search searching internet results', page: 'googlesearch', label: 'How to Use Google Search' },
  { keywords: 'facebook social media friends post', page: 'facebook', label: 'How to Use Facebook' },
  { keywords: 'workshop registration sign up form register', page: 'signup', label: 'Workshop Sign-Up' },
  { keywords: 'contact partner retirement village request message', page: 'contact', label: 'Contact Us' }
];

// Which top-level nav link stays highlighted for each page (sub-pages belong to "Start learning")
const navParent = {
  home: 'home', aboutus: 'aboutus', linkchecker: 'linkchecker',
  safety: 'safety', factcheck: 'safety', skills: 'safety', quiz: 'safety', resources: 'safety',
  apps: 'safety', whatsapp: 'safety', gmail: 'safety', googlesearch: 'safety', facebook: 'safety',
  signup: 'safety', contact: 'safety'
};

let currentPage = 'home';
let fontSize = 16;
const THEME_KEY = 'silverassist-theme'; // 'light' | 'dark' | 'contrast'
let theme = 'light';
try {
  const savedTheme = localStorage.getItem(THEME_KEY);
  if (savedTheme === 'dark' || savedTheme === 'contrast') theme = savedTheme;
} catch (error) { /* storage unavailable – default to light */ }

// Quiz State
let currentCategory = 'quiz1'; // Starts on Quiz 1
let quizIndex = 0;
let quizScore = 0;
let quizRun = [];        // The questions for the current attempt (options shuffled)
let quizAnswers = [];    // One entry per answered question, used for the results review
let quizAnswered = false;
const QUIZ_STORAGE_KEY = 'silverassist-quiz-best';

// ==========================================
// 4 QUIZZES x 10 QUESTIONS
// 'answer' is the index of the correct option in the list below (0 = first).
// Options are shuffled every time a quiz starts, so the correct answer does not
// always sit in the same place. Add  shuffle: false  to keep a question's order
// (used for True/False).
// ==========================================
const quizCategories = {

  // --------------------------------------
  // QUIZ 1: Scam Safety Basics
  // --------------------------------------
  quiz1: {
    title: 'Quiz 1: Scam Safety Basics',
    questions: [
      {
        question: 'Scammers often pretend to be someone you already trust. Who are they most likely to pretend to be?',
        options: [
          'Your bank, SARS or a courier company',
          'A stranger who tells you straight away that they want your money',
          'Only people who live in another country',
          'Nobody – scammers always use their own names'
        ],
        answer: 0,
        explanation: 'Scammers copy trusted names such as banks, government departments and delivery companies, because you are more likely to believe and obey them.'
      },
      {
        question: 'A caller says they are from your bank\'s fraud department and asks you to read out the code. What should you do?',
        scenario: { sender: 'Bank Security', time: 'Now', icon: 'fa-building-columns', message: 'ALERT: A payment of R4,800 is pending. To stop it, reply with the 6-digit code we just sent you. Do not hang up.', clues: ['It asks you to share a one-time code', 'It creates urgency and says not to hang up'] },
        options: [
          'Read it out – they are only trying to protect your account',
          'Give them only the first three digits',
          'Hang up, then phone your bank on the number printed on your bank card',
          'Ask them to phone back later and give them your account number then'
        ],
        answer: 2,
        explanation: 'Banks never ask for your OTP, PIN or password. That code lets someone approve a payment from your account. Hang up and call the number on your card yourself.'
      },
      {
        question: 'What is an OTP, the code that is sent to your phone when you log in or make a payment?',
        options: [
          'A one-time PIN or password that proves it is really you – never share it',
          'A permanent password for your phone',
          'A receipt for a payment you made',
          'A code you give to bank staff so they can help you'
        ],
        answer: 0,
        explanation: 'OTP stands for One-Time PIN (or Password). It works only once and it is meant for you alone, so keep it private.'
      },
      {
        question: 'True or false: a real bank may ask for your PIN over the phone if they say there is a problem with your account.',
        options: ['True', 'False'],
        answer: 1,
        shuffle: false,
        explanation: 'False. A real bank will never ask for your PIN, password or OTP by phone, SMS or email, however serious the problem sounds.'
      },
      {
        question: 'Which of these messages contains a warning sign of a scam?',
        options: [
          '"Your parcel could not be delivered. Pay R35 within the hour or it will be sent back."',
          'A reminder from your clinic about an appointment you booked',
          'A photo from your daughter in your family WhatsApp group',
          'A till slip after you paid at the shop'
        ],
        answer: 0,
        explanation: 'Pressure to pay quickly, a small fee and a deadline are classic scam signs. Genuine companies give you time and do not rush you.'
      },
      {
        question: 'This text says your bank account is blocked. What is the safest thing to do?',
        scenario: { sender: 'YourBank', time: 'Today, 09:42', icon: 'fa-building-columns', message: 'Your account has been temporarily locked. Restore access now: https://yourbank-secure.example/login', clues: ['The unexpected link may lead to a fake sign-in page', 'The message pressures you to act now'] },
        options: [
          'Tap the link quickly so the account is unblocked',
          'Reply STOP to the message',
          'Forward it to your friends as a warning',
          'Do not tap the link. Open your bank\'s official app or call the number on your bank card'
        ],
        answer: 3,
        explanation: 'Links in unexpected messages can lead to fake websites that steal your details. Go to your bank yourself, using the app or a number you already trust. Forwarding the message could also spread the link.'
      },
      {
        question: 'An email from someone you do not know has an attachment called "Invoice.zip". What should you do?',
        options: [
          'Open it to find out who sent it',
          'Do not open it – delete the email, or check with the sender in another way',
          'Save it to your phone to look at later',
          'Forward it to your family to see if they know it'
        ],
        answer: 1,
        explanation: 'Unexpected attachments can contain viruses that steal your information. If you are not sure who sent it, do not open it.'
      },
      {
        question: 'You are not sure whether a message from SARS, your bank or a shop is genuine. What is the best next step?',
        options: [
          'Phone the number given in the message to ask',
          'Contact the organisation using details from its official website, your bank card or a statement',
          'Reply and ask whether the message is real',
          'Ignore every message from every organisation from now on'
        ],
        answer: 1,
        explanation: 'Phone numbers and links in a suspicious message may belong to the scammer. Always use contact details that you already trust.'
      },
      {
        question: 'A new WhatsApp contact asks you to send them a code. What should you do?',
        scenario: { sender: 'Unknown number', time: 'Today, 10:18', icon: 'fa-user', message: 'Hi! I accidentally used your number for my WhatsApp. They sent you a 6-digit code. Please send it to me quickly 🙏', clues: ['The sender is unknown to you', 'Verification codes are private and should never be shared'] },
        options: [
          'Send it – it is only a code',
          'Reply and ask who they are before you decide',
          'Never share it. Ignore the message and block the sender',
          'Send it, then delete the message'
        ],
        answer: 2,
        explanation: 'That code lets someone take over your WhatsApp account. They can then message your family and friends and ask them for money. Never share a code with anyone.'
      },
      {
        question: 'Why do scammers say things like "Act now!" or "Your account will be closed today!"?',
        options: [
          'To give you time to think carefully',
          'To rush you so that you do not stop to check',
          'Because genuine organisations always demand an immediate answer',
          'To be polite'
        ],
        answer: 1,
        explanation: 'Scammers use pressure so that you panic and act before you check. If a message tries to rush you, slow down and verify it first.'
      }
    ]
  },

  // --------------------------------------
  // QUIZ 2: Common Types of Scams
  // --------------------------------------
  quiz2: {
    title: 'Quiz 2: Common Types of Scams',
    questions: [
      {
        question: 'A courier text asks you to pay a small fee through a link. What is the safest next step?',
        scenario: { sender: 'Parcel Delivery', time: 'Today, 08:06', icon: 'fa-box', message: 'Delivery attempt failed. Pay R25 redelivery fee within 2 hours: https://parcel-track.example/pay', clues: ['You were not expecting this delivery notice', 'It asks for payment through an unfamiliar link and sets a short deadline'] },
        options: [
          'Open the link and pay so the parcel is not returned',
          'Reply with your address to confirm delivery',
          'Do not use the link; check your order through the courier or shop’s official app or website',
          'Forward the message to friends to ask if it is real'
        ],
        answer: 2,
        explanation: 'Fake delivery messages ask for a small fee or your card details through a link. Check with the courier or the shop using their official contact details.'
      },
      {
        question: 'Which of these is an example of phishing (a fake message that tries to steal your details)?',
        options: [
          'An SMS that looks like it is from your bank and links to a fake login page',
          'A statement that you download from inside your own banking app',
          'A newsletter from a shop that you signed up to',
          'A software update notice in your phone\'s own Settings'
        ],
        answer: 0,
        explanation: 'Phishing messages copy real companies and lead you to fake websites. When you type your details in, the scammer steals them.'
      },
      {
        question: 'A message says: "Congratulations! You won R500 000. Pay R2 000 to release your prize." What is wrong with it?',
        options: [
          'Nothing – fees for prizes are normal',
          'Real prizes never ask you to pay first, and you cannot win a competition you never entered',
          'It is only a problem if the amount is very large',
          'It is only a scam if the message is in another language'
        ],
        answer: 1,
        explanation: 'Lottery and prize scams ask you to pay a fee to "release" winnings that do not exist. You should never have to pay to receive a genuine prize.'
      },
      {
        question: 'Someone you met online says they love you, but they always have an excuse not to video call. Now they ask you to send money for a "medical emergency". What type of scam is this?',
        options: [
          'A romance scam',
          'A lottery scam',
          'A phone scam',
          'A parcel scam'
        ],
        answer: 0,
        explanation: 'Romance scammers spend weeks or months building trust and affection before they ask for money. Never send money to someone you have not met in person, however close you feel.'
      },
      {
        question: 'An advert says: "Double your money in 7 days – no risk!" What should you think?',
        options: [
          'It is a great chance – invest before it ends',
          'If it sounds too good to be true, it probably is. Real investments always carry some risk',
          'It must be safe because it has photographs of happy people',
          'It must be safe because it has lots of likes'
        ],
        answer: 1,
        explanation: 'Promises of huge, fast, risk-free profits are the main sign of an investment scam. Before investing, check that the company is registered with the Financial Sector Conduct Authority (FSCA) and speak to someone you trust.'
      },
      {
        question: 'A caller says: "Gran, it\'s me! I\'m in trouble and need money right now. Please don\'t tell Mum." What is the safest thing to do?',
        options: [
          'Send the money first and check later',
          'Hang up and phone your grandchild, or another family member, on a number you already know',
          'Ask them to send a photo to prove it is them',
          'Ask them to keep talking while you go to the bank'
        ],
        answer: 1,
        explanation: 'Scammers pretend to be a relative in trouble and ask you to keep it secret. Voices can be imitated and photos can be faked, so always check using a number you already know.'
      },
      {
        question: 'Which of these is a common warning sign of a scam?',
        options: [
          'You are asked to pay with gift vouchers, cryptocurrency or a money transfer to someone you do not know',
          'A shop asks you to pay with your card at the till',
          'A bill arrives for something you ordered',
          'A friend asks what time you will arrive'
        ],
        answer: 0,
        explanation: 'Scammers prefer payments that are hard to trace and almost impossible to get back.'
      },
      {
        question: 'A message says you qualify for a government grant or tax refund. It asks you to tap a link and confirm your banking details. What should you do?',
        options: [
          'Tap the link – government money is urgent',
          'Ignore the link and check directly with the department, using its official website or office',
          'Reply with only your ID number',
          'Forward it to a friend to see if they got one too'
        ],
        answer: 1,
        explanation: 'Scammers copy government departments. A genuine department will not ask you to confirm your banking details through a link in a message. Check using the official website or phone number.'
      },
      {
        question: 'A pop-up on your phone says: "Your phone has a virus! Call this number now." What should you do?',
        options: [
          'Call the number straight away',
          'Close the pop-up and do not call. Real warnings from your phone never ask you to phone a number',
          'Download the app the pop-up tells you to',
          'Enter your card details to pay for virus removal'
        ],
        answer: 1,
        explanation: 'This is a tech-support scam. The "helper" will try to take your money or get into your phone. Close the pop-up, and ask a trusted person if you are worried.'
      },
      {
        question: 'Which habit protects you best from scams?',
        options: [
          'Trust any message that uses your name – scammers would not know it',
          'Stop, think and check with someone you trust before you send money or personal details',
          'Act quickly so that you do not miss out',
          'Switch your phone off for the whole day'
        ],
        answer: 1,
        explanation: 'Scammers can easily find your name. The best protection is to pause and check – with the real organisation, a family member or a trusted friend.'
      }
    ]
  },

  // --------------------------------------
  // QUIZ 3: How to use the Internet Safely
  // --------------------------------------
  quiz3: {
    title: 'Quiz 3: Internet Safety',
    questions: [
      {
        question: 'Which of these is the strongest password?',
        options: [
          'Password123',
          'JohnSmith1945',
          'Blue-Kettle-Sunrise-Garden',
          '12345678'
        ],
        answer: 2,
        explanation: 'A long password made of several random words is hard for criminals to guess and easier for you to remember. Avoid names, birth years and simple number patterns.'
      },
      {
        question: 'Why should you use a different password for each important account, such as your email and your bank?',
        options: [
          'Different passwords make websites load faster',
          'If one password is stolen, criminals cannot use it to open your other accounts',
          'The law says you must',
          'It uses less data'
        ],
        answer: 1,
        explanation: 'If you reuse a password and it is stolen from one website, criminals will try it on your email, bank and social media too. Your email password is the most important one to keep unique.'
      },
      {
        question: 'Someone phones, says they are from your internet provider and asks for your email password "to fix a fault". What should you do?',
        options: [
          'Give it to them – they know your name',
          'Refuse and hang up. No genuine company needs your password',
          'Give them half of the password',
          'Give it only if they tell you their employee number'
        ],
        answer: 1,
        explanation: 'No genuine company needs your password to fix a problem. Anyone who asks for it is trying to get into your accounts. Names and employee numbers are easy to make up.'
      },
      {
        question: 'What do the padlock and "https://" next to a website address tell you?',
        options: [
          'The website is completely safe and honest',
          'The information you send is protected on its way, but you must still check that the address is correct',
          'The website belongs to the government',
          'The website has no adverts'
        ],
        answer: 1,
        explanation: 'The padlock and https:// mean the connection is protected, so other people cannot read what you send. But scammers can get padlocks too, so always check the address carefully as well.'
      },
      {
        question: 'Which of these is most likely to be the real website of the bank FNB?',
        options: [
          'www.fnb.co.za',
          'www.fnb.co.za-secure.com',
          'www.fnb-login-help.co.za',
          'www.fnb.co.za.account-check.net'
        ],
        answer: 0,
        explanation: 'Read the address carefully. Fake sites add extra words or change the ending after the real name. If you are unsure, use your bank\'s official app instead of a link.'
      },
      {
        question: 'Why is it important to keep the software on your phone and computer up to date?',
        options: [
          'Updates fix security weaknesses that criminals could use',
          'Updates only change the wallpaper',
          'Updates make the screen brighter',
          'Updates are only needed on new phones'
        ],
        answer: 0,
        explanation: 'Updates repair security holes that criminals look for. Turning on automatic updates is an easy way to stay protected.'
      },
      {
        question: 'You are in a coffee shop and want to check your bank balance. What is the safest way to connect?',
        options: [
          'The coffee shop\'s free Wi-Fi',
          'Your own mobile data',
          'The Wi-Fi of the shop next door',
          'Any Wi-Fi that has no password'
        ],
        answer: 1,
        explanation: 'Public Wi-Fi is often not secure and other people may be able to spy on it. For banking and shopping, use your own mobile data or your home Wi-Fi.'
      },
      {
        question: 'You used a computer at the library to check your email. What should you do when you finish?',
        options: [
          'Log out, close the browser and do not let it save your password',
          'Just close the lid',
          'Leave the page open for the next person',
          'Let the browser save your password to save time next time'
        ],
        answer: 0,
        explanation: 'If you only close the lid or leave the page open, the next person could read your email or use your accounts. Always log out first.'
      },
      {
        question: 'What does two-step verification (also called 2FA) do?',
        options: [
          'It asks you to type your password twice',
          'It asks for a second proof, such as a code sent to your phone, so a stolen password is not enough',
          'It backs up your photographs',
          'It blocks adverts'
        ],
        answer: 1,
        explanation: 'With two-step verification, a criminal needs your password and your phone. It is one of the best ways to protect your email and banking.'
      },
      {
        question: 'Where is the safest place to download a new app?',
        options: [
          'The official App Store or Google Play Store',
          'A link sent to you in a WhatsApp message',
          'A website that offers paid apps for free',
          'An email attachment from someone you do not know'
        ],
        answer: 0,
        explanation: 'The official stores check apps for safety. Apps from links and unknown websites can contain viruses. Our guide "How to Download an App" shows you how.'
      }
    ]
  },

  // --------------------------------------
  // QUIZ 4: Useful Apps for everyday life
  // --------------------------------------
  quiz4: {
    title: 'Quiz 4: Useful Apps for Everyday Life',
    questions: [
      {
        question: 'You want to check your balance and pay a bill without queuing at the bank. Which app helps you do this?',
        options: [
          'Your bank\'s official app',
          'The Camera app',
          'Google Maps',
          'A calculator app'
        ],
        answer: 0,
        explanation: 'A banking app lets you check your balance, pay bills and transfer money from the comfort of your home.'
      },
      {
        question: 'What is the safest way to get your bank\'s app?',
        options: [
          'Search for it in the App Store or Google Play Store and check that it is published by your bank',
          'Tap a link in an SMS that says it is from your bank',
          'Ask a stranger to install it for you',
          'Download it from a website that offers it for free'
        ],
        answer: 0,
        explanation: 'Only install apps from the official store, and check that the app is from your bank. Never use links sent in messages, and never hand your phone and PIN to a stranger.'
      },
      {
        question: 'You cannot get to the shops this week. Which app lets you order groceries and have them delivered?',
        options: [
          'Checkers Sixty60',
          'The Camera app',
          'Google Maps',
          'A calculator app'
        ],
        answer: 0,
        explanation: 'Checkers Sixty60 lets you order groceries and have them delivered quickly. Always pay inside the app, never through a link that someone sends you.'
      },
      {
        question: 'Which app lets you send messages, photos and voice notes, and make free video calls to family, using Wi-Fi or mobile data?',
        options: [
          'WhatsApp',
          'Google Maps',
          'Your banking app',
          'The Camera app'
        ],
        answer: 0,
        explanation: 'WhatsApp is used to send text and voice messages and photos, and to make voice or video calls. You need Wi-Fi or mobile data.'
      },
      {
        question: 'You are driving to an address you have never visited. Which app can give you directions?',
        options: [
          'Google Maps',
          'WhatsApp',
          'The Camera app',
          'Your banking app'
        ],
        answer: 0,
        explanation: 'Google Maps shows you where a place is and gives you step-by-step directions to get there.'
      },
      {
        question: 'You want to send your daughter a copy of a document. Which app do you use to take a photo of it first?',
        options: [
          'The Camera app',
          'Google Maps',
          'Checkers Sixty60',
          'Your banking app'
        ],
        answer: 0,
        explanation: 'The Camera app takes photos and can scan documents. You can then send the photo using WhatsApp or email. Never send photos of your bank card or PIN.'
      },
      {
        question: 'A number you do not know sends you a WhatsApp message: "Tap here to claim your free prize!" What should you do?',
        options: [
          'Tap the link – it might be real',
          'Do not tap it. Block and report the number',
          'Reply with your address so they can send the prize',
          'Forward it to all of your contacts'
        ],
        answer: 1,
        explanation: 'Free-prize links are a common scam. Do not tap the link or reply. In WhatsApp you can block and report the sender.'
      },
      {
        question: 'You see a QR code sticker on a parking meter that says "Scan to pay". What should you be careful about?',
        options: [
          'QR codes are always safe because they are only pictures',
          'Scammers can stick a fake QR code over a real one, so only use codes from a source you trust',
          'Only QR codes on posters can be dangerous',
          'QR codes can only be used for photos'
        ],
        answer: 1,
        explanation: 'Fake QR codes can be stuck on top of real ones. Check that the sticker looks official and has not been placed over another one. If in doubt, pay another way.'
      },
      {
        question: 'A torch (flashlight) app asks for access to your contacts, messages and location. What should you do?',
        options: [
          'Allow everything – it is only an app',
          'Say no. A torch app does not need these, so think about deleting it',
          'Allow only your contacts',
          'Share the app with your friends'
        ],
        answer: 1,
        explanation: 'A torch app has no reason to see your contacts or messages. Say no, and think about deleting the app. You can check permissions in your phone\'s Settings.'
      },
      {
        question: 'When is it normal to type in your banking PIN or password?',
        options: [
          'When you log in to your own bank app, or when you use your card at an ATM or in a shop yourself',
          'When a caller who says they are from the bank asks for it',
          'When a helpful stranger at the ATM offers to assist you',
          'When a link in an SMS asks you to confirm it'
        ],
        answer: 0,
        explanation: 'You type your PIN yourself, in your own official app or at a card machine. Nobody else needs it – not callers, not "helpers" at the ATM and not people who message you.'
      }
    ]
  }
};

// Short lessons that introduce the ideas practised in each quiz.
const courseLessons = {
  quiz1: {
    title: 'Lesson 1: Spot the warning signs', icon: 'fa-triangle-exclamation',
    intro: 'A scam is a dishonest message or call meant to trick you into giving away money, passwords, or personal information. Scammers may pretend to be your bank, a delivery company, a government office, or even a relative. You are not expected to know every trick. Pausing gives you time to check.',
    pointIcons: ['fa-inbox', 'fa-hourglass-half', 'fa-user-lock', 'fa-money-bill-transfer'],
    points: ['Unexpected: you did not ask for a message about a blocked bank account, parcel fee, prize, or urgent problem.', 'Pressure: words such as “now”, “today”, or “in ten minutes” try to stop you thinking calmly.', 'Secrets and codes: a caller asks you to keep the conversation secret or share a PIN, password, or code sent to your phone.', 'Unusual payment: someone asks for gift cards, cryptocurrency, or money sent to a person you do not know.'],
    stepIcons: ['fa-hand', 'fa-magnifying-glass', 'fa-phone', 'fa-people-group'],
    steps: ['Stop. Do not tap the link, reply, or send money while you feel rushed.', 'Check the message carefully. Look at the sender and what they are asking you to do.', 'Contact the organisation or person using a phone number you already have, such as the number on your bank card.', 'If you are still unsure, ask a trusted person to look at the message with you. It is always fine to take your time.'],
    activity: 'Imagine a text says your bank account will close in ten minutes. You can leave the message alone, find the number on your bank card, and call the bank yourself.'
  },
  quiz2: {
    title: 'Lesson 2: Recognise common scams', icon: 'fa-magnifying-glass-chart',
    intro: 'Scams can arrive as text messages, emails, phone calls, social media posts, or pop-up windows on a website. The story may change, but the sender often wants money, account access, or information about you.',
    pointIcons: ['fa-building-columns', 'fa-box', 'fa-gift', 'fa-house-user', 'fa-laptop-medical'],
    points: ['Bank message scam: a fake message says there is a problem and asks you to sign in through its link. Open your bank app yourself instead.', 'Parcel fee scam: a text says you must pay a small delivery fee. Check your order using the shop or courier details you already trust.', 'Prize or grant scam: you are told you have won money but must pay a fee first. Do not pay to collect a prize you did not enter.', 'Family emergency scam: someone claiming to be a relative asks for money urgently. Call your relative or another family member on a familiar number.', 'Tech-help scam: a pop-up says your phone has a virus and gives you a number to call. Close the page; do not call the number or install an app it recommends.'],
    stepIcons: ['fa-calendar-check', 'fa-link-slash', 'fa-address-book', 'fa-hand'],
    steps: ['Ask yourself whether you expected this call, message, prize, or delivery.', 'Do not use links or phone numbers included in a message you are unsure about.', 'Look up the organisation in a source you already trust, or ask a family member or trusted helper to help you check.', 'Never pay a fee or share account details just to “unlock” money, a prize, or a parcel.'],
    activity: 'Before paying a delivery fee, check your order confirmation or contact the shop using the number on its official paperwork or app.'
  },
  quiz3: {
    title: 'Lesson 3: Protect your phone and accounts', icon: 'fa-lock',
    intro: 'Your phone and online accounts hold private information. A few simple habits make it harder for someone else to get into them. You can ask a trusted person to help set these protections up.',
    pointIcons: ['fa-key', 'fa-lock', 'fa-comment-sms', 'fa-rotate', 'fa-globe'],
    points: ['PIN: a private number used to unlock a device or approve a transaction. Do not tell it to someone who calls or messages you.', 'Password: a secret word or phrase for an account. Use a different password for your email and bank, and avoid easy guesses such as your name or birthday.', 'OTP: a one-time PIN or password sent to you by text or shown in an app. It is a temporary key for you; never read it to another person.', 'App updates: updates fix problems and improve security. Use your phone’s Settings or official app store to install them.', 'Links: a padlock or “https” means the connection is protected. It does not prove that the website belongs to a real bank or business.'],
    stepIcons: ['fa-mobile-screen-button', 'fa-building-columns', 'fa-store', 'fa-phone-slash'],
    steps: ['Unlock your phone with a PIN or password that you keep private.', 'When you need your bank, open the bank app from your phone rather than a link in a message.', 'Install apps through the official app store on your phone. If unsure, ask for help before installing.', 'If a caller asks you to install a remote-help app or share a code, say no, end the call, and contact someone you trust.'],
    activity: 'If a message contains a sign-in link, do not use it. Close the message, then open the service’s app from your phone as you normally would.'
  },
  quiz4: {
    title: 'Lesson 4: Use messages and search with confidence', icon: 'fa-mobile-screen-button',
    intro: 'Messaging and search help you stay in touch and find answers. Take a moment before sharing, forwarding, or believing something you see. You can use your phone at your own pace; there is no need to tap quickly.',
    pointIcons: ['fa-comments', 'fa-image', 'fa-share-nodes', 'fa-magnifying-glass', 'fa-sliders'],
    points: ['WhatsApp and texts: a familiar name or photo does not always prove who sent a message. If someone asks for money, call them on the number you already use.', 'Photos and personal details: share only what you would be comfortable showing to the intended person. Avoid sending copies of identity documents or bank details in a chat.', 'Forwarded messages: a message being shared by many people does not make it true. Check important health, money, or news claims with a trusted source.', 'Online search: search results can include adverts. An advert may appear near the top even when it is not the best or official result.', 'App permissions: an app may ask to use your camera, microphone, or location. If the request does not make sense for what the app does, ask for help before allowing it.'],
    stepIcons: ['fa-user-check', 'fa-eye', 'fa-circle-check', 'fa-life-ring'],
    steps: ['Check the person or business before replying, especially if the message asks for money, a code, or personal details.', 'Read a message fully before touching a link, photo, or attachment.', 'For important information, compare it with a source you trust, such as an official clinic, bank, or government website.', 'If you tapped something by mistake, do not panic. Close the page and ask a trusted person or your service provider to help you check your phone.'],
    activity: 'If a friend sends surprising news, contact them directly before forwarding it. If it is a health or money claim, check it with a trusted organisation too.'
  }
};

// Tap-to-explore visual examples for the useful-apps quiz.
const appSafetyQuizVisuals = {
  quiz3: [
    { title: 'Choose a strong password', items: [['fa-key','Long passphrase','A few unrelated words are easier to remember and harder to guess.'],['fa-calendar','Birth date','People who know you may guess personal dates.'],['fa-list-ol','12345678','Common number patterns are easy to guess.'],['fa-user','Your name','Names are not secret and may be easy to guess.']] },
    { title: 'Keep important accounts separate', items: [['fa-envelope','Email account','Use a password that is different from your bank password.'],['fa-building-columns','Bank account','A unique password helps protect this account if another password is exposed.'],['fa-key','Same password everywhere','If one account is broken into, other accounts using that password may also be at risk.']] },
    { title: 'A caller asks for your email password', items: [['fa-phone','Unexpected caller','A caller can say they are from any company.'],['fa-envelope','Email password','Do not tell it to anyone. A genuine support worker does not need it.'],['fa-phone-slash','Hang up','End the call and contact your internet provider using a number you already trust.']] },
    { title: 'What the padlock means', items: [['fa-lock','Protected connection','The information you send is protected on its way to the website.'],['fa-shield-halved','Still check the site','A scam website can also show a padlock. Check the web address.'],['fa-globe','Website address','Use a known official address or open the service’s app yourself.']] },
    { title: 'Look closely at a bank website address', items: [['fa-check-circle','www.fnb.co.za','The bank name is at the end of the address before .co.za.'],['fa-triangle-exclamation','fnb.co.za-secure.com','The real ending is .com; “fnb” is only part of the name.'],['fa-triangle-exclamation','fnb-login-help.co.za','Extra words in an address may be a warning sign.']] },
    { title: 'Why phone updates matter', items: [['fa-screwdriver-wrench','Fixes','Updates repair security problems in the software.'],['fa-gear','Settings','Use your phone Settings to check for updates.'],['fa-window-maximize','Unexpected pop-up','Do not download an update from a surprising web page.']] },
    { title: 'Banking away from home', items: [['fa-wifi','Public Wi-Fi','A shared network may be less private. Avoid banking on it.'],['fa-signal','Your mobile data','Use your own mobile data for banking when you are away.'],['fa-house','Home Wi-Fi','Your home network is another familiar option.']] },
    { title: 'Using a shared library computer', items: [['fa-right-from-bracket','Log out','Sign out of your email account before you leave.'],['fa-window-close','Close the browser','Close the page after logging out.'],['fa-key','Do not save password','Do not let a shared computer remember your password.']] },
    { title: 'An extra step to protect an account', items: [['fa-lock','Password','The first proof that it is you.'],['fa-mobile-screen-button','Second proof','A code on your phone can provide another check.'],['fa-shield-halved','Two-step verification','A stolen password alone may not be enough to enter your account.']] },
    { title: 'Where to download an app', items: [['fa-store','Official app store','Use the App Store or Google Play on your phone.'],['fa-comment-sms','Message link','Do not install an app from a link someone sent you.'],['fa-paperclip','Email attachment','Do not install an app attached to an email.']] }
  ],
  quiz4: [
  { title: 'Explore these phone apps', items: [['fa-building-columns','Bank app','Check a balance or pay a bill in your bank’s official app.'],['fa-camera','Camera','Take a photo or scan a paper document.'],['fa-map-location-dot','Maps','Find a place and get directions.'],['fa-calculator','Calculator','Add, subtract, and work with numbers.']] },
  { title: 'Where should an app come from?', items: [['fa-store','Official app store','Safer place to find and install apps. Check the publisher name.'],['fa-comment-sms','Text message link','Do not install a bank app from an unexpected text.'],['fa-globe','Unknown website','An app file from an unfamiliar site may be unsafe.'],['fa-user','A stranger','Keep your phone and PIN with you. Ask someone you trust for help.']] },
  { title: 'Which app can help with groceries?', items: [['fa-basket-shopping','Grocery delivery','Choose groceries in a store’s delivery app.'],['fa-camera','Camera','Takes photos; it cannot arrange a grocery delivery.'],['fa-map-location-dot','Maps','Shows places and routes.'],['fa-calculator','Calculator','Helps with sums.']] },
  { title: 'Ways to keep in touch', items: [['fa-comments','WhatsApp','Send messages, photos, and voice notes; make calls using internet data.'],['fa-map-location-dot','Maps','Find places and directions.'],['fa-building-columns','Bank app','Manage banking through your official bank app.'],['fa-camera','Camera','Take photos.']] },
  { title: 'Finding a new place', items: [['fa-map-location-dot','Maps','Search for an address and follow directions.'],['fa-comments','WhatsApp','Message or call a person.'],['fa-camera','Camera','Take photos.'],['fa-building-columns','Bank app','Check your account.']] },
  { title: 'Taking a picture of a paper', items: [['fa-camera','Camera','Take a photo of a document, then share it carefully.'],['fa-map-location-dot','Maps','Find a location.'],['fa-basket-shopping','Grocery app','Order food and household items.'],['fa-building-columns','Bank app','Check your balance or pay a bill.']] },
  { title: 'A message from an unknown number', items: [['fa-gift','“Claim your free prize!”','Unexpected prizes and links can be used to steal details.'],['fa-link','A link in a message','Do not tap if you do not know the sender or expect the message.'],['fa-ban','Block','Stop that number contacting you.'],['fa-flag','Report','Tell the messaging service about suspicious messages.']] },
  { title: 'Before scanning a QR code', items: [['fa-qrcode','QR code sticker','A code can be covered or replaced. Check it before using it.'],['fa-eye','Look closely','Check whether a sticker is covering another code.'],['fa-credit-card','Payment page','Read the website name before entering payment details.']] },
  { title: 'A torch app asks for permissions', items: [['fa-lightbulb','Torch','A torch app needs the light, not your contacts.'],['fa-address-book','Contacts','A torch usually does not need your address book.'],['fa-location-dot','Location','Ask why an app needs your location before allowing access.']] },
  { title: 'Keep your banking PIN private', items: [['fa-mobile-screen-button','Your bank app','Type your PIN yourself in your official app.'],['fa-money-bill-1-wave','ATM or shop terminal','Enter your PIN yourself, and cover the keypad.'],['fa-phone','Caller','A caller should never ask you to say your PIN aloud.'],['fa-user','Helpful stranger','Do not hand your phone or card to a stranger.']] }
  ]
};

function renderQuizVisual() {
  const panel = document.getElementById('quiz-visual-container');
  if (!panel) return;
  panel.replaceChildren();
  const visual = appSafetyQuizVisuals[currentCategory]?.[quizIndex] || null;
  panel.classList.toggle('hidden', !visual);
  if (!visual) return;
  const locked = document.createElement('div');
  locked.className = 'quiz-visual-locked';
  const lockIcon = document.createElement('i');
  lockIcon.className = 'fa-solid fa-circle-question';
  lockIcon.setAttribute('aria-hidden', 'true');
  const lockText = document.createElement('span');
  lockText.textContent = 'Choose your answer first. Then explore the visual review.';
  locked.append(lockIcon, lockText);

  const content = document.createElement('div');
  content.className = 'quiz-visual-content hidden';
  const heading = document.createElement('h3');
  heading.className = 'quiz-visual-title';
  heading.textContent = visual.title;
  const instruction = document.createElement('p');
  instruction.className = 'quiz-visual-instruction';
  instruction.textContent = 'Tap a picture to explore this idea a little more.';
  const tiles = document.createElement('div');
  tiles.className = 'quiz-visual-tiles';
  const detail = document.createElement('p');
  detail.className = 'quiz-visual-detail';
  detail.setAttribute('aria-live', 'polite');
  detail.textContent = 'Choose any picture to see what it does.';
  visual.items.forEach(([iconName, label, description]) => {
    const tile = document.createElement('button');
    tile.type = 'button';
    tile.className = 'quiz-visual-tile';
    tile.setAttribute('aria-pressed', 'false');
    const icon = document.createElement('span');
    icon.className = 'quiz-visual-icon';
    icon.innerHTML = `<i class="fa-solid ${iconName}" aria-hidden="true"></i>`;
    const text = document.createElement('span');
    text.className = 'quiz-visual-label';
    text.textContent = label;
    tile.append(icon, text);
    tile.addEventListener('click', () => {
      tiles.querySelectorAll('.quiz-visual-tile').forEach((other) => {
        other.classList.remove('is-selected');
        other.setAttribute('aria-pressed', 'false');
      });
      tile.classList.add('is-selected');
      tile.setAttribute('aria-pressed', 'true');
      detail.textContent = description;
    });
    tiles.appendChild(tile);
  });
  content.append(heading, instruction, tiles, detail);
  panel.append(locked, content);
}

function unlockQuizVisual() {
  document.querySelector('#quiz-visual-container .quiz-visual-locked')?.classList.add('hidden');
  document.querySelector('#quiz-visual-container .quiz-visual-content')?.classList.remove('hidden');
}

function renderLesson() {
  const lesson = courseLessons[currentCategory];
  const panel = document.getElementById('course-lesson');
  const quiz = document.getElementById('quiz-container');
  const results = document.getElementById('quiz-results-container');
  if (!lesson || !panel) return;
  panel.replaceChildren();
  panel.classList.remove('hidden');
  quiz?.classList.add('hidden');
  results?.classList.add('hidden');

  const header = document.createElement('div');
  header.className = 'lesson-heading';
  const icon = document.createElement('span');
  icon.className = 'lesson-icon';
  icon.innerHTML = `<i class="fa-solid ${lesson.icon}" aria-hidden="true"></i>`;
  const title = document.createElement('h2');
  title.textContent = lesson.title;
  header.append(icon, title);

  const intro = document.createElement('p');
  intro.className = 'lesson-intro';
  intro.textContent = lesson.intro;
  const flow = document.createElement('div');
  flow.className = 'lesson-safety-flow';
  flow.setAttribute('aria-label', 'Three steps: pause, check, choose');
  [['fa-hand', 'Pause'], ['fa-magnifying-glass', 'Check'], ['fa-shield-heart', 'Choose safely']].forEach(([iconName, label], index) => {
    const step = document.createElement('div');
    step.className = 'lesson-flow-step';
    const icon = document.createElement('span');
    icon.innerHTML = `<i class="fa-solid ${iconName}" aria-hidden="true"></i>`;
    const text = document.createElement('strong');
    text.textContent = label;
    step.append(icon, text);
    flow.appendChild(step);
    if (index < 2) {
      const arrow = document.createElement('span');
      arrow.className = 'lesson-flow-arrow';
      arrow.innerHTML = '<i class="fa-solid fa-arrow-right" aria-hidden="true"></i>';
      flow.appendChild(arrow);
    }
  });
  const list = document.createElement('ul');
  const keyHeading = document.createElement('h3');
  keyHeading.className = 'lesson-section-title';
  keyHeading.textContent = 'Things to know';
  list.className = 'lesson-points';
  lesson.points.forEach((point, index) => {
    const item = document.createElement('li');
    const iconWrap = document.createElement('span');
    iconWrap.className = 'lesson-point-icon';
    const pointIcon = document.createElement('i');
    pointIcon.className = `fa-solid ${lesson.pointIcons[index] || 'fa-circle-info'}`;
    pointIcon.setAttribute('aria-hidden', 'true');
    iconWrap.appendChild(pointIcon);
    const text = document.createElement('span');
    text.textContent = point;
    item.append(iconWrap, text);
    list.appendChild(item);
  });
  const stepsHeading = document.createElement('h3');
  stepsHeading.className = 'lesson-section-title';
  stepsHeading.textContent = 'What to do, step by step';
  const steps = document.createElement('ol');
  steps.className = 'lesson-steps';
  lesson.steps.forEach((step, index) => {
    const item = document.createElement('li');
    const stepIcon = document.createElement('i');
    stepIcon.className = `lesson-step-icon fa-solid ${lesson.stepIcons[index] || 'fa-circle-check'}`;
    stepIcon.setAttribute('aria-hidden', 'true');
    item.append(stepIcon, document.createTextNode(step));
    steps.appendChild(item);
  });
  const reassurance = document.createElement('p');
  reassurance.className = 'lesson-reassurance';
  reassurance.innerHTML = '<i class="fa-solid fa-heart" aria-hidden="true"></i> You can always stop and ask someone you trust for help. Taking time is a good safety habit.';
  const activity = document.createElement('div');
  activity.className = 'lesson-try';
  const activityTitle = document.createElement('strong');
  activityTitle.textContent = 'Try this in real life';
  const activityText = document.createElement('p');
  activityText.textContent = lesson.activity;
  activity.append(activityTitle, activityText);
  const start = document.createElement('button');
  start.type = 'button';
  start.className = 'btn btn-primary btn-large';
  start.innerHTML = '<i class="fa-solid fa-circle-play" aria-hidden="true"></i> Start lesson quiz';
  start.addEventListener('click', startLessonQuiz);
  panel.append(header, intro, flow, keyHeading, list, stepsHeading, steps, reassurance, activity, start);
}

function startLessonQuiz() {
  startQuizRun(currentCategory);
  document.getElementById('course-lesson')?.classList.add('hidden');
  document.getElementById('quiz-results-container')?.classList.add('hidden');
  document.getElementById('quiz-container')?.classList.remove('hidden');
  renderQuiz({ focus: true });
}

// ==========================================
// APPLICATION LOGIC
// ==========================================
document.addEventListener('DOMContentLoaded', init);

function init() {
  const sections = document.querySelectorAll('.page-section');
  const initialPage = window.location.hash.slice(1);
  sections.forEach((section) => {
    const shouldShow = section.id === `page-${initialPage}` || (!pageMap[initialPage] && section.id === 'page-home');
    section.hidden = !shouldShow;
    section.classList.toggle('active-page', shouldShow);
  });

  const startPage = pageMap[initialPage] ? initialPage : 'home';
  currentPage = startPage;
  setActiveNavLink(startPage);
  updateProgress();
  bindAccessibilityButtons();
  bindManualVisuals();
  document.getElementById('analyze-link-button')?.addEventListener('click', analyzeLink);
  document.getElementById('link-input')?.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') analyzeLink();
  });
  renderCategoryButtons();
  renderLesson();
  applyFontSize();
  applyTheme();
  bindLanguageSelector();
  bindWorkshopDateSelector();
  bindSearchBar();
  bindWorkshopForm();
  bindContactForm();
  applyLanguage(appState.language);
  window.addEventListener('hashchange', () => {
    const pageId = window.location.hash.slice(1);
    if (pageMap[pageId]) navigateTo(pageId);
  });

  window.navigateTo = navigateTo;
  window.toggleMobileMenu = toggleMobileMenu;
  window.analyzeLink = analyzeLink;
  window.nextQuestion = nextQuestion;
  window.resetQuiz = resetQuiz;
  window.selectCategory = selectCategory;
  window.goToNextQuiz = goToNextQuiz;
  window.startLessonQuiz = startLessonQuiz;
}

function bindManualVisuals() {
  document.querySelectorAll('.manual-visual [data-guide-tip]').forEach((button) => {
    button.setAttribute('aria-pressed', 'false');
    button.addEventListener('click', () => {
      const figure = button.closest('.manual-visual');
      const output = figure?.querySelector('.manual-visual-tip');
      figure?.querySelectorAll('[data-guide-tip]').forEach((item) => {
        item.classList.remove('is-selected');
        item.setAttribute('aria-pressed', 'false');
      });
      button.classList.add('is-selected');
      button.setAttribute('aria-pressed', 'true');
      if (output) output.textContent = button.dataset.guideTip;
    });
  });
}

function bindLanguageSelector() {
  const selector = document.getElementById('language-select');
  if (selector) selector.addEventListener('change', (event) => applyLanguage(event.target.value));
}

function bindWorkshopDateSelector() {
  const residenceSelector = document.getElementById('retirement-village');
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

// ==========================================
// GLOBAL SEARCH BAR
// ==========================================
function bindSearchBar() {
  const searchInput = document.getElementById('global-search');
  const searchBox = searchInput?.closest('.search-box');
  if (!searchInput || !searchBox) return;

  const resultsList = document.createElement('div');
  resultsList.id = 'search-results-dropdown';
  resultsList.className = 'search-results-dropdown hidden';
  searchBox.appendChild(resultsList);

  const findMatches = (query) =>
    searchIndex.filter(item =>
      item.keywords.toLowerCase().includes(query) || item.label.toLowerCase().includes(query)
    ).slice(0, 6);

  searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim().toLowerCase();
    if (!query) {
      resultsList.classList.add('hidden');
      resultsList.innerHTML = '';
      return;
    }
    renderSearchResults(findMatches(query), resultsList, searchInput);
  });

  searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      const query = searchInput.value.trim().toLowerCase();
      if (!query) return;
      const firstMatch = findMatches(query)[0];
      if (firstMatch) {
        navigateTo(firstMatch.page);
        searchInput.value = '';
        resultsList.classList.add('hidden');
        resultsList.innerHTML = '';
      }
    }
    if (event.key === 'Escape') {
      resultsList.classList.add('hidden');
      searchInput.blur();
    }
  });

  document.addEventListener('click', (event) => {
    if (!searchBox.contains(event.target)) {
      resultsList.classList.add('hidden');
    }
  });
}

function renderSearchResults(matches, resultsList, searchInput) {
  resultsList.innerHTML = '';

  if (matches.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'search-result-item search-result-empty';
    empty.textContent = 'No matching topics found.';
    resultsList.appendChild(empty);
    resultsList.classList.remove('hidden');
    return;
  }

  matches.forEach((match) => {
    const item = document.createElement('button');
    item.type = 'button';
    item.className = 'search-result-item';
    item.textContent = match.label;
    item.addEventListener('click', () => {
      navigateTo(match.page);
      searchInput.value = '';
      resultsList.classList.add('hidden');
      resultsList.innerHTML = '';
    });
    resultsList.appendChild(item);
  });

  resultsList.classList.remove('hidden');
}

// ==========================================
// WORKSHOP SIGN-UP & CONTACT FORMS
// ==========================================
function bindWorkshopForm() {
  const form = document.getElementById('workshop-signup-form');
  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const name = document.getElementById('name').value.trim();
    showFormSuccess(form, `Thanks, ${name}! Your workshop registration has been received. We'll email you the details soon.`);
    form.reset();

    const dateGroup = document.getElementById('workshop-date-group');
    if (dateGroup) {
      dateGroup.classList.add('hidden');
      dateGroup.setAttribute('aria-hidden', 'true');
    }
  });
}

function bindContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const name = document.getElementById('contact-name').value.trim();
    showFormSuccess(form, `Thank you, ${name}! We've received your message and will be in touch soon.`);
    form.reset();
  });
}

function showFormSuccess(form, message) {
  let successBox = form.querySelector('.form-success-message');
  if (!successBox) {
    successBox = document.createElement('div');
    successBox.className = 'form-success-message';
    form.prepend(successBox);
  }
  successBox.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${message}`;
  successBox.classList.remove('hidden');
  successBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

  window.setTimeout(() => {
    successBox.classList.add('hidden');
  }, 6000);
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

// ==========================================
// QUIZ LOGIC
// ==========================================
function shuffleArray(list) {
  const copy = list.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// Builds a fresh attempt: options are shuffled, and the correct index is recalculated.
function startQuizRun(key) {
  const quiz = quizCategories[key];
  if (!quiz) return;

  quizRun = quiz.questions.map((q) => {
    const tagged = q.options.map((text, i) => ({ text, correct: i === q.answer }));
    const options = q.shuffle === false ? tagged : shuffleArray(tagged);
    return {
      question: q.question,
      explanation: q.explanation,
      scenario: q.scenario || null,
      options: options.map((o) => o.text),
      answer: options.findIndex((o) => o.correct)
    };
  });
  quizIndex = 0;
  quizScore = 0;
  quizAnswers = [];
  quizAnswered = false;
}

function loadBestScores() {
  try {
    return JSON.parse(localStorage.getItem(QUIZ_STORAGE_KEY)) || {};
  } catch (error) {
    return {};
  }
}

function saveBestScore(key, score) {
  const best = loadBestScores();
  if (best[key] === undefined || score > best[key]) {
    best[key] = score;
    try {
      localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(best));
    } catch (error) { /* storage unavailable – the quiz still works */ }
  }
  return best;
}

function renderCategoryButtons() {
  const categoryContainer = document.getElementById('quiz-category-selector');
  if (!categoryContainer) return;

  const best = loadBestScores();
  categoryContainer.innerHTML = '';
  categoryContainer.setAttribute('role', 'group');
  categoryContainer.setAttribute('aria-label', 'Choose a course lesson');

  Object.keys(quizCategories).forEach((key) => {
    const lesson = courseLessons[key];
    const total = quizCategories[key].questions.length;
    const isActive = key === currentCategory;

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `quiz-tab${isActive ? ' is-active' : ''}`;
    btn.setAttribute('aria-pressed', isActive.toString());

    const title = document.createElement('span');
    title.className = 'quiz-tab-title';
    title.textContent = lesson.title;

    const status = document.createElement('span');
    status.className = 'quiz-tab-best';
    if (best[key] !== undefined) {
      const icon = document.createElement('i');
      icon.className = best[key] === total ? 'fa-solid fa-star' : 'fa-solid fa-circle-check';
      icon.setAttribute('aria-hidden', 'true');
      status.appendChild(icon);
      status.appendChild(document.createTextNode(` Completed · best score ${best[key]} of ${total}`));
    } else {
      status.textContent = 'Lesson and practice quiz';
    }

    btn.appendChild(title);
    btn.appendChild(status);
    btn.addEventListener('click', () => selectCategory(key));
    categoryContainer.appendChild(btn);
  });
}

function selectCategory(catKey) {
  if (!quizCategories[catKey]) return;
  currentCategory = catKey;
  renderCategoryButtons();
  renderLesson();
}

function setQuizProgress(completed, total) {
  const bar = document.getElementById('quiz-progress');
  const fill = document.getElementById('quiz-progress-fill');
  if (fill) fill.style.width = `${total ? (completed / total) * 100 : 0}%`;
  if (bar) {
    bar.setAttribute('aria-valuemax', total.toString());
    bar.setAttribute('aria-valuenow', completed.toString());
    bar.setAttribute('aria-valuetext', `${completed} of ${total} questions answered`);
  }
}

function renderQuiz(options = {}) {
  const categoryTitle = document.getElementById('quiz-category-title');
  const questionNumber = document.getElementById('quiz-question-number');
  const questionText = document.getElementById('quiz-question-text');
  const optionsContainer = document.getElementById('quiz-options-container');
  const feedbackBox = document.getElementById('quiz-feedback-box');
  const hintButton = document.getElementById('quiz-hint-button');
  const hintBox = document.getElementById('quiz-hint');
  const resultsContainer = document.getElementById('quiz-results-container');
  const quizContainer = document.getElementById('quiz-container');

  const activeQuiz = quizCategories[currentCategory];
  if (!activeQuiz) return;
  if (!questionNumber || !questionText || !optionsContainer || !feedbackBox || !resultsContainer) return;

  if (!quizRun.length) startQuizRun(currentCategory);
  if (categoryTitle) categoryTitle.textContent = `${courseLessons[currentCategory].title} · Practice quiz`;

  if (quizIndex >= quizRun.length) {
    showResults();
    return;
  }

  // Show the quiz, hide results and any old feedback
  quizContainer?.classList.remove('hidden');
  resultsContainer.classList.add('hidden');
  feedbackBox.innerHTML = '';
  feedbackBox.className = 'quiz-feedback hidden';
  quizAnswered = false;
  if (hintButton && hintBox) {
    hintButton.disabled = false;
    hintButton.textContent = 'Need a hint?';
    hintButton.setAttribute('aria-expanded', 'false');
    hintBox.textContent = 'Pause and look for pressure, requests for private codes or passwords, and ways to verify the message using contact details you already trust.';
    hintBox.classList.add('hidden');
    hintButton.onclick = () => {
      const opening = hintBox.classList.contains('hidden');
      hintBox.classList.toggle('hidden', !opening);
      hintButton.setAttribute('aria-expanded', String(opening));
      hintButton.textContent = opening ? 'Hide hint' : 'Need a hint?';
    };
  }

  const q = quizRun[quizIndex];
  const total = quizRun.length;
  setQuizProgress(quizIndex, total);
  questionNumber.textContent = `Question ${quizIndex + 1} of ${total}`;
  questionText.textContent = q.question;
  renderQuizVisual();

  const scenarioBox = document.getElementById('quiz-scenario');
  if (scenarioBox) {
    scenarioBox.replaceChildren();
    scenarioBox.classList.toggle('hidden', !q.scenario);
    if (q.scenario) {
      const top = document.createElement('div');
      top.className = 'quiz-phone-top';
      const statusBar = document.createElement('div');
      statusBar.className = 'quiz-phone-status';
      statusBar.innerHTML = '<span>9:41</span><span aria-hidden="true"><i class="fa-solid fa-signal"></i> <i class="fa-solid fa-wifi"></i> <i class="fa-solid fa-battery-three-quarters"></i></span>';
      const avatar = document.createElement('span');
      avatar.className = 'quiz-phone-avatar';
      avatar.setAttribute('aria-hidden', 'true');
      avatar.innerHTML = `<i class="fa-solid ${q.scenario.icon || 'fa-comment-sms'}"></i>`;
      const sender = document.createElement('span');
      sender.textContent = q.scenario.sender;
      const time = document.createElement('span');
      time.className = 'quiz-phone-time';
      time.textContent = q.scenario.time;
      top.append(avatar, sender, time);

      const label = document.createElement('p');
      label.className = 'quiz-message-label';
      label.textContent = 'Text message';
      const bubble = document.createElement('div');
      bubble.className = 'quiz-message-bubble';
      bubble.textContent = q.scenario.message;
      const warningButton = document.createElement('button');
      warningButton.type = 'button';
      warningButton.className = 'quiz-clue-toggle';
      warningButton.setAttribute('aria-expanded', 'false');
      warningButton.innerHTML = '<i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i> Spot the warning signs';
      const clues = document.createElement('ul');
      clues.className = 'quiz-clues hidden';
      clues.setAttribute('aria-label', 'Warning signs in this message');
      (q.scenario.clues || []).forEach((clue) => {
        const item = document.createElement('li');
        item.textContent = clue;
        clues.appendChild(item);
      });
      warningButton.addEventListener('click', () => {
        const isOpening = clues.classList.contains('hidden');
        clues.classList.toggle('hidden', !isOpening);
        warningButton.setAttribute('aria-expanded', String(isOpening));
        warningButton.innerHTML = isOpening
          ? '<i class="fa-solid fa-eye-slash" aria-hidden="true"></i> Hide warning signs'
          : '<i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i> Spot the warning signs';
      });
      const note = document.createElement('p');
      note.className = 'quiz-message-note';
      note.textContent = 'What would you do if this appeared on your phone?';
      scenarioBox.append(statusBar, top, label, bubble, warningButton, clues, note);
    }
  }

  optionsContainer.innerHTML = '';
  q.options.forEach((optionText, idx) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'option-btn';

    const letter = document.createElement('span');
    letter.className = 'option-letter';
    letter.setAttribute('aria-hidden', 'true');
    letter.textContent = String.fromCharCode(65 + idx); // A, B, C, D

    const text = document.createElement('span');
    text.className = 'option-text';
    text.textContent = optionText;

    const status = document.createElement('span');
    status.className = 'option-status';

    btn.appendChild(letter);
    btn.appendChild(text);
    btn.appendChild(status);
    btn.addEventListener('click', () => handleAnswer(idx));
    optionsContainer.appendChild(btn);
  });

  if (options.focus) {
    questionText.focus({ preventScroll: true });
    questionNumber.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
  }
}

function prefersReducedMotion() {
  return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function setOptionStatus(button, isCorrect, srText) {
  const status = button.querySelector('.option-status');
  if (!status) return;
  status.innerHTML = `<i class="fa-solid ${isCorrect ? 'fa-circle-check' : 'fa-circle-xmark'}" aria-hidden="true"></i><span class="sr-only">${srText}</span>`;
}

function handleAnswer(selectedIndex) {
  if (quizAnswered) return;
  const q = quizRun[quizIndex];
  if (!q) return;
  quizAnswered = true;
  const hintButton = document.getElementById('quiz-hint-button');
  if (hintButton) hintButton.disabled = true;
  unlockQuizVisual();

  const isCorrect = selectedIndex === q.answer;
  if (isCorrect) quizScore++;
  quizAnswers.push({
    question: q.question,
    chosen: q.options[selectedIndex],
    correct: q.options[q.answer],
    explanation: q.explanation,
    isCorrect
  });

  // Mark every option: green tick on the right answer, red cross on a wrong choice
  const optionButtons = document.querySelectorAll('#quiz-options-container .option-btn');
  optionButtons.forEach((btn, idx) => {
    btn.disabled = true;
    if (idx === q.answer) {
      btn.classList.add('is-correct');
      setOptionStatus(btn, true, isCorrect ? 'Your answer – correct' : 'Correct answer');
    } else if (idx === selectedIndex) {
      btn.classList.add('is-incorrect');
      setOptionStatus(btn, false, 'Your answer – not correct');
    } else {
      btn.classList.add('is-faded');
    }
  });

  setQuizProgress(quizIndex + 1, quizRun.length);

  // Feedback panel
  const feedbackBox = document.getElementById('quiz-feedback-box');
  if (!feedbackBox) return;
  feedbackBox.innerHTML = '';
  feedbackBox.className = `quiz-feedback ${isCorrect ? 'is-correct' : 'is-incorrect'}`;
  feedbackBox.setAttribute('tabindex', '-1');

  const heading = document.createElement('div');
  heading.className = 'quiz-feedback-heading';
  heading.innerHTML = `<i class="fa-solid ${isCorrect ? 'fa-circle-check' : 'fa-circle-info'}" aria-hidden="true"></i>`;
  heading.appendChild(document.createTextNode(isCorrect ? 'Correct – well done!' : 'Not quite'));
  feedbackBox.appendChild(heading);

  if (!isCorrect) {
    const correctLine = document.createElement('p');
    const label = document.createElement('strong');
    label.textContent = 'The correct answer is: ';
    correctLine.appendChild(label);
    correctLine.appendChild(document.createTextNode(q.options[q.answer]));
    feedbackBox.appendChild(correctLine);
  }

  const explanation = document.createElement('p');
  explanation.textContent = q.explanation;
  feedbackBox.appendChild(explanation);

  const isLast = quizIndex + 1 >= quizRun.length;
  const nextBtn = document.createElement('button');
  nextBtn.type = 'button';
  nextBtn.className = 'btn btn-primary';
  nextBtn.textContent = isLast ? 'See My Results' : 'Next Question';
  nextBtn.addEventListener('click', nextQuestion);
  feedbackBox.appendChild(nextBtn);

  feedbackBox.classList.remove('hidden');
  feedbackBox.focus({ preventScroll: true });
  feedbackBox.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'nearest' });
}

function nextQuestion() {
  quizIndex++;
  renderQuiz({ focus: true });
}

function showResults() {
  const resultsContainer = document.getElementById('quiz-results-container');
  if (!resultsContainer) return;

  const total = quizRun.length;
  saveBestScore(currentCategory, quizScore);
  updateProgress();
  renderCategoryButtons(); // refresh the "Best score" labels

  document.getElementById('quiz-container')?.classList.add('hidden');
  resultsContainer.classList.remove('hidden');

  const finalScore = document.getElementById('final-score');
  const maxScore = document.getElementById('max-score');
  if (finalScore) finalScore.textContent = quizScore;
  if (maxScore) maxScore.textContent = total;

  const ratio = quizScore / total;
  let message;
  if (quizScore === total) {
    message = 'Excellent! You got every question right. You are well prepared to spot scams.';
    celebratePerfectScore();
  } else if (ratio >= 0.8) {
    message = 'Great work! You know your way around online safety. Have a look at the answers below to polish up.';
  } else if (ratio >= 0.5) {
    message = 'Good effort! Read through the answers below, then try the quiz again to improve your score.';
  } else {
    message = 'A good start! Everyone has to learn this. Read the answers below, then try again – it gets easier each time.';
  }
  const messageEl = document.getElementById('results-message');
  if (messageEl) messageEl.textContent = message;

  // Review of the questions that were missed
  const review = document.getElementById('results-review');
  if (review) {
    const missed = quizAnswers.filter((a) => !a.isCorrect);
    review.innerHTML = '';
    if (missed.length) {
      const heading = document.createElement('h3');
      heading.textContent = missed.length === 1 ? 'One question to look at again' : 'Questions to look at again';
      review.appendChild(heading);

      missed.forEach((item) => {
        const card = document.createElement('div');
        card.className = 'review-item';

        const question = document.createElement('p');
        question.className = 'review-question';
        question.textContent = item.question;

        const yours = document.createElement('p');
        yours.innerHTML = '<strong>Your answer:</strong> ';
        yours.appendChild(document.createTextNode(item.chosen));

        const right = document.createElement('p');
        right.innerHTML = '<strong>Correct answer:</strong> ';
        right.appendChild(document.createTextNode(item.correct));

        const why = document.createElement('p');
        why.className = 'review-why';
        why.textContent = item.explanation;

        card.append(question, yours, right, why);
        review.appendChild(card);
      });
      review.classList.remove('hidden');
    } else {
      review.classList.add('hidden');
    }
  }

  // "Next quiz" button
  const keys = Object.keys(quizCategories);
  const nextKey = keys[(keys.indexOf(currentCategory) + 1) % keys.length];
  const nextBtn = document.getElementById('btn-next-quiz');
  if (nextBtn) {
    nextBtn.textContent = `Continue to ${courseLessons[nextKey].title}`;
    nextBtn.classList.toggle('hidden', nextKey === currentCategory);
  }

  setQuizProgress(total, total);
  const heading = document.getElementById('quiz-results-heading');
  if (heading) {
    heading.focus({ preventScroll: true });
    heading.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
  }
}

function goToNextQuiz() {
  const keys = Object.keys(quizCategories);
  const nextKey = keys[(keys.indexOf(currentCategory) + 1) % keys.length];
  selectCategory(nextKey);
  document.getElementById('quiz-category-selector')?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
}

function resetQuiz() {
  startQuizRun(currentCategory); // fresh shuffle for the retake
  document.getElementById('quiz-container')?.classList.remove('hidden');
  document.getElementById('quiz-results-container')?.classList.add('hidden');
  renderQuiz({ focus: true });
}

function celebratePerfectScore() {
  if (prefersReducedMotion()) return;
  document.getElementById('quiz-confetti')?.remove();
  const layer = document.createElement('div');
  layer.id = 'quiz-confetti';
  layer.className = 'quiz-confetti';
  layer.setAttribute('aria-hidden', 'true');
  const colors = ['#1B4A75', '#2F7D68', '#B9812E', '#A24F36', '#6E5AA6'];
  for (let index = 0; index < 72; index++) {
    const piece = document.createElement('span');
    piece.className = 'quiz-confetti-piece';
    piece.style.setProperty('--x', `${Math.random() * 100}vw`);
    piece.style.setProperty('--drift', `${Math.round((Math.random() - 0.5) * 240)}px`);
    piece.style.setProperty('--spin', `${Math.round(360 + Math.random() * 720)}deg`);
    piece.style.setProperty('--delay', `${Math.random() * 0.5}s`);
    piece.style.setProperty('--duration', `${2.2 + Math.random() * 1.1}s`);
    piece.style.setProperty('--piece-color', colors[index % colors.length]);
    piece.style.setProperty('--piece-width', `${6 + Math.random() * 6}px`);
    layer.appendChild(piece);
  }
  document.body.appendChild(layer);
  window.setTimeout(() => layer.remove(), 3800);
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
  if (window.location.hash !== `#${pageId}`) {
    window.history.replaceState(null, '', `#${pageId}`);
  }
  document.getElementById('nav-menu')?.classList.remove('mobile-active');
  window.scrollTo(0, 0);
}

function setActiveNavLink(pageId) {
  const activeKey = navParent[pageId] || 'home';
  document.querySelectorAll('.nav-link').forEach(link => {
    const isActive = link.getAttribute('data-page') === activeKey;
    link.classList.toggle('active', isActive);
    if (isActive) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
}

function toggleMobileMenu() {
  const navMenu = document.getElementById('nav-menu');
  if (navMenu) navMenu.classList.toggle('mobile-active');
}

function extractLinkFromText(text) {
  const match = text.match(/(?:https?:\/\/|www\.)[^\s<>"']+|(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}(?::\d+)?(?:\/[^\s<>"']*)?/i);
  return (match ? match[0] : text).replace(/[),.!?;]+$/g, '');
}

function getBaseDomain(hostname) {
  const parts = hostname.toLowerCase().replace(/^www\./, '').split('.');
  const compoundSuffixes = new Set(['co.za','org.za','gov.za','ac.za','net.za','com.au','co.uk','org.uk','gov.uk','co.nz','com.br','co.in']);
  const lastTwo = parts.slice(-2).join('.');
  return parts.length >= 3 && compoundSuffixes.has(lastTwo) ? parts.slice(-3).join('.') : lastTwo;
}

function inspectLink(rawText) {
  const candidate = extractLinkFromText(rawText.trim());
  const prepared = candidate.startsWith('//') ? `https:${candidate}` : (/^[a-z][a-z0-9+.-]*:\/\//i.test(candidate) ? candidate : `https://${candidate}`);
  let parsed;
  try { parsed = new URL(prepared); } catch (error) { return { error: 'That does not look like a complete web address. Copy the full link and try again.' }; }
  if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
    return { error: 'This is not a web link the checker can inspect. Use a link that begins with http:// or https://.' };
  }
  if (!parsed.hostname || !parsed.hostname.includes('.')) {
    return { error: 'Please enter a full website address, such as example.com.' };
  }

  const host = parsed.hostname.toLowerCase();
  const baseDomain = getBaseDomain(host);
  const findings = [];
  const highRisk = [];
  const caution = [];
  const flag = (list, text) => list.push(text);
  const isIpAddress = /^\[[0-9a-f:]+\]$/i.test(host) || /^(?:\d{1,3}\.){3}\d{1,3}$/.test(host);
  if (parsed.username || parsed.password) flag(highRisk, 'The address contains a hidden username or password before the website name. Do not open it.');
  if (isIpAddress) flag(highRisk, 'The link uses a number address instead of a familiar website name. This is unusual for a link sent to you.');
  if (host.includes('xn--')) flag(caution, 'The website name uses special characters that can make it look like another address. Check it carefully.');
  if (parsed.protocol === 'http:') flag(caution, 'This address does not use an encrypted connection. That alone does not prove it is a scam, but do not enter private information.');

  const officialBrandDomains = {
    google: ['google.com','google.co.za'], facebook: ['facebook.com'], whatsapp: ['whatsapp.com'],
    microsoft: ['microsoft.com'], apple: ['apple.com'], paypal: ['paypal.com'], amazon: ['amazon.com'],
    sars: ['sars.gov.za'], fnb: ['fnb.co.za'], capitec: ['capitec.co.za'],
    absa: ['absa.co.za'], nedbank: ['nedbank.co.za'], standardbank: ['standardbank.co.za']
  };
  Object.entries(officialBrandDomains).forEach(([brand, domains]) => {
    if (host.includes(brand) && !domains.some((domain) => host === domain || host.endsWith(`.${domain}`))) {
      flag(highRisk, `The address contains “${brand}” but does not match a known official ${brand.toUpperCase()} website address. It may be pretending to be that organisation.`);
    }
  });

  const shorteners = new Set(['bit.ly','tinyurl.com','t.co','goo.gl','ow.ly','is.gd','cutt.ly','rb.gy']);
  if (shorteners.has(baseDomain)) flag(caution, 'This is a shortened link. It hides the website address it will take you to.');
  if (host.split('.').length > 4) flag(caution, 'This address has several sections before the ending. Read the main website name carefully.');
  if (host.length > 45) flag(caution, 'This website name is unusually long. Long names can make misleading addresses harder to notice.');
  if (parsed.port && !['80','443'].includes(parsed.port)) flag(caution, 'This link uses an unusual connection number. Do not continue unless you trust the source.');
  if (/\.(?:apk|exe|scr|bat|cmd|msi|js|zip)$/i.test(parsed.pathname)) flag(caution, 'The link appears to point to a file download. Do not download an unexpected file.');
  if (/login|verify|account|secure|update|support/i.test(host)) flag(caution, 'The website name uses words often seen in account-warning messages. These words alone do not prove it is a scam.');

  findings.push(...highRisk, ...caution);
  return { url: parsed, host, baseDomain, findings, highRisk: highRisk.length > 0 };
}

function analyzeLink() {
  const input = document.getElementById('link-input');
  const resultBox = document.getElementById('scan-result');
  const badge = document.getElementById('result-status-badge');
  const title = document.getElementById('result-title');
  const explanation = document.getElementById('result-explanation');
  const findingsList = document.getElementById('result-findings');
  const limit = document.getElementById('result-limit');
  const externalButton = document.getElementById('google-safe-browsing-button');
  if (!input || !resultBox || !badge || !title || !explanation || !findingsList || !limit) return;

  const rawText = input.value.trim();
  resultBox.className = 'scan-result';
  findingsList.replaceChildren();
  findingsList.classList.add('hidden');
  limit.textContent = '';
  externalButton?.classList.add('hidden');

  if (!rawText) {
    resultBox.classList.add('scan-result-error');
    badge.textContent = 'LINK NEEDED';
    title.textContent = 'Paste a link to check';
    explanation.textContent = 'Copy a web address or a message containing one, then try again.';
    input.focus();
    resultBox.classList.remove('hidden');
    return;
  }

  const result = inspectLink(rawText);
  if (result.error) {
    resultBox.classList.add('scan-result-error');
    badge.textContent = 'COULD NOT CHECK';
    title.textContent = 'Please check the address';
    explanation.textContent = result.error;
    resultBox.classList.remove('hidden');
    return;
  }

  if (result.highRisk) {
    resultBox.classList.add('scan-result-high');
    badge.textContent = 'STRONG WARNING SIGNS';
    title.textContent = 'Do not open this link';
    explanation.textContent = 'The address has signs commonly used to mislead people. Do not enter a password, code, or payment details.';
  } else if (result.findings.length) {
    resultBox.classList.add('scan-result-caution');
    badge.textContent = 'USE CAUTION';
    title.textContent = 'Check this link another way';
    explanation.textContent = 'We found some warning signs. This does not prove it is a scam, but do not use it for private details or payments.';
  } else {
    resultBox.classList.add('scan-result-neutral');
    badge.textContent = 'NO OBVIOUS WARNING SIGNS';
    title.textContent = 'This check did not find a clear warning sign';
    explanation.textContent = 'That does not mean the website is safe. Only continue if you expected this link and trust who sent it.';
  }

  const domainItem = document.createElement('li');
  domainItem.textContent = `Website name: ${result.host}`;
  findingsList.appendChild(domainItem);
  result.findings.forEach((finding) => {
    const item = document.createElement('li');
    item.textContent = finding;
    findingsList.appendChild(item);
  });
  findingsList.classList.remove('hidden');
  limit.textContent = 'This page checks for common warning signs only; it does not check a live scam database. New or compromised scam sites may not show these signs. If you choose the Google check, the link is sent to Google Safe Browsing for a separate check.';
  if (externalButton) {
    externalButton.classList.remove('hidden');
    externalButton.onclick = () => {
      const reportUrl = `https://transparencyreport.google.com/safe-browsing/search?url=${encodeURIComponent(result.url.href)}`;
      window.open(reportUrl, '_blank', 'noopener,noreferrer');
    };
  }
  resultBox.classList.remove('hidden');
}

// Home page progress bar: one step for every quiz that has been completed
function updateProgress() {
  const bar = document.getElementById('learning-progress-bar');
  const statusText = document.getElementById('progress-status-text');
  if (!bar || !statusText) return;

  const keys = Object.keys(quizCategories);
  const best = loadBestScores();
  const done = keys.filter((key) => best[key] !== undefined).length;
  const percent = Math.round((done / keys.length) * 100);

  bar.style.width = `${percent}%`;
  bar.textContent = done ? `${percent}%` : '';
  bar.classList.toggle('is-empty', done === 0);
  bar.parentElement?.setAttribute('aria-valuenow', percent.toString());
  statusText.textContent = `${done} of ${keys.length} lessons completed`;
}

function bindAccessibilityButtons() {
  const decreaseButton = document.getElementById('btn-decrease-font');
  const resetButton = document.getElementById('btn-reset-font');
  const increaseButton = document.getElementById('btn-increase-font');
  const themeButton = document.getElementById('btn-toggle-theme');
  const darkButton = document.getElementById('btn-toggle-dark');
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

  themeButton?.addEventListener('click', () => setTheme(theme === 'contrast' ? 'light' : 'contrast'));
  darkButton?.addEventListener('click', () => setTheme(theme === 'dark' ? 'light' : 'dark'));

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

// Dark mode and high contrast are mutually exclusive; the choice is remembered.
function setTheme(newTheme) {
  theme = newTheme;
  try { localStorage.setItem(THEME_KEY, theme); } catch (error) { /* ignore */ }
  applyTheme();
}

function applyTheme() {
  document.body.classList.toggle('dark-mode', theme === 'dark');
  document.body.classList.toggle('high-contrast', theme === 'contrast');
  document.getElementById('btn-toggle-dark')?.setAttribute('aria-pressed', (theme === 'dark').toString());
  document.getElementById('btn-toggle-theme')?.setAttribute('aria-pressed', (theme === 'contrast').toString());
}
