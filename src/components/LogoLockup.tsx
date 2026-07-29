type LogoLockupProps = {
  compact?: boolean;
};

export function LogoLockup({ compact = false }: LogoLockupProps) {
  return (
    <a className={`logo-lockup${compact ? ' logo-lockup--compact' : ''}`} href="#top" aria-label="BEE Assembly home">
      <img src="/brand/rebrand/bee-assembly-mark.svg" alt="" />
      {!compact && (
        <span>
          <strong>BEE ASSEMBLY</strong>
          <small>CUSTOM APPAREL · EMBROIDERY · CREATOR GOODS</small>
        </span>
      )}
    </a>
  );
}
