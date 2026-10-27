// src/modules/superadmin/components/SuperadminUsersPage.tsx
// ✅ Wrapper que provee QueryClient + Toaster para la isla React autónoma de Astro

import { QueryProvider } from '@/components/shared/QueryProvider';
import { Toaster } from 'sonner';
import { SuperadminUsersTable } from './SuperadminUsersTable';

export function SuperadminUsersPage() {
  return (
    <QueryProvider>
      <SuperadminUsersTable />
      <Toaster richColors position="top-right" theme="dark" closeButton />
    </QueryProvider>
  );
}
