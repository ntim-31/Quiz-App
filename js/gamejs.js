const question = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName("choice-text"));

const progressText = document.getElementById("progressText");
const progressBarFull = document.getElementById("progressBarFull");
const scoreText = document.getElementById("score");

let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];

let questions = [];

fetch("json/questions.json")
	.then((res) => {
		return res.json();
	})
	.then((loadedQuestions) => {
		questions = loadedQuestions;
		startGame();
	})
	.catch((err) => {
		console.log(err);
	});

const CORRECT_BONUS = 10;
const MAX_QUESTION = 3;

startGame = () => {
	questionCounter = 0;
	score = 0;
	availableQuestions = [...questions];
	getNewQuestion();
};

getNewQuestion = () => {
	localStorage.setItem("mostRecentScore", score);
	if (availableQuestions.length === 0 || questionCounter > MAX_QUESTION) {
		return window.location.assign("/end.html");
	}
	questionCounter++;
	progressText.innerText = `Question: ${questionCounter}/${MAX_QUESTION}`;
	progressBarFull.style.width = `${(questionCounter / MAX_QUESTION) * 100}%`;
	const questionIndex = Math.floor(Math.random() * availableQuestions.length);
	currentQuestion = availableQuestions[questionIndex];
	question.innerText = currentQuestion.question;
	choices.forEach((choice) => {
		const number = choice.dataset["number"];
		choice.innerText = currentQuestion["choice" + number];
	});

	availableQuestions.splice(questionIndex, 1);
	acceptingAnswers = true;
};

choices.forEach((choice) => {
	choice.addEventListener("click", (e) => {
		if (!acceptingAnswers) return;
		acceptingAnswers = false;
		const selectedChoice = e.target;
		const selectedAnswer = selectedChoice.dataset["number"];

		const classToApply =
			selectedAnswer == currentQuestion.answer ? "correct" : "incorrect";

		if (classToApply === "correct") incrementScore(CORRECT_BONUS);
		selectedChoice.parentElement.classList.add(classToApply);
		setTimeout(() => {
			selectedChoice.parentElement.classList.remove(classToApply);
			getNewQuestion();
		}, 1000);
	});
});

incrementScore = (num) => {
	score += num;
	scoreText.innerText = score;
};
