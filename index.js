const BACKEND_DOMAIN = "ying-reft-887309013306.us-central1.run.app";

export default {
  async fetch(request) {
    const url = new URL(request.url);

    const target = new URL(url.pathname + url.search, "https://" + BACKEND_DOMAIN);

    const headers = new Headers(request.headers);

    // remove problematic hop-by-hop headers
    headers.delete("host");
    headers.delete("connection");
    headers.delete("content-length");

    const response = await fetch(target, {
      method: request.method,
      headers: headers,
      body: ["GET", "HEAD"].includes(request.method)
        ? undefined
        : request.body,
      redirect: "manual"
    });

    const responseHeaders = new Headers(response.headers);

    responseHeaders.delete("content-length");

    return new Response(response.body, {
      status: response.status,
      headers: responseHeaders
    });
  }
};
