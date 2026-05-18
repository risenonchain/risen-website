"use client";

/**
 * Android-specific fine-tuning for the RISEN Rush game.
 * Handles immersive mode, status bar, and back button logic.
 */

export async function applyAndroidFinetuning(isPaused: boolean, togglePause: () => void) {
  if (typeof window === "undefined" || !(window as any).Capacitor) return () => {};

  const { App } = (window as any).Capacitor.Plugins;
  const { StatusBar } = (window as any).Capacitor.Plugins;

  // 1. Style Status Bar if plugin exists
  if (StatusBar) {
    try {
      await StatusBar.setBackgroundColor({ color: "#02070d" });
      await StatusBar.setStyle({ style: "DARK" });
    } catch (e) {
      // Ignored if not supported
    }
  }

  // 2. Handle Hardware Back Button
  let listener: any = null;
  if (App) {
    listener = App.addListener('backButton', ({ canGoBack }: { canGoBack: boolean }) => {
      if (isPaused) {
        if (!canGoBack) {
          App.exitApp();
        }
      } else {
        togglePause();
      }
    });
  }

  return () => {
    if (listener) {
      listener.remove();
    }
  };
}
