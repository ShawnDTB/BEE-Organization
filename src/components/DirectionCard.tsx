import type { BrandDirection } from '../types/brand';

type DirectionCardProps = {
  direction: BrandDirection;
  active: boolean;
  onSelect: (direction: BrandDirection) => void;
};

export function DirectionCard({ direction, active, onSelect }: DirectionCardProps) {
  return (
    <article className={`direction-card${active ? ' is-active' : ''}`}>
      <button type="button" onClick={() => onSelect(direction)} aria-pressed={active}>
        <span className="direction-card__number">{direction.number}</span>
        <span className="direction-card__title">
          <strong>{direction.name}</strong>
          <small>{direction.tagline}</small>
        </span>
        {direction.recommended && <span className="direction-card__badge">Recommended</span>}
      </button>
      <div className="direction-card__body">
        <div className="direction-card__logo-stage">
          <img src={direction.logo} alt={`${direction.name} logo concept`} />
        </div>
        <p>{direction.thesis}</p>
        <p className="direction-card__audience">{direction.audience}</p>
        <div className="trait-list" aria-label="Brand traits">
          {direction.traits.map((trait) => <span key={trait}>{trait}</span>)}
        </div>
        <div className="swatches" aria-label="Color palette">
          {direction.colors.map((color) => (
            <span key={color.name} title={`${color.name}: ${color.value}`} style={{ backgroundColor: color.value }} />
          ))}
        </div>
      </div>
    </article>
  );
}
