const REQUIRED_FIELDS = {
  members: ['id', 'name', 'role', 'email'],
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
