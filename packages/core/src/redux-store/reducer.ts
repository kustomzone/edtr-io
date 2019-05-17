import * as R from 'ramda'

import * as A from './actions'
import { isStatefulPlugin, Plugin } from '../plugin'

/* Mode */
const editableReducer = createSubReducer('editable', true, {
  [A.setEditable.type](_state, action: A.SetEditableAction) {
    return action.payload
  }
})
export const isEditable = (state: State) => state.editable

/* Plugins */
const pluginsReducer = createSubReducer(
  'plugins',
  { defaultPlugin: '', plugins: {} },
  {}
)
export function getDefaultPlugin(state: State) {
  return state.plugins.defaultPlugin
}
export function getPlugins(state: State) {
  return state.plugins.plugins
}
export function getPlugin(state: State, type: string): Plugin | null {
  const plugins = getPlugins(state)
  return plugins[type] || null
}
export function getPluginTypeOrDefault(
  state: State,
  type = getDefaultPlugin(state)
): string {
  return type
}
export function getPluginOrDefault(
  state: State,
  type = getDefaultPlugin(state)
): Plugin | null {
  return getPlugin(state, type)
}

/* Documents */
const documentsReducer = createSubReducer(
  'documents',
  {},
  {
    [A.insert.type](state, action: A.InsertAction, s) {
      if (!s) {
        return state // FIXME: can we guarantee that this does indeed exist?? we should be able to! foo
      }
      const { id, plugin: type, state: pluginState } = action.payload
      const plugin = getPlugin(s, type)

      if (!plugin) {
        return state
      }

      // FIXME: const history = commit(state, action)

      return {
        ...state,
        [id]: {
          plugin: type,
          state: isStatefulPlugin(plugin) ? pluginState : undefined
        }
      }
    },
    [A.remove.type](state, action: A.RemoveAction) {
      return R.omit([action.payload], state)
    },
    [A.change.type](state, action: A.ChangeAction) {
      const { id, state: pluginState } = action.payload

      if (!state[id]) {
        //TODO: console.warn: Missing Id
        return state
      }

      // FIXME: commit (probably in saga)

      return {
        [id]: {
          ...state[id],
          state: pluginState
        }
      }
    }
  }
)
export function getDocuments(state: State) {
  return state.documents
}

/* Focus */
const focusReducer = createSubReducer('focus', null, {})
export function getFocused(state: State) {
  return state.focus
}

/* Clipboard */
const clipboardReducer = createSubReducer('clipboard', [], {
  // [A.copy.type](state, action: A.CopyAction) {
  //   const maxLength = 3
  //   state.unshift(action.payload)
  //   state.splice(maxLength, state.length - maxLength)
  // }
})
export function getClipboard(state: State) {
  return state.clipboard
}

/* History */
// TODO:
// - Saga commits "resolved" actions (e.g. w/o side effects!!)
// - Undo / Redo can then be handled by reducer
// - Insert / Change etc. get handled by that saga...
const historyReducer = createSubReducer(
  'history',
  {
    initialState: {
      documents: {},
      focus: null
    },
    actions: [],
    redoStack: [],
    pending: 0
  },
  {}
)
// export type Undoable = (InsertAction | ChangeAction | RemoveAction)
export type Undoable = A.InsertAction & {
  commit?: ActionCommitType
}
export enum ActionCommitType {
  ForceCommit = 'ForceCommit',
  ForceCombine = 'ForceCombine'
}

export function rootReducer(state: State | undefined, action: A.Action): State {
  return {
    editable: editableReducer(state && state.editable, action, state),
    plugins: pluginsReducer(state && state.plugins, action, state),
    clipboard: clipboardReducer(state && state.clipboard, action, state),
    documents: documentsReducer(state && state.documents, action, state),
    focus: focusReducer(state && state.focus, action, state),
    history: historyReducer(state && state.history, action, state)
  }
}

export interface State extends BaseState {
  editable: boolean
  plugins: {
    defaultPlugin: string
    plugins: Record<string, Plugin>
  }
  clipboard: DocumentState[]
  history: StateHistory
}
export interface BaseState {
  documents: Record<string, DocumentState>
  focus: string | null
}
export interface StateHistory {
  initialState: BaseState | State
  actions: Undoable[][]
  redoStack: Undoable[][]
  pending: number
}
export interface DocumentState {
  plugin: string
  state?: unknown
}

/* Utils */
function createSubReducer<K extends keyof State>(
  key: K,
  initialState: State[K],
  actionsMap: CaseReducersMapObject<State[K]>
): SubReducer<State[K]> {
  return (subState = initialState, action, state) => {
    const caseReducer = actionsMap[action.type]
    return typeof caseReducer === 'function'
      ? caseReducer((state && state[key]) || initialState, action, state)
      : subState
  }
}
type SubReducer<S = unknown> = (
  subState: S | undefined,
  action: A.Action,
  state: State | undefined
) => S
interface CaseReducersMapObject<S = unknown> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [actionType: string]: CaseReducer<S, any>
}
type CaseReducer<S = unknown, A extends A.Action = A.Action> = (
  subState: S,
  action: A,
  state: State | undefined
) => S
