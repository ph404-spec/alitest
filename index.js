export default {
  async fetch(request) {
    return new Response("ESA OK", {
      status: 200
    });
  }
};
