// js/main.js

// =============== SCROLL PROGRESS ===============
window.addEventListener("scroll", () => {
  const winScroll =
    document.body.scrollTop || document.documentElement.scrollTop;
  const height =
    document.documentElement.scrollHeight -
    document.documentElement.clientHeight;
  const scrolled = (winScroll / height) * 100;
  const progressBar = document.getElementById("progressBar");
  if (progressBar) progressBar.style.width = scrolled + "%";

  // Back to top button
  const backToTopBtn = document.getElementById("backToTop");
  if (backToTopBtn) {
    if (window.scrollY > 300) {
      backToTopBtn.classList.add("show");
    } else {
      backToTopBtn.classList.remove("show");
    }
  }
});

// =============== MOBILE NAV ===============
document.getElementById("hamburger")?.addEventListener("click", () => {
  document.querySelector(".nav-links").classList.toggle("active");
});

// =============== THEME TOGGLE (URL-BASED, NO localStorage) ===============
function getThemeFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("theme");
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

  // Clear existing
  toggle.innerHTML = "";

  // Add single icon
  const icon = document.createElement("i");
  icon.className = isDark ? "fas fa-sun" : "fas fa-moon";
  toggle.appendChild(icon);
}

// Apply theme on load
const urlTheme = getThemeFromURL();
const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
const finalTheme = urlTheme || (systemDark && !urlTheme ? "dark" : "light");
applyTheme(finalTheme);

// Toggle theme
document.getElementById("themeToggle")?.addEventListener("click", () => {
  const current =
    getThemeFromURL() || (systemDark && !urlTheme ? "dark" : "light");
  const newTheme = current === "dark" ? "light" : "dark";
  setThemeInURL(newTheme);
  applyTheme(newTheme);
});

// =============== AUTO-LINK THEME PRESERVATION ===============
document.querySelectorAll("a[href]").forEach((link) => {
  if (
    link.hostname === window.location.hostname &&
    !link.classList.contains("no-theme")
  ) {
    link.addEventListener("click", function (e) {
      const currentTheme = getThemeFromURL();
      if (currentTheme === "dark") {
        const url = new URL(this.href);
        url.searchParams.set("theme", "dark");
        this.href = url.toString();
      }
    });
  }
});

// =============== CERTIFICATE RENDERING (Home Page) ===============
const homeContainer = document.querySelector(".certificates-grid");
if (homeContainer && typeof certificates !== "undefined") {
  certificates.slice(0, 4).forEach((cert) => {
    const card = createCertCard(cert);
    homeContainer.appendChild(card);
  });
}

// =============== CERTIFICATE FILTERING (Certificates Page) ===============
const certContainer = document.getElementById("certContainer");
if (certContainer && typeof certificates !== "undefined") {
  renderCertificates("all");

  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document
        .querySelectorAll(".filter-btn")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const category = btn.dataset.category;
      renderCertificates(category);
    });
  });
}

function renderCertificates(category) {
  certContainer.innerHTML = "";
  const filtered =
    category === "all"
      ? certificates
      : certificates.filter((c) => c.category === category);

  if (filtered.length === 0) {
    certContainer.innerHTML = `<p style="text-align:center; padding:2rem; color:var(--text-light)">No certificates found.</p>`;
    return;
  }

  filtered.forEach((cert) => {
    const card = createCertCard(cert);
    certContainer.appendChild(card);
  });
}

function createCertCard(cert) {
  const card = document.createElement("div");
  card.className = "cert-card";
  const skillsHtml = cert.skills
    .map((skill) => `<span class="skill-tag">${skill}</span>`)
    .join("");

  const ratingHtml =
    cert.rating || cert.enrolled
      ? `<div style="margin:10px 0;color:var(--text-light);">
        ${cert.rating ? `<span>⭐ ${cert.rating}</span>` : ""}
        ${cert.enrolled ? `<span> | 📚 ${cert.enrolled} enrolled</span>` : ""}
       </div>`
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
      ${ratingHtml}
      <div class="skills">${skillsHtml}</div>
      <div class="actions">
        <a href="${cert.pdf}" download class="btn btn-download">Download</a>
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
  navigator.clipboard.writeText(url).then(() => {
    alert("Certificate link copied to clipboard!");
  });
}

// =============== BACK TO TOP ===============
document.getElementById("backToTop")?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});
