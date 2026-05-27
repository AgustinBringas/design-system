import { useToast } from './use-toast';
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from './toast';

/**
 * Mount once at the app root (e.g. inside your layout or _app.tsx).
 * All toasts triggered via `toast()` or `useToast()` render here.
 *
 * @example
 * // app root
 * <Toaster />
 *
 * // anywhere in the app
 * import { toast } from '@ds/ui';
 * toast({ title: 'Saved!', variant: 'success' });
 */
export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(({ id, title, description, action, ...props }) => (
        <Toast key={id} {...props}>
          <div className="grid gap-1">
            {title       && <ToastTitle>{title}</ToastTitle>}
            {description && <ToastDescription>{description}</ToastDescription>}
          </div>
          {action}
          <ToastClose />
        </Toast>
      ))}
      <ToastViewport />
    </ToastProvider>
  );
}
