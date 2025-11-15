import { useState, useEffect } from 'react';
import ProductCard from '../ProductCard/ProductCard';
import styles from './RelatedProducts.module.css';

export default function RelatedProducts({ category, currentProductId }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (category) {
      fetchRelatedProducts();
    }
  }, [category]);

  const fetchRelatedProducts = async () => {
    try {
      setLoading(true);
      // Используем API для получения товаров по категории
      const response = await fetch(`https://dummyjson.com/products/category/${category}`);
      const data = await response.json();
      // Исключается текущий товар из списка похожих
      const filteredProducts = data.products.filter(product => product.id !== currentProductId);
      setProducts(filteredProducts.slice(0, 4)); // Беру только 4 товара
    } catch (error) {
      console.error('Error fetching related products:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className={styles.relatedProducts}>
        <h2 className={styles.title}>С этим товаром покупают</h2>
        <div className={styles.productsGrid}>
          {[...Array(4)].map((_, i) => (
            <div key={i} className={styles.productCardSkeleton}>
              <div className={`${styles.skeletonImage} ${styles.animatePulse}`}></div>
              <div className={`${styles.skeletonText} ${styles.animatePulse}`}></div>
              <div className={`${styles.skeletonPrice} ${styles.animatePulse}`}></div>
              <div className={`${styles.skeletonButton} ${styles.animatePulse}`}></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <section className={styles.relatedProducts}>
      <h2 className={styles.title}>С этим товаром покупают</h2>
      <div className={styles.productsGrid}>
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}