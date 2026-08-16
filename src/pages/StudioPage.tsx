import { useMemo, useState, type ChangeEvent } from 'react';

const CART_KEY = 'bee-project-bag-v1';
const CART_EVENT = 'bee-cart-updated';
const DRAFT_KEY = 'bee-studio-drafts-v1';

type GarmentType = 'tee' | 'hoodie' | 'polo';
type GarmentView = 'front' | 'back';
type DecorationType = 'embroidery' | 'graphic';
type PlacementPreset = 'left-chest' | 'center-front' | 'full-front' | 'center-back';

type StudioDraft = {
  id: string;
  garment: GarmentType;
  color: string;
  view: GarmentView;
  decoration: DecorationType;
  text: string;
  textColor: string;
  artworkData?: string;
  placement: PlacementPreset;
  x: number;
  y: number;
  scale: number;
  size: string;
  quantity: number;
  createdAt: string;
};

type ProjectBagItem = {
  id: string;
  productSlug: string;
  color: string;
  size: string;
  quantity: number;
  decoration: string;
};

const garmentMeta: Record<GarmentType, { label: string; productSlug: string; sizes: string[] }> = {
  tee: { label: 'Premium Tee', productSlug: 'creator-graphic-tee', sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL'] },
  hoodie: { label: 'Heavyweight Hoodie', productSlug: 'heavyweight-creator-hoodie', sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL'] },
  polo: { label: 'Performance Polo', productSlug: 'embroidered-performance-polo', sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'] },
};

const garmentColors = [
  { label: 'Black', value: '#15191d' },
  { label: 'Charcoal', value: '#343b41' },
  { label: 'Navy', value: '#1f2a3b' },
  { label: 'Royal', value: '#284d7f' },
  { label: 'Forest', value: '#273f34' },
  { label: 'Bone', value: '#d7d0c2' },
  { label: 'White', value: '#e8e8e4' },
] as const;

const textColors = [
  '#f4f5f5', '#111417', '#9bb7c8', '#d1b46a', '#8e5c5c', '#567a63', '#725f8e',
] as const;

const placementPresets: Record<PlacementPreset, { label: string; x: number; y: number; scale: number; view: GarmentView }> = {
  'left-chest': { label: 'Left chest', x: 41, y: 37, scale: 72, view: 'front' },
  'center-front': { label: 'Center front', x: 50, y: 45, scale: 100, view: 'front' },
  'full-front': { label: 'Full front', x: 50, y: 50, scale: 135, view: 'front' },
  'center-back': { label: 'Center back', x: 50, y: 46, scale: 120, view: 'back' },
};

function initialGarment(): GarmentType {
  const requested = new URLSearchParams(window.location.search).get('garment');
  return requested === 'hoodie' || requested === 'polo' ? requested : 'tee';
}

function readBag(): ProjectBagItem[] {
  try {
    const value = window.localStorage.getItem(CART_KEY);
    if (!value) return [];
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function readDrafts(): StudioDraft[] {
  try {
    const value = window.localStorage.getItem(DRAFT_KEY);
    if (!value) return [];
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function GarmentSvg({ garment, color, view }: { garment: GarmentType; color: string; view: GarmentView }) {
  const stroke = color === '#e8e8e4' || color === '#d7d0c2' ? '#8b9295' : '#626d75';

  if (garment === 'hoodie') {
    return (
      <svg viewBox="0 0 500 610" className="studio-garment-svg" role="img" aria-label={`${view} view of heavyweight hoodie`}>
        <defs><linearGradient id="hoodieShade" x1="0" x2="1"><stop offset="0" stopColor={color} /><stop offset="0.5" stopColor={color} stopOpacity="0.86" /><stop offset="1" stopColor={color} /></linearGradient></defs>
        <path d="M166 112 L205 88 Q250 58 295 88 L334 112 L421 190 L371 268 L332 236 L327 548 L173 548 L168 236 L129 268 L79 190 Z" fill="url(#hoodieShade)" stroke={stroke} strokeWidth="3" />
        <path d="M204 92 Q250 32 296 92 Q286 150 250 158 Q214 150 204 92Z" fill={color} stroke={stroke} strokeWidth="3" />
        {view === 'front' && <><path d="M220 132 L215 224" stroke={stroke} strokeWidth="3" /><path d="M280 132 L285 224" stroke={stroke} strokeWidth="3" /><path d="M192 425 L308 425 L332 493 L168 493 Z" fill="none" stroke={stroke} strokeWidth="3" /></>}
        <path d="M173 548 L327 548" stroke={stroke} strokeWidth="4" />
      </svg>
    );
  }

  if (garment === 'polo') {
    return (
      <svg viewBox="0 0 500 610" className="studio-garment-svg" role="img" aria-label={`${view} view of performance polo`}>
        <defs><linearGradient id="poloShade" x1="0" x2="1"><stop offset="0" stopColor={color} /><stop offset="0.5" stopColor={color} stopOpacity="0.88" /><stop offset="1" stopColor={color} /></linearGradient></defs>
        <path d="M165 112 L210 92 Q250 78 290 92 L335 112 L420 180 L378 260 L329 228 L325 548 L175 548 L171 228 L122 260 L80 180 Z" fill="url(#poloShade)" stroke={stroke} strokeWidth="3" />
        {view === 'front' && <><path d="M210 92 L250 137 L290 92 L309 127 L273 155 L250 138 L227 155 L191 127 Z" fill="none" stroke={stroke} strokeWidth="3" /><path d="M250 138 L250 223" stroke={stroke} strokeWidth="3" /><circle cx="250" cy="171" r="3" fill={stroke} /><circle cx="250" cy="194" r="3" fill={stroke} /></>}
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 500 610" className="studio-garment-svg" role="img" aria-label={`${view} view of premium tee`}>
      <defs><linearGradient id="teeShade" x1="0" x2="1"><stop offset="0" stopColor={color} /><stop offset="0.5" stopColor={color} stopOpacity="0.88" /><stop offset="1" stopColor={color} /></linearGradient></defs>
      <path d="M168 108 L211 88 Q250 104 289 88 L332 108 L425 176 L381 265 L329 233 L325 548 L175 548 L171 233 L119 265 L75 176 Z" fill="url(#teeShade)" stroke={stroke} strokeWidth="3" />
      <path d="M211 88 Q250 128 289 88 Q283 151 250 157 Q217 151 211 88Z" fill={color} stroke={stroke} strokeWidth="3" />
      {view === 'back' && <path d="M221 103 Q250 128 279 103" fill="none" stroke={stroke} strokeWidth="2" />}
    </svg>
  );
}

export function StudioPage() {
  const [garment, setGarment] = useState<GarmentType>(initialGarment);
  const [color, setColor] = useState(garmentColors[0].value);
  const [view, setView] = useState<GarmentView>('front');
  const [decoration, setDecoration] = useState<DecorationType>('graphic');
  const [text, setText] = useState('YOUR DESIGN');
  const [textColor, setTextColor] = useState(textColors[0]);
  const [artworkData, setArtworkData] = useState<string | undefined>();
  const [placement, setPlacement] = useState<PlacementPreset>('center-front');
  const [x, setX] = useState(50);
  const [y, setY] = useState(45);
  const [scale, setScale] = useState(100);
  const [size, setSize] = useState(garmentMeta[garment].sizes[2] ?? garmentMeta[garment].sizes[0]);
  const [quantity, setQuantity] = useState(12);
  const [status, setStatus] = useState<string | null>(null);

  const currentGarment = garmentMeta[garment];
  const isLightGarment = color === '#e8e8e4' || color === '#d7d0c2';
  const designLabel = useMemo(() => {
    const parts = [decoration === 'embroidery' ? 'Embroidery' : 'Graphic decoration'];
    if (text.trim()) parts.push(`text: ${text.trim().slice(0, 32)}`);
    if (artworkData) parts.push('uploaded artwork');
    return parts.join(' · ');
  }, [artworkData, decoration, text]);

  function changeGarment(next: GarmentType) {
    setGarment(next);
    setSize(garmentMeta[next].sizes[2] ?? garmentMeta[next].sizes[0]);
    if (next === 'polo') setDecoration('embroidery');
    setStatus(null);
  }

  function applyPlacement(next: PlacementPreset) {
    const preset = placementPresets[next];
    setPlacement(next);
    setX(preset.x);
    setY(preset.y);
    setScale(preset.scale);
    setView(preset.view);
  }

  function handleArtwork(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setStatus('Choose a PNG, JPG, WEBP, GIF, or SVG image file.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setArtworkData(reader.result);
        setStatus('Artwork loaded into this browser preview.');
      }
    };
    reader.readAsDataURL(file);
  }

  function buildDraft(): StudioDraft {
    return {
      id: `studio-${Date.now()}`,
      garment,
      color,
      view,
      decoration,
      text,
      textColor,
      artworkData,
      placement,
      x,
      y,
      scale,
      size: size ?? '',
      quantity: Math.max(1, quantity),
      createdAt: new Date().toISOString(),
    };
  }

  function saveDraft() {
    const draft = buildDraft();
    const drafts = readDrafts();
    window.localStorage.setItem(DRAFT_KEY, JSON.stringify([...drafts, draft]));
    setStatus('Studio draft saved locally in this browser.');
  }

  function addToProjectBag() {
    const draft = buildDraft();
    const drafts = readDrafts();
    window.localStorage.setItem(DRAFT_KEY, JSON.stringify([...drafts, draft]));

    const bag = readBag();
    const item: ProjectBagItem = {
      id: draft.id,
      productSlug: currentGarment.productSlug,
      color: garmentColors.find((option) => option.value === color)?.label ?? color,
      size: size ?? '',
      quantity: Math.max(1, quantity),
      decoration: designLabel,
    };
    window.localStorage.setItem(CART_KEY, JSON.stringify([...bag, item]));
    window.dispatchEvent(new Event(CART_EVENT));
    setStatus('Design saved and added to your project bag.');
  }

  return (
    <section className="studio-page">
      <header className="studio-heading">
        <div>
          <span className="eyebrow">BEE Studio · interactive prototype</span>
          <h1>Design the piece before you ask production to make it.</h1>
        </div>
        <p>This visual builder is a production-planning prototype, not a final garment proof. Real supplier models, print areas, thread behavior, artwork checks, and production limits still require review.</p>
      </header>

      <div className="studio-shell">
        <div className="studio-viewport-column">
          <div className="studio-toolbar">
            <div className="studio-view-switch" role="group" aria-label="Garment view">
              <button type="button" className={view === 'front' ? 'is-active' : undefined} onClick={() => setView('front')}>Front</button>
              <button type="button" className={view === 'back' ? 'is-active' : undefined} onClick={() => setView('back')}>Back</button>
            </div>
            <div className="studio-viewport-meta"><span>{currentGarment.label}</span><span>{decoration === 'embroidery' ? 'Embroidery preview' : 'Graphic preview'}</span></div>
          </div>

          <div className={`studio-viewport${isLightGarment ? ' is-light-garment' : ''}`}>
            <div className="studio-viewport-grid" aria-hidden="true" />
            <GarmentSvg garment={garment} color={color} view={view} />
            <div
              className={`studio-art-layer studio-art-layer--${decoration}`}
              style={{ left: `${x}%`, top: `${y}%`, transform: `translate(-50%, -50%) scale(${scale / 100})` }}
            >
              {artworkData && <img src={artworkData} alt="Uploaded artwork preview" />}
              {text.trim() && <span style={{ color: textColor }}>{text}</span>}
            </div>
            <div className="studio-safe-area" aria-hidden="true"><span>Suggested decoration area</span></div>
          </div>

          <div className="studio-mobile-status">
            <span>{placementPresets[placement].label}</span><b>{Math.max(1, quantity)} pieces</b><span>{size}</span>
          </div>
        </div>

        <aside className="studio-controls" aria-label="Garment designer controls">
          <div className="studio-controls__section">
            <div className="studio-controls__title"><span>01</span><strong>Garment</strong></div>
            <div className="studio-garment-options">
              {(Object.keys(garmentMeta) as GarmentType[]).map((option) => (
                <button key={option} type="button" className={garment === option ? 'is-active' : undefined} onClick={() => changeGarment(option)}>
                  <img src={option === 'tee' ? '/store/tee.svg' : option === 'hoodie' ? '/store/hoodie.svg' : '/store/polo.svg'} alt="" />
                  <span>{garmentMeta[option].label}</span>
                </button>
              ))}
            </div>
            <label className="studio-field"><span>Garment color</span><div className="studio-swatches">{garmentColors.map((option) => <button key={option.value} type="button" className={color === option.value ? 'is-active' : undefined} style={{ background: option.value }} onClick={() => setColor(option.value)} aria-label={option.label} title={option.label} />)}</div></label>
            <div className="studio-two-up">
              <label className="studio-field"><span>Starting size</span><select value={size} onChange={(event) => setSize(event.target.value)}>{currentGarment.sizes.map((option) => <option key={option}>{option}</option>)}</select></label>
              <label className="studio-field"><span>Quantity</span><input type="number" min="1" value={quantity} onChange={(event) => setQuantity(Number(event.target.value))} /></label>
            </div>
          </div>

          <div className="studio-controls__section">
            <div className="studio-controls__title"><span>02</span><strong>Decoration</strong></div>
            <div className="studio-segmented">
              <button type="button" className={decoration === 'embroidery' ? 'is-active' : undefined} onClick={() => setDecoration('embroidery')}>Embroidery</button>
              <button type="button" className={decoration === 'graphic' ? 'is-active' : undefined} onClick={() => setDecoration('graphic')}>Graphic / print</button>
            </div>
            <label className="studio-field"><span>Text</span><input value={text} maxLength={36} onChange={(event) => setText(event.target.value)} placeholder="Add text" /></label>
            <label className="studio-field"><span>Text color</span><div className="studio-swatches studio-swatches--small">{textColors.map((option) => <button key={option} type="button" className={textColor === option ? 'is-active' : undefined} style={{ background: option }} onClick={() => setTextColor(option)} aria-label={`Use ${option}`} />)}</div></label>
            <label className="studio-upload"><span>Upload artwork</span><input type="file" accept="image/*" onChange={handleArtwork} /><b>{artworkData ? 'Artwork loaded' : 'PNG, JPG, WEBP, GIF, or SVG'}</b></label>
            {artworkData && <button className="studio-remove-art" type="button" onClick={() => setArtworkData(undefined)}>Remove uploaded artwork</button>}
          </div>

          <div className="studio-controls__section">
            <div className="studio-controls__title"><span>03</span><strong>Placement</strong></div>
            <label className="studio-field"><span>Preset</span><select value={placement} onChange={(event) => applyPlacement(event.target.value as PlacementPreset)}>{(Object.keys(placementPresets) as PlacementPreset[]).map((option) => <option key={option} value={option}>{placementPresets[option].label}</option>)}</select></label>
            <label className="studio-range"><span>Horizontal <b>{x}%</b></span><input type="range" min="24" max="76" value={x} onChange={(event) => setX(Number(event.target.value))} /></label>
            <label className="studio-range"><span>Vertical <b>{y}%</b></span><input type="range" min="25" max="70" value={y} onChange={(event) => setY(Number(event.target.value))} /></label>
            <label className="studio-range"><span>Scale <b>{scale}%</b></span><input type="range" min="45" max="160" value={scale} onChange={(event) => setScale(Number(event.target.value))} /></label>
          </div>

          <div className="studio-controls__actions">
            <button className="button" type="button" onClick={addToProjectBag}>Add design to project bag</button>
            <button type="button" onClick={saveDraft}>Save browser draft</button>
            {status && <div className="studio-status" role="status">{status}</div>}
          </div>
        </aside>
      </div>

      <footer className="studio-footnote">
        <div><span>Visual fidelity</span><strong>Concept preview</strong><p>Garment silhouettes, colors, artwork effects, and placement are approximate until real supplier assets and production templates are connected.</p></div>
        <div><span>Production review</span><strong>Still required</strong><p>Artwork resolution, embroidery feasibility, print size, garment availability, final pricing, and proofs remain explicit approval checkpoints.</p></div>
        <div><span>Future 3D layer</span><strong>Architecture ready</strong><p>The saved design state already separates garment, surface, decoration, artwork, position, scale, size, and quantity so real 3D garment models can replace the visual layer later.</p></div>
      </footer>
    </section>
  );
}
