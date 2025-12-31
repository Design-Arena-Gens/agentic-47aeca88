'use client';

import type { Channel } from '@/lib/types';
import clsx from 'clsx';

export function PlatformBadge({ platform }: { platform: Channel }) {
  const colors = platform === 'messenger' ? 'bg-messenger/15 text-messenger' : 'bg-whatsapp/15 text-whatsapp';
  const label = platform === 'messenger' ? 'Messenger' : 'WhatsApp';
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wide',
        colors
      )}
    >
      <span className="h-2 w-2 rounded-full bg-current" />
      {label}
    </span>
  );
}
