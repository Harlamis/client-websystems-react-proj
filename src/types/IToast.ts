export type ToastType = "error" | "success" | "info";

export interface IToast {
  id: string;
  message: string;
  type: ToastType;
}
