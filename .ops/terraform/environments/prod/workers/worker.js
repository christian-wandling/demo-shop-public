addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const response = await fetch(request);
  const newResponse = new Response(response.body, response);

  newResponse.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  newResponse.headers.set('X-Content-Type-Options', 'nosniff');

  newResponse.headers.set('X-XSS-Protection', '1; mode=block');
  newResponse.headers.set(
    'Content-Security-Policy',
    `default-src 'self'; \
     script-src 'self' 'unsafe-inline' https://*.cloudflareinsights.com https://*.wandling.dev; \
     style-src 'self' 'unsafe-inline' https://*.wandling.dev; \
     object-src 'none'; \
     base-uri 'none' \
     img-src 'self' https://*.cloudflareinsights.com https://*.wandling.dev data:; \
     font-src 'self' data:; \
     frame-src 'self' https://*.cloudflareinsights.com https://*.wandling.dev; \
     connect-src 'self' https://*.cloudflareinsights.com https://*.wandling.dev;`
  );
  newResponse.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  newResponse.headers.set('Permissions-Policy', 'geolocation=(), microphone=()');

  return newResponse;
}
