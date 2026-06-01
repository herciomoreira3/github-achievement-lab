(function () {
  const HIGH_SCORE_KEY = "type-race-high-score";

  function loadHighScore() {
    try {
      const rawScore = window.localStorage.getItem(HIGH_SCORE_KEY);
      if (!rawScore) {
        return null;
      }

      const score = JSON.parse(rawScore);
      if (!Number.isFinite(score.wpm) || !Number.isFinite(score.accuracy) || !Number.isFinite(score.duration)) {
        return null;
      }

      return {
        wpm: score.wpm,
        accuracy: score.accuracy,
        duration: score.duration,
        date: score.date || null
      };
    } catch (error) {
      return null;
    }
  }

  function saveHighScore(score) {
    window.localStorage.setItem(HIGH_SCORE_KEY, JSON.stringify(score));
  }

  function isNewHighScore(score, highScore) {
    if (!highScore) {
      return true;
    }

    if (score.wpm !== highScore.wpm) {
      return score.wpm > highScore.wpm;
    }

    if (score.accuracy !== highScore.accuracy) {
      return score.accuracy > highScore.accuracy;
    }

    return score.duration > highScore.duration;
  }

  window.TypeRaceStorage = {
    loadHighScore,
    saveHighScore,
    isNewHighScore
  };
})();
