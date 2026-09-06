/** Vẽ Thái Cực (âm dương) tại tâm (cx, cy) với bán kính r — công thức chuẩn hoá,
 * dùng chung cho logo header và tâm vòng bát quái để đảm bảo luôn giống hệt nhau. */
export function TaijiMarks({
  cx, cy, r, borderWidth = r * 0.045,
}: { cx: number; cy: number; r: number; borderWidth?: number }) {
  const half = r / 2;
  const dotR = r * 0.14;
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="#0a0a0a" />
      <path
        d={`M${cx},${cy - r} A${half},${half} 0 0 1 ${cx},${cy} A${half},${half} 0 0 0 ${cx},${cy + r} A${r},${r} 0 0 0 ${cx},${cy - r} Z`}
        fill="#f6f1e7"
      />
      <circle cx={cx} cy={cy - half} r={dotR} fill="#f6f1e7" />
      <circle cx={cx} cy={cy + half} r={dotR} fill="#0a0a0a" />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#c9a227" strokeWidth={borderWidth} />
    </g>
  );
}

export default function TaijiSymbol({ size = 28, className = "" }: { size?: number; className?: string }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={`block ${className}`}>
      <TaijiMarks cx={50} cy={50} r={46} borderWidth={3.5} />
    </svg>
  );
}
