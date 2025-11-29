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
    1: [{ word: "receive", meaning: "받아들이다" },
    { word: "standby", meaning: "예비품, 대기자" },
    { word: "container", meaning: "그릇, 용기" },
    { word: "banister", meaning: "난간" },
    { word: "guide book", meaning: "안내서" },
    { word: "hot rod", meaning: "개조한 자동차" },
    { word: "clear off the table", meaning: "식탁을 깨끗이 치우다" },
    { word: "leaflet", meaning: "전단지" },
    { word: "on the floor", meaning: "제작중인, 바닥에서, 무일푼의" },
    { word: "carefree", meaning: "근심 걱정 없는" }
    ],
    2: [{ word: "lay down the law", meaning: "강압적으로 말하다." },
    { word: "bathe", meaning: "목욕하다, 세척하다" },
    { word: "recliner", meaning: "등받이가 뒤로 넘어가는 안락의자" },
    { word: "supply", meaning: "공급, 공급하다" },
    { word: "cross legged", meaning: "다리를 꼬다" },
    { word: "press the button", meaning: "버튼을 누르다" },
    { word: "mend", meaning: "수리하다, 고치다" },
    { word: "lathe", meaning: "선반" },
    { word: "go for a ride", meaning: "타러 가다" },
    { word: "run out of", meaning: "~을 다 써버리다" }],

    3: [{ word: "start", meaning: "시작하다" },
    { word: "street vendor", meaning: "노점상" },
    { word: "facsimile", meaning: "복제, 복사" },
    { word: "row", meaning: "노를 젓다, 줄" },
    { word: "display", meaning: "전시하다" },
    { word: "baggage", meaning: "짐, 수하물" },
    { word: "sack", meaning: "파면, 해고" },
    { word: "gamble", meaning: "돈을 걸다, 도박" },
    { word: "record", meaning: "기록, 성적" },
    { word: "pass", meaning: "지나가다, 통과" }
    ],
    4: [{ word: "get with", meaning: "~에 주목하다" },
    { word: "toward", meaning: "~쪽으로, 임박해오는" },
    { word: "pointer", meaning: "충고, 신호" },
    { word: "guard", meaning: "경비, 지키다" },
    { word: "nail down", meaning: "고정시키다, 확실하게 하다." },
    { word: "for sale", meaning: "팔려고 내놓은" },
    { word: "strain to", meaning: "~에 안간힘을 쓰다" },
    { word: "stack up", meaning: "계속 쌓이다, 비교할 만하다" },
    { word: "crew", meaning: "승무원" },
    { word: "baked", meaning: "구운, 햇볕에 탄" }
    ],
    5: [{ word: "chandelier", meaning: "샹들리에" },
    { word: "graze", meaning: "방목하다, 찰과상" },
    { word: "stroll", meaning: "산책하다, 어슬렁거리다" },
    { word: "trip", meaning: "여행, 발을 헛디디다" },
    { word: "magazine staff", meaning: "잡지부 직원" },
    { word: "rake", meaning: "갈퀴, 난봉꾼" },
    { word: "stand up", meaning: "서 있다" },
    { word: "sightseer", meaning: "관광객" },
    { word: "second floor", meaning: "2층" },
    { word: "subway stop", meaning: "지하철역" }
    ],
    6: [{ word: "museum", meaning: "박물관" },
    { word: "cord", meaning: "줄, 끈으로 묶다" },
    { word: "outdoor", meaning: "집 밖의" },
    { word: "section", meaning: "부분, 구역, 절개하다" },
    { word: "popsicle", meaning: "아이스캔디" },
    { word: "escalate", meaning: "확대하다, 증가되다" },
    { word: "pose", meaning: "제기하다, 자세를 취하다" },
    { word: "trim", meaning: "다듬다, 손질하다" },
    { word: "copious", meaning: "엄청난, 방대한" },
    { word: "dig", meaning: "땅을 파다, 캐다" },
    ],
    7: [{ word: "lacrosse", meaning: "(구기종목)라크로스" },
    { word: "endurance", meaning: "인내, 참을성" },
    { word: "go up", meaning: "올라가다" },
    { word: "billow", meaning: "부풀어오르다, 피어오르다" },
    { word: "peel", meaning: "껍질" },
    { word: "float", meaning: "흘러가다, 뜨다" },
    { word: "shaving", meaning: "면도" },
    { word: "strew", meaning: "흩뿌리다" },
    { word: "look down", meaning: "내려다보다, 깔보다" },
    { word: "directory", meaning: "안내 책자" },
    ],
    8: [{ word: "cross country ski", meaning: "들이나 산을 횡단하는 스키" },
    { word: "cloudy day", meaning: "흐린 날" },
    { word: "pick up", meaning: "집다, 회복하다" },
    { word: "paint brush", meaning: "페인트 붓" },
    { word: "library", meaning: "도서관" },
    { word: "light", meaning: "빛, 밝은, 불을 켜다" },
    { word: "strings", meaning: "현악기" },
    { word: "windshield", meaning: "바람막이 창" },
    { word: "throw a party", meaning: "파티를 열다" },
    { word: "bucket", meaning: "양동이" },
    ],
    9: [{ word: "construction", meaning: "건설,공사,건축물" },
        { word: "pudding", meaning: "푸딩" },
        { word: "inspect", meaning: "점검하다" },
        { word: "backrest", meaning: "의자 등받이" },
        { word: "dining table", meaning: "식탁" },
        { word: "playground", meaning: "운동장" },
        { word: "front yard", meaning: "앞마당" },
        { word: "slice", meaning: "조각, 썰다" },
        { word: "leap off", meaning: "뛰어내리다" },
        { word: "lie down", meaning: "눕다" }
    ],
    10: [{ word: "weld", meaning: "용접하다, 결합시키다" },
        { word: "basket", meaning: "바구니" },
        { word: "crook", meaning: "사기꾼, 구부리다" },
        { word: "mailbox", meaning: "우체통" },
        { word: "flick", meaning: "손을 털다, 휙 움직임" },
        { word: "rise to the challenge", meaning: "잘 대처하다" },
        { word: "newspaper stand", meaning: "신문 판매대" },
        { word: "trolley", meaning: "카트,손수레" },
        { word: "outstanding", meaning: "뛰어난,미지불된" },
        { word: "harbor", meaning: "항구,피난처,숨겨주다" }
    ],
    11: [{ word: "wharf", meaning: "부두, 선창" },
        { word: "zoo", meaning: "동물원" },
        { word: "librarian", meaning: "사서" },
        { word: "hop", meaning: "한 발로 깡충 뛰기" },
        { word: "went", meaning: "go의 과거, 갔다" },
        { word: "lie on", meaning: "~의 의무이다, 드러눕다" },
        { word: "handle", meaning: "다루다, 만지다, 손잡이" },
        { word: "cane", meaning: "지팡이, 막대기, 회초리로 때리다" },
        { word: "for the day", meaning: "그 날은, 그 날에" },
        { word: "sit down", meaning: "앉다" },
    ],
    12: [{ word: "investment", meaning: "투자" },
        { word: "humility", meaning: "겸손" },
        { word: "lay out", meaning: "펼치다, 투자하다, 때려 눕히다, 질책하다, 계획하다" },
        { word: "gas pump", meaning: "주유 펌프" },
        { word: "turn on", meaning: "켜다, ~에 달려있다." },
        { word: "patron", meaning: "보호자, 후원자, 단골손님" },
        { word: "subway station", meaning: "지하철 역" },
        { word: "mechanic", meaning: "정비공, 기술자" },
        { word: "hand out", meaning: "나눠주다, 배포하다" },
        { word: "hoist", meaning: "들어올리다, 승강장치" },
    ],
};

// [Study] 메인 <-> 상세 화면 전환
function startStudy(day) {
    const homeView = document.getElementById('home-view');
    const studyView = document.getElementById('study-view');
    if (homeView && studyView) {
        homeView.classList.add('hidden');
        studyView.classList.remove('hidden');
        loadDayData(day);
    }
}

function showHome() {
    const homeView = document.getElementById('home-view');
    const studyView = document.getElementById('study-view');
    if (homeView && studyView) {
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
    if (title) title.innerText = `Day ${day} 학습`;

    updateCard();
}

function updateCard() {
    const wordDisplay = document.getElementById('word-display');
    const meaningDisplay = document.getElementById('meaning-display');
    const progressText = document.getElementById('progress-text');
    const progressFill = document.getElementById('progress-fill');
    const cardPrev = document.getElementById('card-prev');
    const cardNext = document.getElementById('card-next');

    if (!wordDisplay) return;

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

if (cardPrev && cardNext) {
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