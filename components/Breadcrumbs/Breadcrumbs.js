import Link from 'next/link';
import styles from './Breadcrumbs.module.css';

export default function Breadcrumbs({ items }) {
  return (
    <nav className={styles.breadcrumbs}>
      {items.map((item, index) => (
        <div key={item.href} className={styles.breadcrumbItem}>
          {index < items.length - 1 ? (
            <>
              <Link href={item.href} className={styles.breadcrumbLink}>
                {item.label}
              </Link>
              <span className={styles.breadcrumbSeparator}> <svg width="24" height="10" viewBox="0 0 7 13" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M0.146447 0.146447C0.341709 -0.0488155 0.658291 -0.0488155 0.853553 0.146447L6.85355 6.14645C7.04882 6.34171 7.04882 6.65829 6.85355 6.85355L0.853553 12.8536C0.658291 13.0488 0.341709 13.0488 0.146447 12.8536C-0.0488155 12.6583 -0.0488155 12.3417 0.146447 12.1464L5.79289 6.5L0.146447 0.853553C-0.0488155 0.658291 -0.0488155 0.341709 0.146447 0.146447Z" fill="#414141"/>
</svg>
 </span>
            </>
          ) : (
            <span className={styles.breadcrumbCurrent}>{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}