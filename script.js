// 1. 로컬 스토리지에서 단어 목록 불러오기 (없으면 빈 배열)
let vocabList = JSON.parse(localStorage.getItem('myVocabList'));

if (!vocabList || vocabList.length === 0) {
    vocabList = [
        { word: "accept", meaning: "받아들이다" },
        { word: "acceptable", meaning: "받아들일 수 있는" },
        { word: "access", meaning: "접근, 접속" },
        { word: "by accident", meaning: "우연히"},
        { word: "according to~", meaning: "~에 따르면"},
        { word: "ache", meaning: "아픔"},
        { word: "achieve", meaning: "성취하다"},
        { word: "achievement", meaning: "성취"},
        { word: "activate", meaning: "활성화하다"},
        { word: "actual", meaning: "실제의"},
        { word: "addition", meaning: "더하기"},
        { word: "address", meaning: "주소"},
        { word: "advanced", meaning: "발전한,고급의"},
        { word: "advantage", meaning: "이점,장점"},
        { word: "disadvantage", meaning: "단점,불리한 점"},
        { word: "advertise", meaning: "광고하다"},
        { word: "affair", meaning: "일,사건"},
        { word: "affect", meaning: "영향을 미치다"},
        { word: "affection", meaning: "애정"},
        { word: "afford", meaning: "~할 여유가 있다"},
        { word: "backbone", meaning: "척추"},
        { word: "ban", meaning: "금지"},
        { word: "bare", meaning: "벌거벗은"},
        { word: "barely", meaning: "가까스로"},
        { word: "bargain", meaning: "흥정하다"},
        { word: "basically", meaning: "기본적으로"},
        { word: "bay", meaning: "구역"},
        { word: "beak", meaning: "부리"},
        { word: "beast", meaning: "야수"}
        
        
        
    ];
    localStorage.setItem('myVocabList', JSON.stringify(vocabList));
}

// HTML 요소들 가져오기
const vocabForm = document.querySelector('#vocab-form form');
const wordInput = document.querySelector('#word');
const meaningInput = document.querySelector('#meaning');
const searchBar = document.querySelector('#search-bar');
const vocabTableBody = document.querySelector('#vocab-tbody');

// 2. 화면에 단어 목록 그려주는 함수 (Render)
function renderVocabList(data) {
    // 기존 목록 비우기
    vocabTableBody.innerHTML = '';

    // 데이터 반복문 돌면서 행(tr) 추가
    data.forEach((item, index) => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${item.word}</td>
            <td>${item.meaning}</td>
            <td>
                <button class="delete-btn" onclick="deleteWord(${index})">삭제</button>
            </td>
        `;
        vocabTableBody.appendChild(row);
    });
}

// 3. '단어 추가' 기능 (Add Word)
if (vocabForm) {
    vocabForm.addEventListener('submit', function(e) {
        e.preventDefault(); // 폼 제출 시 새로고침 방지

        const newWord = wordInput.value.trim(); // 공백 제거
        const newMeaning = meaningInput.value.trim();

        if (newWord && newMeaning) {
            // 새 단어 객체 생성
            const newItem = { word: newWord, meaning: newMeaning };
            
            // 배열에 추가
            vocabList.push(newItem);
            
            // 저장 및 화면 갱신
            saveAndRender();
            
            // 입력창 초기화
            wordInput.value = '';
            meaningInput.value = '';
            wordInput.focus(); // 입력창에 다시 포커스
        } else {
            alert('단어와 뜻을 모두 입력해주세요!');
        }
    });
}

// 4. '단어 삭제' 기능 (Delete Word)
// window 객체에 등록하여 HTML onclick에서 접근 가능하게 함
window.deleteWord = function(index) {
    if (confirm('정말 이 단어를 삭제하시겠습니까?')) {
        vocabList.splice(index, 1); // 배열에서 해당 인덱스 삭제
        saveAndRender(); // 저장 및 갱신
    }
};

// 5. '단어 검색' 기능 (Search)
if (searchBar) {
    searchBar.addEventListener('input', function(e) {
        const keyword = e.target.value.toLowerCase(); // 소문자로 변환

        // 검색어가 포함된 단어만 필터링
        const filteredList = vocabList.filter(item => 
            item.word.toLowerCase().includes(keyword) || 
            item.meaning.includes(keyword)
        );

        renderVocabList(filteredList); // 필터링된 목록만 보여주기
    });
}

// 공통: 데이터 저장 및 렌더링 헬퍼 함수
function saveAndRender() {
    localStorage.setItem('myVocabList', JSON.stringify(vocabList));
    renderVocabList(vocabList);
}

// 초기 실행: 페이지 로드 시 목록 보여주기
// (Main Page인 경우에만 실행)
if (vocabTableBody) {
    renderVocabList(vocabList);
}