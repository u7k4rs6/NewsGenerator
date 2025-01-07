const API_KEY = "AIzaSyCPlObYrqLzHXLjZzYKqFNTDjKWk3S6jZE";

document.getElementById('fetchNews').addEventListener('click', async () => {
  const category = document.getElementById('category').value;
  const newsContainer = document.getElementById('newsContainer');
  newsContainer.innerHTML = '<p>Loading...</p>';

  try {
    const newsResponse = await fetch(`https://newsapi.org/v2/top-headlines?category=${category}&apiKey=35cb930e7ab24c849dbf119c9424ce5f`);
    const newsData = await newsResponse.json();

    if (newsData.articles) {
      newsContainer.innerHTML = '';

      for (const article of newsData.articles) {
        const sentiment = await getSentiment(article.title);
        const articleHTML = `
          <div class="article">
            <h3>${article.title}</h3>
            <p>${article.description || "No description available."}</p>
            <p class="sentiment">Sentiment: ${sentiment}</p>
          </div>
        `;
        newsContainer.innerHTML += articleHTML;
      }
    } else {
      newsContainer.innerHTML = '<p>No articles found.</p>';
    }
  } catch (error) {
    console.error('Error fetching news:', error);
    newsContainer.innerHTML = '<p>Error fetching news.</p>';
  }
});

async function getSentiment(text) {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text }]
        }]
      })
    });
    const data = await response.json();
    return data?.contents?.[0]?.parts?.[0]?.text || "Neutral";
  } catch (error) {
    console.error('Error analyzing sentiment:', error);
    return "Error";
  }
}
