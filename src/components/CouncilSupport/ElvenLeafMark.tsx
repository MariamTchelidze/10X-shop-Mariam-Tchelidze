interface ElvenLeafMarkProps {
  className?: string;
}

export function ElvenLeafMark({ className = "h-5 w-5" }: ElvenLeafMarkProps) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={`${className} fill-none stroke-current`} strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 26c1-10 6-17 20-20-1 14-7 20-20 20Z" />
      <path d="M7 25c4-6 9-11 17-16M13 18l-1-6m6 0 5 1m-11 9 1 4" />
    </svg>
  );
}
