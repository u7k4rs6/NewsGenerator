const API_KEY = '8c81e496d1a76a5468a038d0d3246978'; // Get a free API key from https://mediastack.com/
const NEWS_API_URL = 'https://api.mediastack.com/v1/news';

document.getElementById('fetchNews').addEventListener('click', async () => {
  const category = document.getElementById('category').value;
  const newsContainer = document.getElementById('newsContainer');
  newsContainer.innerHTML = '<p>Loading...</p>';

  try {
    const url = `${NEWS_API_URL}?access_key=${API_KEY}&categories=${category}&languages=en&countries=us`;
    const response = await fetch(url);
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
