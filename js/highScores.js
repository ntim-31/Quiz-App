const highScoresList = document.getElementById("highScoresList");
const highScores = JSON.parse(localStorage.getItem("highScores")) || [];

highScores.map((score) => {
	highScoresList.innerHTML += `<li class="high-score">${score.name} - ${score.score}</li>`;
});
