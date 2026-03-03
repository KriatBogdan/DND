// Функция выбора редкости на основе шансов
function selectRarity(chances) {
  const rand = Math.random() * 100;
  let cumulative = 0;
  
  for (const [rarity, chance] of Object.entries(chances)) {
    cumulative += chance;
    if (rand <= cumulative) {
      return rarity;
    }
  }
  return 'common';
}

// Получение случайного предмета из массива
function getRandomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

// Создание карточки билета
function createTicketCard(type, ticket) {
  const card = document.createElement('div');
  card.className = `ticket-card ${type}`;
  card.onclick = () => rollGacha(type);
  
  const chancesList = Object.entries(ticket.chances)
    .filter(([_, chance]) => chance > 0)
    .map(([rarity, chance]) => `${getRarityName(rarity)}: ${chance}%`)
    .join('<br>');
  
  card.innerHTML = `
    <div class="ticket-icon">${ticket.icon}</div>
    <div class="ticket-name">${ticket.name}</div>
    <div class="ticket-chances">${chancesList}</div>
  `;
  
  return card;
}

// Получение названия редкости на русском
function getRarityName(rarity) {
  const names = {
    common: 'Обычный',
    uncommon: 'Необычный',
    rare: 'Редкий',
    epic: 'Эпический',
    legendary: 'Легендарный'
  };
  return names[rarity] || rarity;
}

// Загрузка билетов на страницу
function loadTickets() {
  const ticketsGrid = document.getElementById('ticketsGrid');
  ticketsGrid.innerHTML = '';
  
  for (const [key, ticket] of Object.entries(TICKET_TYPES)) {
    const card = createTicketCard(key, ticket);
    ticketsGrid.appendChild(card);
  }
}

// Открытие гачи
async function rollGacha(ticketType) {
  const overlay = document.getElementById('animationOverlay');
  overlay.classList.add('active');
  
  // Задержка для анимации (2 секунды)
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const ticketInfo = TICKET_TYPES[ticketType];
  const selectedRarity = selectRarity(ticketInfo.chances);
  
  const availableItems = ITEMS_DATABASE[selectedRarity];
  const item = getRandomItem(availableItems);
  
  overlay.classList.remove('active');
  displayResult({
    item: { ...item, rarity: selectedRarity },
    ticketUsed: ticketInfo.name
  });
}

// Отображение результата
function displayResult(result) {
  const resultSection = document.getElementById('resultSection');
  const resultCard = document.getElementById('resultCard');
  
  const item = result.item;
  
  resultCard.className = `result-card ${item.rarity}`;
  
  let statsHTML = '';
  if (item.damage) statsHTML += `<p><strong>⚔️ Урон:</strong> ${item.damage}</p>`;
  if (item.bonus) statsHTML += `<p><strong>✨ Бонус:</strong> ${item.bonus}</p>`;
  if (item.effect) statsHTML += `<p><strong>🎯 Эффект:</strong> ${item.effect}</p>`;
  
  resultCard.innerHTML = `
    <div class="item-icon">${item.icon}</div>
    <div class="item-name">${item.name}</div>
    <div class="item-rarity">${getRarityName(item.rarity)}</div>
    <div class="item-description">${item.description}</div>
    ${statsHTML ? `<div class="item-stats">${statsHTML}</div>` : ''}
  `;
  
  resultSection.style.display = 'block';
  resultSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Открыть еще раз
function rollAgain() {
  document.getElementById('resultSection').style.display = 'none';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
  loadTickets();
});
