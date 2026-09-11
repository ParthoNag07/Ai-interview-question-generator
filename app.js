
const roleInput = document.getElementById("roleInput");
const questionsContainer = document.getElementById("questions");
const emptyState = document.getElementById("emptyState");
const questionCount = document.getElementById("questionCount");
const copyAllBtn = document.getElementById("copyAllBtn");
const toast = document.getElementById("toast");

let currentQuestions = [];

const templates = [
  "What are the key responsibilities of a ${role}?",
  "What technical and soft skills are required to become a successful ${role}?",
  "Walk me through a challenging project you worked on as a ${role}.",
  "How do you stay updated with the latest trends and technologies in ${role}?",
  "What tools and technologies do you use most often as a ${role}?",
  "How do you approach problem-solving when working as a ${role}?",
  "Describe your typical workflow when working as a ${role}.",
  "What are the most common mistakes beginners make in ${role}?",
  "How would you improve the performance of a ${role} project?",
  "Why should we hire you as a ${role}?"
];

function useRole(role) {
  roleInput.value = role;
  roleInput.focus();
}

function showToast(message = "Question copied to clipboard") {
  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
}

function copyText(text) {
  navigator.clipboard.writeText(text)
    .then(() => showToast())
    .catch(() => {
      showToast("Copy unavailable — select the text manually");
    });
}

function generateQuestions() {
  const role = roleInput.value.trim();

  if (!role) {
    roleInput.classList.add("error");
    roleInput.focus();

    showToast("Please enter a job role first");

    setTimeout(() => {
      roleInput.classList.remove("error");
    }, 1000);

    return;
  }

  currentQuestions = templates.map(template =>
    template.replaceAll("${role}", role)
  );

  questionsContainer.innerHTML = "";

  currentQuestions.forEach((question, index) => {
    const card = document.createElement("article");

    card.className = "question-card";

    card.innerHTML = `
      <div class="question-top">
        <span class="question-number">
          ${String(index + 1).padStart(2, "0")}
        </span>

        <button class="mini-copy" aria-label="Copy question">
          Copy ↗
        </button>
      </div>

      <p>${question}</p>

      <div class="question-footer">
        <span>Practice prompt</span>
        <span>○</span>
      </div>
    `;

    card.querySelector(".mini-copy").addEventListener("click", event => {
      event.stopPropagation();
      copyText(question);
    });

    card.addEventListener("click", () => {
      copyText(question);
    });

    questionsContainer.appendChild(card);
  });

  emptyState.style.display = "none";
  questionCount.textContent = currentQuestions.length;
  copyAllBtn.disabled = false;

  document.querySelector(".results-section").scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}

function copyAllQuestions() {
  if (!currentQuestions.length) return;

  const allQuestions = currentQuestions
    .map((question, index) => `${index + 1}. ${question}`)
    .join("\n");

  copyText(allQuestions);
  showToast("All questions copied");
}

roleInput.addEventListener("keydown", event => {
  if (event.key === "Enter") {
    generateQuestions();
  }
});