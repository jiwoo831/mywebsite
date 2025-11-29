document.addEventListener('DOMContentLoaded', () => {
    // 1. [공통] 스크롤 애니메이션
    const observerOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // 2. [시험 일정] D-Day 로직
    if (document.querySelector('.d-day-container')) initDDayLogic();
});

/* --- 학습 페이지 로직 (Global Functions for onclick) --- */
const vocabDB = {
    1: [{ word: "standby", meaning: "예비품, 대기자" }, { word: "accept", meaning: "받아들이다" }],
    2: [{ word: "benefit", meaning: "이익" }, { word: "charge", meaning: "책임" }],
    // ... (데이터 생략, 필요시 추가)
    12: [{ word: "final", meaning: "마지막의" }]
};

// [Study] 메인 <-> 상세 화면 전환
function startStudy(day) {
    const homeView = document.getElementById('home-view');
    const studyView = document.getElementById('study-view');
    if(homeView && studyView) {
        homeView.classList.add('hidden');
        studyView.classList.remove('hidden');
        loadDayData(day);
    }
}

function showHome() {
    const homeView = document.getElementById('home-view');
    const studyView = document.getElementById('study-view');
    if(homeView && studyView) {
        studyView.classList.add('hidden');
        homeView.classList.remove('hidden');
    }
}

// [Study] 단어 카드 로직
let currentWords = [];
let currentIndex = 0;

function loadDayData(day) {
    currentWords = vocabDB[day] || [{ word: "No Data", meaning: "데이터가 없습니다." }];
    currentIndex = 0;
    
    const title = document.getElementById('study-title');
    if(title) title.innerText = `Day ${day} 학습`;
    
    updateCard();
}

function updateCard() {
    const wordDisplay = document.getElementById('word-display');
    const meaningDisplay = document.getElementById('meaning-display');
    const progressText = document.getElementById('progress-text');
    const progressFill = document.getElementById('progress-fill');
    const cardPrev = document.getElementById('card-prev');
    const cardNext = document.getElementById('card-next');

    if(!wordDisplay) return;

    const item = currentWords[currentIndex];
    wordDisplay.innerText = item.word;
    meaningDisplay.innerText = item.meaning;

    const currentNum = currentIndex + 1;
    const totalNum = currentWords.length;
    progressText.innerText = `${currentNum} / ${totalNum}`;
    progressFill.style.width = `${(currentNum / totalNum) * 100}%`;

    cardPrev.disabled = (currentIndex === 0);
    cardNext.disabled = (currentIndex === totalNum - 1);
    cardPrev.style.opacity = (currentIndex === 0) ? 0.3 : 1;
    cardNext.style.opacity = (currentIndex === totalNum - 1) ? 0.3 : 1;
}

// 이벤트 리스너 (버튼 존재 시 연결)
const cardPrev = document.getElementById('card-prev');
const cardNext = document.getElementById('card-next');

if(cardPrev && cardNext) {
    cardPrev.addEventListener('click', () => {
        if (currentIndex > 0) { currentIndex--; updateCard(); }
    });
    cardNext.addEventListener('click', () => {
        if (currentIndex < currentWords.length - 1) { currentIndex++; updateCard(); }
    });
}

/* --- D-Day 로직 --- */
function initDDayLogic() {
    const dateElements = document.querySelectorAll('.exam-date[data-date]');
    dateElements.forEach(element => {
        const targetDate = new Date(element.getAttribute('data-date')).getTime();
        const now = new Date().getTime();
        const days = Math.ceil((targetDate - now) / (1000 * 60 * 60 * 24));
        const badge = element.nextElementSibling;
        
        if (days > 0) {
            badge.innerText = `D-${days}`;
            badge.style.color = "#2196f3"; // accent-blue
        } else if (days === 0) {
            badge.innerText = "D-Day";
            badge.style.color = "#ff4d4d";
        } else {
            badge.innerText = `D+${Math.abs(days)}`;
            badge.style.color = "#666";
        }
    });
}