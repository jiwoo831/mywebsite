/* =========================================
   1. 데이터베이스 (단어 목록)
   ========================================= */
const vocabDB = {
    1: [{ word: "standby", meaning: "예비품, 대기자" }, { word: "accept", meaning: "받아들이다" }],
    2: [{ word: "benefit", meaning: "이익" }, { word: "charge", meaning: "책임" }],
    3: [{ word: "focus", meaning: "집중하다" }],
    4: [{ word: "review", meaning: "복습하다" }],
    5: [{ word: "challenge", meaning: "도전하다" }],
    6: [{ word: "halfway", meaning: "중간의" }],
    7: [{ word: "steady", meaning: "꾸준한" }],
    8: [{ word: "advance", meaning: "나아가다" }],
    9: [{ word: "deep", meaning: "깊은" }],
    10: [{ word: "master", meaning: "숙달하다" }],
    11: [{ word: "expert", meaning: "전문가" }],
    12: [{ word: "final", meaning: "마지막의" }]
};

/* =========================================
   2. 화면 전환 & 학습 로직 (SPA)
   ========================================= */
const homeView = document.getElementById('home-view');
const studyView = document.getElementById('study-view');

// 메인 -> 상세 페이지 이동
function startStudy(day) {
    homeView.classList.add('hidden');
    studyView.classList.remove('hidden');
    // 스크롤을 맨 위로 올려줌 (UX 향상)
    window.scrollTo(0, 0);
    loadDayData(day);
}

// 상세 -> 메인 페이지 이동
function showHome() {
    studyView.classList.add('hidden');
    homeView.classList.remove('hidden');
}

/* =========================================
   3. 학습 카드 기능
   ========================================= */
let currentWords = [];
let currentIndex = 0;

const wordDisplay = document.getElementById('word-display');
const meaningDisplay = document.getElementById('meaning-display');
const studyTitle = document.getElementById('study-title');
const progressText = document.getElementById('progress-text');
const progressFill = document.getElementById('progress-fill');
const cardPrev = document.getElementById('card-prev');
const cardNext = document.getElementById('card-next');

function loadDayData(day) {
    currentWords = vocabDB[day] || [{ word: "No Data", meaning: "데이터가 없습니다." }];
    currentIndex = 0;
    studyTitle.innerText = `Day ${day} 학습`;
    updateCard();
}

function updateCard() {
    const item = currentWords[currentIndex];
    wordDisplay.innerText = item.word;
    meaningDisplay.innerText = item.meaning;

    const currentNum = currentIndex + 1;
    const totalNum = currentWords.length;
    progressText.innerText = `${currentNum} / ${totalNum}`;
    progressFill.style.width = `${(currentNum / totalNum) * 100}%`;

    // 버튼 활성화 상태 관리
    cardPrev.style.opacity = (currentIndex === 0) ? 0.3 : 1;
    cardNext.style.opacity = (currentIndex === totalNum - 1) ? 0.3 : 1;
    cardPrev.disabled = (currentIndex === 0);
    cardNext.disabled = (currentIndex === totalNum - 1);
}

if(cardPrev && cardNext) {
    cardPrev.addEventListener('click', () => {
        if (currentIndex > 0) { currentIndex--; updateCard(); }
    });

    cardNext.addEventListener('click', () => {
        if (currentIndex < currentWords.length - 1) { currentIndex++; updateCard(); }
    });
}

/* =========================================
   4. D-Day 계산 (Schedule Page용)
   ========================================= */
// 이 코드는 schedule.html이 열렸을 때만 작동
function updateDDays() {
    const dateElements = document.querySelectorAll('.exam-date[data-date]');
    if (dateElements.length === 0) return;

    dateElements.forEach(element => {
        const targetDate = new Date(element.getAttribute('data-date')).getTime();
        const now = new Date().getTime();
        const days = Math.ceil((targetDate - now) / (1000 * 60 * 60 * 24));
        const badge = element.nextElementSibling;
        
        if (days > 0) {
            badge.innerText = `D-${days}`;
            badge.style.color = "#4da9ff";
        } else if (days === 0) {
            badge.innerText = "D-Day";
            badge.style.color = "#ff4d4d";
        } else {
            badge.innerText = `D+${Math.abs(days)}`;
            badge.style.color = "#666";
        }
    });
}
// DOM 로드 시 실행
document.addEventListener('DOMContentLoaded', updateDDays);