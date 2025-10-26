// js/contact.js
document
  .getElementById("contactForm")
  ?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const form = e.target;
    const button = form.querySelector('button[type="submit"]');
    const originalText = button.textContent;

    // Disable & show loading
    button.disabled = true;
    button.textContent = "Sending...";

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: {
          Accept: "application/json",
        },
      });

      if (response.ok) {
        alert("Message sent successfully!");
        form.reset();
      } else {
        const error = await response.json();
        alert(`Error: ${error.error || "Something went wrong"}`);
      }
    } catch (err) {
      alert("Failed to send. Check your internet or Formspree setup.");
    } finally {
      button.disabled = false;
      button.textContent = originalText;
    }
  });
