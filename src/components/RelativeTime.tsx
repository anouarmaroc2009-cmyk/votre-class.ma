'use client';

import { useState, useEffect } from 'react';

interface RelativeTimeProps {
  date: string;
  className?: string;
}

function computeRelative(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
}

export default function RelativeTime({ date, className }: RelativeTimeProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) {
    const d = new Date(date);
    return (
      <span className={className}>
        {d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
      </span>
    );
  }

  return <span className={className}>{computeRelative(date)}</span>;
}
