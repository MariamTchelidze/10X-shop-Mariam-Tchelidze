// toast-ის ტიპებსა და შეტყობინების მონაცემებს განსაზღვრავს.
export type ToastType = "success" | "info" | "error";

export interface ToastMessage {
  id: number;
  message: string;
  type: ToastType;
}
