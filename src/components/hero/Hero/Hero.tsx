import FarmScene from '@/components/farm/FarmScene/FarmScene';
import HeroEgg from '@/components/hero/HeroEgg/HeroEgg';
import Badge from '@/components/pixel/Badge/Badge';
import { PixelLink } from '@/components/pixel/PixelButton/PixelButton';
import {
  HERO_HEADLINE,
  HERO_SUBHEADLINE,
  HERO_SUPPORT,
  PROTOCOL_STATS,
  SLOGAN_PRIMARY,
} from '@/config/protocol';
import { NETWORK_SHORT } from '@/config/contracts';
import styles from './Hero.module.css';

export function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.background} aria-hidden="true">
        <FarmScene className={styles.sceneFull} variant="full" />
        <FarmScene className={styles.sceneSimple} variant="simple" />
        <span className={styles.fade} />
      </div>

      <div className={styles.inner}>
        <div className={styles.copy}>
          <Badge tone="live" dot className={styles.badge}>
            LIVE ON {NETWORK_SHORT}
          </Badge>

          <h1 className={styles.title}>{HERO_HEADLINE}</h1>
          <p className={styles.subtitle}>{HERO_SUBHEADLINE}</p>
          <p className={styles.support}>{HERO_SUPPORT}</p>

          <div className={styles.equation} aria-label="$UNEST is the token, EGG is the NFT">
            <span className={styles.eqItem}>
              <b>$UNEST</b> THE FUEL
            </span>
            <span className={styles.eqPlus}>+</span>
            <span className={styles.eqItem}>
              <b>EGG</b> THE LIFE
            </span>
          </div>

          <div className={styles.actions}>
            <PixelLink href="/nest" size="lg">
              ENTER THE NEST
            </PixelLink>
            <PixelLink href="/protocol" size="lg" variant="ghost">
              READ THE PROTOCOL
            </PixelLink>
          </div>

          <p className={styles.slogan}>{SLOGAN_PRIMARY}</p>
        </div>

        <div className={styles.stageCol}>
          <HeroEgg />
        </div>
      </div>

      <div className={styles.stats}>
        <div className={styles.statsInner}>
          {Object.values(PROTOCOL_STATS).map((s) => (
            <div key={s.label} className={styles.stat}>
              <span className={styles.statValue}>{s.value}</span>
              <span className={styles.statLabel}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Hero;
