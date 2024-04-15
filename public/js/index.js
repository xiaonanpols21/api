const backBtn = document.querySelector(".nav-single button");
const logo = document.querySelector("h1")

function goBack() {
    history.back();
}
backBtn.addEventListener("click", goBack);
