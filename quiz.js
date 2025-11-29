/* =========================================
   O/X 퀴즈 게임 로직 (quiz.js) - vocabDB 연동 완료
   ========================================= */

// 상태 변수들
let quizCurrentDay = 1;
let quizQuestions = []; // 생성된 문제들
let quizIndex = 0;      // 현재 문제 번호 (0~9)
let quizScore = 0;      // 점수
let timerInterval;      // 타이머 인터벌
let timeLeft = 5;       // 남은 시간 (초)
let isAnswerChecked = false; // 중복 클릭 방지용

// 1. 모달 열기 (빙하 클릭 시)
function openQuizModal(day) {
    quizCurrentDay = day;
    
    // 해당 Day에 데이터가 있는지 확인
    if (!vocabDB[day]) {
        alert("아직 준비 중인 Day입니다.");
        return;
    }

    const modal = document.getElementById('startModal');
    if(modal) modal.style.display = 'flex';
}

// 2. 모달 닫기
function closeQuizModal() {
    const modal = document.getElementById('startModal');
    if(modal) modal.style.display = 'none';
}

// 3. 게임 시작
function startQuizGame() {
    closeQuizModal();
    
    // 화면 전환: 빙하 그리드 숨기기 -> 게임 화면 보이기
    document.getElementById('quiz-home-view').style.display = 'none';
    
    const gameView = document.getElementById('quiz-game-view');
    gameView.style.display = 'block';
    gameView.classList.remove('hidden');

    document.getElementById('quiz-day-title').innerText = `Day ${quizCurrentDay} Quiz`;

    // 문제 출제
    generateQuestions();
    
    // 첫 문제 표시
    quizIndex = 0;
    quizScore = 0;
    updateScore();
    showQuestion();
}

// 4. 문제 데이터 생성 (vocabDB 연동 핵심 로직)
function generateQuestions() {
    // script.js에 있는 vocabDB에서 데이터를 가져옵니다.
    const originalData = vocabDB[quizCurrentDay];

    if (!originalData || originalData.length === 0) {
        alert("데이터를 불러올 수 없습니다.");
        location.reload();
        return;
    }

    // 10개의 데이터를 기반으로 O/X 문제 생성
    quizQuestions = originalData.map(item => {
        // 50% 확률로 정답(True), 50% 확률로 오답(False) 생성
        const isReal = Math.random() < 0.5;
        
        let displayedMeaning = item.meaning; // 기본은 진짜 뜻
        
        if (!isReal) {
            // 오답(X) 문제일 경우: 현재 Day의 단어 중 '나'를 제외한 다른 단어의 뜻을 가져옴
            const otherItems = originalData.filter(w => w.word !== item.word);
            
            // 다른 단어가 있으면 그중 하나 랜덤, 없으면 "틀린 뜻" 텍스트
            if (otherItems.length > 0) {
                const randomItem = otherItems[Math.floor(Math.random() * otherItems.length)];
                displayedMeaning = randomItem.meaning;
            } else {
                displayedMeaning = "틀린 뜻";
            }
        }

        return {
            word: item.word,
            displayedMeaning: displayedMeaning,
            isCorrect: isReal // O가 정답이면 true, X가 정답이면 false
        };
    });

    // 문제 순서를 한 번 더 섞고 싶다면 여기서 shuffle 가능 (현재는 단어 순서대로 출제)
}

// 5. 화면에 문제 표시
function showQuestion() {
    // 모든 문제를 다 풀었으면 종료
    if (quizIndex >= quizQuestions.length) {
        endQuiz();
        return;
    }

    isAnswerChecked = false;
    const currentQ = quizQuestions[quizIndex];

    // HTML 업데이트
    document.getElementById('q-word').innerText = currentQ.word;
    document.getElementById('q-meaning').innerText = currentQ.displayedMeaning;

    // 버튼 상태 초기화
    resetButtons();

    // 타이머 시작
    startTimer();
}

// 6. 타이머 로직 (0.05초 단위 업데이트)
function startTimer() {
    clearInterval(timerInterval);
    timeLeft = 5; // 5초
    updateTimerBar();

    timerInterval = setInterval(() => {
        timeLeft -= 0.05; 
        updateTimerBar();

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            handleTimeOut(); // 시간 초과
        }
    }, 50);
}

function updateTimerBar() {
    const bar = document.getElementById('timer-bar');
    if(!bar) return;

    const percentage = (timeLeft / 5) * 100;
    bar.style.width = `${percentage}%`;
    
    // 30% 미만 남으면 빨간색 경고
    if (percentage < 30) {
        bar.style.backgroundColor = '#ff4d4d';
    } else {
        bar.style.backgroundColor = '#2196F3';
    }
}

// 7. 정답 체크 (사용자 클릭)
function checkAnswer(userChoice) {
    if (isAnswerChecked) return; // 이미 눌렀으면 무시
    isAnswerChecked = true;
    clearInterval(timerInterval); // 타이머 정지

    const currentQ = quizQuestions[quizIndex];
    const isWin = (userChoice === currentQ.isCorrect); // 내 선택과 정답이 일치하는가?

    const btnO = document.querySelector('.btn-o');
    const btnX = document.querySelector('.btn-x');

    // 시각적 피드백
    if (isWin) {
        // 정답! -> 누른 버튼 파란색
        if (userChoice === true) btnO.classList.add('correct');
        else btnX.classList.add('correct');
        quizScore++;
    } else {
        // 땡! -> 누른 버튼 회색(흔들림) + 진짜 정답 파란색
        if (userChoice === true) { // 내가 O를 눌렀는데 틀림
            btnO.classList.add('wrong');
            btnX.classList.add('correct'); // 정답은 X였음
        } else { // 내가 X를 눌렀는데 틀림
            btnX.classList.add('wrong');
            btnO.classList.add('correct'); // 정답은 O였음
        }
    }

    updateScore();

    // 1초 뒤 다음 문제로
    setTimeout(() => {
        quizIndex++;
        showQuestion();
    }, 1000);
}

// 시간 초과 처리
function handleTimeOut() {
    isAnswerChecked = true;
    
    const currentQ = quizQuestions[quizIndex];
    const btnO = document.querySelector('.btn-o');
    const btnX = document.querySelector('.btn-x');

    // 정답만 파란색으로 보여줌 (사용자는 점수 못 얻음)
    if (currentQ.isCorrect) btnO.classList.add('correct');
    else btnX.classList.add('correct');

    setTimeout(() => {
        quizIndex++;
        showQuestion();
    }, 1000);
}

function resetButtons() {
    const buttons = document.querySelectorAll('.btn-ox');
    buttons.forEach(btn => {
        btn.classList.remove('correct', 'wrong');
    });
}

function updateScore() {
    const display = document.getElementById('score-display');
    if(display) display.innerText = `Score: ${quizScore} / ${quizQuestions.length}`;
}

// 8. 게임 종료 및 결과
function endQuiz() {
    const finalScoreDisplay = document.getElementById('final-score');
    if(finalScoreDisplay) finalScoreDisplay.innerText = `${quizScore * 10}점`; // 100점 만점 환산

    const resultModal = document.getElementById('resultModal');
    if(resultModal) resultModal.style.display = 'flex';
}

// 나가기 (새로고침)
function quitQuiz() {
    location.reload();
}