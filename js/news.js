const PAGE_SIZE = 5;

let allNews = [];
let currentPage = 1;

// 상시 안내(pinned:true)는 날짜 순서와 무관하게 페이지네이션 위 배너로 고정 표시한다.
function renderPinned(pinnedItems) {
  const container = document.getElementById('news-pinned');
  container.innerHTML = '';
  pinnedItems.forEach(n => {
    const banner = el('div', 'pinned-banner');
    banner.appendChild(el('span', 'tag tag-accent', '고정'));
    if (n.category) banner.appendChild(el('span', 'tag tag-neutral', n.category));
    banner.appendChild(el('p', 'item-title', n.title));
    banner.appendChild(el('p', 'item-summary', n.content));
    container.appendChild(banner);
  });
}

function renderNewsList(pageItems) {
  const container = document.getElementById('news-list');
  container.innerHTML = '';
  pageItems.forEach(n => container.appendChild(renderNewsItem(n)));
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

    const sorted = [...valid].sort(
      (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)
    );
    renderPinned(sorted.filter(n => n.pinned));
    allNews = sorted.filter(n => !n.pinned);
    currentPage = 1;
    renderCurrentPage();
  } catch (err) {
    console.error('공지사항 데이터를 불러오는 중 오류가 발생했습니다.', err);
  }
})();
