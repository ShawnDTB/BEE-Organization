import { siteConfig } from '../content/siteContent';

type LogoLockupProps = {
  compact?: boolean;
};

export function LogoLockup({ compact = false }: LogoLockupProps) {
  return (
    <a className={`logo-lockup${compact ? ' logo-lockup--compact' : ''}`} href="/" aria-label="BEE Organization home">
      <img src="/brand/bee-modular-mark.svg" alt="" />
      <span>
        <strong>{siteConfig.workingName.toUpperCase()}</strong>
        <small>{compact ? 'CUSTOM APPAREL STUDIO' : siteConfig.descriptor.toUpperCase()}</small>
      </span>
    </a>
  );
}
