# Дизайн-система Content Hunter

## Брендинг

### Тон коммуникации
- **Экспертный** — уверенный, профессиональный
- **Лаконичный** — по делу, без воды
- **Цифры и факты** — конкретика вместо обещаний

### Запрещено
- Размытые обещания: "Мы лучшие", "Невероятные результаты"
- Панибратство: "Ребята", "братан"
- Неуверенный тон: "Ну, вот такой подход", "Можно попробовать"
- Мусорные слова: "Короче", "как бы", "типа"
- Восторженность: "Это просто бомба!", "Вау-эффект!"

---

## Цветовая палитра

### Основные цвета

```css
:root {
  /* Primary — акцентный цвет */
  --primary-50: #fef2f2;
  --primary-100: #fee2e2;
  --primary-200: #fecaca;
  --primary-300: #fca5a5;
  --primary-400: #f87171;
  --primary-500: #ef4444;  /* Основной */
  --primary-600: #dc2626;
  --primary-700: #b91c1c;
  
  /* Neutral — текст и фоны */
  --neutral-50: #fafafa;
  --neutral-100: #f5f5f5;
  --neutral-200: #e5e5e5;
  --neutral-300: #d4d4d4;
  --neutral-400: #a3a3a3;
  --neutral-500: #737373;
  --neutral-600: #525252;
  --neutral-700: #404040;
  --neutral-800: #262626;
  --neutral-900: #171717;
  --neutral-950: #0a0a0a;
  
  /* Dark — для тёмных секций */
  --dark-bg: #0f0f0f;
  --dark-card: #1a1a1a;
  --dark-border: #2a2a2a;
}
```

### Применение

| Элемент | Цвет |
|---------|------|
| Фон страницы | `neutral-50` (светлый) / `dark-bg` (тёмный) |
| Текст основной | `neutral-900` / `neutral-100` |
| Текст вторичный | `neutral-600` / `neutral-400` |
| Кнопки Primary | `primary-500` → `primary-600` (hover) |
| Кнопки Secondary | `neutral-900` / `neutral-100` |
| Ссылки | `primary-600` |
| Карточки | `white` / `dark-card` |
| Бордеры | `neutral-200` / `dark-border` |

---

## Типографика

### Шрифты

```css
font-family: 'Inter', system-ui, -apple-system, sans-serif;
```

### Размеры

| Название | Size | Line Height | Weight | Использование |
|----------|------|-------------|--------|---------------|
| `display` | 72px | 1.0 | 700 | Hero заголовки |
| `h1` | 48px | 1.1 | 700 | Заголовки страниц |
| `h2` | 36px | 1.2 | 600 | Заголовки секций |
| `h3` | 24px | 1.3 | 600 | Подзаголовки |
| `h4` | 20px | 1.4 | 600 | Заголовки карточек |
| `body-lg` | 18px | 1.6 | 400 | Лид-параграфы |
| `body` | 16px | 1.6 | 400 | Основной текст |
| `body-sm` | 14px | 1.5 | 400 | Вторичный текст |
| `caption` | 12px | 1.4 | 500 | Подписи, метки |

### Tailwind классы

```html
<!-- Display -->
<h1 class="text-6xl md:text-7xl font-bold tracking-tight">

<!-- H1 -->
<h1 class="text-4xl md:text-5xl font-bold">

<!-- H2 -->
<h2 class="text-3xl font-semibold">

<!-- H3 -->
<h3 class="text-2xl font-semibold">

<!-- Body -->
<p class="text-base text-neutral-600">

<!-- Caption -->
<span class="text-sm text-neutral-500">
```

---

## Компоненты

### Кнопки

```tsx
// Primary Button
<button className="
  px-6 py-3 
  bg-primary-500 hover:bg-primary-600 
  text-white font-medium 
  rounded-lg 
  transition-colors
">
  Получить консультацию
</button>

// Secondary Button
<button className="
  px-6 py-3 
  bg-neutral-900 hover:bg-neutral-800 
  text-white font-medium 
  rounded-lg 
  transition-colors
">
  Смотреть кейсы
</button>

// Outline Button
<button className="
  px-6 py-3 
  border border-neutral-300 
  hover:border-neutral-400 
  text-neutral-900 font-medium 
  rounded-lg 
  transition-colors
">
  Узнать больше
</button>

// Ghost Button
<button className="
  px-4 py-2 
  text-neutral-600 hover:text-neutral-900 
  font-medium 
  transition-colors
">
  Все кейсы →
</button>
```

### Карточки

```tsx
// Карточка кейса
<div className="
  bg-white 
  rounded-2xl 
  border border-neutral-200 
  overflow-hidden 
  hover:shadow-lg 
  transition-shadow
">
  <img src="..." className="w-full h-48 object-cover" />
  <div className="p-6">
    <span className="text-sm text-primary-600 font-medium">E-commerce</span>
    <h3 className="text-xl font-semibold mt-2">Онлайн-магазин одежды</h3>
    <div className="grid grid-cols-2 gap-4 mt-4">
      <div>
        <p className="text-2xl font-bold">14.1М</p>
        <p className="text-sm text-neutral-500">просмотров</p>
      </div>
      <div>
        <p className="text-2xl font-bold">1.9М ₽</p>
        <p className="text-sm text-neutral-500">выручка</p>
      </div>
    </div>
  </div>
</div>
```

### Бейджи

```tsx
// Ниша
<span className="
  px-3 py-1 
  bg-primary-100 text-primary-700 
  text-sm font-medium 
  rounded-full
">
  E-commerce
</span>

// Статус
<span className="
  px-3 py-1 
  bg-green-100 text-green-700 
  text-sm font-medium 
  rounded-full
">
  Популярный
</span>
```

### Инпуты

```tsx
<input 
  type="text"
  placeholder="Ваше имя"
  className="
    w-full px-4 py-3 
    border border-neutral-300 
    rounded-lg 
    focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
    transition-shadow
  "
/>
```

---

## Секции

### Hero

```tsx
<section className="py-24 md:py-32 bg-neutral-950 text-white">
  <div className="max-w-7xl mx-auto px-4">
    <h1 className="text-5xl md:text-7xl font-bold tracking-tight max-w-4xl">
      Контент-завод под ключ
    </h1>
    <p className="text-xl text-neutral-400 mt-6 max-w-2xl">
      Масштабируем охваты и лиды через сетку аккаунтов. 
      Не надеемся на вирусность — гарантируем результат.
    </p>
    <div className="flex gap-4 mt-10">
      <button className="px-8 py-4 bg-primary-500 hover:bg-primary-600 rounded-lg font-medium">
        Получить консультацию
      </button>
      <button className="px-8 py-4 border border-neutral-700 hover:border-neutral-500 rounded-lg font-medium">
        Смотреть кейсы
      </button>
    </div>
  </div>
</section>
```

### Цифры

```tsx
<section className="py-20 bg-white">
  <div className="max-w-7xl mx-auto px-4">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
      <div className="text-center">
        <p className="text-5xl font-bold text-neutral-900">50+</p>
        <p className="text-neutral-600 mt-2">Запущенных проектов</p>
      </div>
      <div className="text-center">
        <p className="text-5xl font-bold text-neutral-900">20М+</p>
        <p className="text-neutral-600 mt-2">Просмотров в месяц</p>
      </div>
      <div className="text-center">
        <p className="text-5xl font-bold text-neutral-900">15+</p>
        <p className="text-neutral-600 mt-2">Ниш клиентов</p>
      </div>
      <div className="text-center">
        <p className="text-5xl font-bold text-neutral-900">8</p>
        <p className="text-neutral-600 mt-2">Стран присутствия</p>
      </div>
    </div>
  </div>
</section>
```

---

## Отступы и сетка

### Container

```tsx
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
```

### Section Spacing

```tsx
// Стандартная секция
<section className="py-16 md:py-24">

// Hero секция
<section className="py-24 md:py-32">

// Компактная секция
<section className="py-12 md:py-16">
```

### Grid

```tsx
// 2 колонки
<div className="grid md:grid-cols-2 gap-8">

// 3 колонки
<div className="grid md:grid-cols-3 gap-6">

// 4 колонки
<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
```

---

## Анимации

### Transitions

```css
/* Стандартный переход */
transition: all 0.2s ease;

/* Tailwind */
.transition-colors  /* цвета */
.transition-shadow  /* тени */
.transition-transform /* трансформации */
.duration-200
.ease-out
```

### Hover эффекты

```tsx
// Карточка
<div className="hover:shadow-lg hover:-translate-y-1 transition-all duration-300">

// Кнопка
<button className="hover:bg-primary-600 active:scale-95 transition-all">

// Ссылка
<a className="hover:text-primary-600 transition-colors">
```

---

## Иконки

Используем **Lucide React**:

```tsx
import { 
  ArrowRight, 
  Play, 
  Check, 
  ChevronDown,
  Instagram,
  Youtube,
  MessageCircle 
} from 'lucide-react'

<ArrowRight className="w-5 h-5" />
```

### Размеры иконок

| Размер | Класс | Использование |
|--------|-------|---------------|
| SM | `w-4 h-4` | В кнопках, инпутах |
| MD | `w-5 h-5` | Стандартный |
| LG | `w-6 h-6` | Заголовки, навигация |
| XL | `w-8 h-8` | Features |
| 2XL | `w-12 h-12` | Hero, большие блоки |

---

## Референсы

Сайты для вдохновения (из брифа):
- https://distribly.io/
- https://artemkey.ru/

Стиль: минималистичный, тёмные акценты, много белого пространства, крупная типографика, цифры как ключевой элемент.
