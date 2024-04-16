
const cards = document.querySelectorAll(".known div a");

// Gsap likes
// Zie prompts: https://chemical-bunny-323.notion.site/API-Chat-GPT-Doc-372f65d6b2a5497a86b02ed94edffe17#238b3a9ad1234fd6b177d17cb4c31c84
cards.forEach((card, index) => {
    gsap.from(card, {
        y: 100,
        opacity: 0,
        delay: index * 0.1,
        duration: 0.2
    });
});
