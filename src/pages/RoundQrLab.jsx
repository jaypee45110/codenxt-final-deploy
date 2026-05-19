import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import americana from '../assets/round-badges/americana.png';
import blues from '../assets/round-badges/blues.png';
import acoustic from '../assets/round-badges/acoustic.png';
import heavymetal from '../assets/round-badges/heavymetal.png';
import pop from '../assets/round-badges/pop.png';
import grunge from '../assets/round-badges/grunge.png';
import rock from '../assets/round-badges/rock.png';

const BADGES = { americana, blues, acoustic, heavymetal, pop, grunge, rock };

export default function RoundQrLab() {
  const [selected, setSelected] = useState('americana');
const [qrSize, setQrSize] = useState(211);
const [offsetX, setOffsetX] = useState(1);
const [offsetY, setOffsetY] = useState(7);
const canvasRef = useRef(null);
const joinUrl = 'https://codetone.codenxt.global/join/CT-80136';

useEffect(() => {
  const canvas = canvasRef.current;
  if (!canvas) return;

  const qr = QRCode.create(joinUrl, {
    errorCorrectionLevel: 'H',
    margin: 0,
  });

  const ctx = canvas.getContext('2d');
  const size = qrSize;
  const moduleCount = qr.modules.size;

  const coreScale = 0.70;
  const coreSize = size * coreScale;
  const moduleSize = coreSize / moduleCount;
  const coreOffset = (size - coreSize) / 2;

  const center = size / 2;
  const outerRadius = size / 2;
  const coreLeft = coreOffset;
  const coreTop = coreOffset;
  const coreRight = coreOffset + coreSize;
  const coreBottom = coreOffset + coreSize;

  canvas.width = size;
  canvas.height = size;

  ctx.clearRect(0, 0, size, size);

  // Clip full output to circular outer edge
  ctx.save();
  ctx.beginPath();
  ctx.arc(center, center, outerRadius, 0, Math.PI * 2);
  ctx.clip();

  // White square behind real QR core
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(coreLeft, coreTop, coreSize, coreSize);

  const isFinderArea = (row, col) => {
    const last = moduleCount - 7;
    return (
      (row < 7 && col < 7) ||
      (row < 7 && col >= last) ||
      (row >= last && col < 7)
    );
  };

  // Real QR modules
  ctx.fillStyle = '#000000';

  for (let row = 0; row < moduleCount; row += 1) {
    for (let col = 0; col < moduleCount; col += 1) {
      if (!qr.modules.get(row, col)) continue;
      if (isFinderArea(row, col)) continue;

      const x = coreOffset + col * moduleSize;
      const y = coreOffset + row * moduleSize;

      ctx.fillRect(
        x + moduleSize * 0.04,
        y + moduleSize * 0.04,
        moduleSize * 0.92,
        moduleSize * 0.92
      );
    }
  }

  const drawFinder = (col, row) => {
    const x = coreOffset + col * moduleSize;
    const y = coreOffset + row * moduleSize;

    ctx.fillStyle = '#000000';
    ctx.fillRect(x, y, moduleSize * 7, moduleSize * 7);

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x + moduleSize, y + moduleSize, moduleSize * 5, moduleSize * 5);

    ctx.fillStyle = '#000000';
    ctx.fillRect(x + moduleSize * 2, y + moduleSize * 2, moduleSize * 3, moduleSize * 3);
  };

  drawFinder(0, 0);
  drawFinder(moduleCount - 7, 0);
  drawFinder(0, moduleCount - 7);

  // Small white square safety border around QR core
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = moduleSize * 1.2;
  ctx.strokeRect(
    coreLeft - moduleSize * 0.6,
    coreTop - moduleSize * 0.6,
    coreSize + moduleSize * 1.2,
    coreSize + moduleSize * 1.2
  );

  // QR-like decoy field outside square core, clipped to circular outer edge
  ctx.fillStyle = '#000000';

  for (let row = -6; row < moduleCount + 6; row += 1) {
    for (let col = -6; col < moduleCount + 6; col += 1) {
      const x = coreOffset + col * moduleSize;
      const y = coreOffset + row * moduleSize;
      const cx = x + moduleSize / 2;
      const cy = y + moduleSize / 2;

      const insideCoreSquare =
        cx > coreLeft - moduleSize &&
        cx < coreRight + moduleSize &&
        cy > coreTop - moduleSize &&
        cy < coreBottom + moduleSize;

      if (insideCoreSquare) continue;

      const dist = Math.hypot(cx - center, cy - center);
      if (dist > outerRadius - moduleSize * 0.7) continue;

      const noise = Math.sin(row * 12.9898 + col * 78.233) * 43758.5453;
      const randomish = noise - Math.floor(noise);

      if (randomish > 0.38) continue;

      ctx.fillRect(
        x + moduleSize * 0.04,
        y + moduleSize * 0.04,
        moduleSize * 0.92,
        moduleSize * 0.92
      );
    }
  }

  ctx.restore();
}, [qrSize]);
  return (
    <div style={styles.page}>
      <h1>Round QR Lab</h1>

      <div style={styles.controls}>
        <select value={selected} onChange={(e) => setSelected(e.target.value)}>
          {Object.keys(BADGES).map((key) => (
            <option key={key} value={key}>{key}</option>
          ))}
        </select>

        <label>Size {qrSize}px</label>
        <input type="range" min="120" max="230" value={qrSize} onChange={(e) => setQrSize(Number(e.target.value))} />

        <label>X {offsetX}px</label>
        <input type="range" min="-40" max="40" value={offsetX} onChange={(e) => setOffsetX(Number(e.target.value))} />

        <label>Y {offsetY}px</label>
        <input type="range" min="-40" max="40" value={offsetY} onChange={(e) => setOffsetY(Number(e.target.value))} />
      </div>

      <div style={styles.stage}>
        <img src={BADGES[selected]} alt={selected} style={styles.badge} />

        <div
          style={{
            ...styles.qrWindow,
            width: qrSize,
            height: qrSize,
            transform: `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px))`,
          }}
        >
<canvas ref={canvasRef} style={styles.qr} />
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#000',
    color: '#fff',
    padding: 40,
    fontFamily: 'Arial, sans-serif',
  },
  controls: {
    display: 'grid',
    gap: 10,
    maxWidth: 360,
    marginBottom: 30,
  },
  stage: {
    position: 'relative',
    width: 520,
    height: 520,
  },
  badge: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    display: 'block',
  },
  qrWindow: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    borderRadius: '50%',
    overflow: 'hidden',
background: '#ffffff',
  },
  qr: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  },
};