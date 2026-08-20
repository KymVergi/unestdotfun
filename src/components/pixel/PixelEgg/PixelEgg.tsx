import { buildEgg, type EggOptions } from '@/lib/pixel/egg';
import PixelGrid from '../PixelGrid/PixelGrid';

export interface PixelEggProps extends EggOptions {
  className?: string;
  spriteClassName?: string;
  title?: string;
  pad?: number;
}

export function PixelEgg({
  id = 1,
  crack = 0,
  open = false,
  golden = false,
  className,
  spriteClassName,
  title,
  pad = 1,
}: PixelEggProps) {
  const { grid, palette } = buildEgg({ id, crack, open, golden });
  return (
    <PixelGrid
      grid={grid}
      palette={palette}
      pad={pad}
      className={className}
      spriteClassName={spriteClassName}
      title={title}
    />
  );
}

export default PixelEgg;
