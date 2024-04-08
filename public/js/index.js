const backBtn = document.querySelector(".nav-single button");

function goBack() {
    history.back();
}
backBtn.addEventListener("click", goBack);

