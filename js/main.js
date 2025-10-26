// js/main.js

// =============== SCROLL PROGRESS + BACK TO TOP ===============
window.addEventListener("scroll", () => {
  const winScroll =
    document.body.scrollTop || document.documentElement.scrollTop;
  const height =
    document.documentElement.scrollHeight -
    document.documentElement.clientHeight;
  const scrolled = (winScroll / height) * 100;
  const progressBar = document.getElementById("progressBar");
  if (progressBar) progressBar.style.width = scrolled + "%";

  const backToTopBtn = document.getElementById("backToTop");
  if (backToTopBtn) {
    backToTopBtn.classList.toggle("show", window.scrollY > 300);
  }
});

// =============== MOBILE NAV ===============
document.getElementById("hamburger")?.addEventListener("click", () => {
  document.querySelector(".nav-links")?.classList.toggle("active");
});

// =============== THEME SYSTEM (URL-BASED, NO localStorage) ===============
function getThemeFromURL() {
  return new URLSearchParams(window.location.search).get("theme");
}

function setThemeInURL(theme) {
  const url = new URL(window.location);
  if (theme === "dark") {
    url.searchParams.set("theme", "dark");
  } else {
    url.searchParams.delete("theme");
  }
  window.history.replaceState({}, "", url);
}

function applyTheme(theme) {
  const isDark = theme === "dark";
  document.body.setAttribute("data-theme", isDark ? "dark" : "light");
  updateThemeIcon(isDark);
}

function updateThemeIcon(isDark) {
  const toggle = document.getElementById("themeToggle");
  if (!toggle) return;

  toggle.innerHTML = "";
  const icon = document.createElement("i");
  icon.className = isDark ? "fas fa-sun" : "fas fa-moon";
  toggle.appendChild(icon);
}

// Initialize theme on load
(() => {
  const urlTheme = getThemeFromURL();
  const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const finalTheme = urlTheme || (systemDark && !urlTheme ? "dark" : "light");
  applyTheme(finalTheme);
})();

// Toggle theme on click (works every time)
document.addEventListener("click", (e) => {
  if (e.target.closest("#themeToggle")) {
    const current =
      getThemeFromURL() ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches &&
      !getThemeFromURL()
        ? "dark"
        : "light");
    const newTheme = current === "dark" ? "light" : "dark";
    setThemeInURL(newTheme);
    applyTheme(newTheme);
  }
});

// Preserve theme in internal links
document.querySelectorAll("a[href]").forEach((link) => {
  if (
    link.hostname === window.location.hostname &&
    !link.classList.contains("no-theme")
  ) {
    link.addEventListener("click", function () {
      const theme = getThemeFromURL();
      if (theme === "dark") {
        const url = new URL(this.href);
        url.searchParams.set("theme", "dark");
        this.href = url.toString();
      }
    });
  }
});

// =============== CREATE CERTIFICATE CARD ===============
function createCertCard(cert) {
  const card = document.createElement("div");
  card.className = "cert-card";

  const skillsHtml = cert.skills
    .map((s) => `<span class="skill-tag">${s}</span>`)
    .join("");

  // Verify button (only if verifyUrl exists)
  const verifyBtn = cert.verifyUrl
    ? `<a href="${cert.verifyUrl}" target="_blank" class="btn btn-verify">Verify</a>`
    : "";

  card.innerHTML = `
    <div class="cert-info">
      <h2 class="cert-title">${cert.title}</h2>
      <div class="issuer">${cert.issuer}</div>
      <div class="platform">${cert.platform}</div>
      <div class="date">Completed on ${cert.date}</div>
      ${
        cert.hours
          ? `<div class="hours">${cert.hours} (approximately)</div>`
          : ""
      }
      ${cert.verified ? `<div class="verified-badge">Verified</div>` : ""}
      <div class="skills">${skillsHtml}</div>
      <div class="actions">
        <a href="${cert.pdf}" download class="btn btn-download">Download</a>
        ${verifyBtn}
        <button class="btn btn-share" onclick="shareCert('${
          cert.id
        }')">Share</button>
      </div>
    </div>
    <div class="cert-preview">
      <img src="${cert.image}" alt="${cert.title} Certificate">
    </div>
  `;
  return card;
}

// =============== SHARE FUNCTION ===============
function shareCert(id) {
  const url = `${window.location.origin}${window.location.pathname}?theme=${
    getThemeFromURL() || "light"
  }#${id}`;
  navigator.clipboard
    .writeText(url)
    .then(() => alert("Link copied to clipboard!"))
    .catch(() => prompt("Copy this link:", url));
}

// =============== HOME PAGE (Preview) ===============
const homeGrid = document.querySelector(".certificates-grid");
if (homeGrid && typeof certificates !== "undefined") {
  certificates.slice(0, 4).forEach((cert) => {
    homeGrid.appendChild(createCertCard(cert));
  });
}

// =============== CERTIFICATES PAGE (Filterable) ===============
const certContainer = document.getElementById("certContainer");
if (certContainer && typeof certificates !== "undefined") {
  function render(category) {
    certContainer.innerHTML = "";
    const list =
      category === "all"
        ? certificates
        : certificates.filter((c) => c.category === category);

    if (list.length === 0) {
      certContainer.innerHTML = `<p style="text-align:center;padding:2rem;color:var(--text-light)">No certificates found.</p>`;
      return;
    }
    list.forEach((cert) => certContainer.appendChild(createCertCard(cert)));
  }

  render("all");

  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document
        .querySelectorAll(".filter-btn")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      render(btn.dataset.category);
    });
  });
}

// =============== BACK TO TOP CLICK ===============
document.getElementById("backToTop")?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});
