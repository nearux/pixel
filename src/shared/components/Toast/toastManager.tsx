type ToastType = "success" | "error";

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

type Listener = (toasts: Toast[]) => void;

class ToastManager {
  private toasts: Toast[] = [];
  private listeners: Set<Listener> = new Set();

  subscribe(listener: Listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((listener) => listener([...this.toasts]));
  }

  private add(type: ToastType, message: string, duration = 3000) {
    const id = Date.now().toString() + Math.random();
    const toast = { id, type, message };

    this.toasts = [...this.toasts, toast];
    this.notify();

    setTimeout(() => {
      this.remove(id);
    }, duration);
  }

  remove(id: string) {
    this.toasts = this.toasts.filter((t) => t.id !== id);
    this.notify();
  }

  success(message: string, duration?: number) {
    this.add("success", message, duration);
  }

  error(message: string, duration?: number) {
    this.add("error", message, duration);
  }
}

export const toastManager = new ToastManager();

export const toast = {
  success: (message: string, duration?: number) =>
    toastManager.success(message, duration),
  error: (message: string, duration?: number) =>
    toastManager.error(message, duration),
};
