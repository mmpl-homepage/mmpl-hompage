const REQUIRED_FIELDS = {
  members: ['id', 'name', 'role'],
  publications: ['id', 'title', 'authors', 'venue', 'year', 'type'],
  news: ['id', 'title', 'content', 'author', 'publishedAt'],
};

async function loadJSON(path) {
  const res = await fetch(path);
  return res.json();
}

function el(tag, className, html) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (html !== undefined) node.innerHTML = html;
  return node;
}

// Phase 2: JSON 유효성 검사 — 필수 필드가 비어있는 항목은 화면에서 제외하고 에러로 수집한다.
function validateItems(items, requiredFields, typeName) {
  const valid = [];
  const errors = [];
  items.forEach((item, index) => {
    const missing = requiredFields.filter(
      field => item[field] === undefined || item[field] === null || item[field] === ''
    );
    if (missing.length > 0) {
      errors.push(`${typeName} #${index} (id: ${item.id || '없음'}) - 누락된 필드: ${missing.join(', ')}`);
    } else {
      valid.push(item);
    }
  });
  return { valid, errors };
}

function renderErrors(container, errors) {
  container.innerHTML = '';
  if (errors.length === 0) return;
  const banner = el('div', 'error-banner');
  banner.appendChild(el('p', null, `데이터 오류 ${errors.length}건이 발견되어 해당 항목은 화면에 표시되지 않았습니다:`));
  const list = el('ul');
  errors.forEach(msg => list.appendChild(el('li', null, msg)));
  banner.appendChild(list);
  container.appendChild(banner);
  errors.forEach(msg => console.error('[데이터 검증 오류]', msg));
}

function fmtDate(iso) {
  const d = new Date(iso);
  return d.getFullYear() + '.' + String(d.getMonth() + 1).padStart(2, '0') + '.' + String(d.getDate()).padStart(2, '0');
}

// news.js가 쓰는 공지 항목 렌더링 (날짜/분류/수정여부 태그 + 제목 + 내용)
function renderNewsItem(n) {
  const item = el('li', 'list-item');
  const tags = el('div', 'item-tags');
  tags.appendChild(el('span', 'item-date', fmtDate(n.publishedAt)));
  if (n.category) tags.appendChild(el('span', 'tag tag-neutral', n.category));
  if (n.updatedAt) tags.appendChild(el('span', 'tag tag-outline', '수정됨'));
  item.appendChild(tags);
  const titleHtml = n.link
    ? `<a href="${n.link}" target="_blank" rel="noopener">${n.title}</a>`
    : n.title;
  item.appendChild(el('p', 'item-title', titleHtml));
  item.appendChild(el('p', 'item-summary', n.content));
  return item;
}

// home.js가 쓰는 홈 화면 최근 공지 미리보기 행(날짜 + 분류 + 제목만 표시)
function renderRecentNewsRow(n) {
  const item = el('li', 'recent-news-row');
  item.appendChild(el('span', 'item-date', fmtDate(n.publishedAt)));
  if (n.category) item.appendChild(el('span', 'tag tag-accent', n.category));
  item.appendChild(el('span', 'item-title', n.title));
  return item;
}
