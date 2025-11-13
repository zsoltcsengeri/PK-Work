// Wait until the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");

  if (!form) {
    console.error("Contact form not found in the HTML!");
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault(); // stop page reload

    // Collect values from the form
    const formData = {
      name: e.target.name.value,
      email: e.target.email.value,
      phone: e.target.phone.value,
      website: e.target.website.value,
      message: e.target.message.value,
    };

    try {
      // Send data to FastAPI backend
      const response = await fetch("https://api.zsolt-csengeri.com/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Server error: " + response.statusText);
      }

      const data = await response.json();
      alert("✅ Message sent! ID: " + data.id);

      // Optional: reset the form after success
      form.reset();
    } catch (error) {
      console.error("Error:", error);
      alert("❌ Failed to send message. Please try again later.");
    }
  });
});
