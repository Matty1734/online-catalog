import { useState } from 'react';
import Link from 'next/link';
import { getProductPrices, formatPrice } from '../../utils/currency';
import styles from './ProductCard.module.css';

export default function ProductCard({ product }) {
  const [isFavorite, setIsFavorite] = useState(false);

  // Используем консистентные цены
  const { currentPrice, oldPrice, discountPercentage } = getProductPrices(product);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    alert('Товар добавлен в корзину!');
  };

  const toggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  return (
    <Link href={`/products/${product.id}`}>
      <div className={styles.productCard}>
        {/* Изображение и бейджи */}
        <div className={styles.imageContainer}>
          <img
            src={product.thumbnail}
            alt={product.title}
            className={styles.image}
          />
          
          {/* Бейдж скидки */}
          <div className={styles.discountBadge}>
            -{discountPercentage}%
          </div>
          
          {/* Кнопка избранного */}
          <button
            onClick={toggleFavorite}
            className={styles.favoriteBtn}
          >
            <svg 
              className={`${styles.favoriteIcon} ${isFavorite ? styles.favoriteIconActive : ''}`}
              fill={isFavorite ? "currentColor" : "none"}
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>

        {/* Цены */}
        <div className={styles.prices}>
          <div className={styles.leftPrice}>
            <span className={styles.currentPrice}>{formatPrice(currentPrice)} ₽</span>
            <span className={styles.currentPriceLabel}>С картой</span>
          </div>
          
          {/* Правая часть - старая цена (без скидки) */}
          <div className={styles.rightPrice}>
            <span className={styles.oldPrice}>{formatPrice(oldPrice)} ₽</span>
            <span className={styles.oldPriceLabel}>Обычная</span>
          </div>
        </div>

        {/* Название товара */}
        <h3 className={styles.title}>{product.title}</h3>

        {/* Рейтинг */}
        <div className={styles.rating}>
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              className={`${styles.star} ${i < 4 ? styles.starActive : ''}`}
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>

        {/* Кнопка корзины */}
        <button
          onClick={handleAddToCart}
          className={styles.cartBtn}
        >
          <span>В корзину</span>
        </button>
      </div>
    </Link>
  );
}