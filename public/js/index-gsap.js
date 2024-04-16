const form = document.querySelector(".like-form");

form.addEventListener("submit", function (e) {
    e.preventDefault();
    const likeStatus = e.submitter.getAttribute('name')
    console.log(likeStatus);
    // gsap on complete en dan submit
    const formData = new FormData(e.currentTarget)

    const likeObject = {
        id: e.submitter.dataset.id,
        name: e.submitter.dataset.name,
        profile_path:  e.submitter.dataset.profile_path
    }

    formData.append(likeStatus, JSON.stringify(likeObject));

    console.log(Array.from(formData))

    if (likeStatus === "like") {
        // Bron: https://gsap.com/community/forums/topic/7949-how-to-set-rotate-an-object-with-origin/
        gsap.to(".cards a", {
            rotate: 10,
            duration: 0.5,
            transformOrigin: "center bottom",
            onComplete: () => submitForm(formData)
        });
    } else {
        gsap.to(".cards a", {
            rotate: "-10deg",
            duration: 0.5,
            transformOrigin: "center bottom",
            onComplete: () => submitForm(formData)
        });
    }

    function submitForm(formData) {
        const page = formData.get('page')

        console.log({page})
        fetch('/choice', {method: 'POST', body: formData})
        .then((res) => {
            if (res.ok) {
                window.location = `/${parseInt(page) + 1}`
            }
        })
    }

})
