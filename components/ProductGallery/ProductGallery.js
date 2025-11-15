import { useState, useEffect } from 'react';
import styles from './ProductGallery.module.css';

export default function ProductGallery({ images = [] }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  // Если изображений нет, используем заглушку
  const displayImages = images.length > 0 ? images : ['/images/placeholder.jpg'];

  // Автопрокрутка слайдера
  useEffect(() => {
    if (!autoPlay || displayImages.length <= 1) return;

    const interval = setInterval(() => {
      setSelectedImage(prev => (prev + 1) % displayImages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [autoPlay, displayImages.length]);

  const nextImage = () => {
    setSelectedImage(prev => (prev + 1) % displayImages.length);
  };

  const prevImage = () => {
    setSelectedImage(prev => (prev - 1 + displayImages.length) % displayImages.length);
  };

  const goToImage = (index) => {
    setSelectedImage(index);
    setAutoPlay(false); // Останавливаем автопрокрутку при ручном выборе
  };

  return (
    <div 
      className={styles.gallery}
      onMouseEnter={() => setAutoPlay(false)}
      onMouseLeave={() => setAutoPlay(true)}
    >
      {/* Основное изображение с кнопками навигации */}
      <div className={styles.mainImageContainer}>
        <div className={styles.mainImage}>
          <img
            src={displayImages[selectedImage]}
            alt={`Product view ${selectedImage + 1}`}
            className={styles.image}
          />
        </div>

        {/* Кнопки навигации (только если больше 1 изображения) */}
        {displayImages.length > 1 && (
          <>
            <button 
              className={`${styles.navButton} ${styles.prevButton}`}
              onClick={prevImage}
              aria-label="Previous image"
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button 
              className={`${styles.navButton} ${styles.nextButton}`}
              onClick={nextImage}
              aria-label="Next image"
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Индикатор текущего слайда */}
        {displayImages.length > 1 && (
          <div className={styles.slideIndicator}>
            {selectedImage + 1} / {displayImages.length}
          </div>
        )}
      </div>
      
      {/* Миниатюры */}
      {displayImages.length > 1 && (
        <div className={styles.thumbnails}>
          {displayImages.map((image, index) => (
            <button
              key={index}
              className={`${styles.thumbnail} ${selectedImage === index ? styles.thumbnailActive : ''}`}
              onClick={() => goToImage(index)}
            >
              <img
                src={image}
                alt={`Thumbnail ${index + 1}`}
                className={styles.thumbnailImage}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}