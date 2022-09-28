async function initMocks() {
  if (typeof window === "undefined") {
    const { server } = await import("./server");
    server.listen({ onUnhandledRequest: "warn" });
  } else {
    const { worker } = await import("./browser");
    worker.start({ onUnhandledRequest: "warn" });
  }
}

initMocks();

export {};
