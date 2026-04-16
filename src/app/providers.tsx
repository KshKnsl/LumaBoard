"use client";

import { useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "@/store";

export function AppProviders({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .catch((error) => console.log("Service Worker registration failed:", error));
    }
  }, []);
  return <Provider store={store}>{children}</Provider>;
}
