// js/data.js
const certificates = [
  {
    id: "html-offline",
    title: "HTML & CSS Mastery",
    issuer: "Raj Computers Academy",
    category: "offline",
    platform: "Offline Training",
    date: "Jan 2024",
    hours: "40 hours",
    verified: true,
    skills: ["HTML5", "CSS3", "Responsive Design"],
    image: "assets/certs/html-offline.jpg",
    pdf: "assets/certs/html-offline.pdf"
    // No verifyUrl → Verify button won't show
  },
  {
    id: "coursera-emails",
    title: "Write Professional Emails in English",
    issuer: "Georgia Institute of Technology",
    category: "coursera",
    platform: "Coursera",
    date: "Oct 24, 2025",
    hours: "14 hours",
    verified: true,
    skills: ["Writing", "Communication", "Business Writing"],
    image: "assets/certs/coursera-emails.jpg",
    pdf: "assets/certs/coursera-emails.pdf",
    rating: "4.8",
    enrolled: "1M+",
    verifyUrl: "https://coursera.org/verify/ABC123XYZ" // 👈 Add this
  },
  {
    id: "udemy-js",
    title: "JavaScript - The Complete Guide",
    issuer: "Udemy",
    category: "udemy",
    platform: "Udemy",
    date: "Mar 2025",
    verified: true,
    skills: ["JavaScript", "DOM", "ES6"],
    image: "assets/certs/udemy-js.jpg",
    pdf: "assets/certs/udemy-js.pdf",
    verifyUrl: "https://www.udemy.com/certificate/UC-XXXXXX/" // 👈 Add this
  },
  {
    id: "hackathon-ai",
    title: "AI Hackathon Finalist",
    issuer: "TechNova 2025",
    category: "hackathons",
    platform: "Offline Event",
    date: "Jul 2025",
    verified: true,
    skills: ["Python", "AI", "Teamwork"],
    image: "assets/certs/hackathon-ai.jpg",
    pdf: "assets/certs/hackathon-ai.pdf"
  }
];