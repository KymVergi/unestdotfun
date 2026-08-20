import PixelEgg from '@/components/pixel/PixelEgg/PixelEgg';
import { PixelLink } from '@/components/pixel/PixelButton/PixelButton';
import styles from './not-found.module.css';

export default function NotFound() {
  return (
    <div className={styles.wrap}>
      <div className={styles.art}>
        <PixelEgg id={404} crack={3} title="A cracked, empty EGG" />
      </div>
      <span className={styles.code}>404</span>
      <h1 className={styles.title}>NOTHING HATCHED HERE</h1>
      <p className={styles.text}>
        This corner of the Farm is empty. The page you were looking for does not exist — or has not
        been built yet.
      </p>
      <div className={styles.actions}>
        <PixelLink href="/" size="lg">
          BACK TO THE FARM
        </PixelLink>
        <PixelLink href="/docs" size="lg" variant="ghost">
          READ THE DOCS
        </PixelLink>
      </div>
    </div>
  );
}
