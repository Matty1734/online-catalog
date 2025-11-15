import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import ProductGallery from '../../components/ProductGallery/ProductGallery';
import RelatedProducts from '../../components/RelatedProducts/RelatedProducts';
import { getProductPrices, formatPrice } from '../../utils/currency';
import styles from './ProductPage.module.css';

export default function ProductPage() {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`https://dummyjson.com/products/${id}`);
      
      if (!response.ok) {
        throw new Error('Товар не найден');
      }
      
      const data = await response.json();
      setProduct(data);
    } catch (error) {
      console.error('Error fetching product:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <Header />
        <div className={styles.loading}>Загрузка...</div>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className={styles.page}>
        <Header />
        <div className={styles.error}>
          <h1>Товар не найден</h1>
          <p>{error || 'Произошла ошибка при загрузке товара'}</p>
          <button onClick={() => router.push('/')} className={styles.backButton}>
            Вернуться на главную
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  // Используются консистентные цены (такие же как в карточках)
  const { currentPrice, oldPrice, discountPercentage } = getProductPrices(product);

  return (
    <div className={styles.page}>
      <Head>
        <title>{product.title} - Магазин</title>
        <meta name="description" content={product.description} />
      </Head>

      <Header />

      <main className={styles.main}>
        <div className={styles.container}>
          {/* Навигационная цепочка */}
          <Breadcrumbs items={[
            { label: 'Главная', href: '/' },
            { label: 'Каталог', href: '/search' },
            { label: product.category, href: `/search?category=${product.category}` },
            { label: product.title, href: `/products/${product.id}` }
          ]} />

          <div className={styles.productLayout}>
            {/* Галерея изображений */}
            <ProductGallery images={product.images} />

            {/* Информация о товаре */}
            <div className={styles.info}>
              <div className={styles.header}>
                <h1 className={styles.title}>{product.title}</h1>
                <p className={styles.sku}>Артикул: {product.id}</p>
              </div>

              {/* Рейтинг и действия */}
              <div className={styles.ratingActions}>
                <div className={styles.rating}>
                  <div className={styles.stars}>
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`${styles.star} ${i < Math.floor(product.rating) ? styles.starActive : ''}`}
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className={styles.reviews}>({Math.floor(Math.random() * 100) + 1} отзывов)</span>
                </div>
                
                <div className={styles.actions}>
                  <button className={styles.actionBtn}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M14.5 5C14.5 3.067 16.067 1.5 18 1.5C19.933 1.5 21.5 3.067 21.5 5C21.5 6.933 19.933 8.5 18 8.5C16.067 8.5 14.5 6.933 14.5 5ZM18 2.5C16.6193 2.5 15.5 3.61929 15.5 5C15.5 6.38071 16.6193 7.5 18 7.5C19.3807 7.5 20.5 6.38071 20.5 5C20.5 3.61929 19.3807 2.5 18 2.5Z" fill="#414141"/>
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M2.5 12C2.5 10.067 4.067 8.5 6 8.5C7.933 8.5 9.5 10.067 9.5 12C9.5 13.933 7.933 15.5 6 15.5C4.067 15.5 2.5 13.933 2.5 12ZM6 9.5C4.61929 9.5 3.5 10.6193 3.5 12C3.5 13.3807 4.61929 14.5 6 14.5C7.38071 14.5 8.5 13.3807 8.5 12C8.5 10.6193 7.38071 9.5 6 9.5Z" fill="#414141"/>
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M14.5 19C14.5 17.067 16.067 15.5 18 15.5C19.933 15.5 21.5 17.067 21.5 19C21.5 20.933 19.933 22.5 18 22.5C16.067 22.5 14.5 20.933 14.5 19ZM18 16.5C16.6193 16.5 15.5 17.6193 15.5 19C15.5 20.3807 16.6193 21.5 18 21.5C19.3807 21.5 20.5 20.3807 20.5 19C20.5 17.6193 19.3807 16.5 18 16.5Z" fill="#414141"/>
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M8.15792 13.2583C8.29695 13.0197 8.60307 12.939 8.84166 13.078L15.6717 17.058C15.9103 17.197 15.991 17.5031 15.8519 17.7417C15.7129 17.9803 15.4068 18.061 15.1682 17.922L8.33819 13.942C8.0996 13.803 8.01889 13.4969 8.15792 13.2583Z" fill="#414141"/>
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M15.8418 6.25799C15.981 6.49649 15.9004 6.80266 15.6619 6.94184L8.84194 10.9218C8.60344 11.061 8.29727 10.9805 8.15808 10.742C8.0189 10.5035 8.09941 10.1973 8.33791 10.0582L15.1579 6.07816C15.3964 5.93897 15.7026 6.01948 15.8418 6.25799Z" fill="#414141"/>
                      </svg>

                    <span>Поделиться</span>
                  </button>
                  
                  <button className={styles.actionBtn}>
                      <svg width="22" height="20" viewBox="0 0 22 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M11.6577 1.75827C12.783 0.632497 14.3095 0 15.9013 0C17.493 0 19.0195 0.632466 20.1448 1.75819C21.2705 2.88347 21.9031 4.41012 21.9031 6.00183C21.9031 7.59357 21.2706 9.12009 20.1448 10.2454C20.1448 10.2454 20.1449 10.2454 20.1448 10.2454L11.3048 19.0854C11.1096 19.2806 10.793 19.2806 10.5977 19.0854L1.75774 10.2454C-0.585912 7.90173 -0.585912 4.10192 1.75774 1.75827C4.10139 -0.585378 7.90119 -0.585378 10.2448 1.75827L10.9513 2.46472L11.6577 1.75827C11.6578 1.75824 11.6577 1.7583 11.6577 1.75827ZM15.9013 1C14.5748 1 13.3027 1.52711 12.3649 2.4653L11.3048 3.52538C11.2111 3.61915 11.0839 3.67183 10.9513 3.67183C10.8187 3.67183 10.6915 3.61915 10.5977 3.52538L9.53774 2.46538C7.58461 0.512254 4.41797 0.512254 2.46484 2.46538C0.511719 4.4185 0.511719 7.58515 2.46484 9.53827L10.9513 18.0247L19.4377 9.53827C20.3759 8.60052 20.9031 7.32831 20.9031 6.00183C20.9031 4.67534 20.376 3.40321 19.4378 2.46546C18.5001 1.52727 17.2278 1 15.9013 1Z" fill="#414141"/>
                      </svg>

                    <span>В избранное</span>
                  </button>
                </div>
              </div>

              {/* Цена и кнопка корзины */}
              <div className={styles.purchase}>
                <div className={styles.prices}>
                  {/* Левая цена - обычная */}
                  <div className={styles.leftPrice}>
                    <span className={styles.oldPriceValue}>{formatPrice(oldPrice)} ₽</span>
                    <span className={styles.oldPriceLabel}>Цена без скидки</span>
                  </div>
                  
                  {/* Правая цена - по карте */}
                  <div className={styles.rightPrice}>
                    <span className={styles.currentPriceValue}>{formatPrice(currentPrice)} ₽</span>
                    <span className={styles.currentPriceLabel}>С картой</span>
                  </div>
                </div>
                
                <button 
                  className={styles.cartBtn}
                  onClick={() => alert('Товар добавлен в корзину!')}
                >
                  В корзину
                </button>
                
                <div className={styles.availability}>
                  <svg className={styles.inStockIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>В наличии</span>
                </div>
              </div>

              {/* Характеристики */}
              <div className={styles.specs}>
                <h3 className={styles.specsTitle}>Характеристики</h3>
                <div className={styles.specsList}>
                  <div className={styles.specItem}>
                    <span className={styles.specLabel}>Бренд:</span>
                    <span className={styles.specValue}>{product.brand}</span>
                  </div>
                  <div className={styles.specItem}>
                    <span className={styles.specLabel}>Категория:</span>
                    <span className={styles.specValue}>{product.category}</span>
                  </div>
                  <div className={styles.specItem}>
                    <span className={styles.specLabel}>Описание:</span>
                    <span className={styles.specValue}>{product.description}</span>
                  </div>
                  <div className={styles.specItem}>
                    <span className={styles.specLabel}>Скидка:</span>
                    <span className={styles.specValue}>{discountPercentage}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Похожие товары */}
          <RelatedProducts category={product.category} currentProductId={product.id} />
        </div>
      </main>

      <Footer />
    </div>
  );
}