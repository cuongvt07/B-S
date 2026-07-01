'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { makeQueryClient } from '@/lib/query-client';
import { IconContext } from '@/components/icons';

export function Providers({ children }: { children: ReactNode }) {
  const [client] = useState(() => makeQueryClient());
  return (
    <QueryClientProvider client={client}>
      {/* Site-wide icon look: Phosphor duotone for a softer, more premium feel.
          Per-icon `weight`/`size` props still override this default. */}
      <IconContext.Provider value={{ weight: 'duotone' }}>
        {children}
        {process.env.NODE_ENV === 'development' && (
          <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-right" />
        )}
      </IconContext.Provider>
    </QueryClientProvider>
  );
}
