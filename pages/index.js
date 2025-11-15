import { useState, useEffect } from 'react';
import Head from 'next/head';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import ProductCard from '../components/ProductCard/ProductCard';
import SearchBar from '../components/SearchBar/SearchBar';
import Breadcrumbs from '../components/Breadcrumbs/Breadcrumbs';
import CategoryFilter from '../components/CategoryFilter/CategoryFilter';
import styles from './Home.module.css';

export default function Home() {
  // Состояния для данных
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  
  // Состояния для загрузки
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  
  // Состояния для фильтров
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  
  // Состояния для пагинации
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // Загрузка товаров при первом открытии страницы
  useEffect(() => {
    loadInitialData();
  }, []);

  // Основная функция загрузки данных
  const loadInitialData = async () => {
    try {
      setLoading(true);
      
      // Загружаем все товары для поиска
      const allProductsResponse = await fetch('https://dummyjson.com/products?limit=100');
      const allProductsData = await allProductsResponse.json();
      setAllProducts(allProductsData.products);
      
      // Загружаем первые 16 товаров для отображения
      const initialProductsResponse = await fetch('https://dummyjson.com/products?limit=16');
      const initialProductsData = await initialProductsResponse.json();
      setProducts(initialProductsData.products);
      setSkip(16); // Устанавливаем, с какого товара продолжать загрузку
      
    } catch (error) {
      console.error('Ошибка при загрузке товаров:', error);
    } finally {
      setLoading(false);
    }
  };

  // Загрузка товаров по категории
  const loadProductsByCategory = async (category) => {
    try {
      setLoading(true);
      const response = await fetch(`https://dummyjson.com/products/category/${category}`);
      const data = await response.json();
      setProducts(data.products);
      setHasMore(false); // Для категорий отключаю кнопку "Загрузить ещё"
    } catch (error) {
      console.error('Ошибка при загрузке категории:', error);
    } finally {
      setLoading(false);
    }
  };

  // Обработчик выбора категории
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setSearchQuery(''); // Сбрасываю поиск при выборе категории
    
    if (category === '') {
      // Если выбрана категория "Все товары", загружаю первоначальные товары
      loadInitialData();
      setHasMore(true);
    } else {
      // Загружаю товары по выбранной категории
      loadProductsByCategory(category);
    }
  };

  // Обработчик поиска
  const handleSearch = async (query) => {
    setSearchQuery(query);
    setSelectedCategory(''); // Сбрасываю категорию при поиске
    
    // Если поиск пустой, показываются обычные товары
    if (query.trim() === '') {
      if (products.length === 0) {
        const response = await fetch('https://dummyjson.com/products?limit=16');
        const data = await response.json();
        setProducts(data.products);
      }
      return;
    }

    // Запускается поиск
    setSearchLoading(true);
    
    try {
      // Использую апи поиска
      const response = await fetch(`https://dummyjson.com/products/search?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      setProducts(data.products);
    } catch (error) {
      console.error('Ошибка поиска:', error);
      // Если API поиска не работает, фильтрую локально
      const filtered = allProducts.filter(product =>
        product.title.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase())
      );
      setProducts(filtered);
    } finally {
      setSearchLoading(false);
    }
  };

  // Загрузка дополнительных товаров
  const loadMoreProducts = async () => {
    if (!hasMore || selectedCategory) return;

    try {
      const response = await fetch(`https://dummyjson.com/products?limit=8&skip=${skip}`);
      const data = await response.json();
      
      // Если товаров больше нет, скрывается кнопка
      if (data.products.length === 0) {
        setHasMore(false);
        return;
      }

      // Добавлябтся новые товары к существующим
      setProducts(prev => [...prev, ...data.products]);
      setSkip(prev => prev + 8);
      
      // В апи всего 100 товаров, поэтому ограничиваю
      if (skip + 8 >= 100) {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Ошибка при загрузке товаров:', error);
    }
  };

  // Получаем название выбранной категории для отображения
  const getCategoryName = () => {
    if (!selectedCategory) return '';
    // Здесь можно было бы получить название категории из API категорий, но для простоты просто возвращаем выбранную категорию
    return selectedCategory;
  };

  return (
    <div className={styles.page}>
      <Head>
        <title>Магазин - Поиск товаров</title>
        <meta name="description" content="Онлайн каталог товаров" />
      </Head>

      <Header />

      <main className={styles.main}>
        <div className={styles.container}>
          {/* Навигационная цепочка */}
          <Breadcrumbs items={[
            { label: 'Главная', href: '/' },
            { label: 'Поиск', href: '/search' }
          ]} />

          {/* Заголовок страницы */}
          <h1 className={styles.pageTitle}>Поиск</h1>

          {/* Строка с фильтрами */}
          <div className={styles.filtersRow}>
            {/* Поисковая строка */}
            <div className={styles.searchSection}>
              <SearchBar 
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Найти товар"
              />
            </div>

            {/* Фильтр по категориям */}
            <CategoryFilter 
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategorySelect}
            />
          </div>

          {/* Показываем, какая категория выбрана */}
          {selectedCategory && (
            <div className={styles.categoryInfo}>
              <h2 className={styles.categoryTitle}>
                Категория: {getCategoryName()}
                <button 
                  className={styles.clearCategory}
                  onClick={() => handleCategorySelect('')}
                >
                  × Очистить
                </button>
              </h2>
            </div>
          )}

          {/* Индикатор загрузки при поиске */}
          {searchLoading && (
            <div className={styles.searchLoading}>
              <div className={styles.loadingSpinner}></div>
              <span>Поиск товаров...</span>
            </div>
          )}

          {/* Сетка товаров */}
          {loading ? (
            // Пока загружаем, показываем скелетоны
            <div className={styles.productsGrid}>
              {[...Array(8)].map((_, i) => (
                <div key={i} className={styles.productCardSkeleton}>
                  <div className={`${styles.skeletonImage} ${styles.animatePulse}`}></div>
                  <div className={`${styles.skeletonText} ${styles.animatePulse}`}></div>
                  <div className={`${styles.skeletonPrice} ${styles.animatePulse}`}></div>
                  <div className={`${styles.skeletonButton} ${styles.animatePulse}`}></div>
                </div>
              ))}
            </div>
          ) : (
            // Когда загрузилось, показываем товары
            <>
              {/* Сообщение, если ничего не найдено */}
              {products.length === 0 && (searchQuery || selectedCategory) && !searchLoading && (
                <div className={styles.noResults}>
                  <h3>Товары не найдены</h3>
                  <p>Попробуйте изменить поисковый запрос или выбрать другую категорию</p>
                </div>
              )}

              {/* Сетка с товарами */}
              <div className={styles.productsGrid}>
                {products.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Кнопка "Загрузить ещё" - показываем только когда нужно */}
              {!searchQuery && !selectedCategory && hasMore && products.length > 0 && (
                <div className={styles.loadMoreSection}>
                  <button
                    onClick={loadMoreProducts}
                    className={styles.loadMoreBtn}
                  >
                    Загрузить ещё
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}