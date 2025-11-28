/* --- 1. D-Day 계산 로직 (메인 페이지용) --- */
function updateDDays() {
    const dateElements = document.querySelectorAll('.exam-date[data-date]');
    dateElements.forEach(element => {
        const targetDateStr = element.getAttribute('data-date');
        const targetDate = new Date(targetDateStr).getTime();
        const now = new Date().getTime();
        const distance = targetDate - now;
        const days = Math.ceil(distance / (1000 * 60 * 60 * 24));
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
if (document.querySelector('.d-day-container')) updateDDays();


/* --- 2. 학습 데이터 (DB 역할) --- */
// Day별로 단어를 따로 저장합니다.
const vocabDatabase = {
    "1": [ // Day 1 단어들
        { word: "receive", meaning: "받아들이다" },
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
    "2": [ // Day 2 단어들
        { word: "lay down the law", meaning: "강압적으로 말하다." },
        { word: "bathe", meaning: "목욕하다, 세척하다" },
        { word: "recliner", meaning: "등받이가 뒤로 넘어가는 안락의자" },
        { word: "supply", meaning: "공급, 공급하다" },
        { word: "cross legged", meaning: "다리를 꼬다" },
        { word: "press the button", meaning: "버튼을 누르다" },
        { word: "mend", meaning: "수리하다, 고치다" },
        { word: "lathe", meaning: "선반" },
        { word: "go for a ride", meaning: "타러 가다" },
        { word: "run out of", meaning: "~을 다 써버리다" }
    ],
    "3": [ // Day 3 단어들
        { word: "start", meaning: "시작하다" },
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
        "4": [ 
        { word: "get with", meaning: "~에 주목하다" },
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
            "5": [ 
        { word: "chandelier", meaning: "샹들리에" },
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
            "6": [ 
        { word: "museum", meaning: "박물관" },
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
            "7": [ 
        { word: "lacrosse", meaning: "(구기종목)라크로스" },
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
            "8": [ 
        { word: "cross country ski", meaning: "들이나 산을 횡단하는 스키" },
        { word: "cloudy day", meaning: "흐린 날" },
        { word: "pick up", meaning: "집다, 회복하다" },
        { word: "paint brush", meaning: "페인트 붓" },
        { word: "library", meaning: "도서관" },
        { word: "light", meaning: "빛, 밝은, 불을 켜다" },
        { word: "strings", meaning: "현악기" },
        { word: "windshield", meaning: "바람막이 창" },
        { word: "throw a party", meaning: "파티를 열다" },
        { word: "bucket", meaning: "양동이" },
    ]

    
};


/* --- 3. 학습 인터페이스 로직 --- */
const wordDisplay = document.getElementById('word-display');

// 이 코드는 study.html 페이지에서만 실행되어야 함
if (wordDisplay) {

    // [중요] 주소창에서 '?day=숫자' 값을 읽어옵니다.
    const urlParams = new URLSearchParams(window.location.search);
    const dayId = urlParams.get('day'); // 예: "1" 또는 "2"

    // 해당 Day의 단어 목록을 가져옴 (없으면 빈 배열)
    // 데이터가 없으면 Day 1 데이터를 기본으로 보여줌
    const wordData = vocabDatabase[dayId] || vocabDatabase["1"];

    // 현재 Day 제목 업데이트 (예: Day 2 학습)
    const pageTitle = document.querySelector('h2');
    if (pageTitle && dayId) pageTitle.innerText = `Day ${dayId} 학습`;


    // --- 슬라이드 기능 (기존 로직 유지) ---
    let currentIndex = 0;
    const meaningDisplay = document.getElementById('meaning-display');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const progressText = document.getElementById('progress-text');
    const progressFill = document.getElementById('progress-fill');

    function updateCard() {
        if (!wordData || wordData.length === 0) {
            wordDisplay.innerText = "단어 데이터가 없습니다.";
            return;
        }

        const currentWord = wordData[currentIndex];
        wordDisplay.innerText = currentWord.word;
        meaningDisplay.innerText = currentWord.meaning;

        progressText.innerText = `${currentIndex + 1} / ${wordData.length}`;
        const percentage = ((currentIndex + 1) / wordData.length) * 100;
        progressFill.style.width = `${percentage}%`;

        prevBtn.disabled = (currentIndex === 0);
        nextBtn.disabled = (currentIndex === wordData.length - 1);
    }

    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) { currentIndex--; updateCard(); }
    });

    nextBtn.addEventListener('click', () => {
        if (currentIndex < wordData.length - 1) { currentIndex++; updateCard(); }
    });

    // 시작
    updateCard();
}