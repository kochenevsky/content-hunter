// src/app/(frontend)/price_rub/page.tsx
'use client';

import { Check, X, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const tariffData = [
  {
    name: 'Быстрый тест',
    phones: '1',
    accounts: '10',
    rent: '₽0',
    days: '10',
    posts: '200',
    price: '₽25 000',
    views: '60 000',
    forecast: '300 000',
    costPerPost: '₽125',
    costPerView: '₽0,08',
    popular: false
  },
  {
    name: 'Мини блог',
    phones: '3',
    accounts: '30',
    rent: '₽0',
    days: '10',
    posts: '400',
    price: '₽46 000',
    views: '120 000',
    forecast: '600 000',
    costPerPost: '₽115',
    costPerView: '₽0,08',
    popular: true
  },
  {
    name: 'Бизнес',
    phones: '5',
    accounts: '50',
    rent: '₽0',
    days: '10',
    posts: '600',
    price: '₽60 000',
    views: '180 000',
    forecast: '900 000',
    costPerPost: '₽100',
    costPerView: '₽0,07',
    popular: false
  },
  {
    name: 'Оптимус прайм',
    phones: '10',
    accounts: '100',
    rent: '₽0',
    days: '10',
    posts: '1 000',
    price: '₽90 000',
    views: '300 000',
    forecast: '1 500 000',
    costPerPost: '₽90',
    costPerView: '₽0,06',
    popular: false
  }
];

export default function PriceRubPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-transparent to-emerald-500/10" />
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-400/20 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Тарифы контент-фермы
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Выберите подходящий{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
                тариф
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Гибкие тарифы для любого масштаба бизнеса. Оплата в рублях, прозрачные условия
            </p>
          </div>
        </div>
      </section>

      {/* Тарифная сетка */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto rounded-2xl shadow-xl border border-gray-200 bg-white">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-green-600 to-emerald-600">
                <th className="p-6 text-left text-white font-semibold text-lg rounded-tl-2xl">
                  Тариф
                </th>
                {tariffData.map((tariff, idx) => (
                  <th key={idx} className={cn(
                    "p-6 text-center text-white font-semibold text-lg",
                    tariff.popular && "bg-white/10",
                    idx === tariffData.length - 1 && "rounded-tr-2xl"
                  )}>
                    <div className="flex flex-col items-center gap-1">
                      {tariff.name}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {/* Количество телефонов */}
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="p-6 font-medium text-gray-900">
                  <div className="flex items-center gap-2">
                    Количество Телефонов-ферм
                    <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
                  </div>
                </td>
                {tariffData.map((tariff, idx) => (
                  <td key={idx} className={cn(
                    "p-6 text-center text-gray-700",
                    tariff.popular && "bg-green-50/50"
                  )}>
                    <span className="font-semibold text-lg">{tariff.phones}</span>
                  </td>
                ))}
              </tr>

              {/* Количество аккаунтов */}
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="p-6 font-medium text-gray-900">
                  <div className="flex items-center gap-2">
                    Количество Аккаунтов в соцсетях
                    <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
                  </div>
                  <span className="text-xs text-gray-500 block">Инст, Ютуб, ТикТок</span>
                </td>
                {tariffData.map((tariff, idx) => (
                  <td key={idx} className={cn(
                    "p-6 text-center text-gray-700",
                    tariff.popular && "bg-green-50/50"
                  )}>
                    <span className="font-semibold text-lg">{tariff.accounts}</span>
                  </td>
                ))}
              </tr>

              {/* Стоимость аренды */}
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="p-6 font-medium text-gray-900">
                  <div className="flex items-center gap-2">
                    Стоимость аренды фермы в месяц
                    <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
                  </div>
                </td>
                {tariffData.map((tariff, idx) => (
                  <td key={idx} className={cn(
                    "p-6 text-center",
                    tariff.popular && "bg-green-50/50"
                  )}>
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      {tariff.rent}
                    </span>
                  </td>
                ))}
              </tr>

              {/* Дней на подготовку */}
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="p-6 font-medium text-gray-900">
                  Дней на подготовку и прогрев сетапа
                </td>
                {tariffData.map((tariff, idx) => (
                  <td key={idx} className={cn(
                    "p-6 text-center text-gray-700",
                    tariff.popular && "bg-green-50/50"
                  )}>
                    {tariff.days}
                  </td>
                ))}
              </tr>

              {/* Пакеты публикаций */}
              <tr className="bg-gray-50">
                <td className="p-6 font-medium text-gray-900">
                  Пакеты (наборы) публикаций
                </td>
                {tariffData.map((tariff, idx) => (
                  <td key={idx} className={cn(
                    "p-6 text-center",
                    tariff.popular && "bg-green-100/50"
                  )}>
                    <span className="font-bold text-xl text-gray-900">{tariff.posts}</span>
                  </td>
                ))}
              </tr>

              {/* Стоимость пакета */}
              <tr>
                <td className="p-6 font-medium text-gray-900">
                  Стоимость пакета публикаций в месяц
                </td>
                {tariffData.map((tariff, idx) => (
                  <td key={idx} className={cn(
                    "p-6 text-center",
                    tariff.popular && "bg-green-50/50"
                  )}>
                    <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
                      {tariff.price}
                    </span>
                  </td>
                ))}
              </tr>

              {/* Страховка - Гарантия просмотров */}
              <tr className="bg-amber-50">
                <td className="p-6 font-medium text-gray-900">
                  <div className="flex items-center gap-2">
                    <span className="text-amber-600">🛡️ Страховка!!!</span>
                    <span className="text-sm text-gray-600">Гарантия количества просмотров</span>
                  </div>
                </td>
                {tariffData.map((tariff, idx) => (
                  <td key={idx} className={cn(
                    "p-6 text-center bg-amber-50",
                    tariff.popular && "bg-amber-100/50"
                  )}>
                    <span className="font-bold text-lg text-amber-700">
                      {tariff.views}
                    </span>
                  </td>
                ))}
              </tr>

              {/* Прогноз просмотров */}
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="p-6 font-medium text-gray-900">
                  Прогноз количества просмотров
                </td>
                {tariffData.map((tariff, idx) => (
                  <td key={idx} className={cn(
                    "p-6 text-center text-gray-700",
                    tariff.popular && "bg-green-50/50"
                  )}>
                    <span className="font-semibold text-lg">{tariff.forecast}</span>
                  </td>
                ))}
              </tr>

              {/* Стоимость 1 публикации */}
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="p-6 font-medium text-gray-900">
                  Стоимость 1 публикации
                </td>
                {tariffData.map((tariff, idx) => (
                  <td key={idx} className={cn(
                    "p-6 text-center text-gray-700",
                    tariff.popular && "bg-green-50/50"
                  )}>
                    {tariff.costPerPost}
                  </td>
                ))}
              </tr>

              {/* Стоимость 1 просмотра */}
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="p-6 font-medium text-gray-900">
                  Стоимость 1 просмотра
                </td>
                {tariffData.map((tariff, idx) => (
                  <td key={idx} className={cn(
                    "p-6 text-center text-gray-700",
                    tariff.popular && "bg-green-50/50"
                  )}>
                    {tariff.costPerView}
                  </td>
                ))}
              </tr>

              
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden space-y-6">
          {tariffData.map((tariff, idx) => (
            <div key={idx} className={cn(
              "bg-white rounded-2xl shadow-xl border overflow-hidden",
              tariff.popular ? "border-green-500 ring-2 ring-green-500/20" : "border-gray-200"
            )}>
              {/* Заголовок карточки */}
              <div className={cn(
                "p-6 text-white",
                tariff.popular 
                  ? "bg-gradient-to-r from-green-600 to-emerald-600" 
                  : "bg-gradient-to-r from-gray-800 to-gray-700"
              )}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold">{tariff.name}</h3>
                  {tariff.popular && (
                    <span className="text-xs bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full font-medium">
                      Популярный
                    </span>
                  )}
                </div>
                <div className="text-3xl font-bold">{tariff.price}</div>
                <div className="text-sm opacity-90">в месяц</div>
              </div>

              {/* Содержимое карточки */}
              <div className="p-6 space-y-4">
                <div className="space-y-3">
                  <RowItem label="Телефонов-ферм" value={tariff.phones} />
                  <RowItem label="Аккаунтов в соцсетях" value={tariff.accounts} />
                  <RowItem 
                    label="Аренда фермы" 
                    value={tariff.rent}
                    valueClassName="text-green-600 font-semibold"
                  />
                  <RowItem label="Дней на подготовку" value={tariff.days} />
                  
                  <div className="pt-2 border-t border-gray-200">
                    <RowItem 
                      label="Пакет публикаций" 
                      value={tariff.posts}
                      valueClassName="text-xl font-bold"
                    />
                  </div>

                  <div className="bg-amber-50 p-4 rounded-xl">
                    <div className="text-sm text-amber-800 mb-1">🛡️ Страховка - гарантия просмотров</div>
                    <div className="text-2xl font-bold text-amber-700">{tariff.views}</div>
                  </div>

                  <RowItem label="Прогноз просмотров" value={tariff.forecast} />
                  <RowItem label="Стоимость 1 публикации" value={tariff.costPerPost} />
                  <RowItem label="Стоимость 1 просмотра" value={tariff.costPerView} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// Компонент для строки в мобильной карточке
function RowItem({ 
  label, 
  value, 
  valueClassName 
}: { 
  label: string; 
  value: string; 
  valueClassName?: string;
}) {
  return (
    <div className="flex justify-between items-center py-1">
      <span className="text-gray-600 text-sm">{label}</span>
      <span className={cn("font-medium text-gray-900", valueClassName)}>{value}</span>
    </div>
  );
}
