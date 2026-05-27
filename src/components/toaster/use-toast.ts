import * as React from 'react';
import type { ToastActionElement, ToastVariant } from './toast';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ToasterToast {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
  variant?: ToastVariant;
  duration?: number;
  open: boolean;
  onOpenChange?: (open: boolean) => void;
}

type ToastInput = Omit<ToasterToast, 'id' | 'open'>;

type Action =
  | { type: 'ADD_TOAST';    toast: ToasterToast }
  | { type: 'UPDATE_TOAST'; toast: Partial<ToasterToast> & { id: string } }
  | { type: 'DISMISS_TOAST'; toastId?: string }
  | { type: 'REMOVE_TOAST';  toastId?: string };

interface State {
  toasts: ToasterToast[];
}

// ─── Constants ────────────────────────────────────────────────────────────────

const TOAST_LIMIT       = 3;
const TOAST_REMOVE_DELAY = 1000; // ms after close animation before removing from DOM

// ─── Module-level state (lives outside React) ─────────────────────────────────

let count = 0;
function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

function addToRemoveQueue(toastId: string) {
  if (toastTimeouts.has(toastId)) return;
  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({ type: 'REMOVE_TOAST', toastId });
  }, TOAST_REMOVE_DELAY);
  toastTimeouts.set(toastId, timeout);
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'ADD_TOAST':
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      };

    case 'UPDATE_TOAST':
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t,
        ),
      };

    case 'DISMISS_TOAST': {
      const { toastId } = action;
      if (toastId !== undefined) {
        addToRemoveQueue(toastId);
      } else {
        state.toasts.forEach((t) => addToRemoveQueue(t.id));
      }
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          toastId === undefined || t.id === toastId
            ? { ...t, open: false }
            : t,
        ),
      };
    }

    case 'REMOVE_TOAST':
      if (action.toastId === undefined) return { ...state, toasts: [] };
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      };
  }
}

const listeners: Array<(state: State) => void> = [];
let memoryState: State = { toasts: [] };

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => listener(memoryState));
}

// ─── Public API ───────────────────────────────────────────────────────────────

function toast(props: ToastInput) {
  const id = genId();

  const dismiss = () => dispatch({ type: 'DISMISS_TOAST', toastId: id });
  const update  = (next: ToastInput) =>
    dispatch({ type: 'UPDATE_TOAST', toast: { ...next, id } });

  dispatch({
    type: 'ADD_TOAST',
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => { if (!open) dismiss(); },
    },
  });

  return { id, dismiss, update };
}

function useToast() {
  const [state, setState] = React.useState<State>(memoryState);

  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) listeners.splice(index, 1);
    };
  }, []);

  return {
    toasts: state.toasts,
    toast,
    dismiss: (toastId?: string) =>
      dispatch({ type: 'DISMISS_TOAST', ...(toastId !== undefined && { toastId }) }),
  };
}

export { toast, useToast };

/** Synchronously wipes all toast state. Only import this in test files. */
export function _resetForTests() {
  toastTimeouts.forEach(clearTimeout);
  toastTimeouts.clear();
  memoryState = { toasts: [] };
  listeners.forEach((l) => l(memoryState));
}
