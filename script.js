const API_KEY = '935ed9fcdac24f7f9fc3cb2cdfa374ed'; // Replace with your actual NewsAPI key
const NEWS_API_URL = 'https://newsapi.org/v2/top-headlines';
const PROXY_URL = 'https://corsproxy.io/?';

document.getElementById('fetchNews').addEventListener('click', async () => {
  const category = document.getElementById('category').value;
  const newsContainer = document.getElementById('newsContainer');
  newsContainer.innerHTML = '<p>Loading...</p>';

  try {
    const url = `${PROXY_URL}${encodeURIComponent(`${NEWS_API_URL}?category=${category}&apiKey=${API_KEY}`)}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.articles?.length > 0) {
      newsContainer.innerHTML = '';
      data.articles.forEach((article) => {
        const articleHTML = `
          <div class="article">
            <h3>${article.title}</h3>
            <p>${article.description || 'No description available.'}</p>
          </div>
        `;
        newsContainer.innerHTML += articleHTML;
      });
    } else {
      newsContainer.innerHTML = '<p>No articles found.</p>';
    }
  } catch (error) {
    console.error('Error fetching news:', error);
    newsContainer.innerHTML = '<p>Error fetching news.</p>';
  }
});
