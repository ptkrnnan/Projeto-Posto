document.addEventListener("DOMContentLoaded", function () {
    const toggleButton = document.querySelector(".toggle-button");
    const sidebar = document.querySelector(".sidebar");
  
    toggleButton.addEventListener("click", function () {
      sidebar.classList.toggle("collapsed");
    });
  });