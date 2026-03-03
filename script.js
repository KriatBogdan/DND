class LootGachaSystem {
  constructor() {
    this.loadPlayerData();
    this.currentRarity = 'common';
    this.init();
  }

  loadPlayerData() {
    const saved = localStorage.getItem('dndGacha');
    if (saved) {
      this.data = JSON.parse(saved);
    } else {
      this.data = {
        tickets: { common: 10, uncommon: 2, rare: 0, epic: 0, legendary: 0 },
        totalSpins: 0,
        lastBonus: null
      };
      this.save();
    }
  }

  save() {
    localStorage.setItem('dndGacha', JSON.stringify(this.data));
  }

  init() {
    console.log('Система загружена!');
    this.updateUI();
    this.checkBonus();
    this.setupEvents();
    this.selectRarity('common');
  }

  setupEvents() {
    // Выбор талончика
    document.querySelectorAll('.ticket-card').forEach(card => {
      card.addEventListener('click', () => {
        const rarity = card.getAttribute('data-rarity');
        this.selectRarity(rarity);
      });
    });

    // Кнопка крутки
    document.getElementById('spin-btn').addEventListener('click', () => {
      this.spin();
    });
  }

  selectRarity(rarity) {
    this.currentRarity = rarity;
    
    // Убираем active
    document.querySelectorAll('.ticket-card').forEach(c => c.classList.remove('active'));
    
    // Добавляем active
    document.querySelector(`.ticket-card.${rarity}`).classList.add('active');
    
    this.updateSpinBtn();
  }

  updateUI() {
    // Обновляем счетчики
    Object.keys(this.data.tickets).forEach(rarity => {
      const el = document.getElementById(`ticket-${rarity}`);
      if (el) el.textContent = this.data.tickets[rarity];
    });

    // Статистика
    const spins = document.getElementById('total-spins');
    if (spins) spins.textContent = this.data.totalSpins;

    this.updateSpinBtn();
  }

  updateSpinBtn() {
    const btn = document.getElementById('spin-btn');
    const hasTicket = this.data.tickets[this.currentRarity] > 0;
    
    btn.disabled = !hasTicket;
    btn.textContent = hasTicket 
      ? `🎲 Крутить (${this.getRarityRU(this.currentRarity)})`
      : '❌ Нет талончиков';
  }

  async spin() {
    if (this.data.tickets[this.currentRarity] <= 0) {
      this.notify('❌ Нет талончиков!');
      return;
    }

    // Списываем талончик
    this.data.tickets[this.currentRarity]--;
    this.data.totalSpins++;
    this.save();
    this.updateUI();

    // Анимация
    const result = document.getElementById('gacha-result');
    result.style.display = 'block';
    result.innerHTML = '<div class="spinner">🎰</div>';

    await this.sleep(1500);

    // Получаем предмет
    const item = this.getItem();
    
    // Получаем награду (талончик)
    const reward = this.getReward();
    this.data.tickets[reward]++;
    this.save();
    this.updateUI();

    // Показываем результат
    result.innerHTML = `
      <div class="result-card ${item.rarity}">
        <h3>🎉 Получено!</h3>
        <div class="item-name">${item.name}</div>
        <div class="item-rarity">${this.getRarityRU(item.rarity)}</div>
        <div class="reward-info">
          ✨ Награда: +1 ${this.getRarityRU(reward)}
        </div>
      </div>
    `;
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

    if (rand < 0.7) return this.currentRarity; // 70%
    if (rand < 0.9 && idx < 4) return rarities[idx + 1]; // 20% выше
    if (idx > 0) return rarities[idx - 1]; // 10% ниже
    
    return this.currentRarity;
  }

  upgradeTickets(from) {
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
  }*
