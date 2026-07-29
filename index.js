/**
 * Alibaba Cloud ESA Edge Routine - Optimized XHTTP Stream Relay
 */
const BACKEND_DOMAIN = 'ying-reft-887309013306.us-central1.run.app';
const XHTTP_PATH = '/ying';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname.startsWith(XHTTP_PATH)) {
      const targetUrl = new URL(request.url);
      targetUrl.hostname = BACKEND_DOMAIN;
      targetUrl.port = '443';
      targetUrl.protocol = 'https:';

      const headers = new Headers(request.headers);
      
      // CRITICAL FOR GOOGLE CLOUD RUN
      headers.set('Host', BACKEND_DOMAIN);
      
      // Force connection reuse and prevent compression buffering issues
      headers.set('Connection', 'keep-alive');
      headers.delete('accept-encoding'); 

      const fetchOptions = {
        method: request.method,
        headers: headers,
        redirect: 'manual',
        // Enable duplex stream reading for XHTTP POST uploads
        body: ['POST', 'PUT', 'PATCH'].includes(request.method) ? request.body : null,
        duplex: 'half'
      };

      const originResponse = await fetch(targetUrl.toString(), fetchOptions);

      // Disable caching & buffering on the response stream
      const responseHeaders = new Headers(originResponse.headers);
      responseHeaders.set('Cache-Control', 'no-cache, no-store, no-transform, must-revalidate');
      responseHeaders.set('X-Accel-Buffering', 'no');
      responseHeaders.set('Content-Type', 'application/octet-stream');

      return new Response(originResponse.body, {
        status: originResponse.status,
        statusText: originResponse.statusText,
        headers: responseHeaders
      });
    }

    return new Response('<h1>200 OK</h1>', {
      status: 200,
      headers: { 'Content-Type': 'text/html' }
    });
  }
};
