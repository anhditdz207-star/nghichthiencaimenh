interface HexagramGlyphProps {
  binary: string; // 6 ký tự, hào 1 (dưới) -> hào 6 (trên)
  movingPositions?: number[]; // các hào động, đánh dấu chấm vàng
  size?: number;
  className?: string;
}

/** Vẽ 6 hào của một quẻ, từ trên (hào 6) xuống dưới (hào 1) theo quy ước truyền thống */
export default function HexagramGlyph({ binary, movingPositions = [], size = 120, className = "" }: HexagramGlyphProps) {
  const lines = binary.split("").reverse(); // đảo để vẽ hào 6 ở trên cùng
  const w = size;
  const h = size * 0.75;
  const lineH = h / 6;
  const barW = w * 0.8;
  const gap = barW * 0.18;
  const x = (w - barW) / 2;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} width={size} height={size * 0.75} className={`block mx-auto ${className}`}>
      {lines.map((bit, i) => {
        const position = 6 - i; // vị trí hào thực (1-6)
        const y = i * lineH + lineH * 0.3;
        const barH = lineH * 0.4;
        const isMoving = movingPositions.includes(position);
        const stroke = isMoving ? "#c9a227" : "#f6f1e7";
        if (bit === "1") {
          return (
            <rect key={i} x={x} y={y} width={barW} height={barH} rx={barH * 0.15} fill={stroke} />
          );
        }
        return (
          <g key={i}>
            <rect x={x} y={y} width={(barW - gap) / 2} height={barH} rx={barH * 0.15} fill={stroke} />
            <rect x={x + (barW + gap) / 2} y={y} width={(barW - gap) / 2} height={barH} rx={barH * 0.15} fill={stroke} />
          </g>
        );
      })}
    </svg>
  );
}
