import type { APIContext } from 'astro';
import { vi } from 'vitest';

export function context(
  path: string,
  options: {
    method?: string;
    body?: unknown;
    origin?: string;
    cookies?: Record<string, string>;
    headers?: Record<string, string>;
  } = {},
) {
  const url = new URL(path, 'https://frontend.test');
  const values = new Map(Object.entries(options.cookies ?? {}));
  const cookies = {
    get: vi.fn((key: string) =>
      values.has(key) ? { value: values.get(key) } : undefined,
    ),
    set: vi.fn((key: string, value: string) => {
      values.set(key, value);
    }),
    delete: vi.fn((key: string) => {
      values.delete(key);
    }),
  };
  const headers = new Headers(options.headers);
  if (options.origin) headers.set('Origin', options.origin);
  if (options.body !== undefined)
    headers.set('Content-Type', 'application/json');
  const request = new Request(url, {
    method: options.method ?? 'GET',
    headers,
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  });
  return {
    context: {
      url,
      request,
      cookies,
      params: {},
      redirect: (location: string) =>
        new Response(null, { status: 302, headers: { Location: location } }),
    } as unknown as APIContext,
    cookies,
  };
}
