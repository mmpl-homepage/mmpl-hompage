const PAGE_SIZE = 5;

let allNews = [];
let currentPage = 1;

function renderNewsList(pageItems) {
  const container = document.getElementById('news-list');
  container.innerHTML = '';
  pageItems.forEach(n => {
    const item = el('li', 'list-item');
    const titleHtml = n.link
      ? `<a href="${n.link}" target="_blank" rel="noopener">${n.title}</a>`
      : n.title;
    item.appendChild(el('p', 'item-title', titleHtml));
    const date = n.publishedAt.slice(0, 10);
    const updatedLabel = n.updatedAt ? ' (수정됨)' : '';
    item.appendChild(el('p', 'item-meta', `${n.author} · ${date}${updatedLabel}`));
    item.appendChild(el('p', 'item-summary', n.content));
    container.appendChild(item);
  });
}

function renderPagination(totalPages) {
  const nav = document.getElementById('news-pagination');
  nav.innerHTML = '';
  if (totalPages <= 1) return;

  for (let page = 1; page <= totalPages; page++) {
    const button = el('button', page === currentPage ? 'active' : null, String(page));
    button.type = 'button';
    button.addEventListener('click', () => {
      currentPage = page;
      renderCurrentPage();
    });
    nav.appendChild(button);
  }
}

function renderCurrentPage() {
  const totalPages = Math.max(1, Math.ceil(allNews.length / PAGE_SIZE));
  const start = (currentPage - 1) * PAGE_SIZE;
  const pageItems = allNews.slice(start, start + PAGE_SIZE);
  renderNewsList(pageItems);
  renderPagination(totalPages);
}

(async function init() {
  try {
    const news = await loadJSON('data/news.json');
    const { valid, errors } = validateItems(news, REQUIRED_FIELDS.news, '공지');
    renderErrors(document.getElementById('news-errors'), errors);

    allNews = [...valid].sort(
      (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)
    );
    currentPage = 1;
    renderCurrentPage();
  } catch (err) {
    console.error('공지사항 데이터를 불러오는 중 오류가 발생했습니다.', err);
  }
})();
