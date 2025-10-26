// js/main.js

// =============== THEME TOGGLE (LIKE YOUR OLD PROJECT) ===============
const themeToggle = document.getElementById("themeToggle");
const icon = themeToggle?.querySelector("i");

if (themeToggle) {
  // On Load: Restore saved theme
  const savedTheme = localStorage.getItem("theme") || "light";
  document.body.setAttribute(
    "data-theme",
    savedTheme === "dark" ? "dark" : "light"
  );
  updateThemeIcon(savedTheme === "dark");

  // Toggle
  themeToggle.addEventListener("click", () => {
    const isDark = document.body.getAttribute("data-theme") === "dark";
    const newTheme = isDark ? "light" : "dark";

    document.body.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    updateThemeIcon(newTheme === "dark");
  });
}

function updateThemeIcon(isDark) {
  if (!icon) return;
  icon.className = isDark ? "fas fa-sun" : "fas fa-moon";
}

// =============== OTHER FEATURES (Scroll, Mobile Nav, etc.) ===============
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

document.getElementById("hamburger")?.addEventListener("click", () => {
  document.querySelector(".nav-links")?.classList.toggle("active");
});

// =============== CERT CARD ===============
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
      ${cert.verified ? `<div class="verified-badge">Verified</div>` : ""}
      <div class="skills">${skillsHtml}</div>
      <div class="actions">
        <a href="${
          cert.pdf
        }" target="_blank" download class="btn btn-download">Download</a>
        ${verifyBtn}
      </div>
    </div>
    <div class="cert-preview">
      <img src="${cert.image}" alt="${cert.title} Certificate">
    </div>
  `;
  return card;
}

function shareCert(id) {
  const url = `${window.location.origin}${window.location.pathname}#${id}`;
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
