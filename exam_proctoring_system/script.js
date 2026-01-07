// Global Variables
let currentUser = null;
let currentExam = null;
let examTimer = null;
let examStartTime = null;
let examEndTime = null;
let userAnswers = {};
let tabSwitchCount = 0;
let fullscreenExitCount = 0;
let proctoringViolations = [];

// Sample Data (In a real application, this would come from a database)
const users = [
    { id: 1, username: 'student1', password: 'password123', name: 'John Doe' },
    { id: 2, username: 'student2', password: 'password123', name: 'Jane Smith' },
    { id: 3, username: 'student3', password: 'password123', name: 'Mike Johnson' }
];

const exams = [
    {
        id: 1,
        title: 'JavaScript Fundamentals',
        description: 'Test your knowledge of JavaScript basics',
        duration: 30, // minutes
        questions: [
            {
                id: 1,
                text: 'What is the correct way to declare a variable in JavaScript?',
                options: [
                    'var x = 5;',
                    'variable x = 5;',
                    'v x = 5;',
                    'declare x = 5;'
                ],
                correctAnswer: 0,
                category: 'Variables'
            },
            {
                id: 2,
                text: 'Which method is used to add an element to the end of an array?',
                options: [
                    'push()',
                    'pop()',
                    'shift()',
                    'unshift()'
                ],
                correctAnswer: 0,
                category: 'Arrays'
            },
            {
                id: 3,
                text: 'What is the output of: console.log(typeof null)?',
                options: [
                    'null',
                    'undefined',
                    'object',
                    'number'
                ],
                correctAnswer: 2,
                category: 'Data Types'
            },
            {
                id: 4,
                text: 'How do you create a function in JavaScript?',
                options: [
                    'function myFunction()',
                    'function:myFunction()',
                    'function = myFunction()',
                    'function => myFunction()'
                ],
                correctAnswer: 0,
                category: 'Functions'
            },
            {
                id: 5,
                text: 'What does the === operator check for?',
                options: [
                    'Value equality only',
                    'Value and type equality',
                    'Type equality only',
                    'Reference equality'
                ],
                correctAnswer: 1,
                category: 'Operators'
            }
        ]
    },
    {
        id: 2,
        title: 'HTML & CSS Basics',
        description: 'Test your knowledge of HTML and CSS fundamentals',
        duration: 25,
        questions: [
            {
                id: 1,
                text: 'What does HTML stand for?',
                options: [
                    'Hyper Text Markup Language',
                    'High Tech Modern Language',
                    'Home Tool Markup Language',
                    'Hyperlink and Text Markup Language'
                ],
                correctAnswer: 0,
                category: 'HTML Basics'
            },
            {
                id: 2,
                text: 'Which CSS property controls the text size?',
                options: [
                    'font-style',
                    'text-size',
                    'font-size',
                    'text-style'
                ],
                correctAnswer: 2,
                category: 'CSS Typography'
            },
            {
                id: 3,
                text: 'What is the correct HTML element for inserting a line break?',
                options: [
                    '<break>',
                    '<lb>',
                    '<br>',
                    '<linebreak>'
                ],
                correctAnswer: 2,
                category: 'HTML Elements'
            }
        ]
    }
];

const examResults = [
    { userId: 1, examId: 1, score: 85, timeTaken: 1800, violations: 0 },
    { userId: 2, examId: 1, score: 92, timeTaken: 1500, violations: 1 },
    { userId: 3, examId: 1, score: 78, timeTaken: 2000, violations: 0 }
];

// DOM Elements
const loginSection = document.getElementById('loginSection');
const dashboardSection = document.getElementById('dashboardSection');
const examSection = document.getElementById('examSection');
const resultsSection = document.getElementById('resultsSection');

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    checkAuthentication();
});

// Event Listeners
function initializeEventListeners() {
    // Login Form
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    
    // Logout Button
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);
    
    // Exam Navigation
    document.getElementById('prevBtn').addEventListener('click', previousQuestion);
    document.getElementById('nextBtn').addEventListener('click', nextQuestion);
    document.getElementById('submitExamBtn').addEventListener('click', confirmSubmitExam);
    
    // Results Actions
    document.getElementById('viewLeaderboardBtn').addEventListener('click', showLeaderboard);
    document.getElementById('takeAnotherExamBtn').addEventListener('click', backToDashboard);
    document.getElementById('backToDashboardBtn').addEventListener('click', backToDashboard);
    
    // Modal Actions
    document.getElementById('modalCancel').addEventListener('click', closeModal);
    document.getElementById('modalConfirm').addEventListener('click', handleModalConfirm);
    
    // Proctoring Event Listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('keydown', handleKeydown);
    document.addEventListener('contextmenu', handleContextMenu);
}

// Authentication Functions
function checkAuthentication() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        showDashboard();
    }
}

function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        showDashboard();
    } else {
        alert('Invalid username or password');
    }
}

function handleLogout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    showLogin();
}

// Navigation Functions
function showLogin() {
    hideAllSections();
    loginSection.classList.add('active');
}

function showDashboard() {
    hideAllSections();
    dashboardSection.classList.add('active');
    loadDashboardData();
}

function showExam(examId) {
    hideAllSections();
    examSection.classList.add('active');
    
    currentExam = exams.find(exam => exam.id === examId);
    if (!currentExam) return;
    
    initializeExam();
    startProctoring();
}

function showResults() {
    hideAllSections();
    resultsSection.classList.add('active');
    displayResults();
}

function hideAllSections() {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
}
