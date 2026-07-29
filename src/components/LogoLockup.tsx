import { siteConfig } from '../content/siteContent';

type LogoLockupProps = {
  compact?: boolean;
};

export function LogoLockup({ compact = false }: LogoLockupProps) {
  return (
    <a className={`logo-lockup${compact ? ' logo-lockup--compact' : ''}`} href="/" aria-label="BEE Organization home">
      <img src="/brand/placeholder/bee-organization-mark.svg" alt="" />
      {!compact && (
        <span>
          <strong>{siteConfig.workingName.toUpperCase()}</strong>
          <small>{siteConfig.descriptor.toUpperCase()}</small>
        </span>
      )}
      {compact && <span><strong>{siteConfig.workingName.toUpperCase()}</strong><small>WORKING IDENTITY</small></span>}
    </a>
  );
}
