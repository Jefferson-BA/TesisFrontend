export function getImageUrl(
  value?: string | null,
  fallback = 'https://placehold.co/400x400',
) {
  if (!value) return fallback;
  if (/^https?:\/\//i.test(value)) return value;
  const base =
    import.meta.env.PUBLIC_ASSET_URL || import.meta.env.PUBLIC_API_URL || '';
  return base
    ? `${base.replace(/\/$/, '')}/${value.replace(/^\//, '')}`
    : `/${value.replace(/^\//, '')}`;
}
