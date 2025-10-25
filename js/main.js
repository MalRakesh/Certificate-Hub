// js/main.js

// Scroll Progress Bar
window.addEventListener("scroll", () => {
  const winScroll =
    document.body.scrollTop || document.documentElement.scrollTop;
  const height =
    document.documentElement.scrollHeight -
    document.documentElement.clientHeight;
  const scrolled = (winScroll / height) * 100;
  document.getElementById("progressBar").style.width = scrolled + "%";
});

// Mobile Nav Toggle
document.getElementById("hamburger").addEventListener("click", () => {
  document.querySelector(".nav-links").classList.toggle("active");
});

// Render Certificates
const container = document.querySelector(".certificates-grid");

certificates.forEach((cert) => {
  const card = document.createElement("div");
  card.className = "cert-card";

  const skillsHtml = cert.skills
    .map((skill) => `<span class="skill-tag">${skill}</span>`)
    .join("");

  card.innerHTML = `
    <div class="cert-info">
      <h2 class="cert-title">${cert.title}</h2>
      <div class="issuer">${cert.issuer}</div>
      <div class="platform">${cert.platform}</div>
      <div class="date">Completed on ${cert.date}</div>
      ${cert.hours ? `<div>${cert.hours} (approximately)</div>` : ""}
      ${cert.verified ? `<div class="verified-badge">✅ Verified</div>` : ""}
      
      ${
        cert.rating || cert.enrolled
          ? `
        <div style="margin: 10px 0; color: #555;">
          ${cert.rating ? `<span>⭐ ${cert.rating}</span>` : ""}
          ${cert.enrolled ? `<span> | 📚 ${cert.enrolled} enrolled</span>` : ""}
        </div>
      `
          : ""
      }
      
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

  container.appendChild(card);
});

// Share Function (copies link to clipboard)
function shareCert(id) {
  const url = `${window.location.origin}${window.location.pathname}#${id}`;
  navigator.clipboard.writeText(url).then(() => {
    alert("Certificate link copied to clipboard!");
  });
}


// Back to top
const backToTopBtn = document.getElementById("backToTop");

window.addEventListener("scroll", () => {
  if (window.scrollY > 300) {
    backToTopBtn.classList.add("show");
  } else {
    backToTopBtn.classList.remove("show");
  }
});

backToTopBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});


// js/main.js

function getThemeFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('theme') || null;
}

function setThemeInURL(theme) {
  const url = new URL(window.location);
  if (theme === 'light') {
    url.searchParams.delete('theme');
  } else {
    url.searchParams.set('theme', theme);
  }
  window.history.replaceState({}, '', url);
}

function applyTheme(theme) {
  if (theme === 'dark') {
    document.body.setAttribute('data-theme', 'dark');
  } else {
    document.body.removeAttribute('data-theme'); // light is default
  }
  // Update icon
  updateThemeIcon(theme);
}

function updateThemeIcon(theme) {
  const sun = document.querySelector('.fa-sun');
  const moon = document.querySelector('.fa-moon');
  if (!sun || !moon) return;
  if (theme === 'dark') {
    sun.style.opacity = '0.4';
    moon.style.opacity = '1';
  } else {
    sun.style.opacity = '1';
    moon.style.opacity = '0.4';
  }
}

// On page load
const urlTheme = getThemeFromURL();
const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

let finalTheme = 'light';
if (urlTheme) {
  finalTheme = urlTheme; // URL overrides system
} else if (systemPrefersDark) {
  finalTheme = 'dark';
}

applyTheme(finalTheme);

// Toggle button
document.getElementById('themeToggle')?.addEventListener('click', () => {
  const current = getThemeFromURL() || (systemPrefersDark && !urlTheme ? 'dark' : 'light');
  const newTheme = current === 'dark' ? 'light' : 'dark';
  setThemeInURL(newTheme);
  applyTheme(newTheme);
});


