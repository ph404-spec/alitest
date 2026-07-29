const BACKEND_DOMAIN = "ying-reft-887309013306.us-central1.run.app";

export default {
  async fetch(request) {
    const url = new URL(request.url);

    const target = new URL(request.url);
    target.hostname = BACKEND_DOMAIN;
    target.protocol = "https:";

    const headers = new Headers(request.headers);
    headers.set("Host", BACKEND_DOMAIN);

    const response = await fetch(target, {
      method: request.method,
      headers,
      body: request.body
    });

    return new Response(response.body, {
      status: response.status,
      headers: response.headers
    });
  }
};
