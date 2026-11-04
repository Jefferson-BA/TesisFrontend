// @vitest-environment happy-dom
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { api } from '@/api/axios';
import { SuperadminSettingsView } from '@/modules/superadmin/components/SuperadminSettingsView';
import { superadminService } from '@/modules/superadmin/services/superadmin.service';
import type { SuperadminPasswordModalProps } from '@/modules/superadmin/components/SuperadminPasswordModal';

vi.mock('@/modules/superadmin/components/SuperadminPasswordModal', () => ({
  SuperadminPasswordModal: ({
    open,
    onConfirm,
    actionLabel,
  }: SuperadminPasswordModalProps) =>
    open ? (
      <button
        onClick={() =>
          void onConfirm({ superadminPassword: 'test-password', reason: '' })
        }
      >
        {actionLabel}
      </button>
    ) : null,
}));
vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }));
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});
function renderSettings() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  render(
    <QueryClientProvider client={client}>
      <SuperadminSettingsView />
    </QueryClientProvider>,
  );
  return client;
}

describe('modo mantenimiento', () => {
  it.each([true, false])(
    'interpreta inMaintenance=%s del backend',
    async (enabled) => {
      vi.spyOn(api, 'get').mockResolvedValue({
        data: { inMaintenance: enabled, message: 'Mensaje público' },
      });
      await expect(superadminService.getMaintenanceStatus()).resolves.toEqual({
        maintenanceMode: enabled,
        customMessage: 'Mensaje público',
      });
    },
  );
  it('rechaza un estado sin booleano válido', async () => {
    vi.spyOn(api, 'get').mockResolvedValue({
      data: { inMaintenance: 'false', message: 'Mensaje' },
    });
    await expect(superadminService.getMaintenanceStatus()).rejects.toThrow();
  });
  it.each([true, false])(
    'permite cambiar el estado inicial %s y actualiza el botón',
    async (initial) => {
      let enabled = initial;
      vi.spyOn(api, 'get').mockImplementation(async (url) => ({
        data: url.endsWith('/status')
          ? { inMaintenance: enabled, message: 'Mensaje público' }
          : [],
      }));
      const post = vi
        .spyOn(api, 'post')
        .mockImplementation(async (_url, dto: unknown) => {
          enabled = (dto as { enabled: boolean }).enabled;
          return {
            data: {
              success: true,
              message: 'Actualizado',
              maintenanceMode: enabled,
              customMessage: 'Mensaje público',
            },
          };
        });
      const client = renderSettings();
      await waitFor(() =>
        expect(screen.queryByText('Estado sin confirmar')).toBeNull(),
      );
      fireEvent.click(
        await screen.findByRole('button', {
          name: initial ? 'Desactivar Mantenimiento' : 'Activar Mantenimiento',
        }),
      );
      fireEvent.click(
        screen.getByRole('button', {
          name: initial ? 'Reabrir Plataforma' : 'Bloquear Plataforma',
        }),
      );
      await waitFor(() =>
        expect(post).toHaveBeenCalledWith(
          '/superadmin/config/maintenance-mode/toggle',
          {
            enabled: !initial,
            message: 'Mensaje público',
            superadminPassword: 'test-password',
          },
        ),
      );
      await waitFor(() =>
        expect(
          client.getQueryData(['superadmin-maintenance-status']),
        ).toMatchObject({ maintenanceMode: !initial }),
      );
      expect(
        await screen.findByRole('button', {
          name: initial ? 'Activar Mantenimiento' : 'Desactivar Mantenimiento',
        }),
      ).toBeTruthy();
      client.clear();
    },
  );
  it('no permite alternar si falla la consulta del estado', async () => {
    vi.spyOn(api, 'get').mockRejectedValue(new Error('Sin conexión'));
    const client = renderSettings();
    expect(
      await screen.findByRole('button', {
        name: 'Reintentar consulta de mantenimiento',
      }),
    ).toBeTruthy();
    expect(
      (
        screen.getByRole('button', {
          name: 'Activar Mantenimiento',
        }) as HTMLButtonElement
      ).disabled,
    ).toBe(true);
    expect(screen.queryByText('EN LÍNEA')).toBeNull();
    client.clear();
  });
});
