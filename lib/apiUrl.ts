'use client';

/**
 * Capacitor runs the app at a local WebView origin. A relative API request
 * would point at the phone instead of the deployed Pickem HQ server.
 */
const hostedOrigin = process.env.NEXT_PUBLIC_APP_ORIGIN || 'https://pickemhq.co';

export function apiUrl(path: string) {
  if (!path.startsWith('/')) throw new Error('API paths must begin with /.');
  if (typeof window === 'undefined') return path;
  const protocol = window.location.protocol;
  return protocol === 'capacitor:' || protocol === 'ionic:' || protocol === 'file:'
    ? `${hostedOrigin}${path}`
    : path;
}
