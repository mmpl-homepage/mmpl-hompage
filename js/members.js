const ROLE_ORDER = ['교수', '박사과정', '석사과정', '학부연구생'];

function renderMembers(members) {
  const container = document.getElementById('members-list');
  container.innerHTML = '';

  const { valid, errors } = validateItems(members, REQUIRED_FIELDS.members, '구성원');
  renderErrors(document.getElementById('members-errors'), errors);

  const groups = new Map(ROLE_ORDER.map(role => [role, []]));
  valid.forEach(m => {
    if (!groups.has(m.role)) groups.set(m.role, []);
    groups.get(m.role).push(m);
  });

  groups.forEach((groupMembers, role) => {
    if (groupMembers.length === 0) return;
    container.appendChild(el('h3', 'role-heading', role));
    const grid = el('div', 'card-grid');
    groupMembers.forEach(m => {
      const card = el('div', 'card');
      card.appendChild(el('h4', null, m.name));
      if (m.interests && m.interests.length) {
        card.appendChild(el('p', 'card-interests', m.interests.join(', ')));
      }
      if (m.bio) card.appendChild(el('p', 'card-bio', m.bio));
      card.appendChild(el('p', 'card-email', m.email));
      grid.appendChild(card);
    });
    container.appendChild(grid);
  });
}

(async function init() {
  try {
    const members = await loadJSON('data/members.json');
    renderMembers(members);
  } catch (err) {
    console.error('구성원 데이터를 불러오는 중 오류가 발생했습니다.', err);
  }
})();
