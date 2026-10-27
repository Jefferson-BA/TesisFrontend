// src/modules/superadmin/components/SuperadminAuditPage.tsx
// ✅ Wrapper autónomo para la isla React de Astro

import { QueryProvider } from '@/components/shared/QueryProvider';
import { Toaster } from 'sonner';
import { SuperadminAuditView } from './SuperadminAuditView';

export function SuperadminAuditPage() {
  return (
    <QueryProvider>
      <SuperadminAuditView />
      <Toaster richColors position="top-right" theme="dark" closeButton />
    </QueryProvider>
  );
}
