// src/modules/superadmin/components/SuperadminFinancePage.tsx
// ✅ Wrapper autónomo para la isla React de Astro

import { QueryProvider } from '@/components/shared/QueryProvider';
import { Toaster } from 'sonner';
import { SuperadminFinanceView } from './SuperadminFinanceView';

export function SuperadminFinancePage() {
  return (
    <QueryProvider>
      <SuperadminFinanceView />
      <Toaster richColors position="top-right" theme="dark" closeButton />
    </QueryProvider>
  );
}
