export default function LotusSymbol({ size = 32, className = "" }: { size?: number; className?: string }) {
  return (
    <svg viewBox="0 0 100 60" width={size} height={size * 0.6} className={className}>
      <path d="M50,58 C50,58 20,50 20,30 C20,18 32,10 50,26 C68,10 80,18 80,30 C80,50 50,58 50,58 Z" fill="none" stroke="#c9a227" strokeWidth="2" />
      <path d="M50,58 C50,58 34,44 34,28 C34,20 42,16 50,30 C50,30 50,30 50,30 Z" fill="#c9a227" opacity="0.85" />
      <path d="M50,58 C50,58 66,44 66,28 C66,20 58,16 50,30 C50,30 50,30 50,30 Z" fill="#e8c766" opacity="0.85" />
      <path d="M50,58 C50,58 40,40 50,24 C60,40 50,58 50,58 Z" fill="#f6f1e7" />
    </svg>
  );
}
