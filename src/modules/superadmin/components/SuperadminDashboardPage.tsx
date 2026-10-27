// src/modules/superadmin/components/SuperadminDashboardPage.tsx
// ✅ Wrapper autónomo para la isla React de Astro

import { QueryProvider } from '@/components/shared/QueryProvider';
import { Toaster } from 'sonner';
import { SuperadminDashboardView } from './SuperadminDashboardView';

export function SuperadminDashboardPage() {
  return (
    <QueryProvider>
      <SuperadminDashboardView />
      <Toaster richColors position="top-right" theme="dark" closeButton />
    </QueryProvider>
  );
}
