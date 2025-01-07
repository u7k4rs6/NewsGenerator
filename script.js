const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';
const NEWS_API_URL = 'https://newsapi.org/v2/top-headlines';

document.getElementById('fetchNews').addEventListener('click', async () => {
  const category = document.getElementById('category').value;
  const newsContainer = document.getElementById('newsContainer');
  newsContainer.innerHTML = '<p>Loading...</p>';

  try {
    const response = await fetch(`${CORS_PROXY}${NEWS_API_URL}?category=${category}&apiKey=35cb930e7ab24c849dbf119c9424ce5f`);
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
