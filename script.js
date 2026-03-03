// Система управления талончиками и прогрессом
class LootGachaSystem {
  constructor() {
    this.loadPlayerData();
    this.initializeUI();
    this.currentRarity = 'common'; // Текущий выбранный тип талончика
  }

  // Загрузка данных игрока
  loadPlayerData() {
    const savedData = localStorage.getItem('playerData');
    if (savedData) {
      this.playerData = JSON.parse(savedData);
    } else {
      this.playerData = {
        tickets: {
          common: 10,
          uncommon: 2,
          rare: 0,
          epic: 0,
          legendary: 0
        },
        totalSpins: 0,
        lastDailyBonus: null,
        inventory: []
      };
      this.savePlayerData();
    }
  }

  savePlayerData() {
    localStorage.setItem('playerData', JSON.stringify(this.playerData));
  }

  initializeUI() {
    this.updateTicketDisplay();
    this.updateStatsDisplay();
    this.setupEventListeners();
    this.checkDailyBonus();
    this.selectRarity('common');
  }

  // Обновление отображения талончиков
  updateTicketDisplay() {
    const rarities = ['common', 'uncommon', 'rare', 'epic', 'legendary'];
    rarities.forEach(rarity => {
      const element = document.getElementById(`ticket-${rarity}`);
      if (element) {
        element.textContent = this.playerData.tickets[rarity];
      }
    });
  }

  // Обновление статистики
  updateStatsDisplay() {
    const totalSpinsEl = document.getElementById('total-spins');
    if (totalSpinsEl) {
      totalSpinsEl.textContent = this.playerData.totalSpins;
    }
  }

  // Выбор редкости талончика для крутки
  selectRarity(rarity) {
    this.currentRarity = rarity;
    
    // Обновляем UI - убираем active со всех
    document.querySelectorAll('.ticket-card').forEach(card => {
      card.classList.remove('active');
    });
    
    // Добавляем active к выбранному
    const selectedCard = document.querySelector(`.ticket-card.${rarity}`);
    if (selectedCard) {
      selectedCard.classList.add('active');
    }

    // Обновляем кнопку крутки
    this.updateSpinButton();
  }

  // Обновление кнопки крутки
  updateSpinButton() {
    const spinBtn = document.getElementById('spin-btn');
    if (!spinBtn) return;

    const hasTicket = this.playerData.tickets[this.currentRarity] > 0;
    
    spinBtn.disabled = !hasTicket;
    spinBtn.textContent = hasTicket 
      ? `🎲 Крутить (${this.getRarityName(this.currentRarity)})`
      : `❌ Нет талончиков`;
  }

  // ГЛАВНАЯ ФУНКЦИЯ КРУТКИ
  async performSpin() {
    // Проверяем наличие талончика
    if (this.playerData.tickets[this.currentRarity] <= 0) {
      this.showNotification('❌ У вас нет талончиков этого типа!');
      return;
    }

    // Потребляем талончик
    this
