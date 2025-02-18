'use client';

import { cn } from '@tutur3u/utils/format';
import { ReactNode } from 'react';

export default function UserPresenceIndicator({
  className,
  children,
}: {
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div
      className={cn(
        'absolute right-0 bottom-0 z-20 h-2 w-2 rounded-full border border-background',
        'bg-dynamic-green',
        className
      )}
    >
      {children}
    </div>
  );
}
