import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: { translation: { dashboard: 'Dashboard', products: 'Products', orders: 'Orders', users: 'Users', settings: 'Settings', logout: 'Logout' } },
  uz: { translation: { dashboard: 'Boshqaruv', products: 'Mahsulotlar', orders: 'Buyurtmalar', users: 'Foydalanuvchilar', settings: 'Sozlamalar', logout: 'Chiqish' } },
  ru: { translation: { dashboard: 'Панель', products: 'Товары', orders: 'Заказы', users: 'Пользователи', settings: 'Настройки', logout: 'Выход' } }
};

i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem('lang') || 'en',
  interpolation: { escapeValue: false }
});

export default i18n;
