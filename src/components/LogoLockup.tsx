type LogoLockupProps = {
  compact?: boolean;
};

export function LogoLockup({ compact = false }: LogoLockupProps) {
  return (
    <a className={`logo-lockup${compact ? ' logo-lockup--compact' : ''}`} href="#top" aria-label="BEE Works home">
      <img src="/brand/final/bee-works-mark.svg" alt="" />
      {!compact && (
        <span>
          <strong>BEE WORKS</strong>
          <small>APPAREL · EMBROIDERY · CREATION</small>
        </span>
      )}
    </a>
  );
}
