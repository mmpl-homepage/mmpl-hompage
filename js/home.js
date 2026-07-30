(async function initHome() {
  try {
    const [members, publications, news] = await Promise.all([
      loadJSON('data/members.json'),
      loadJSON('data/publications.json'),
      loadJSON('data/news.json'),
    ]);
    document.getElementById('stat-members').textContent = members.length;
    document.getElementById('stat-publications').textContent = publications.length;
    document.getElementById('stat-news').textContent = news.length;

    const { valid } = validateItems(news, REQUIRED_FIELDS.news, '공지');
    const recent = [...valid]
      .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
      .slice(0, 3);
    const list = document.getElementById('home-news-list');
    list.innerHTML = '';
    recent.forEach(n => list.appendChild(renderRecentNewsRow(n)));
  } catch (err) {
    console.error('홈 데이터를 불러오는 중 오류가 발생했습니다.', err);
  }
})();
