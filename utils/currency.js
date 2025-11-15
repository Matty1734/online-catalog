// Курс 1 $ = 100 RUB
const EXCHANGE_RATE = 100;

export const usdToRub = (usdPrice) => {
  return (usdPrice * EXCHANGE_RATE);
};

export const formatPrice = (price) => {
  return new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(price);
};

// Функция для расчета цены со скидкой
export const calculateDiscountedPrice = (price, discountPercentage = 50) => {
  return price * (1 - discountPercentage / 100);
};

// Функция для получения цен товара
export const getProductPrices = (product) => {
  const basePriceRub = usdToRub(product.price);
  const discountedPriceRub = calculateDiscountedPrice(basePriceRub);
  
  return {
    currentPrice: discountedPriceRub,
    oldPrice: basePriceRub,
    discountPercentage: 50 // Скидка
  };
};