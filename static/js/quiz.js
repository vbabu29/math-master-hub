(function () {
  const quizzes = document.querySelectorAll(".quiz");
  if (!quizzes.length) return;

  quizzes.forEach((quiz) => {
    const questions = quiz.querySelectorAll(".quiz-question");
    if (!questions.length) return;

    const totalQuestions = questions.length;
    let currentQuestionIndex = 0;
    let score = 0;
    let totalSteps = 0;

    const progressBar = quiz.querySelector(".quiz-progress-bar");
    const progressText = quiz.querySelector(".quiz-progress-text");
    const summary = quiz.querySelector(".quiz-summary");

    function updateProgress() {
      const pct = ((currentQuestionIndex + 1) / totalQuestions) * 100;
      if (progressBar) progressBar.style.width = `${pct}%`;
      if (progressText) {
        progressText.textContent = `Question ${
          currentQuestionIndex + 1
        } of ${totalQuestions}`;
      }
    }

    function showQuestion(index) {
      questions.forEach((q, i) => {
        q.style.display = i === index ? "block" : "none";
      });
      currentQuestionIndex = index;
      updateProgress();
    }

    questions.forEach((question, questionIndex) => {
      const steps = question.querySelectorAll(".quiz-step");
      if (!steps.length) return;

      totalSteps += steps.length;

      const nextQuestionBtn = question.querySelector(".quiz-next-question");
      let answeredSteps = 0;

      steps.forEach((step) => {
        const options = step.querySelectorAll(".quiz-option");
        const feedback = step.querySelector(".quiz-feedback");
        let answered = false;

        options.forEach((option) => {
          option.addEventListener("click", () => {
            if (answered) return;
            answered = true;

            // mark all options and highlight the correct one
            options.forEach((opt) => {
              opt.classList.add("quiz-option-disabled");
              if (opt.dataset.correct === "true") {
                opt.classList.add("quiz-option-correct");
              }
            });

            if (option.dataset.correct === "true") {
              score += 1;
              if (feedback) {
                feedback.textContent = "Nice work — that's correct!";
                feedback.classList.remove("quiz-feedback-wrong");
                feedback.classList.add("quiz-feedback-correct");
              }
            } else {
              option.classList.add("quiz-option-wrong");
              if (feedback) {
                feedback.textContent =
                  "Not quite. The correct answer is highlighted in green.";
                feedback.classList.remove("quiz-feedback-correct");
                feedback.classList.add("quiz-feedback-wrong");
              }
            }

            answeredSteps += 1;
            if (nextQuestionBtn && answeredSteps === steps.length) {
              nextQuestionBtn.disabled = false;
              nextQuestionBtn.classList.add("is-active");
            }
          });
        });
      });

      if (nextQuestionBtn) {
        nextQuestionBtn.addEventListener("click", () => {
          const nextQuestionIndex = questionIndex + 1;
          if (nextQuestionIndex < totalQuestions) {
            showQuestion(nextQuestionIndex);
          } else {
            // finished the entire set
            questions.forEach((q) => {
              q.style.display = "none";
            });

            if (summary) {
              summary.style.display = "block";
              const totalForDisplay = totalSteps || score;
              summary.innerHTML = `
                <h3 class="quiz-summary-title">You're done!</h3>
                <p class="quiz-summary-score">Score: ${score} / ${totalForDisplay}</p>
                <button type="button" class="quiz-restart">Try another set</button>
              `;

              const restart = summary.querySelector(".quiz-restart");
              if (restart) {
                restart.addEventListener("click", () => {
                  window.location.reload();
                });
              }
            }
          }
        });
      }
    });

    showQuestion(0);
  });
})();