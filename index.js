const BACKEND = "ying-ctmc-780516275884.us-central1.run.app";

export default {
  async fetch(request) {

    const target = new URL(request.url);
    target.hostname = BACKEND;
    target.protocol = "https:";

    const headers = new Headers(request.headers);

    // remove ESA restricted/hop headers
    headers.delete("host");
    headers.delete("connection");
    headers.delete("content-length");
    headers.delete("keep-alive");

    const response = await fetch(target.toString(), {
      method: request.method,
      headers,
      body: request.method === "GET" || request.method === "HEAD"
        ? undefined
        : request.body,
        redirect: "follow"
    });

    const text = await response.text();

    return new Response(
      "STATUS: " + response.status + "\n\n" + text.slice(0,500),
      {
        status: 200,
        headers:{
          "content-type":"text/plain"
        }
      }
    );
  }
};
