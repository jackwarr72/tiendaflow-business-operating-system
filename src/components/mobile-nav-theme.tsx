"use client";

import { useSyncExternalStore, useEffect } from "react";

// The `.dark` class on <html> (set pre-paint by the root-layout script) is
// the single source of truth. A custom event notifies subscribers of changes
// made either here or by the OS-preference listener below.
const THEME_EVENT = "tiendaflow-theme-change";

function subscribe(onStoreChange: () => void) {
  window.addEventListener(THEME_EVENT, onStoreChange);
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  const onSchemeChange = () => {
    if (!localStorage.getItem("tiendaflow-theme")) {
      applyTheme(mq.matches);
    }
  };
  mq.addEventListener("change", onSchemeChange);
  return () => {
    window.removeEventListener(THEME_EVENT, onStoreChange);
    mq.removeEventListener("change", onSchemeChange);
  };
}

function applyTheme(dark: boolean) {
  document.documentElement.classList.toggle("dark", dark);
  document.documentElement.style.colorScheme = dark ? "dark" : "light";
  window.dispatchEvent(new Event(THEME_EVENT));
}

function getSnapshot() {
  return document.documentElement.classList.contains("dark");
}

function getServerSnapshot() {
  return false;
}

export function MobileNavTheme() {
  const dark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    // Sync theme on mount
    const stored = localStorage.getItem("tiendaflow-theme");
    if (stored) {
      applyTheme(stored === "dark");
    }
  }, []);

  // This component only manages the theme side-effect; it renders nothing.
  return null;
}