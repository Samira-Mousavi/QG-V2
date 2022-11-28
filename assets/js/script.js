const SetQtyOfQuestions = 50; //تعد کل سوالات تست
const highScoresToShow = 8;  //تعداد نتایجی که در آخر می توان دید
const pointsPerCorrectAnswerEasy = 1; //نمره جواب درست در سطح ساده
const pointsPerCorrectAnswerHard = 2; //نمراه جواب درست در سطح سخت
const pointsPerCorrectAnswerMedium = 1.5; ///نمره جواب درست در سطح متوسط
const questionsToFetchMultiplier = 1; 
const qtyOfQuestionsToFetch = (SetQtyOfQuestions * questionsToFetchMultiplier);  
var s=0; //ثانیه شمار
var m=0; //میلی ثانیه شمار
var t=null;
function runTimer(){
	//تابعی که شمارهنده را فعال می کند
	s=0;
	m=0;
	t=setInterval(displayTime,1000); //فعال کردن شمارنده
}
function displayTime(){
	//تابعی که کار به روز رسانی شمارنده را دارد و همچنین چک کردن زمان پایان
	s++;
	if(s==60){
		m++;
		s=0;
	}
	if(s==30 && m==1){
		//اگر به 90 ثانیه رسید پایان مسابقه
		clearInterval(t);  //اتمام شمارنده
		availableQuestions.length =0;   //تعداد سوالات موجود
		maxQuestionsReached();   ///اگر تعدا سوالات موجود به صفر برسد مسابقه تمام می شود
	}
	document.getElementById("timerinside").innerHTML=addzero(m)+":"+addzero(s);  //نمایش شمارنده
}
function addzero(n){
	if(n<10)
	{return "0"+n;}
	else return n;
}
const answers = Array.from(document.getElementsByClassName("answers-text-jsRef"));
//محفظه سوالات یک تا چهار
const answerContainer1 = document.getElementById("answer-container-1-jsRef");
const answerContainer2 = document.getElementById("answer-container-2-jsRef");
const answerContainer3 = document.getElementById("answer-container-3-jsRef");
const answerContainer4 = document.getElementById("answer-container-4-jsRef");

const continuePlayingButton = document.querySelector("#btn-continue-playing-jsRef");
const endGameHighScoresList = document.querySelector(".endGameHighScoresList-jsRef");
const exitGame = document.getElementById("btn-exit-game-jsRef");
const exitQuizContainer = document.querySelector("#exit-quiz-container-jsRef");
const highScoresContainer = document.querySelector("#high-score-container-jsRef");
const highScoresList = document.querySelector(".highScoresList-jsRef");
const homeContainer = document.querySelector("#home-container-jsRef");
const homeScreenButton = document.querySelector("#btn-view-home-screen-jsRef");
const loadingSpinner = document.querySelector(".loadingSpinner-jsRef");
const muteButton = document.getElementById("btn-mute-jsRef");
const playButton = document.querySelector("#btn-play-game-jsRef");
const playerFinalScore = document.getElementById("playerFinalScore-jsRef");
const playername = document.getElementById("playername-jsRef");
const progressBarFull = document.querySelector("#progressBarFull-jsRef");
const progressText = document.getElementById("progressText-jsRef");
const question = document.getElementById("question-jsRef");
const quizContainer = document.querySelector("#quiz-container-jsRef");
const returnHomeScreenButton = document.querySelector("#btn-return-to-home-screen-jsRef");
const saveHighScore = document.querySelector("#btn-save-score-jsRef");
const saveScoreBtn = document.getElementById("btn-save-score-jsRef");
const scoreText = document.querySelector("#score-jsRef");
const showExitGameOptions = document.getElementById("exit-quiz-options-jsRef");
const soundCorrect = new Audio("assets/sounds/sound-correct.mp3");
const soundIncorrect = new Audio("assets/sounds/sound-incorrect.mp3");
const unMuteButton = document.getElementById("btn-unmute-jsRef");
const userFinalScoreContainer = document.querySelector("#user-final-score-container-jsRef");
const viewHighScoresButton = document.querySelector("#btn-view-high-scores-jsRef");
let acceptingAnswers = false;
let actualAnswer = answerContainer1;
let availableQuestions = [];
let newQuestion = {};
let getNewQuestion;
let highScores = [];
let incrementScore;
let level = document.getElementById("selectLevelRef").value;
let pointsPerCorrectAnswer = pointsPerCorrectAnswerEasy; //* default value for easy -
let questionCounter = 0;
let questions = [];
let score = 0;
let quizUrl = 'https://opentdb.com/api.php?amount=40&type=multiple';
soundCorrect.volume = 0.4;
soundIncorrect.volume = 0.4;


//* event listeners
continuePlayingButton.addEventListener("click", closeExitOverlayScreen);
exitGame.addEventListener("click", returnToHomeScreen);
homeScreenButton.addEventListener("click", returnToHomeScreen);
muteButton.addEventListener("click", sounds);
playButton.addEventListener("click", startQuiz);
returnHomeScreenButton.addEventListener("click", returnToHomeScreen);
saveHighScore.addEventListener("click", saveTheHighScore);
showExitGameOptions.addEventListener("click", showExitQuizContainer);
unMuteButton.addEventListener("click", sounds);
playername.addEventListener("keyup", () => {
	saveScoreBtn.disabled = !playername.value;
});
viewHighScoresButton.addEventListener("click", showHighScoresScreen);



/** 
 * retrieves and updates the session storage 
 * altering the key(sounds)from mute to play
 */
function sounds() {
	if (sessionStorage.getItem("sounds") == undefined) {
		sessionStorage.setItem("sounds", "mute");
	} else if (sessionStorage.getItem("sounds") == "mute") {
		sessionStorage.setItem("sounds", "play");
	} else {
		sessionStorage.setItem("sounds", "mute");
	}
	sfxMuteOrPlay();
}


/** 
 * alternates the SFX button 
 * and mutes/plays the SFX accordingly
 */
function sfxMuteOrPlay() {
	if (sessionStorage.getItem("sounds") == "mute") {
		soundCorrect.muted = true;
		soundIncorrect.muted = true;
		muteButton.classList.add("hidden");
		unMuteButton.classList.remove("hidden");
	} else {
		soundCorrect.muted = false;
		soundIncorrect.muted = false;
		unMuteButton.classList.add("hidden");
		muteButton.classList.remove("hidden");
	}
}


/**
 * Adds the points information to the home screen. 
 */
function addPointsInformationToTheHomePage() {
	let pointsInformation = document.getElementById("points-information");
	let pointsInformationText = `Easy - ${pointsPerCorrectAnswerEasy} point per question,<br>
								Medium - ${pointsPerCorrectAnswerMedium} points per question<br>
								Hard - ${pointsPerCorrectAnswerHard} points per question`;
	pointsInformation.innerHTML = pointsInformationText;
}
addPointsInformationToTheHomePage();



function showQuizContainer() {
	homeContainer.classList.add("hidden");
	quizContainer.classList.remove("hidden");
	muteButton.classList.remove("hidden");
}



function returnToHomeScreen() {
	quizContainer.classList.add("hidden");
	userFinalScoreContainer.classList.add("hidden");
	highScoresContainer.classList.add("hidden");
	muteButton.classList.add("hidden");
	unMuteButton.classList.add("hidden");
	exitQuizContainer.classList.add("hidden");
	homeContainer.classList.remove("hidden");
	clearInterval(t);
	document.getElementById("timerinside").innerHTML="00:00";
}



function showExitQuizContainer() {
	exitQuizContainer.classList.remove("hidden");
}



function closeExitOverlayScreen() {
	exitQuizContainer.classList.add("hidden");
}



window.onload = function () {
	if (sessionStorage.getItem("hasSampleScoresBeenAddedBefore") == null) {
		/** this is to add some sample high scores to local storage */
		let letsAddSomeSampleHighScores = [{
				"score": (Math.floor(Math.random() * SetQtyOfQuestions) + 1) * pointsPerCorrectAnswerHard,
				"name": "Sara"
			},
			{
				"score": (Math.floor(Math.random() * SetQtyOfQuestions) + 1) * pointsPerCorrectAnswerHard,
				"name": "Ahmed"
			},

			{
				"score": (Math.floor(Math.random() * SetQtyOfQuestions) + 1) * pointsPerCorrectAnswerHard,
				"name": "Isabel"
			},
			{
				"score": (Math.floor(Math.random() * SetQtyOfQuestions) + 1) * pointsPerCorrectAnswerMedium,
				"name": "Samira"
			},
			{
				"score": (Math.floor(Math.random() * SetQtyOfQuestions) + 1) * pointsPerCorrectAnswerMedium,
				"name": "Rayan"
			},
			{
				"score": (Math.floor(Math.random() * SetQtyOfQuestions) + 1) * pointsPerCorrectAnswerMedium,
				"name": "Vihan"
			},
			{
				"score": (Math.floor(Math.random() * SetQtyOfQuestions) + 1) * pointsPerCorrectAnswerMedium,
				"name": "Nima"
			},
			{
				"score": (Math.floor(Math.random() * SetQtyOfQuestions) + 1) * pointsPerCorrectAnswerMedium,
				"name": "Mike"
			},
			{
				"score": (Math.floor(Math.random() * SetQtyOfQuestions) + 1) * pointsPerCorrectAnswerEasy,
				"name": "Eva"
			},
			{
				"score": (Math.floor(Math.random() * SetQtyOfQuestions) + 1) * pointsPerCorrectAnswerEasy,
				"name": "Eskil"
			},
			{
				"score": (Math.floor(Math.random() * SetQtyOfQuestions) + 1) * pointsPerCorrectAnswerEasy,
				"name": "John"
			}
		];
		letsAddSomeSampleHighScores.sort((a, b) => b.score - a.score);
		letsAddSomeSampleHighScores.splice(highScoresToShow);
		sessionStorage.setItem("highScores", JSON.stringify(letsAddSomeSampleHighScores));
		sessionStorage.setItem("hasSampleScoresBeenAddedBefore", true);
		highScoresRetrieveAndSort();
	}
};



function hideSubmitButtonIfLowestScore() {
	let highScoresNumbers = 0;
	let lowestHighScoresNumber = 0;
	highScoresNumbers = JSON.parse(sessionStorage.getItem("highScores")).map(function (i) {
		return i.score;
	});
	highScoresNumbers.sort((a, b) => a - b);
	highScoresNumbers.splice(1);
	lowestHighScoresNumber = highScoresNumbers.toString();
	if (score < lowestHighScoresNumber) {
		saveHighScore.classList.add("hidden");
		playername.classList.add("hidden");
	}
}



function startQuiz() {
	document.getElementById("countdown").style.display="block";
	runTimer();
	scoreText.innerText = 0;
	score = 0;
	playerFinalScore.innerText = `You scored ${score}`;
	progressBarFull.classList.remove("progress-bar-rounded");
	questionCounter = 0;
	setTimeout(() => {
		showQuizContainer();
		sfxMuteOrPlay();
		availableQuestions = [...questions];
		getNewQuestion();
		loadingSpinner.classList.add("hidden");
	}, 500);
}



function pointsPerQuestion() {
	if (level == "hard") {
		pointsPerCorrectAnswer = pointsPerCorrectAnswerHard;
	} else if (level == "medium") {
		pointsPerCorrectAnswer = pointsPerCorrectAnswerMedium;
	} else {
		pointsPerCorrectAnswer = pointsPerCorrectAnswerEasy;
	}
}



function highScoresRetrieveAndSort() {
	// دریافت امتیازات قبلی و تبدیل امتیازات به شی
	highScores = JSON.parse(sessionStorage.getItem("highScores")) || [];
	// گرفتن تابع برای مرتب سازی به صورت دلخواه
	// مرتب سازی به صورت نزولی
	highScores.sort((a, b) => {
		return b.score - a.score;
	});
}



function fetchTheQuestions() {
//تابع fetch یک آدرس URL را به عنوان ورودی دریافت می‌کند. سپس یک شئ از نوع Promise را بازمی‌گرداند
	fetch(quizUrl)
		.then((res) => {
			return res.json();
		})
		.then((loadedQuestions) => {
			questions = loadedQuestions.results.map((loadedQuestion) => {
				const formattedQuestion = {
					question: loadedQuestion.question,
				};
				const availableAnswers = [...loadedQuestion.incorrect_answers];
				formattedQuestion.CorrectAnswer = Math.floor(Math.random() * 4) + 1;
				availableAnswers.splice(
					formattedQuestion.CorrectAnswer - 1,
					0,
					loadedQuestion.correct_answer
				);

				availableAnswers.forEach((answers, index) => {
					formattedQuestion["answers" + (index + 1)] = answers;
				});

				return formattedQuestion;
			});
		});
}



function updateQuizLevel() {
	// مشخص کردن سطح سوالات
	level = document.getElementById("selectLevelRef").value;
	quizUrl = `https://opentdb.com/api.php?amount=${qtyOfQuestionsToFetch}&category=11&difficulty=${level}&type=multiple`;
	// مشخص کردن بارم سوالات
	pointsPerQuestion();
	sessionStorage.setItem("API-URL", quizUrl);
	// بارگزاری سوالات با تنظیمات گفته شده
	fetchTheQuestions();
}
updateQuizLevel();


function maxQuestionsReached() {
	
	if (availableQuestions.length === 0 || questionCounter >= SetQtyOfQuestions) {
		sessionStorage.setItem("mostRecentScore", score);
		endGameHighScores();
		quizContainer.classList.add("hidden");
		userFinalScoreContainer.classList.remove("hidden");
		hideSubmitButtonIfLowestScore();
		muteButton.classList.add("hidden");
		unMuteButton.classList.add("hidden");
	}
}



function saveTheHighScore(submit) {

	submit.preventDefault();

	score = {
		score: score,
		name: playername.value
	};
	// اضافه کردن امتیاز جدید
	highScores.push(score);  
	highScores.sort((a, b) => b.score - a.score);
	highScores.splice(highScoresToShow);

	// تبدیل یک  شی به Json 
	sessionStorage.setItem("highScores", JSON.stringify(highScores));
	window.location.assign("index.html");
}



function endGameHighScores() {
	highScoresRetrieveAndSort();
	// پس از دریافت و مرتب سازی هر ریکورد را به یک تگ تبدیل می کنیم
	// با استفاده از تکنیک اینترپولیشن و بک تیک
	endGameHighScoresList.innerHTML = highScores
		.map(score => {
			return `<li class="high-score"><span>${score.score}</span>\t<span>${score.name}</span</li>`;
		})
		.join("");
}


// تابع گرفتن سوال جدید
getNewQuestion = () => {
	// قبل از نمایش سوال جدید چک شود تعدا کلی سوالات تمام نشده باشد
	maxQuestionsReached();
	// به روز رسانی تعداد سوالات جواب داده شده
	questionCounter++;

	//Updates the progress bar
	progressText.innerText = `Question ${questionCounter}/${SetQtyOfQuestions}`;

	progressBarFull.style.width = `${(questionCounter / SetQtyOfQuestions) * 100}%`;
	if (availableQuestions.length === 0 || questionCounter >= SetQtyOfQuestions) {
		progressBarFull.classList.add("progress-bar-rounded");
	}

	//creates a random number between 1 and the qty of remaining questions and sets the current question to that question number
	const questionIndex = Math.floor(Math.random() * (qtyOfQuestionsToFetch - (questionCounter - 1)));
	newQuestion = availableQuestions[questionIndex];

	// adds current question to the Question section 
	question.innerHTML = newQuestion.question;

	// gets the correct answer information from the set of questions
	answers.forEach((answers) => {
		const number = answers.dataset.number;
		answers.innerHTML = newQuestion["answers" + number];
	});
	//removes the current question from the available questions list
	availableQuestions.splice(questionIndex, 1);
	acceptingAnswers = true;
};



answers.forEach((answers) => {
	answers.addEventListener("click", (e) => {
		if (!acceptingAnswers) return;

		acceptingAnswers = false;
		const answersSet = e.target;
		const userSelectedAnswer = answersSet.dataset.number;
		let correctAnswer = newQuestion.CorrectAnswer;
		// console.log("The Correct Answer was ",correctAnswer);

		//check if the user has selected the correct answer 
		const classToApply = userSelectedAnswer == correctAnswer ? "answered-correct" : "answered-incorrect";
		//if  answer correct increase the user score
		if (classToApply === "answered-correct") {
			incrementScore(pointsPerCorrectAnswer);
			soundCorrect.play();
		} else {
			soundIncorrect.play();
			switch(correctAnswer){
				case 1:
					actualAnswer = answerContainer1;
					break;
				case 2:
					actualAnswer = answerContainer2;
					break;
				case 3:
					actualAnswer = answerContainer3;
					break;
				default:
					actualAnswer = answerContainer4;
			}
			actualAnswer.classList.add("answer-was-actual-correct");
		}

		answersSet.parentElement.classList.add(classToApply);

		setTimeout(() => {
			answersSet.parentElement.classList.remove(classToApply);
			actualAnswer.classList.remove("answer-was-actual-correct");
			getNewQuestion();
		}, 1500);
	});		
});



incrementScore = (questionPointsValue) => {
	score += questionPointsValue;
	scoreText.innerText = score;
	playerFinalScore.innerText = `You scored ${score}`;


};



function showHighScoresScreen() {
	highScoresRetrieveAndSort();  //مرتب کردن نتایج بر اساس امتیاز جدید کاربر

	homeContainer.classList.add("hidden");
	highScoresContainer.classList.remove("hidden");

	highScoresList.innerHTML = highScores
		.map(score => {
			return `<li class="high-score"><span>${score.score}</span>\t<span>${score.name}</span</li>`;
		})
		.join("");
}