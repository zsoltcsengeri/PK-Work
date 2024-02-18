const switchBTN = document.querySelector(".switch-input-js")
switchBTN.addEventListener("click", function(event){
  document.querySelector("body").classList.toggle("dark-mode");
  document.querySelector(".container").classList.toggle("dark-mode");
  console.log(event.target.value);
});
