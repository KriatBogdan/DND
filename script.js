// Система управления талончиками и прогрессом
class LootGachaSystem {
  constructor() {
    this.loadPlayerData();
    this.initializeUI();
  }

  // Загрузка данных игрока из localStorage
  loadPlayerData() {
    const savedData = localStorage.getItem('playerData');
    if (savedData) {
      this.playerData = JSON.parse(savedData);
    } else {
      this.playerData = {
        tickets: {
          common: 10,
          uncommon: 0,
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

  // Сохранение данных игрока
  savePlayerData() {
    localStorage.setItem('playerData', JSON.stringify(this.playerData));
  }

  // Инициализация интерфейса
  initializeUI() {
    this.updateTicketDisplay();
    this.setupEventListeners();
    this.checkDailyBonus();
  }

  // Обновление отображения талончиков
  updateTicketDisplay() {
    const ticketRarities = ['common', 'uncommon', 'rare', 'epic', 'legendary'];
    ticketRarities.forEach(rarity => {
      const element = document.getElementById(`ticket-${rarity}`);
      if (element) {
        element.textContent = this.playerData.tickets[rarity];
      }
    });
  }

  // Получение талончика за крутку
  addTicket(rarity, amount = 1) {
    this.playerData.tickets[rarity] += amount;
    this.savePlayerData();
    this.updateTicketDisplay();
    this.showNotification(`+${amount} ${this.getRarityName(rarity)} талончик(ов)!`);
  }

  // Потребление талончика на крутку
  consumeTicket(rarity) {
    if (this.playerData.tickets[rarity] > 0) {
      this.playerData.tickets[rarity]--;
      this.playerData.totalSpins++;
      this.savePlayerData();
      this.updateTicketDisplay();
      return true;
    }
    return false;
  }

  // Система улучшения талончиков
  upgradeTickets(fromRarity) {
    const rarities = ['common', 'uncommon', 'rare', 'epic', 'legendary'];
    const fromIndex = rarities.indexOf(fromRarity);
    
    if (fromIndex === -1 || fromIndex === rarities.length - 1) {
      this.showNotification('Невозможно улучшить!');
      return false;
    }

    const toRarity = rarities[fromIndex + 1];
    const requiredAmount = 3; // 3 талончика на улучшение

    if (this.playerData.tickets[fromRarity] >= requiredAmount) {
      this.playerData.tickets[fromRarity] -= requiredAmount;
      this.playerData.tickets[toRarity]++;
      this.savePlayerData();
      this.updateTicketDisplay();
      this.showNotification(
        `✨ ${requiredAmount}x ${this.getRarityName(fromRarity)} → 1x ${this.getRarityName(toRarity)}`
      );
      return true;
    } else {
      this.showNotification(
        `Нужно ${requiredAmount} талончиков ${this.getRarityName(fromRarity)}!`
      );
      return false;
    }
  }

  // Ежедневный бонус
  checkDailyBonus() {
    const today = new Date().toDateString();
    if (this.playerData.lastDailyBonus !== today) {
      this.addTicket('common', 5);
      this.playerData.lastDailyBonus = today;
      this.savePlayerData();
      this.showNotification('🎁 Ежедневный бонус: +5 Common талончиков!');
    }
  }

  // Вспомогательные функции
  getRarityName(rarity) {
    const names = {
      common: 'Обычный',
      uncommon: 'Необычный',
      rare: 'Редкий',
      epic: 'Эпический',
      legendary: 'Легендарный'
    };
    return names[rarity] || rarity;
  }

  showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
  }

  // Сброс данных (для тестирования)
  resetData() {
    if (confirm('Вы уверены? Это удалит все ваши данные!')) {
      localStorage.removeItem('playerData');
      location.reload();
    }
  }

  setupEventListeners() {
    // Кнопки улучшения
    const rarities = ['common', 'uncommon', 'rare', 'epic'];
    rarities.forEach(rarity => {
      const btn = document.getElementById(`upgrade-${rarity}`);
      if (btn) {
        btn.addEventListener('click', () => this.upgradeTickets(rarity));
      }
    });

    // Кнопка сброса
    const resetBtn = document.getElementById('reset-data');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => this.resetData());
    }
  }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
  window.gachaSystem = new LootGachaSystem();
});
