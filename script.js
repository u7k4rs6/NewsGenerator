// Use an environment variable (set this in Netlify settings)
const API_KEY = import.meta.env?.VITE_NEWS_API_KEY || "YOUR_FALLBACK_KEY"; 
const NEWS_API_URL = 'https://api.mediastack.com/v1/news';

document.getElementById('fetchNews').addEventListener('click', async () => {
  const category = document.getElementById('category').value;
  const newsContainer = document.getElementById('newsContainer');
  newsContainer.innerHTML = '<p>Loading...</p>';

  try {
    const url = `${NEWS_API_URL}?access_key=${API_KEY}&categories=${category}&languages=en&countries=us`;

    // Hide the actual key from dev tools
    const response = await fetch(url, { method: 'GET', headers: { 'X-API-Request': 'true' } });
    const data = await response.json();

    if (data.data?.length > 0) {
      newsContainer.innerHTML = '';
      data.data.forEach((article) => {
        const articleHTML = `
          <div class="article">
            <h3>${article.title}</h3>
            <p>${article.description || 'No description available.'}</p>
            <a href="${article.url}" target="_blank">Read More</a>
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
