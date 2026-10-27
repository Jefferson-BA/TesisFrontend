// src/modules/superadmin/components/SuperadminSettingsPage.tsx
// ✅ Wrapper autónomo para la isla React de Astro

import { QueryProvider } from '@/components/shared/QueryProvider';
import { Toaster } from 'sonner';
import { SuperadminSettingsView } from './SuperadminSettingsView';

export function SuperadminSettingsPage() {
  return (
    <QueryProvider>
      <SuperadminSettingsView />
      <Toaster richColors position="top-right" theme="dark" closeButton />
    </QueryProvider>
  );
}
