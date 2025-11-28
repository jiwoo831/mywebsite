/* --- 1. D-Day 계산 로직 (메인 페이지용) --- */
function updateDDays() {
    // 날짜 요소들을 모두 찾음
    const dateElements = document.querySelectorAll('.exam-date[data-date]');
    
    dateElements.forEach(element => {
        const targetDateStr = element.getAttribute('data-date');
        const targetDate = new Date(targetDateStr).getTime();
        const now = new Date().getTime();
        
        // 차이 계산 (밀리초 단위 -> 일 단위 변환)
        const distance = targetDate - now;
        const days = Math.ceil(distance / (1000 * 60 * 60 * 24));
        
        // 해당 카드의 D-Day 뱃지 찾기
        const badge = element.nextElementSibling;
        
        if (days > 0) {
            badge.innerText = `D-${days}`;
            badge.style.color = "#4da9ff"; // D-Day 남음 (파란색)
        } else if (days === 0) {
            badge.innerText = "D-Day";
            badge.style.color = "#ff4d4d"; // 당일 (빨간색)
        } else {
            badge.innerText = `D+${Math.abs(days)}`;
            badge.style.color = "#666";    // 지남 (회색)
        }
    });
}

// 메인 페이지에 D-Day 요소가 있을 때만 실행
if (document.querySelector('.d-day-container')) {
    updateDDays();
}


/* --- 2. 학습 인터페이스 로직 (상세 학습 페이지용) --- */

// 샘플 데이터 (Day 1)
const wordData = [
    { word: "accept", meaning: "받아들이다, 수락하다" },
    { word: "develop", meaning: "개발하다, 성장하다" },
    { word: "theory", meaning: "이론, 학설" },
    { word: "feature", meaning: "특징, 기능" },
    { word: "structure", meaning: "구조, 조직하다" },
    { word: "boundary", meaning: "경계, 한계" },
    { word: "achieve", meaning: "성취하다, 이루다" },
    { word: "challenge", meaning: "도전, 난제" },
    { word: "method", meaning: "방법, 방식" },
    { word: "positive", meaning: "긍정적인" }
];

let currentIndex = 0; // 현재 보고 있는 단어의 인덱스 (0 ~ 9)

const wordDisplay = document.getElementById('word-display');
const meaningDisplay = document.getElementById('meaning-display');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const progressText = document.getElementById('progress-text');
const progressFill = document.getElementById('progress-fill');

// 화면 업데이트 함수
function updateCard() {
    if (!wordDisplay) return; // 요소가 없으면 실행 중단 (다른 페이지일 경우)

    const currentWord = wordData[currentIndex];
    
    // 텍스트 변경
    wordDisplay.innerText = currentWord.word;
    meaningDisplay.innerText = currentWord.meaning;
    
    // 진행률 텍스트 업데이트 (예: 1 / 10)
    progressText.innerText = `${currentIndex + 1} / ${wordData.length}`;
    
    // 프로그레스 바 너비 업데이트 (예: 10% -> 20% ...)
    const percentage = ((currentIndex + 1) / wordData.length) * 100;
    progressFill.style.width = `${percentage}%`;

    // 버튼 활성화/비활성화 상태 관리
    prevBtn.disabled = (currentIndex === 0); // 첫 단어면 '이전' 불가
    nextBtn.disabled = (currentIndex === wordData.length - 1); // 마지막이면 '다음' 불가
}

// 버튼 클릭 이벤트 리스너
if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateCard();
        }
    });

    nextBtn.addEventListener('click', () => {
        if (currentIndex < wordData.length - 1) {
            currentIndex++;
            updateCard();
        }
    });

    // 초기 실행
    updateCard();
}