// ========================================
// 🎲 D&D GACHA SYSTEM - ИСПРАВЛЕННАЯ ВЕРСИЯ
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
    
    // Проверка элементов
    const spinBtn = document.getElementById('spin-btn');
    const ticketCards = document.querySelectorAll('.ticket-card');
    
    console.log('🎯 Найдено карточек:', ticketCards.length);
    console.log('🎯 Кнопка крутки:', spinBtn ? 'OK' : 'НЕ НАЙДЕНА!');
    
    this.updateUI();
    this.checkBonus();
    this.setupEvents();
    this.selectRarity('common');
    
    console.log('✅ Система готова!');
  }

  setupEvents() {
    console.log('🔗 Настройка событий...');
    
    // Выбор талончика
    const cards = document.querySelectorAll('.ticket-card');
    cards.forEach((card, index) => {
      const rarity = card.getAttribute('data-rarity');
      console.log(`  Карточка ${index}: ${rarity}`);
      
      card.addEventListener('click', (e) => {
        console.log(`🎯 Клик по карточке: ${rarity}`);
        this.selectRarity(rarity);
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
    } else {
      console.error('❌ Кнопка крутки не найдена!');
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
    } else {
      console.error('❌ Карточка не найдена!');
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
    
    console.log(`🎲 Кнопка: ${btn.textContent}, disabled: ${btn.disabled}`);
  }

  async spin() {
    console.log('🎰 НАЧАЛО КРУТКИ');
    
    // Проверка талончиков
    if (this.data.tickets[this.currentRarity] <= 0) {
      console.log('❌ Нет талончиков');
      this.notify('❌ Нет талончиков!');
      return;
    }
    
    console.log('✅ Талончик списан');
    
    // Списываем талончик
    this.data.tickets[this.currentRarity]--;
    this.data.totalSpins++;
    this.save();
    this.updateUI();
    
    // Анимация
    const resultDiv = document.getElementById('gacha-result');
    if (!resultDiv) {
      console.error('❌ Блок результата не найден!');
      return;
    }
    
    console.log('🎰 Показываем анимацию...');
    resultDiv.style.display = 'block';
    resultDiv.innerHTML = '<div class="spi
