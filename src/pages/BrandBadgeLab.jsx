import React, { useEffect, useRef, useState } from 'react';

export default function BrandBadgeLab() {
  const canvasRef = useRef(null);

  const [topText, setTopText] = useState('JUST DO IT');
  const [colorA, setColorA] = useState('#050505');
  const [colorB, setColorB] = useState('#ffffff');
  const [colorC, setColorC] = useState('#ff6a00');

  const SIZE = 905;
  const CENTER = SIZE / 2;

  const OUTER_DIAMETER = 905;
  const TEXT_DIAMETER = 800;
  const INNER_DIAMETER = 500;
  const HOLE_DIAMETER = 417;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = SIZE;
    canvas.height = SIZE;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, SIZE, SIZE);

    const drawCircle = (diameter, color) => {
      ctx.beginPath();
      ctx.arc(CENTER, CENTER, diameter / 2, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
    };

    drawCircle(OUTER_DIAMETER, colorA);
    drawCircle(TEXT_DIAMETER, colorB);
    drawCircle(INNER_DIAMETER, colorC);

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(CENTER, CENTER, HOLE_DIAMETER / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';

    drawArcText(ctx, topText, CENTER, CENTER, TEXT_DIAMETER / 2 - 42);

    drawBottomPlaceholder(ctx, CENTER, CENTER, TEXT_DIAMETER / 2 - 80);
  }, [topText, colorA, colorB, colorC]);

  function drawArcText(ctx, text, cx, cy, radius) {
    const letters = text.toUpperCase().split('');
    const totalAngle = Math.min(Math.PI * 0.92, letters.length * 0.075);
    const startAngle = -Math.PI / 2 - totalAngle / 2;

    ctx.save();
    ctx.font = 'bold 46px Arial, sans-serif';
    ctx.fillStyle = colorA;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    letters.forEach((letter, i) => {
      const angle =
        startAngle + (totalAngle / Math.max(letters.length - 1, 1)) * i;

      const x = cx + Math.cos(angle) * radius;
      const y = cy + Math.sin(angle) * radius;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle + Math.PI / 2);
      ctx.fillText(letter, 0, 0);
      ctx.restore();
    });

    ctx.restore();
  }

  function drawBottomPlaceholder(ctx, cx, cy, radius) {
    ctx.save();

    const y = cy + radius * 0.72;

    ctx.fillStyle = colorA;
    ctx.font = 'bold 38px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('LOGO / PRODUCT', cx, y);

    ctx.beginPath();
    ctx.roundRect(cx - 190, y - 55, 380, 110, 28);
    ctx.lineWidth = 5;
    ctx.strokeStyle = colorA;
    ctx.stroke();

    ctx.restore();
  }

  const downloadPng = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = 'brand-badge-lab.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div style={styles.page}>
      <div style={styles.panel}>
        <p style={styles.kicker}>codeNXT experimental lab</p>
        <h1 style={styles.title}>Brand Badge Lab</h1>
        <p style={styles.text}>
          Isolated test page. Does not touch Dashboard or Badge Creator.
        </p>

        <label style={styles.label}>
          Upper arc text
          <input
            style={styles.input}
            value={topText}
            onChange={(e) => setTopText(e.target.value)}
          />
        </label>

        <div style={styles.colorGrid}>
          <label style={styles.label}>
            A outer ring
            <input
              type="color"
              style={styles.colorInput}
              value={colorA}
              onChange={(e) => setColorA(e.target.value)}
            />
          </label>

          <label style={styles.label}>
            B text ring
            <input
              type="color"
              style={styles.colorInput}
              value={colorB}
              onChange={(e) => setColorB(e.target.value)}
            />
          </label>

          <label style={styles.label}>
            C inner ring
            <input
              type="color"
              style={styles.colorInput}
              value={colorC}
              onChange={(e) => setColorC(e.target.value)}
            />
          </label>
        </div>

        <button style={styles.button} onClick={downloadPng}>
          EXPORT PNG
        </button>

        <div style={styles.specs}>
          A outer: Ø905px<br />
          B text ring: Ø800px<br />
          C inner: Ø500px<br />
          D transparent center: Ø417px
        </div>
      </div>

      <div style={styles.stage}>
        <canvas ref={canvasRef} style={styles.canvas} />
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background:
      'radial-gradient(circle at top, #1d2a36 0%, #05070a 42%, #000 100%)',
    color: '#fff',
    display: 'grid',
    gridTemplateColumns: '360px 1fr',
    gap: 32,
    padding: 32,
    boxSizing: 'border-box',
    fontFamily:
      'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  panel: {
    background: 'rgba(255,255,255,0.07)',
    border: '1px solid rgba(255,255,255,0.14)',
    borderRadius: 24,
    padding: 24,
    boxShadow: '0 30px 90px rgba(0,0,0,0.45)',
  },
  kicker: {
    margin: 0,
    color: '#68f7ff',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  title: {
    margin: '10px 0 8px',
    fontSize: 32,
    lineHeight: 1.05,
  },
  text: {
    margin: '0 0 24px',
    color: 'rgba(255,255,255,0.68)',
    fontSize: 14,
    lineHeight: 1.5,
  },
  label: {
    display: 'grid',
    gap: 8,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1.4,
    color: 'rgba(255,255,255,0.72)',
    marginBottom: 18,
  },
  input: {
    width: '100%',
    boxSizing: 'border-box',
    background: 'rgba(0,0,0,0.45)',
    border: '1px solid rgba(255,255,255,0.18)',
    borderRadius: 14,
    color: '#fff',
    padding: '14px 16px',
    fontSize: 18,
    outline: 'none',
  },
  colorGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: 8,
    marginTop: 8,
  },
  colorInput: {
    width: '100%',
    height: 46,
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
  },
  button: {
    width: '100%',
    marginTop: 10,
    padding: '15px 18px',
    borderRadius: 999,
    border: 'none',
    background: '#68f7ff',
    color: '#001013',
    fontWeight: 900,
    letterSpacing: 1.2,
    cursor: 'pointer',
  },
  specs: {
    marginTop: 22,
    paddingTop: 18,
    borderTop: '1px solid rgba(255,255,255,0.12)',
    color: 'rgba(255,255,255,0.55)',
    fontSize: 13,
    lineHeight: 1.7,
  },
  stage: {
    display: 'grid',
    placeItems: 'center',
    minHeight: 'calc(100vh - 64px)',
  },
  canvas: {
    width: 'min(78vh, 78vw)',
    height: 'min(78vh, 78vw)',
    background:
      'linear-gradient(45deg, rgba(255,255,255,0.08) 25%, transparent 25%), linear-gradient(-45deg, rgba(255,255,255,0.08) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, rgba(255,255,255,0.08) 75%), linear-gradient(-45deg, transparent 75%, rgba(255,255,255,0.08) 75%)',
    backgroundSize: '32px 32px',
    backgroundPosition: '0 0, 0 16px, 16px -16px, -16px 0px',
    borderRadius: 24,
    boxShadow: '0 40px 120px rgba(0,0,0,0.65)',
  },
};