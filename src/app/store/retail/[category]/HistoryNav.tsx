'use client';

import { useRouter } from 'next/navigation';

export function BackButton({ className, style }: { className?: string, style?: React.CSSProperties }) {
  const router = useRouter();
  return (
    <button 
      onClick={() => router.back()} 
      className={className} 
      style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', ...style }}
    >
      &lt;&lt;
    </button>
  );
}

export function ForwardButton({ className, style }: { className?: string, style?: React.CSSProperties }) {
  const router = useRouter();
  return (
    <button 
      onClick={() => router.forward()} 
      className={className} 
      style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', ...style }}
    >
      &gt;&gt;
    </button>
  );
}
