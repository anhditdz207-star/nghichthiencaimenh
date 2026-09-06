import { TRIGRAMS } from "../data/trigrams";
import type { TrigramKey } from "../data/types";

interface BaguaWheelProps {
  spinning: boolean;
  size?: number;
}

// Thứ tự Tiên Thiên Bát Quái quanh vòng tròn, bắt đầu từ đỉnh (0°), theo chiều kim đồng hồ
const RING_ORDER: { key: TrigramKey; angle: number }[] = [
  { key: "càn", angle: 0 },
  { key: "đoài", angle: 45 },
  { key: "ly", angle: 90 },
  { key: "chấn", angle: 135 },
  { key: "khảm", angle: 180 },
  { key: "cấn", angle: 225 },
  { key: "khôn", angle: 270 },
  { key: "tốn", angle: 315 },
];

const CX = 150;
const CY = 150;

function TrigramMini({ bits, angle, radius }: { bits: string; angle: number; radius: number }) {
  // Vị trí trên vòng tròn được tính bằng lượng giác; bản thân ký hiệu quái luôn giữ thẳng đứng
  // (hào nằm ngang), không xoay nghiêng theo góc — đúng quy ước truyền thống vẽ quái.
  const rad = (angle * Math.PI) / 180;
  const x = CX + radius * Math.sin(rad);
  const y = CY - radius * Math.cos(rad);
  // hào 1 (bits[0]) ở dưới cùng, hào 3 (bits[2]) ở trên cùng — giống quy ước HexagramGlyph
  const rows = [8, 0, -8];
  return (
    <g transform={`translate(${x} ${y})`}>
      {bits.split("").map((bit, i) => {
        const ry = rows[i];
        if (bit === "1") {
          return <rect key={i} x={-9} y={ry - 1.6} width={18} height={3.2} rx={1} fill="#c9a227" />;
        }
        return (
          <g key={i}>
            <rect x={-9} y={ry - 1.6} width={7} height={3.2} rx={1} fill="#c9a227" />
            <rect x={2} y={ry - 1.6} width={7} height={3.2} rx={1} fill="#c9a227" />
          </g>
        );
      })}
    </g>
  );
}

function OuterTicks({ count, radius }: { count: number; radius: number }) {
  return (
    <g>
      {Array.from({ length: count }).map((_, i) => {
        const angle = (360 / count) * i;
        return (
          <line
            key={i}
            x1={CX}
            y1={CY - radius}
            x2={CX}
            y2={CY - radius + 10}
            stroke="#c9a227"
            strokeWidth={1.4}
            opacity={i % 8 === 0 ? 0.95 : 0.45}
            transform={`rotate(${angle} ${CX} ${CY})`}
          />
        );
      })}
    </g>
  );
}

export default function BaguaWheel({ spinning, size = 260 }: BaguaWheelProps) {
  return (
    <svg
      viewBox="0 0 300 300"
      width={size}
      height={size}
      className="select-none"
    >
      <circle cx={CX} cy={CY} r={142} fill="none" stroke="#7d6216" strokeWidth={1} opacity={0.4} />
      <circle cx={CX} cy={CY} r={70} fill="none" stroke="#7d6216" strokeWidth={1} opacity={0.4} />

      {/* vòng ngoài: 64 hào, quay trái (ngược chiều kim đồng hồ) */}
      <g
        style={{
          transformBox: "view-box" as never,
          transformOrigin: "150px 150px",
          animation: spinning ? "bagua-spin-ccw 3.6s cubic-bezier(0.33,0,0.2,1) 1" : undefined,
        }}
      >
        <OuterTicks count={64} radius={142} />
      </g>

      {/* vòng giữa: 8 quái, quay phải (theo chiều kim đồng hồ) */}
      <g
        style={{
          transformBox: "view-box" as never,
          transformOrigin: "150px 150px",
          animation: spinning ? "bagua-spin-cw 3.2s cubic-bezier(0.33,0,0.2,1) 1" : undefined,
        }}
      >
        {RING_ORDER.map(({ key, angle }) => (
          <TrigramMini key={key} bits={TRIGRAMS[key].bits} angle={angle} radius={104} />
        ))}
      </g>

      {/* vòng trong cùng: Thái Cực, quay trái */}
      <g
        style={{
          transformBox: "view-box" as never,
          transformOrigin: "150px 150px",
          animation: spinning ? "bagua-spin-ccw 2.8s cubic-bezier(0.33,0,0.2,1) 1" : undefined,
        }}
      >
        <g transform={`translate(${CX - 44}, ${CY - 44})`}>
          <circle cx={44} cy={44} r={44} fill="#0a0a0a" />
          <path
            d="M44,2 A21,21 0 0,1 44,44 A21,21 0 0,0 44,86 A44,44 0 0,0 44,2 Z"
            fill="#f6f1e7"
          />
          <circle cx={44} cy={23} r={6} fill="#f6f1e7" />
          <circle cx={44} cy={65} r={6} fill="#0a0a0a" />
        </g>
      </g>
    </svg>
  );
}
