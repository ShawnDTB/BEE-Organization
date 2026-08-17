import { useMemo, useState, type ChangeEvent } from 'react';
import {
  getDraft,
  readBag,
  saveStudioDraft,
  upsertBagItem,
  type DecorationType,
  type GarmentType,
  type GarmentView,
  type PlacementPreset,
  type StudioDraft,
} from '../data/projectStore';

const garmentMeta: Record<GarmentType, { label: string; productSlug: string; sizes: string[]; image: string }> = {
  tee: { label: 'Premium Tee', productSlug: 'creator-graphic-tee', sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL'], image: '/store/tee.svg' },
  hoodie: { label: 'Heavyweight Hoodie', productSlug: 'heavyweight-creator-hoodie', sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL'], image: '/store/hoodie.svg' },
  polo: { label: 'Performance Polo', productSlug: 'embroidered-performance-polo', sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'], image: '/store/polo.svg' },
};

const garmentColors: Array<{ label: string; value: string }> = [
  { label: 'Black', value: '#15191d' },
  { label: 'Charcoal', value: '#343b41' },
  { label: 'Navy', value: '#1f2a3b' },
  { label: 'Royal', value: '#284d7f' },
  { label: 'Forest', value: '#273f34' },
  { label: 'Bone', value: '#d7d0c2' },
  { label: 'White', value: '#e8e8e4' },
];

const textColors = ['#f4f5f5', '#111417', '#9bb7c8', '#d1b46a', '#8e5c5c', '#567a63', '#725f8e'];

const placementPresets: Record<PlacementPreset, { label: string; x: number; y: number; scale: number; view: GarmentView }> = {
  'left-chest': { label: 'Left chest', x: 41, y: 37, scale: 72, view: 'front' },
  'center-front': { label: 'Center front', x: 50, y: 45, scale: 100, view: 'front' },
  'full-front': { label: 'Full front', x: 50, y: 50, scale: 135, view: 'front' },
  'center-back': { label: 'Center back', x: 50, y: 46, scale: 120, view: 'back' },
};

function requestedGarment(): GarmentType {
  const requested = new URLSearchParams(window.location.search).get('garment');
  return requested === 'hoodie' || requested === 'polo' ? requested : 'tee';
}

function initialDraft() {
  const params = new URLSearchParams(window.location.search);
  const draft = getDraft(params.get('draft'));
  if (draft) return draft;
  const garment = requestedGarment();
  const now = new Date().toISOString();
  return {
    id: `studio-${Date.now()}`,
    name: `${garmentMeta[garment].label} draft`,
    garment,
    color: garmentColors[0]?.value ?? '#15191d',
    view: 'front' as GarmentView,
    decoration: garment === 'polo' ? 'embroidery' as DecorationType : 'graphic' as DecorationType,
    text: 'YOUR DESIGN',
    textColor: textColors[0] ?? '#f4f5f5',
    placement: 'center-front' as PlacementPreset,
    x: 50,
    y: 45,
    scale: 100,
    size: garmentMeta[garment].sizes[2] ?? garmentMeta[garment].sizes[0] ?? 'M',
    quantity: 12,
    createdAt: now,
    updatedAt: now,
  } satisfies StudioDraft;
}

function GarmentSvg({ garment, color, view }: { garment: GarmentType; color: string; view: GarmentView }) {
  const stroke = color === '#e8e8e4' || color === '#d7d0c2' ? '#8b9295' : '#626d75';
  if (garment === 'hoodie') {
    return <svg viewBox="0 0 500 610" className="studio-garment-svg" role="img" aria-label={`${view} view of heavyweight hoodie`}><defs><linearGradient id="studioHoodieShade" x1="0" x2="1"><stop offset="0" stopColor={color} /><stop offset=".5" stopColor={color} stopOpacity=".86" /><stop offset="1" stopColor={color} /></linearGradient></defs><path d="M166 112 L205 88 Q250 58 295 88 L334 112 L421 190 L371 268 L332 236 L327 548 L173 548 L168 236 L129 268 L79 190 Z" fill="url(#studioHoodieShade)" stroke={stroke} strokeWidth="3" /><path d="M204 92 Q250 32 296 92 Q286 150 250 158 Q214 150 204 92Z" fill={color} stroke={stroke} strokeWidth="3" />{view === 'front' && <><path d="M220 132 L215 224" stroke={stroke} strokeWidth="3" /><path d="M280 132 L285 224" stroke={stroke} strokeWidth="3" /><path d="M192 425 L308 425 L332 493 L168 493 Z" fill="none" stroke={stroke} strokeWidth="3" /></>}<path d="M173 548 L327 548" stroke={stroke} strokeWidth="4" /></svg>;
  }
  if (garment === 'polo') {
    return <svg viewBox="0 0 500 610" className="studio-garment-svg" role="img" aria-label={`${view} view of performance polo`}><defs><linearGradient id="studioPoloShade" x1="0" x2="1"><stop offset="0" stopColor={color} /><stop offset=".5" stopColor={color} stopOpacity=".88" /><stop offset="1" stopColor={color} /></linearGradient></defs><path d="M165 112 L210 92 Q250 78 290 92 L335 112 L420 180 L378 260 L329 228 L325 548 L175 548 L171 228 L122 260 L80 180 Z" fill="url(#studioPoloShade)" stroke={stroke} strokeWidth="3" />{view === 'front' && <><path d="M210 92 L250 137 L290 92 L309 127 L273 155 L250 138 L227 155 L191 127 Z" fill="none" stroke={stroke} strokeWidth="3" /><path d="M250 138 L250 223" stroke={stroke} strokeWidth="3" /><circle cx="250" cy="171" r="3" fill={stroke} /><circle cx="250" cy="194" r="3" fill={stroke} /></>}</svg>;
  }
  return <svg viewBox="0 0 500 610" className="studio-garment-svg" role="img" aria-label={`${view} view of premium tee`}><defs><linearGradient id="studioTeeShade" x1="0" x2="1"><stop offset="0" stopColor={color} /><stop offset=".5" stopColor={color} stopOpacity=".88" /><stop offset="1" stopColor={color} /></linearGradient></defs><path d="M168 108 L211 88 Q250 104 289 88 L332 108 L425 176 L381 265 L329 233 L325 548 L175 548 L171 233 L119 265 L75 176 Z" fill="url(#studioTeeShade)" stroke={stroke} strokeWidth="3" /><path d="M211 88 Q250 128 289 88 Q283 151 250 157 Q217 151 211 88Z" fill={color} stroke={stroke} strokeWidth="3" />{view === 'back' && <path d="M221 103 Q250 128 279 103" fill="none" stroke={stroke} strokeWidth="2" />}</svg>;
}

export function StudioPageV3() {
  const source = useMemo(initialDraft, []);
  const [draftId] = useState(source.id);
  const [draftName, setDraftName] = useState(source.name);
  const [createdAt] = useState(source.createdAt);
  const [garment, setGarment] = useState<GarmentType>(source.garment);
  const [color, setColor] = useState(source.color);
  const [view, setView] = useState<GarmentView>(source.view);
  const [decoration, setDecoration] = useState<DecorationType>(source.decoration);
  const [text, setText] = useState(source.text);
  const [textColor, setTextColor] = useState(source.textColor);
  const [artworkData, setArtworkData] = useState<string | undefined>(source.artworkData);
  const [placement, setPlacement] = useState<PlacementPreset>(source.placement);
  const [x, setX] = useState(source.x);
  const [y, setY] = useState(source.y);
  const [scale, setScale] = useState(source.scale);
  const [size, setSize] = useState(source.size);
  const [quantity, setQuantity] = useState(source.quantity);
  const [status, setStatus] = useState<string | null>(getDraft(source.id) ? 'Draft reopened from this browser.' : null);

  const currentGarment = garmentMeta[garment];
  const currentPlacement = placementPresets[placement];
  const artworkVisibleOnCurrentView = currentPlacement.view === view;
  const designLabel = useMemo(() => {
    const parts = [decoration === 'embroidery' ? 'Embroidery' : 'Graphic decoration', currentPlacement.label];
    if (text.trim()) parts.push(`text: ${text.trim().slice(0, 32)}`);
    if (artworkData) parts.push('uploaded artwork');
    return parts.join(' · ');
  }, [artworkData, currentPlacement.label, decoration, text]);

  function changeGarment(next: GarmentType) {
    setGarment(next);
    setSize(garmentMeta[next].sizes[2] ?? garmentMeta[next].sizes[0] ?? 'M');
    if (next === 'polo') setDecoration('embroidery');
    setStatus(null);
  }

  function applyPlacement(next: PlacementPreset) {
    const preset = placementPresets[next];
    setPlacement(next); setX(preset.x); setY(preset.y); setScale(preset.scale); setView(preset.view);
  }

  function handleArtwork(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { setStatus('Choose an image file for the artwork preview.'); return; }
    const reader = new FileReader();
    reader.onload = () => { if (typeof reader.result === 'string') { setArtworkData(reader.result); setStatus('Artwork loaded into this browser preview.'); } };
    reader.readAsDataURL(file);
  }

  function buildDraft(): StudioDraft {
    return {
      id: draftId,
      name: draftName.trim() || `${currentGarment.label} draft`,
      garment, color, view, decoration, text, textColor, artworkData, placement, x, y, scale, size,
      quantity: Math.max(1, quantity),
      createdAt,
      updatedAt: new Date().toISOString(),
    };
  }

  function saveDraft() {
    saveStudioDraft(buildDraft());
    setStatus('Draft saved. You can reopen this exact design from the customer workspace.');
  }

  function addToProjectBag() {
    const draft = saveStudioDraft(buildDraft());
    upsertBagItem({
      id: draft.id,
      draftId: draft.id,
      productSlug: currentGarment.productSlug,
      color: garmentColors.find((option) => option.value === color)?.label ?? color,
      size,
      quantity: Math.max(1, quantity),
      decoration: designLabel,
    });
    setStatus(readBag().some((item) => item.draftId === draft.id) ? 'Design saved and synced with your project bag.' : 'Design saved and added to your project bag.');
  }

  return (
    <section className="studio-page studio-page--v3">
      <header className="studio-v3-intro">
        <div><span className="eyebrow">BEE Studio</span><h1>Build your apparel mockup.</h1></div>
        <p>Choose a garment, add text or artwork, set the decoration and placement, then keep the exact draft with your project.</p>
      </header>

      <div className="studio-draft-bar">
        <label><span>Draft name</span><input value={draftName} onChange={(event) => setDraftName(event.target.value)} /></label>
        <span>{getDraft(draftId) ? 'Saved draft' : 'New draft'}</span>
      </div>

      <div className="studio-shell">
        <div className="studio-viewport-column">
          <div className="studio-toolbar"><div className="studio-view-switch" role="group" aria-label="Garment view"><button type="button" className={view === 'front' ? 'is-active' : undefined} onClick={() => setView('front')}>Front</button><button type="button" className={view === 'back' ? 'is-active' : undefined} onClick={() => setView('back')}>Back</button></div><div className="studio-viewport-meta"><span>{currentGarment.label}</span><span>{decoration === 'embroidery' ? 'Embroidery preview' : 'Graphic preview'}</span></div></div>
          <div className="studio-viewport">
            <div className="studio-viewport-grid" aria-hidden="true" />
            <GarmentSvg garment={garment} color={color} view={view} />
            {artworkVisibleOnCurrentView ? <div className={`studio-art-layer studio-art-layer--${decoration}`} style={{ left: `${x}%`, top: `${y}%`, transform: `translate(-50%, -50%) scale(${scale / 100})` }}>{artworkData && <img src={artworkData} alt="Uploaded artwork preview" />}{text.trim() && <span style={{ color: textColor }}>{text}</span>}</div> : <div className="studio-surface-hint">Design is currently placed on the {currentPlacement.view}.</div>}
            <div className="studio-safe-area" aria-hidden="true"><span>Suggested decoration area</span></div>
          </div>
          <div className="studio-mobile-status"><span>{currentPlacement.label}</span><b>{Math.max(1, quantity)} pieces</b><span>{size}</span></div>
        </div>

        <aside className="studio-controls" aria-label="Garment designer controls">
          <div className="studio-controls__section"><div className="studio-controls__title"><span>01</span><strong>Garment</strong></div><div className="studio-garment-options">{(Object.keys(garmentMeta) as GarmentType[]).map((option) => <button key={option} type="button" className={garment === option ? 'is-active' : undefined} onClick={() => changeGarment(option)}><img src={garmentMeta[option].image} alt="" /><span>{garmentMeta[option].label}</span></button>)}</div><label className="studio-field"><span>Garment color</span><div className="studio-swatches">{garmentColors.map((option) => <button key={option.value} type="button" className={color === option.value ? 'is-active' : undefined} style={{ background: option.value }} onClick={() => setColor(option.value)} aria-label={option.label} title={option.label} />)}</div></label><div className="studio-two-up"><label className="studio-field"><span>Starting size</span><select value={size} onChange={(event) => setSize(event.target.value)}>{currentGarment.sizes.map((option) => <option key={option}>{option}</option>)}</select></label><label className="studio-field"><span>Quantity</span><input type="number" min="1" value={quantity} onChange={(event) => setQuantity(Number(event.target.value))} /></label></div></div>

          <div className="studio-controls__section"><div className="studio-controls__title"><span>02</span><strong>Decoration</strong></div><div className="studio-segmented"><button type="button" className={decoration === 'embroidery' ? 'is-active' : undefined} onClick={() => setDecoration('embroidery')}>Embroidery</button><button type="button" className={decoration === 'graphic' ? 'is-active' : undefined} onClick={() => setDecoration('graphic')}>Graphic / print</button></div><label className="studio-field"><span>Text</span><input value={text} maxLength={36} onChange={(event) => setText(event.target.value)} placeholder="Add text" /></label><label className="studio-field"><span>Text color</span><div className="studio-swatches studio-swatches--small">{textColors.map((option) => <button key={option} type="button" className={textColor === option ? 'is-active' : undefined} style={{ background: option }} onClick={() => setTextColor(option)} aria-label={`Use ${option}`} />)}</div></label><label className="studio-upload"><span>Upload artwork</span><input type="file" accept="image/*" onChange={handleArtwork} /><b>{artworkData ? 'Artwork loaded' : 'PNG, JPG, WEBP, GIF, or SVG'}</b></label>{artworkData && <button className="studio-remove-art" type="button" onClick={() => setArtworkData(undefined)}>Remove uploaded artwork</button>}</div>

          <div className="studio-controls__section"><div className="studio-controls__title"><span>03</span><strong>Placement</strong></div><label className="studio-field"><span>Preset</span><select value={placement} onChange={(event) => applyPlacement(event.target.value as PlacementPreset)}>{(Object.keys(placementPresets) as PlacementPreset[]).map((option) => <option key={option} value={option}>{placementPresets[option].label}</option>)}</select></label><label className="studio-range"><span>Horizontal <b>{x}%</b></span><input type="range" min="24" max="76" value={x} onChange={(event) => setX(Number(event.target.value))} /></label><label className="studio-range"><span>Vertical <b>{y}%</b></span><input type="range" min="25" max="70" value={y} onChange={(event) => setY(Number(event.target.value))} /></label><label className="studio-range"><span>Scale <b>{scale}%</b></span><input type="range" min="45" max="160" value={scale} onChange={(event) => setScale(Number(event.target.value))} /></label></div>

          <div className="studio-controls__actions"><button className="button" type="button" onClick={addToProjectBag}>Save + add to project bag</button><button type="button" onClick={saveDraft}>Save draft</button>{status && <div className="studio-status" role="status">{status}</div>}</div>
        </aside>
      </div>

      <footer className="studio-v3-note"><div><strong>Mockup only.</strong><span>Garment shape, color, and placement are approximate.</span></div><div><strong>Final proof required.</strong><span>Artwork, decoration, availability, pricing, and placement are confirmed before production.</span></div></footer>
    </section>
  );
}
