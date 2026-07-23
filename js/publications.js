let allPublications = [];

function renderPublications() {
  const container = document.getElementById('publications-list');
  container.innerHTML = '';

  const yearFilter = document.getElementById('publications-year-filter').value;
  const typeFilter = document.getElementById('publications-type-filter').value;

  const filtered = allPublications.filter(p => {
    const yearMatch = yearFilter === 'all' || String(p.year) === yearFilter;
    const typeMatch = typeFilter === 'all' || p.type === typeFilter;
    return yearMatch && typeMatch;
  });

  const sorted = [...filtered].sort((a, b) => b.year - a.year);

  if (sorted.length === 0) {
    container.appendChild(el('li', 'loading', '조건에 맞는 논문이 없습니다.'));
    return;
  }

  sorted.forEach(p => {
    const item = el('li', 'list-item');
    const titleHtml = p.link
      ? `<a href="${p.link}" target="_blank" rel="noopener">${p.title}</a>`
      : p.title;
    item.appendChild(el('p', 'item-title', titleHtml));
    item.appendChild(el('p', 'item-meta', `${p.authors.join(', ')} · ${p.venue} · ${p.year} · ${p.type}`));
    if (p.summary) item.appendChild(el('p', 'item-summary', p.summary));
    container.appendChild(item);
  });
}

function setupPublicationFilters(publications) {
  const yearSelect = document.getElementById('publications-year-filter');
  const typeSelect = document.getElementById('publications-type-filter');

  const years = [...new Set(publications.map(p => p.year))].sort((a, b) => b - a);
  years.forEach(year => {
    const option = el('option', null, String(year));
    option.value = String(year);
    yearSelect.appendChild(option);
  });

  const types = [...new Set(publications.map(p => p.type))];
  types.forEach(type => {
    const option = el('option', null, type);
    option.value = type;
    typeSelect.appendChild(option);
  });

  yearSelect.addEventListener('change', renderPublications);
  typeSelect.addEventListener('change', renderPublications);
}

(async function init() {
  try {
    const publications = await loadJSON('data/publications.json');
    const { valid, errors } = validateItems(publications, REQUIRED_FIELDS.publications, '논문');
    allPublications = valid;
    renderErrors(document.getElementById('publications-errors'), errors);
    setupPublicationFilters(valid);
    renderPublications();
  } catch (err) {
    console.error('논문 데이터를 불러오는 중 오류가 발생했습니다.', err);
  }
})();
