import * as React from "react"

import { ToastAction, ToastProps } from "./toast"

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 1000000 // Aumentado para 1000 segundos para testes

type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactElement<typeof ToastAction>
  open?: boolean; // Adicionado para controlar o estado de abertura
}

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const

type ActionType = typeof actionTypes

type Action = 
  | { type: ActionType["ADD_TOAST"]; toast: ToasterToast }
  | { type: ActionType["UPDATE_TOAST"]; toast: Partial<ToasterToast> }
  | { type: ActionType["DISMISS_TOAST"]; toastId?: ToasterToast["id"] }
  | { type: ActionType["REMOVE_TOAST"]; toastId?: ToasterToast["id"] }

interface State {
  toasts: ToasterToast[]
}

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case actionTypes.ADD_TOAST:
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    case actionTypes.UPDATE_TOAST:
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      }

    case actionTypes.DISMISS_TOAST: {
      const { toastId } = action

      // Enfileirar para remoção após o tempo limite
      if (toastId) {
        addToastToDismiss(toastId)
      } else {
        state.toasts.forEach((toast) => {
          addToastToDismiss(toast.id)
        })
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? { ...t, open: false } : t
        ),
      }
    }

    case actionTypes.REMOVE_TOAST:
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        }
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      }
    default:
      return state
  }
}

const listeners: ((state: State) => void)[] = []

let memoryState: State = { toasts: [] }

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => listener(memoryState))
}

let dismissTimer: ReturnType<typeof setTimeout> | undefined

function addToastToDismiss(toastId: string) {
  if (dismissTimer) {
    clearTimeout(dismissTimer)
  }
  dismissTimer = setTimeout(() => {
    dispatch({ type: "REMOVE_TOAST", toastId: toastId })
    dismissTimer = undefined
  }, TOAST_REMOVE_DELAY)
}

type Toast = Omit<ToasterToast, "id">

export function useToast() {
  const [state, setState] = React.useState<State>(memoryState)

  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [state])

  return {
    ...state,
    toast: React.useCallback((props: Toast) => {
      const id = generateId()

      const update = (props: Partial<ToasterToast>) =>
        dispatch({ type: "UPDATE_TOAST", toast: { ...props, id } })
      const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id })

      dispatch({ type: "ADD_TOAST", toast: { ...props, id, open: true } })

      return {
        id: id,
        update,
        dismiss,
      }
    }, []),
  }
}

function generateId() {
  return Math.random().toString(36).substring(2, 9)
}

export { ToastAction }

// Exporta a função toast diretamente para uso global
export const toast = (props: Toast) => {
  const id = generateId();
  const update = (props: Partial<ToasterToast>) =>
    dispatch({ type: "UPDATE_TOAST", toast: { ...props, id } });
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id });

  dispatch({ type: "ADD_TOAST", toast: { ...props, id, open: true } });

  return { id, update, dismiss };
};

