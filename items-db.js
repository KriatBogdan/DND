// База данных предметов D&D
const ITEMS_DATABASE = {
  common: [
    { name: 'Длинный меч', type: 'weapon', icon: '⚔️', description: 'Обычный длинный меч', damage: '1d8 рубящего урона' },
    { name: 'Короткий лук', type: 'weapon', icon: '🏹', description: 'Простой лук для охоты', damage: '1d6 колющего урона' },
    { name: 'Зелье лечения', type: 'potion', icon: '🧪', description: 'Восстанавливает здоровье', effect: 'Лечит 2d4+2 HP' },
    { name: 'Кожаная броня', type: 'armor', icon: '🛡️', description: 'Легкая защита', bonus: 'AC 11 + модификатор Ловкости' },
    { name: 'Факел', type: 'tool', icon: '🔦', description: 'Источник света', effect: 'Свет на 20 футов' },
    { name: 'Веревка (50 фт)', type: 'tool', icon: '🪢', description: 'Пеньковая веревка', effect: 'Прочность 2 HP' },
  ],
  uncommon: [
    { name: '+1 Боевой топор', type: 'weapon', icon: '🪓', description: 'Магический боевой топор', damage: '1d8+1 рубящего урона', bonus: '+1 к атаке и урону' },
    { name: 'Плащ защиты', type: 'armor', icon: '🧥', description: 'Магический плащ', bonus: '+1 к AC и спасброскам' },
    { name: 'Сапоги быстроты', type: 'armor', icon: '👢', description: 'Увеличивают скорость', bonus: '+10 футов к скорости' },
    { name: 'Перчатки ловкости воров', type: 'armor', icon: '🧤', description: 'Перчатки для воров', bonus: '+5 к проверкам ловкости рук' },
    { name: 'Зелье большого лечения', type: 'potion', icon: '⚗️', description: 'Мощное зелье', effect: 'Лечит 4d4+4 HP' },
  ],
  rare: [
    { name: 'Огненный меч', type: 'weapon', icon: '🔥', description: '+2 меч, пылает огнём', damage: '1d8+2 + 1d6 огня', bonus: 'Светится в темноте' },
    { name: 'Кольцо защиты разума', type: 'ring', icon: '💍', description: 'Защита от магии', effect: 'Преимущество на спасброски от очарования' },
    { name: 'Мантия звёздной магии', type: 'armor', icon: '✨', description: 'Усиливает заклинания', bonus: '+1 к DC заклинаний' },
    { name: 'Амулет здоровья', type: 'amulet', icon: '📿', description: 'Укрепляет тело', bonus: 'Телосложение становится 19' },
    { name: 'Крылатые сапоги', type: 'armor', icon: '🦅', description: 'Позволяют летать', effect: 'Скорость полёта 60 футов (4 часа в день)' },
  ],
  epic: [
    { name: 'Посох магии', type: 'weapon', icon: '🔮', description: '+2 посох, хранит заряды', damage: '1d6+2 дробящего урона', effect: '50 зарядов для заклинаний' },
    { name: 'Доспехи драконьей чешуи', type: 'armor', icon: '🐲', description: 'Доспехи из чешуи дракона', bonus: 'AC 18, сопротивление огню' },
    { name: 'Пояс силы великана', type: 'belt', icon: '⚡', description: 'Невероятная сила', bonus: 'Сила становится 29' },
    { name: 'Ковёр-самолёт', type: 'wondrous', icon: '🧞', description: 'Летающий ковёр', effect: 'Скорость полёта 80 футов, до 800 фунтов' },
  ],
  legendary: [
    { name: 'Святой мститель', type: 'weapon', icon: '⚔️', description: '+3 меч света', damage: '1d8+3 + 2d10 сияния против нежити', bonus: 'Светится как факел' },
    { name: 'Волшебный артефакт', type: 'artifact', icon: '💎', description: 'Древний артефакт силы', effect: 'Содержит частицу божественной силы' },
    { name: 'Кольцо трёх желаний', type: 'ring', icon: '💫', description: 'Исполняет 3 желания', effect: '3 заклинания Wish' },
    { name: 'Книга бесконечных заклинаний', type: 'book', icon: '📖', description: 'Бесконечный источник магии', effect: 'Содержит случайные заклинания' },
  ]
};

// Настройки билетов с шансами выпадения
const TICKET_TYPES = {
  common: {
    name: 'Обычный билет',
    icon: '🎫',
    chances: { common: 70, uncommon: 25, rare: 5, epic: 0, legendary: 0 }
  },
  uncommon: {
    name: 'Необычный билет',
    icon: '🎟️',
    chances: { common: 40, uncommon: 40, rare: 15, epic: 5, legendary: 0 }
  },
  rare: {
    name: 'Редкий билет',
    icon: '🎭',
    chances: { common: 20, uncommon: 30, rare: 35, epic: 13, legendary: 2 }
  },
  epic: {
    name: 'Эпический билет',
    icon: '👑',
    chances: { common: 5, uncommon: 15, rare: 30, epic: 40, legendary: 10 }
  },
  legendary: {
    name: 'Легендарный билет',
    icon: '💎',
    chances: { common: 0, uncommon: 5, rare: 20, epic: 35, legendary: 40 }
  }
};
