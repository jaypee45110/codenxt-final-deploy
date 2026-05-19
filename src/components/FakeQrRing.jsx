export default function FakeQrRing() {
  const blocks = [
    [42, 4, 8, 8], [58, 2, 6, 6], [76, 6, 10, 6], [96, 4, 6, 10],
    [116, 10, 8, 8], [132, 18, 6, 6], [148, 26, 10, 8],
    [170, 44, 8, 8], [184, 62, 6, 12], [190, 84, 10, 8],
    [184, 108, 8, 10], [170, 132, 6, 8], [150, 152, 10, 6],
    [126, 166, 8, 8], [102, 174, 12, 6], [76, 170, 8, 10],
    [52, 158, 6, 8], [34, 138, 10, 10], [20, 112, 8, 14],
    [14, 86, 6, 10], [20, 62, 10, 8], [30, 40, 8, 8],
    [64, 18, 8, 8], [86, 18, 6, 6], [108, 20, 10, 8],
    [154, 58, 6, 6], [160, 82, 8, 8], [154, 116, 10, 6],
    [118, 154, 8, 10], [88, 156, 6, 6], [54, 136, 8, 8],
    [42, 102, 6, 10], [46, 72, 10, 6],
  ];

  return (
    <div style={styles.wrap}>
      {blocks.map(([left, top, width, height], index) => (
        <span
          key={index}
          style={{
            ...styles.block,
            left,
            top,
            width,
            height,
          }}
        />
      ))}

      <div style={styles.hole} />
    </div>
  );
}

const styles = {
  wrap: {
    position: 'relative',
width: 140,
height: 140,
background: 'rgba(255,255,255,0.12)',
  },
block: {
  position: 'absolute',
  background: '#ffffff',
  opacity: 0.9,
},
hole: {
  position: 'absolute',
  left: 36,
  top: 36,
  width: 48,
  height: 48,
  background: '#ffffff',
},
};