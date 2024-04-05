
const main = document.querySelector('main');
const likeBtn = document.querySelector("section button:last-of-type");

// Get data on client
// Zie prompts: https://chemical-bunny-323.notion.site/API-Chat-GPT-Doc-372f65d6b2a5497a86b02ed94edffe17#b648ab4676944b0ea43517825fc9845b
const data = [];

main.querySelectorAll('article').forEach(article => {
    const name = article.querySelector('h2').textContent.trim();
    const imageUrl = article.querySelector('img').getAttribute('src');

    data.push({
        name: name,
        img: imageUrl,
    });
});

// Z-index
// Zie promts: https://chemical-bunny-323.notion.site/API-Chat-GPT-Doc-372f65d6b2a5497a86b02ed94edffe17#7f38ad89a9e84895b019f2fe2e1ab822
function showData() {
    const aElement = document.querySelectorAll('main a');
    const numCards = data.length;
    let zIndex = numCards;

    aElement.forEach((element, index) => {
        element.style.zIndex = zIndex--;
    });
}
showData();

// Likes in new array
// Zie prompts: https://chemical-bunny-323.notion.site/API-Chat-GPT-Doc-372f65d6b2a5497a86b02ed94edffe17#cf6ffc6142d2442a9bd616eeaa1f0fce
likeBtn.addEventListener('click', function() {
    if (data.length > 0) {
        const likedItem = data.shift();
        updateUI();
    }
});

function updateUI() {
    // Z-index UI
    // Zie prompts: https://chemical-bunny-323.notion.site/API-Chat-GPT-Doc-372f65d6b2a5497a86b02ed94edffe17#bebe8af892df48e6af57c3d6d36d942c
    const zIndexValues = Array.from(main.querySelectorAll('a')).map(element => parseInt(window.getComputedStyle(element).zIndex));

    main.innerHTML = '';

    // Render the updated data
    data.forEach((item, index) => {
        const zIndex = zIndexValues[index] || 0;

        const html = 
        `<a href="" style="z-index: ${zIndex};">
            <article> <!-- Set the z-index -->
                <h2>${item.name}</h2>

                <img src="${item.img}" alt="${item.name}">
                
                <button aria-label="Go to detail page button"><img src="img/icons/arrow-blue.svg" alt="Arrow blue icon"></button>
            </article>
        </a>`;

        main.insertAdjacentHTML("beforeend", html);
    });
}
