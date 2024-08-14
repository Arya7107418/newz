const API_KEY = "7c936188f3504c20bb9b1b074c409cc2";
const url = "https://newsapi.org/v2/top-headlines?country=in&apiKey=";

window.addEventListener("load", () => fetchNews());

function reload() {
    window.location.reload();
}

async function fetchNews(query = "") {
    try {
        const res = await fetch(`${url}${API_KEY}&q=${query}`);
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        if (data.articles && data.articles.length > 0) {
            bindData(data.articles);
        } else {
            console.error("No articles found.");
            displayErrorMessage("No articles found for your search.");
        }
    } catch (error) {
        console.error("Failed to fetch news:", error);
        displayErrorMessage("Failed to load news articles. Please try again later.");
    }
}

function bindData(articles) {
    const cardsContainer = document.getElementById("cards-container");
    const newsCardTemplate = document.getElementById("template-news-card");

    cardsContainer.innerHTML = "";

    articles.forEach((article) => {
        if (!article.urlToImage) return;
        const cardClone = newsCardTemplate.content.cloneNode(true);
        fillDataInCard(cardClone, article);
        cardsContainer.appendChild(cardClone);
    });
}

function fillDataInCard(cardClone, article) {
    const newsImg = cardClone.querySelector('#news-img');
    const newsTitle = cardClone.querySelector('#news-title');
    const newsSource = cardClone.querySelector('#news-source');
    const newsDesc = cardClone.querySelector('#news-desc');

    newsImg.src = article.urlToImage;
    newsTitle.innerHTML = article.title;
    newsDesc.innerHTML = article.description;

    const date = new Date(article.publishedAt).toLocaleString("en-US", {
        timeZone: "Asia/Jakarta"
    });

    newsSource.innerHTML = `${article.source.name} . ${date}`;

    cardClone.firstElementChild.addEventListener('click', () => {
        window.open(article.url, "_blank");
    });
}

function displayErrorMessage(message) {
    const cardsContainer = document.getElementById("cards-container");
    cardsContainer.innerHTML = `<p>${message}</p>`;
}

let curSelectedNav = null;

function onNavItemClick(id) {
    fetchNews(id);
    const navItem = document.getElementById(id);
    curSelectedNav?.classList.remove("active");
    curSelectedNav = navItem;
    curSelectedNav.classList.add("active");
}

const searchButton = document.getElementById("search-button");
const searchText = document.getElementById("search-text");

searchButton.addEventListener('click', () => {
    const query = searchText.value;
    if (!query) return;
    fetchNews(query);
    curSelectedNav?.classList.remove('active');
    curSelectedNav = null;
});
