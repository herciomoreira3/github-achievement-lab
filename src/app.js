(function () {
  const texts = window.TYPE_RACE_TEXTS || [];
  const storage = window.TypeRaceStorage;

  const state = {
    status: "idle",
    targetText: "",
    typedText: "",
    duration: 60,
    timeLeft: 60,
    startedAt: null,
    elapsedSeconds: 0,
    timerId: null,
    correctCount: 0,
    incorrectCount: 0,
    wpm: 0,
    accuracy: 100,
    progress: 0,
    highScore: null,
    lastTextIndex: -1
  };

  const elements = {};

  document.addEventListener("DOMContentLoaded", initApp);

  function initApp() {
    bindElements();
    state.highScore = storage.loadHighScore();
    state.targetText = selectRandomText();
    renderTargetText();
    renderStats();
    renderHighScore();
    setGameStatus("idle");

    elements.startButton.addEventListener("click", startGame);
    elements.restartButton.addEventListener("click", restartGame);
    elements.durationSelect.addEventListener("change", handleDurationChange);
    elements.typingInput.addEventListener("input", handleTypingInput);
    elements.typingInput.addEventListener("paste", preventPaste);
  }

  function bindElements() {
    elements.timeValue = document.getElementById("timeValue");
    elements.wpmValue = document.getElementById("wpmValue");
    elements.accuracyValue = document.getElementById("accuracyValue");
    elements.progressValue = document.getElementById("progressValue");
    elements.progressBar = document.getElementById("progressBar");
    elements.promptDisplay = document.getElementById("promptDisplay");
    elements.typingInput = document.getElementById("typingInput");
    elements.durationSelect = document.getElementById("durationSelect");
    elements.startButton = document.getElementById("startButton");
    elements.restartButton = document.getElementById("restartButton");
    elements.resultPanel = document.getElementById("resultPanel");
    elements.resultMessage = document.getElementById("resultMessage");
    elements.resultWpm = document.getElementById("resultWpm");
    elements.resultAccuracy = document.getElementById("resultAccuracy");
    elements.resultCorrect = document.getElementById("resultCorrect");
    elements.resultIncorrect = document.getElementById("resultIncorrect");
    elements.resultTotal = document.getElementById("resultTotal");
    elements.resultDuration = document.getElementById("resultDuration");
    elements.highScoreText = document.getElementById("highScoreText");
  }

  function handleDurationChange() {
    if (state.status === "running") {
      elements.durationSelect.value = String(state.duration);
      return;
    }

    state.duration = Number(elements.durationSelect.value);
    state.timeLeft = state.duration;
    renderStats();
  }

  function selectRandomText() {
    if (texts.length === 0) {
      return "Type Race needs at least one prompt before the game can begin.";
    }

    if (texts.length === 1) {
      state.lastTextIndex = 0;
      return texts[0];
    }

    let nextIndex = Math.floor(Math.random() * texts.length);
    while (nextIndex === state.lastTextIndex) {
      nextIndex = Math.floor(Math.random() * texts.length);
    }

    state.lastTextIndex = nextIndex;
    return texts[nextIndex];
  }

  function startGame() {
    if (state.status === "running") {
      return;
    }

    resetRace();
    setGameStatus("running");
    state.startedAt = Date.now();
    state.timerId = window.setInterval(tickTimer, 200);
    elements.typingInput.focus();
  }

  function restartGame() {
    clearTimer();
    resetRace();
    setGameStatus("running");
    state.startedAt = Date.now();
    state.timerId = window.setInterval(tickTimer, 200);
    elements.typingInput.focus();
  }

  function resetRace() {
    state.targetText = selectRandomText();
    state.typedText = "";
    state.duration = Number(elements.durationSelect.value);
    state.timeLeft = state.duration;
    state.startedAt = null;
    state.elapsedSeconds = 0;
    state.correctCount = 0;
    state.incorrectCount = 0;
    state.wpm = 0;
    state.accuracy = 100;
    state.progress = 0;
    elements.typingInput.value = "";
    elements.resultPanel.hidden = true;
    renderTargetText();
    renderStats();
  }

  function tickTimer() {
    if (state.status !== "running") {
      return;
    }

    const elapsedSeconds = (Date.now() - state.startedAt) / 1000;
    state.elapsedSeconds = Math.min(elapsedSeconds, state.duration);
    state.timeLeft = Math.max(0, Math.ceil(state.duration - elapsedSeconds));
    updateStats();

    if (state.timeLeft <= 0) {
      finishGame("time");
    }
  }

  function handleTypingInput(event) {
    if (state.status !== "running") {
      event.target.value = state.typedText;
      return;
    }

    state.typedText = event.target.value.slice(0, state.targetText.length);
    if (event.target.value !== state.typedText) {
      event.target.value = state.typedText;
    }

    updateStats();
    renderTargetText();

    if (state.typedText.length >= state.targetText.length) {
      finishGame("complete");
    }
  }

  function preventPaste(event) {
    if (state.status === "running") {
      event.preventDefault();
    }
  }

  function updateStats() {
    state.correctCount = calculateCorrectCount(state.targetText, state.typedText);
    state.incorrectCount = calculateIncorrectCount(state.targetText, state.typedText);
    state.wpm = calculateWpm(state.correctCount, state.elapsedSeconds);
    state.accuracy = calculateAccuracy(state.correctCount, state.typedText.length);
    state.progress = calculateProgress(state.typedText.length, state.targetText.length);
    renderStats();
  }

  function calculateCorrectCount(targetText, typedText) {
    let count = 0;
    for (let index = 0; index < typedText.length && index < targetText.length; index += 1) {
      if (typedText[index] === targetText[index]) {
        count += 1;
      }
    }
    return count;
  }

  function calculateIncorrectCount(targetText, typedText) {
    let count = 0;
    for (let index = 0; index < typedText.length && index < targetText.length; index += 1) {
      if (typedText[index] !== targetText[index]) {
        count += 1;
      }
    }
    return count;
  }

  function calculateWpm(correctCount, elapsedSeconds) {
    if (elapsedSeconds <= 0) {
      return 0;
    }

    return Math.round((correctCount / 5) / (elapsedSeconds / 60));
  }

  function calculateAccuracy(correctCount, typedLength) {
    if (typedLength === 0) {
      return 100;
    }

    return Math.round((correctCount / typedLength) * 100);
  }

  function calculateProgress(typedLength, targetLength) {
    if (targetLength === 0) {
      return 0;
    }

    return Math.min(100, Math.round((typedLength / targetLength) * 100));
  }

  function finishGame(reason) {
    if (state.status !== "running") {
      return;
    }

    clearTimer();
    if (reason === "time") {
      state.timeLeft = 0;
      state.elapsedSeconds = state.duration;
    } else {
      state.elapsedSeconds = Math.max(0.1, (Date.now() - state.startedAt) / 1000);
    }

    updateStats();
    setGameStatus("finished");

    const score = {
      wpm: state.wpm,
      accuracy: state.accuracy,
      duration: state.duration,
      date: new Date().toISOString()
    };

    const hasNewHighScore = storage.isNewHighScore(score, state.highScore);
    if (hasNewHighScore) {
      storage.saveHighScore(score);
      state.highScore = score;
      renderHighScore();
    }

    renderResult(hasNewHighScore);
  }

  function clearTimer() {
    if (state.timerId) {
      window.clearInterval(state.timerId);
      state.timerId = null;
    }
  }

  function renderTargetText() {
    const fragment = document.createDocumentFragment();
    const currentIndex = state.typedText.length;

    for (let index = 0; index < state.targetText.length; index += 1) {
      const span = document.createElement("span");
      span.className = "char";
      span.textContent = state.targetText[index];

      if (index < state.typedText.length) {
        span.classList.add(state.typedText[index] === state.targetText[index] ? "correct" : "incorrect");
      } else if (state.status === "running" && index === currentIndex) {
        span.classList.add("current");
      }

      fragment.appendChild(span);
    }

    elements.promptDisplay.replaceChildren(fragment);
  }

  function renderStats() {
    elements.timeValue.textContent = `${state.timeLeft}s`;
    elements.wpmValue.textContent = String(state.wpm);
    elements.accuracyValue.textContent = `${state.accuracy}%`;
    elements.progressValue.textContent = `${state.progress}%`;
    elements.progressBar.style.width = `${state.progress}%`;
  }

  function renderHighScore() {
    if (!state.highScore) {
      elements.highScoreText.textContent = "No score yet";
      return;
    }

    elements.highScoreText.textContent = `${state.highScore.wpm} WPM at ${state.highScore.accuracy}% accuracy`;
  }

  function renderResult(hasNewHighScore) {
    elements.resultMessage.textContent = hasNewHighScore ? "New high score!" : "Review your result below.";
    elements.resultWpm.textContent = String(state.wpm);
    elements.resultAccuracy.textContent = `${state.accuracy}%`;
    elements.resultCorrect.textContent = String(state.correctCount);
    elements.resultIncorrect.textContent = String(state.incorrectCount);
    elements.resultTotal.textContent = String(state.typedText.length);
    elements.resultDuration.textContent = `${state.duration}s`;
    elements.resultPanel.hidden = false;
  }

  function setGameStatus(status) {
    state.status = status;

    if (status === "idle") {
      elements.typingInput.disabled = true;
      elements.startButton.disabled = false;
      elements.restartButton.disabled = false;
      elements.durationSelect.disabled = false;
      elements.typingInput.placeholder = "Press Start to begin";
    }

    if (status === "running") {
      elements.typingInput.disabled = false;
      elements.startButton.disabled = true;
      elements.restartButton.disabled = false;
      elements.durationSelect.disabled = true;
      elements.typingInput.placeholder = "Start typing the prompt";
    }

    if (status === "finished") {
      elements.typingInput.disabled = true;
      elements.startButton.disabled = false;
      elements.restartButton.disabled = false;
      elements.durationSelect.disabled = false;
      elements.typingInput.placeholder = "Race complete";
    }

    renderTargetText();
  }
})();
