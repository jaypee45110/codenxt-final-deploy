import React, { useEffect, useRef, useState } from 'react';
import americanaBadge from '../assets/round-badges/americana.png';
import rockBadge from '../assets/round-badges/rock.png';
import rapBadge from '../assets/round-badges/rap.png';
import bluesBadge from '../assets/round-badges/blues.png';
import acousticBadge from '../assets/round-badges/acoustic.png';
import grungeBadge from '../assets/round-badges/grunge.png';
import popBadge from '../assets/round-badges/pop.png';
import heavyMetalBadge from '../assets/round-badges/heavymetal.png';

const badgeAssets = {
  americana: americanaBadge,
  rock: rockBadge,
  blues: bluesBadge,
  hiphop: rapBadge,
  acoustic: acousticBadge,
  grunge: grungeBadge,
  pop: popBadge,
  heavymetal: heavyMetalBadge,

  // gamle template-navn peker til nye filer
  folk: acousticBadge,
  punk: grungeBadge,
  hiphop: rapBadge,
};

const templates = [
  { id: 'americana', label: 'Americana' },
  { id: 'rock', label: 'Rock' },
  { id: 'blues', label: 'Blues' },
  { id: 'hiphop', label: 'Rap' },
  { id: 'acoustic', label: 'Acoustic' },
  { id: 'grunge', label: 'Grunge' },
  { id: 'pop', label: 'Pop' },
  { id: 'heavymetal', label: 'Heavy Metal' },
];
const shapes = [
  { id: 'circle', label: 'Round' },
  { id: 'square', label: 'Square' },
  { id: 'triangle', label: 'Triangle' },
];

const styles = [
  { id: 'clean', label: 'Clean' },
  { id: 'edge', label: 'Edge' },
  { id: 'live', label: 'Live' },
];

const colors = [
  { id: 'default', label: 'Turquoise / Plum' },
  { id: 'warm', label: 'Warm Cream / Gold' },
  { id: 'cold', label: 'Ice Blue' },
  { id: 'dark', label: 'Blackout' },
];

export default function BadgeGeneratorModal({
  open,
  onClose,
  artistName = 'ARTIST NAME',
  onSave,
}) {
const [template, setTemplate] = useState('americana');
  const [shape, setShape] = useState('circle');
  const [style, setStyle] = useState('edge');
  const [color, setColor] = useState('default');
    const qrRef = useRef(null);


  if (!open) return null;

  const badgeConfig = {
    template,
    shape,
    style,
    color,
    topText: artistName,
    bottomText: 'INNERCIRCLE',
  };

  return (
    <div style={stylesObj.overlay}>
      <div style={stylesObj.modal}>
<button type="button" onClick={() => onClose && onClose()} style={stylesObj.close}>          ×
        </button>

<div style={stylesObj.kicker}>BADGE GENERATOR</div>
<h2 style={stylesObj.title}>CREATE YOUR OWN BADGE</h2>

<div style={stylesObj.preview}>
  <div style={stylesObj.badgeStage}>
    <img
      src={badgeAssets[template] || americanaBadge}
      style={stylesObj.badgeImage}
      alt="Badge preview"
    />
  </div>
</div>
        <div style={stylesObj.grid}>
          <SelectBlock label="Template" value={template} setValue={setTemplate} options={templates} />
          <SelectBlock label="Shape" value="coming" setValue={() => {}} options={[{ id: 'coming', label: 'Coming feature' }]} disabled />
          <SelectBlock label="Edge" value="coming" setValue={() => {}} options={[{ id: 'coming', label: 'Coming feature' }]} disabled />
          <SelectBlock label="Color" value="coming" setValue={() => {}} options={[{ id: 'coming', label: 'Coming feature' }]} disabled />        </div>


<div
  style={{
    marginBottom: '10px',
    fontSize: '11px',
    color: '#ffffff',
    opacity: 0.78,
    textAlign: 'center',
    letterSpacing: '0.3px',
  }}
>
  Saving generates the event screen video.
</div>

<button
  type="button"
  style={stylesObj.save}
  onClick={() => {
    if (onSave) onSave(badgeConfig);
  }}
>
  SAVE BADGE CONFIG
</button>
      </div>
    </div>
  );
}

function SelectBlock({ label, value, setValue, options, disabled = false }) {
    return (
    <label style={stylesObj.selectWrap}>
      <span style={stylesObj.label}>{label}</span>
<select value={value} onChange={(e) => setValue(e.target.value)} style={stylesObj.select} disabled={disabled}>        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

const stylesObj = {
  overlay: {
    position: 'fixed',
    inset: 0,
    zIndex: 99999,
    background: 'rgba(0,0,0,0.78)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  modal: {
    position: 'relative',
    width: '100%',
    maxWidth: 760,
    borderRadius: 28,
    padding: 28,
    background: 'linear-gradient(180deg, #111 0%, #050505 100%)',
    border: '1px solid rgba(0,240,255,0.28)',
    boxShadow: '0 0 40px rgba(0,240,255,0.18)',
    color: '#fff',
  },
  close: {
    position: 'absolute',
    top: 18,
    right: 20,
    background: 'transparent',
    border: 0,
    color: '#fff',
    fontSize: 28,
    cursor: 'pointer',
  },
  kicker: {
  fontSize: 11,
  letterSpacing: 3,
  color: '#ffffff',
  textTransform: 'uppercase',
  opacity: 0.7,
  textAlign: 'center',
},
  title: {
  margin: '10px 0 28px',
  fontSize: 36,
  lineHeight: 1,
  textAlign: 'center',
  color: '#00f0ff',
  letterSpacing: 1,
},
  preview: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: 24,
  },
badgeMock: {
  width: 260,
  height: 260,
  borderRadius: '50%',
  border: '10px solid #241124',
  boxShadow: '0 0 18px rgba(0,240,255,0.55), inset 0 0 28px rgba(255,255,255,0.06)',
  background: '#050505',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 16,
  textAlign: 'center',
},
badgeStage: {
  position: 'relative',
  width: 260,
  height: 260,
  margin: '0 auto',
},

badgeImage: {
  width: '100%',
  height: '100%',
  objectFit: 'contain',
},

qrOverlay: {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -45%)',

  width: 72,
  height: 72,

  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
},

qrPlaceholder: {
  width: '100%',
  height: '100%',
  background: '#f2e9da',
},
topText: {
  fontSize: 13,
  letterSpacing: 2,
  color: '#00f0ff',
  textShadow: '0 0 8px rgba(0,240,255,0.8)',
  textAlign: 'center',
  width: '100%',
},
  qrHole: {
  width: 108,
  height: 108,
  background: '#f2e9da',
},


bottomText: {
    fontSize: 13,
    letterSpacing: 2,
    color: '#00f0ff',
    textShadow: '0 0 8px rgba(0,240,255,0.8)',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gap: 14,
  },
  selectWrap: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  label: {
    fontSize: 11,
    letterSpacing: 1,
    opacity: 0.65,
    textTransform: 'uppercase',
  },
  select: {
    padding: '12px 14px',
    borderRadius: 14,
    border: '1px solid rgba(255,255,255,0.14)',
    background: '#101010',
    color: '#fff',
    fontSize: 14,
  },
  note: {
    marginTop: 18,
    fontSize: 12,
    lineHeight: 1.5,
    color: 'rgba(255,255,255,0.58)',
  },
  save: {
    marginTop: 22,
    width: '100%',
    padding: '15px 18px',
    borderRadius: 18,
    border: 0,
    background: '#00f0ff',
    color: '#020202',
    fontWeight: 900,
    letterSpacing: 1,
    cursor: 'pointer',
  },
};