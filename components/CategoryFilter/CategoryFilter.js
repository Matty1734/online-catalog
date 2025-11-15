import { useState, useEffect, useRef } from 'react';
import styles from './CategoryFilter.module.css';

export default function CategoryFilter({ selectedCategory, onCategoryChange }) {
  const [categories, setCategories] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  // Закрытие при клике вне его области
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('https://dummyjson.com/products/categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySelect = (category) => {
    onCategoryChange(category);
    setIsOpen(false);
  };

  const getSelectedCategoryName = () => {
    if (!selectedCategory) return 'Все категории';
    const category = categories.find(cat => cat.slug === selectedCategory);
    return category ? category.name : 'Все категории';
  };

  if (loading) {
    return (
      <div className={styles.categoryFilter}>
        <button className={styles.dropdownButton} disabled>
          Загрузка категорий...
        </button>
      </div>
    );
  }

  return (
    <div className={styles.categoryFilter} ref={dropdownRef}>
      <button 
        className={styles.dropdownButton}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{getSelectedCategoryName()}</span>
        <svg 
          className={`${styles.dropdownIcon} ${isOpen ? styles.dropdownIconOpen : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className={styles.dropdownMenu}>
          <button
            className={`${styles.dropdownItem} ${!selectedCategory ? styles.dropdownItemActive : ''}`}
            onClick={() => handleCategorySelect('')}
          >
            Все категории
          </button>
          {categories.map(category => (
            <button
              key={category.slug}
              className={`${styles.dropdownItem} ${selectedCategory === category.slug ? styles.dropdownItemActive : ''}`}
              onClick={() => handleCategorySelect(category.slug)}
            >
              {category.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}