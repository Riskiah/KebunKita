// js/main.js
document.addEventListener("DOMContentLoaded", () => {
  // 1. Injeksi URL Eksternal (DIBUAT AMAN DARI ERROR)
  if (typeof KETAPANG_CONFIG !== "undefined") {
    document.querySelectorAll(".link-gform").forEach((el) => {
      if (KETAPANG_CONFIG.googleFormUrl)
        el.href = KETAPANG_CONFIG.googleFormUrl;
    });
    document.querySelectorAll(".link-dashboard").forEach((el) => {
      if (KETAPANG_CONFIG.budikdalonDashboardUrl)
        el.href = KETAPANG_CONFIG.budikdalonDashboardUrl;
    });
  }

  // 2. Dark/Light Mode Toggle
  const themeToggle = document.getElementById("theme-toggle");
  const currentTheme = localStorage.getItem("theme") || "light";
  document.documentElement.setAttribute("data-theme", currentTheme);

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      let theme = document.documentElement.getAttribute("data-theme");
      let newTheme = theme === "light" ? "dark" : "light";
      document.documentElement.setAttribute("data-theme", newTheme);
      localStorage.setItem("theme", newTheme);
    });
  }

  // 3. Mobile Menu Toggle
  const menuToggle = document.getElementById("menu-toggle");
  const navLinks = document.querySelector(".nav-links");
  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      navLinks.classList.toggle("active");
    });
  }

  // 4. Filter & Pencarian
  const searchInput = document.getElementById("search-input");
  const filterBtns = document.querySelectorAll(".filter-btn");
  const articleCards = document.querySelectorAll(".article-card");

  function filterArticles() {
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : "";
    const activeFilter = document.querySelector(".filter-btn.active")
      ? document.querySelector(".filter-btn.active").dataset.filter
      : "all";

    articleCards.forEach((card) => {
      const title = card.dataset.title ? card.dataset.title.toLowerCase() : "";
      const category = card.dataset.category || "";
      const matchesSearch = title.includes(searchTerm);
      const matchesFilter = activeFilter === "all" || category === activeFilter;

      if (matchesSearch && matchesFilter) {
        card.style.display = "flex";
      } else {
        card.style.display = "none";
      }
    });
  }

  if (searchInput) searchInput.addEventListener("input", filterArticles);

  if (filterBtns) {
    filterBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        filterBtns.forEach((b) => b.classList.remove("active"));
        e.target.classList.add("active");
        filterArticles();
      });
    });
  }

  // =========================================
  // MODAL POSTER
  // =========================================

  const expandBtn = document.querySelector(".poster-expand-btn");
  const modal = document.getElementById("poster-modal");
  const modalImg = document.getElementById("modal-img");
  const closeModal = document.querySelector(".close-modal");

  if (expandBtn && modal && modalImg) {
    expandBtn.addEventListener("click", function () {
      const poster = document.querySelector(".poster-img");

      if (!poster) return;

      // Masukkan poster ke modal
      modalImg.src = poster.src;
      modalImg.alt = poster.alt;

      // Tampilkan modal
      modal.classList.add("active");

      // Hentikan scroll halaman
      document.body.style.overflow = "hidden";
    });
  }

  // Fungsi menutup
  function closePosterModal() {
    if (!modal) return;

    modal.classList.remove("active");

    document.body.style.overflow = "";
  }

  // Tombol X
  if (closeModal) {
    closeModal.addEventListener("click", closePosterModal);
  }

  // Klik area hitam
  if (modal) {
    modal.addEventListener("click", function (e) {
      if (e.target === modal) {
        closePosterModal();
      }
    });
  }

  // Tombol ESC
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modal && modal.classList.contains("active")) {
      closePosterModal();
    }
  });
  // 6. Tandai Selesai Dibaca
  const markReadBtn = document.getElementById("mark-read-btn");
  const articleId = document.body.dataset.articleId;

  if (markReadBtn && articleId) {
    const isRead = localStorage.getItem(`read_${articleId}`);
    if (isRead) {
      markReadBtn.textContent = "✓ Selesai Dibaca";
      markReadBtn.classList.add("read");
      markReadBtn.disabled = true;
    }

    markReadBtn.addEventListener("click", () => {
      localStorage.setItem(`read_${articleId}`, "true");
      markReadBtn.textContent = "✓ Selesai Dibaca";
      markReadBtn.classList.add("read");
      markReadBtn.disabled = true;
      alert("Hebat! Anda telah menyelesaikan materi ini.");
    });
  }

  // 7. Back to Top Button
  const backToTop = document.getElementById("back-to-top");
  if (backToTop) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 300) backToTop.style.display = "block";
      else backToTop.style.display = "none";
    });
    backToTop.addEventListener("click", () =>
      window.scrollTo({ top: 0, behavior: "smooth" }),
    );
  }
});

// 8. Efek Smooth Page Transition
const links = document.querySelectorAll("a");
links.forEach((link) => {
  link.addEventListener("click", function (e) {
    if (
      link.hostname === window.location.hostname &&
      link.target !== "_blank" &&
      !link.href.includes("#") &&
      !link.href.includes("javascript")
    ) {
      e.preventDefault();
      const targetUrl = link.href;
      document.body.classList.add("fade-out");
      setTimeout(() => {
        window.location.href = targetUrl;
      }, 400);
    }
  });
});

// 9. Flash Card Logic
const flashcards = document.querySelectorAll(".flashcard");
flashcards.forEach((card) => {
  card.addEventListener("click", () => {
    card.classList.toggle("flipped");
  });
});

// 10. Fungsi Logika Kuis
window.checkAnswer = function (button, isCorrect) {
  const questionBox = button.closest(".quiz-question-box");
  const allButtons = questionBox.querySelectorAll(".quiz-btn");
  const feedbackText = questionBox.querySelector(".quiz-feedback");

  allButtons.forEach((btn) => {
    btn.disabled = true;
    btn.style.cursor = "not-allowed";
    btn.style.opacity = "0.7";
  });

  if (isCorrect) {
    button.classList.add("correct");
    feedbackText.textContent = "✅ Tepat sekali! Jawaban kamu benar.";
    feedbackText.style.color = "#28a745";
  } else {
    button.classList.add("wrong");
    feedbackText.textContent =
      "❌ Kurang tepat. Coba ingat-ingat lagi materinya!";
    feedbackText.style.color = "#dc3545";

    allButtons.forEach((btn) => {
      if (btn.getAttribute("onclick").includes("true")) {
        btn.classList.add("correct");
      }
    });
  }
};
