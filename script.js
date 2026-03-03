// ========================================
// 🎲 D&D GACHA SYSTEM
// ========================================

class LootGachaSystem {
  constructor() {
    console.log('🎯 Конструктор запущен');
    this.currentRarity = 'common';
    this.loadPlayerData();
  }

  loadPlayerData() {
    console.log('📦 Загрузка данных...');
    const saved = localStorage.getItem('dndGacha');
    if (saved) {
      this.data = JSON.parse(saved);
      console.log('✅ Данные загружены:', this.data);
    } else {
      this.data = {
        tickets: { 
          common: 10, 
          uncommon: 2, 
          rare: 0, 
          epic: 0, 
          legendary: 0 
        },
        totalSpins: 0,
        lastBonus: null
      };
      this.save();
      console.log('✨ Созданы новые данные:', this.data);
    }
  }

  save() {
    localStorage.setItem('dndGacha', JSON.stringify(this.data));
  }

  init() {
    console.log('🚀 Инициализация системы...');
    this.updateUI();
    this.checkBonus();
    this.setupEvents();
    this.selectRarity('common');
    console.log('✅ Система готова!');
  }

  setupEvents() {
    console.log('🔗 Настройка событий...');
    
    // Выбор талончика (КЛИК ПО КАРТОЧКЕ)
    const cards = document.querySelectorAll('.ticket-card');
    cards.forEach((card) => {
      const rarity = card.getAttribute('data-rarity');
      
      card.addEventListener('click', (e) => {
        // Если кликнули на кнопку улучшения - не выбираем карточку
        if (e.target.classList.contains('upgrade-btn')) {
          return;
        }
        console.log(`🎯 Клик по карточке: ${rarity}`);
        this.selectRarity(rarity);
      });
    });
    
    // Кнопки улучшения
    const upgradeButtons = document.querySelectorAll('.upgrade-btn[data-upgrade]');
    upgradeButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation(); // Не активируем карточку
        const rarity = btn.getAttribute('data-upgrade');
        console.log(`⬆️ Клик на улучшение: ${rarity}`);
        this.upgradeTickets(rarity);
      });
    });
    
    // Кнопка крутки
    const spinBtn = document.getElementById('spin-btn');
    if (spinBtn) {
      spinBtn.addEventListener('click', () => {
        console.log('🎲 Нажата кнопка крутки');
        this.spin();
      });
      console.log('✅ Кнопка крутки подключена');
    }
    
    // Кнопка сброса
    const resetBtn = document.getElementById('reset-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        this.resetData();
      });
      console.log('✅ Кнопка сброса подключена');
    }
  }

  selectRarity(rarity) {
    console.log(`🎯 Выбрана редкость: ${rarity}`);
    this.currentRarity = rarity;
    
    // Убираем active у всех
    document.querySelectorAll('.ticket-card').forEach(c => {
      c.classList.remove('active');
    });
    
    // Добавляем active к выбранной
    const selected = document.querySelector(`.ticket-card[data-rarity="${rarity}"]`);
    if (selected) {
      selected.classList.add('active');
      console.log('✅ Карточка активирована');
    }
    
    this.updateSpinBtn();
  }

  updateUI() {
    console.log('🔄 Обновление UI...');
    
    // Обновляем счетчики
    Object.keys(this.data.tickets).forEach(rarity => {
      const el = document.getElementById(`ticket-${rarity}`);
      if (el) {
        el.textContent = this.data.tickets[rarity];
      }
    });
    
    // Статистика
    const spinsEl = document.getElementById('total-spins');
    if (spinsEl) {
      spinsEl.textContent = this.data.totalSpins;
    }
    
    this.updateSpinBtn();
  }

  updateSpinBtn() {
    const btn = document.getElementById('spin-btn');
    if (!btn) return;
    
    const hasTicket = this.data.tickets[this.currentRarity] > 0;
    const rarityRU = this.getRarityRU(this.currentRarity);
    
    btn.disabled = !hasTicket;
    btn.textContent = hasTicket 
      ? `🎲 Крутить (${rarityRU})`
      : '❌ Нет талончиков';
  }

  async spin() {
    console.log('🎰 НАЧАЛО КРУТКИ');
    
    if (this.data.tickets[this.currentRarity] <= 0) {
      console.log('❌ Нет талончиков');
      this.notify('❌ Нет талончиков!');
      return;
    }
    
    // Списываем талончик
    this.data.tickets[this.currentRarity]--;
    this.data.totalSpins++;
    this.save();
    this.updateUI();
    
    // Анимация
    const resultDiv = document.getElementById('gacha-result');
    resultDiv.style.display = 'block';
    resultDiv.innerHTML = '<div class="spinner">🎰</div>';
    
    console.log('🎰 Анимация...');
    await this.sleep(1500);
    
    // Получаем предмет и награду
    const item = this.getItem();
    const reward = this.getReward();
    
    console.log('📦 Предмет:', item);
    console.log('🎁 Награда:', reward);
    
    this.data.tickets[reward]++;
    this.save();
    this.updateUI();
    
    // Показываем результат
    resultDiv.innerHTML = `
      <div class="result-card ${item.rarity}">
        <h3>🎉 Получено!</h3>
        <div class="item-name">${item.name}</div>
        <div class="item-rarity">${this.getRarityRU(item.rarity)}</div>
        <div class="reward-info">
          ✨ Награда: +1 ${this.getRarityRU(reward)}
        </div>
      </div>
    `;
    
    console.log('✅ КРУТКА ЗАВЕРШЕНА');
  }

  getItem() {
    const items = {
      common: ['Зелье лечения', 'Факел', 'Веревка', 'Рюкзак', 'Паек'],
      uncommon: ['Зелье невидимости', '+1 Меч', 'Кольцо защиты', 'Сапоги скорости'],
      rare: ['+2 Доспех', 'Жезл чудес', 'Амулет здоровья', 'Пояс силы'],
      epic: ['+3 Оружие', 'Плащ смещения', 'Браслеты защиты', 'Кольцо регенерации'],
      legendary: ['Святой мститель', 'Посох магов', 'Книга заклинаний', 'Артефакт']
    };
    
    const pool = items[this.currentRarity];
    const name = pool[Math.floor(Math.random() * pool.length)];
    return { name, rarity: this.currentRarity };
  }

  getReward() {
    const rarities = ['common', 'uncommon', 'rare', 'epic', 'legendary'];
    const idx = rarities.indexOf(this.currentRarity);
    const rand = Math.random();
    
    if (rand < 0.7) return this.currentRarity;
    if (rand < 0.9 && idx < 4) return rarities[idx + 1];
    if (idx > 0) return rarities[idx - 1];
    
    return this.currentRarity;
  }

  upgradeTickets(from) {
    console.log(`⬆️ Улучшение: ${from}`);
    
    const rarities = ['common', 'uncommon', 'rare', 'epic', 'legendary'];
    const idx = rarities.indexOf(from);
    
    if (idx === -1 || idx === 4) {
      this.notify('Нельзя улучшить');
      return;
    }
    
    if (this.data.tickets[from] < 3) {
      this.notify('Нужно 3 талончика!');
      return;
    }
    
    const to = rarities[idx + 1];
    this.data.tickets[from] -= 3;
    this.data.tickets[to]++;
    this.save();
    this.updateUI();
    
    this.notify(`✨ 3x ${this.getRarityRU(from)} → 1x ${this.getRarityRU(to)}`);
  }

  checkBonus() {
    const today = new Date().toDateString();
    if (this.data.lastBonus !== today) {
      this.data.tickets.common += 5;
      this.data.lastBonus = today;
      this.save();
      this.notify('🎁 Бонус: +5 обычных!');
    }
  }

  resetData() {
    if (confirm('Удалить все данные?')) {
      localStorage.removeItem('dndGacha');
      location.reload();
    }
  }

  getRarityRU(r) {
    const names = {
      common: 'Обычный',
      uncommon: 'Необычный',
      rare: 'Редкий',
      epic: 'Эпический',
      legendary: 'Легендарный'
    };
    return names[r] || r;
  }

  notify(msg) {
    console.log('📢 Уведомление:', msg);
    const n = document.createElement('div');
    n.className = 'notification';
    n.textContent = msg;
    document.body.appendChild(n);
    setTimeout(() => n.remove(), 2500);
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// ========================================
// 🚀 ЗАПУСК СИСТЕМЫ
// ========================================

let gachaSystem;

document.addEventListener('DOMContentLoaded', () => {
  console.log('✅ DOM загружен!');
  gachaSystem = new LootGachaSystem();
  gachaSystem.init();
  console.log('🎉 Система запущена!');
});
