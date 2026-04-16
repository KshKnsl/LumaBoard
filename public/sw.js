self.addEventListener("install", (e) => {
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(clients.claim());
});

self.addEventListener("fetch", (e) => {
  if (e.request.method === "GET") {
    e.respondWith(
      fetch(e.request).catch(
        () => new Response("You are currently offline.", { status: 503 })
      )
    );
  }
});
