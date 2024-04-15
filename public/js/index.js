const backBtn = document.querySelector(".nav-single button");
const logo = document.querySelector("h1")

function goBack() {
    history.back();
}
backBtn.addEventListener("click", goBack);

if (logo) {
    // gsap.to(logo, {
    //     scale: 3,
    //     duration: 1,
    // })
    // gsap.from("h1", {
    //     scale: 2,
    //     duration: 0.5
    // })
    // gsap.set("h1", {
    //     scale: 2
    // })
    // gsap.fromTo("h1", {
    //     scale: 2,
        
    // }, {
    //     scale: 5,
    //     delay: 4,
    //     duration: 1
    // })
    const tl = gsap.timeline({
    })
    .to(logo, {
        x: 100,
        ease: "bounce.out"
    })
    .to(logo, {
        y: 100,
        ease: "bounce.out"
    })
    .to(logo, {
        skew: "10deg",
    })
    .to(logo, {
        rotate: "-10deg",
        onComplete: () => {
            tl.reverse()
        }
    })
}

gsap.to(".animatie", {
    scrollTrigger: {
        tirgger: ".animatie", 
        start: "top 10%", 
        end: "bottom 50%",
        markers: true,
    },
    y: -100,

})