export function getApiV1BaseUrl(apiUrl: string): string {
  const normalizedUrl = apiUrl.replace(/\/$/, '');

  if (normalizedUrl.endsWith('/api/v1')) {
    return normalizedUrl;
  }

  if (normalizedUrl.endsWith('/api')) {
    return `${normalizedUrl}/v1`;
  }

  return `${normalizedUrl}/api/v1`;
}
