// js/main.js

// =============== UTILS ===============
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

  // Clear all children
  toggle.innerHTML = "";

  // Add single icon
  const icon = document.createElement("i");
  icon.className = isDark ? "fas fa-sun" : "fas fa-moon";
  toggle.appendChild(icon);
}

// =============== INIT THEME ON EVERY PAGE LOAD ===============
(function initTheme() {
  const urlTheme = getThemeFromURL();
  const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const finalTheme = urlTheme || (systemDark && !urlTheme ? "dark" : "light");
  applyTheme(finalTheme);
})();

// =============== TOGGLE THEME (WORKS EVERY TIME) ===============
document.addEventListener("click", function (e) {
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

// =============== AUTO-CARRY THEME IN ALL INTERNAL LINKS ===============
(function preserveThemeInLinks() {
  const currentTheme = getThemeFromURL();
  if (!currentTheme) return;

  document.querySelectorAll("a[href]").forEach((link) => {
    if (
      link.hostname === window.location.hostname &&
      !link.classList.contains("no-theme") &&
      !link.href.includes("?theme=")
    ) {
      const url = new URL(link.href);
      url.searchParams.set("theme", currentTheme);
      link.href = url.toString();
    }
  });
})();

// =============== SCROLL + BACK TO TOP ===============
window.addEventListener("scroll", () => {
  const h = document.documentElement,
    b = document.body,
    st = "scrollTop",
    sh = "scrollHeight";
  const percent =
    ((h[st] || b[st]) / ((h[sh] || b[sh]) - h.clientHeight)) * 100;
  const bar = document.getElementById("progressBar");
  if (bar) bar.style.width = percent + "%";

  const btn = document.getElementById("backToTop");
  if (btn) btn.classList.toggle("show", window.scrollY > 300);
});

document.getElementById("backToTop")?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// =============== MOBILE MENU ===============
document.getElementById("hamburger")?.addEventListener("click", () => {
  document.querySelector(".nav-links")?.classList.toggle("active");
});

// =============== CERT CARD RENDERING ===============
function createCertCard(cert) {
  const card = document.createElement("div");
  card.className = "cert-card";

  const skillsHtml = cert.skills
    .map((s) => `<span class="skill-tag">${s}</span>`)
    .join("");

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
      ${cert.verified ? `<div class="verified-badge">✅ Verified</div>` : ""}
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

function shareCert(id) {
  const url = `${window.location.origin}${window.location.pathname}?theme=${
    getThemeFromURL() || "light"
  }#${id}`;
  navigator.clipboard
    .writeText(url)
    .then(() => alert("Link copied!"))
    .catch(() => prompt("Copy this link:", url));
}

// =============== HOME PAGE ===============
const homeGrid = document.querySelector(".certificates-grid");
if (homeGrid && typeof certificates !== "undefined") {
  certificates
    .slice(0, 4)
    .forEach((cert) => homeGrid.appendChild(createCertCard(cert)));
}

// =============== CERTIFICATES PAGE ===============
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
