export default function TaijiSymbol({ size = 28, className = "" }: { size?: number; className?: string }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className}>
      <circle cx="50" cy="50" r="48" fill="#0a0a0a" />
      <path
        d="M50,2 A24,24 0 0,1 50,50 A24,24 0 0,0 50,98 A48,48 0 0,0 50,2 Z"
        fill="#f6f1e7"
      />
      <circle cx="50" cy="26" r="7" fill="#f6f1e7" />
      <circle cx="50" cy="74" r="7" fill="#0a0a0a" />
      <circle cx="50" cy="50" r="48" fill="none" stroke="#c9a227" strokeWidth="2" />
    </svg>
  );
}
