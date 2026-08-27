document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("recommendation-form");
  const recommendationList = document.getElementById("recommendation-list");

  // Popup confirmation function called only upon new form submission
  function showPopup() {
    alert("Thank you! Your recommendation has been submitted successfully.");
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const nameInput = document.getElementById("rec-name").value.trim();
    const textInput = document.getElementById("rec-text").value.trim();

    if (nameInput && textInput) {
      // Create new recommendation card element
      const newCard = document.createElement("div");
      newCard.classList.add("recommendation-card");

      const quote = document.createElement("p");
      quote.textContent = `"${textInput}"`;

      const author = document.createElement("span");
      author.textContent = `- ${nameInput}`;

      newCard.appendChild(quote);
      newCard.appendChild(author);

      // Append new recommendation to the list
      recommendationList.appendChild(newCard);

      // Trigger popup notification ONLY after new recommendation addition
      showPopup();

      // Reset form input fields
      form.reset();
    }
  });
});