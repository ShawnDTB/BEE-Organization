type LogoLockupProps = {
  compact?: boolean;
};

export function LogoLockup({ compact = false }: LogoLockupProps) {
  return (
    <a
      className={`logo-lockup${compact ? " logo-lockup--compact" : ""}`}
      href="/"
      aria-label="Works by BEE home"
    >
      <span className="bee-brand-signature">
        <small>WORKS BY</small>
        <img
          className="bee-wordmark"
          src="/brand/bee-wordmark.svg"
          width="300"
          height="120"
          alt=""
        />
      </span>
      <span className="bee-brand-descriptor">
        <strong>CUSTOM APPAREL</strong>
        <small>& EMBROIDERY</small>
      </span>
    </a>
  );
}
