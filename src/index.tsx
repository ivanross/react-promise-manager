import * as React from 'react'
const pkgName = require('../package.json').name

type FunctionChildren<T> = (result: T) => React.ReactNode
type ChildrenOrFunction<T> = React.ReactNode | FunctionChildren<T>

function isFunctionChildren<T = any>(x: ChildrenOrFunction<T>): x is FunctionChildren<T> {
  return typeof x === 'function'
}

export interface ManagePromiseProps<T = any> {
  children?: ChildrenOrFunction<PromiseState<T>>
  promise: Promise<T>
}

export interface Props<T = any> {
  children?: ChildrenOrFunction<T>
}

export type ResolvedResult<T> = {
  state: 'resolved'
  result: T
}

export type RejectedResult = {
  state: 'rejected'
  error: any
}

export type PendingResult = {
  state: 'pending'
}

export type PromiseState<T> = ResolvedResult<T> | RejectedResult | PendingResult

export function usePromise<T>(promise: Promise<T>) {
  const [state, setState] = React.useState<PromiseState<T>>({ state: 'pending' })

  React.useEffect(() => {
    let shouldUpdate = true

    // should I reset state to pending when new promise is passed?
    // setState({ state: "pending" }) + [promise] as a dependency

    promise
      .then(result => shouldUpdate && setState({ state: 'resolved', result }))
      .catch(error => shouldUpdate && setState({ state: 'rejected', error }))

    return () => {
      shouldUpdate = false
    }
  }, [])

  return state
}

const InternalPromiseContext = React.createContext<PromiseState<any> | 'unset'>('unset')

export function usePromiseState<T = any>() {
  const status = React.useContext(InternalPromiseContext)
  if (status === 'unset')
    throw new PromiseManagerError('usePromiseState must be called inside a ManagePromise child')
  return status as PromiseState<T>
}

export function usePromiseResult<T = any>() {
  const result = usePromiseState<T>()
  if (result.state !== 'resolved')
    throw new PromiseManagerError('usePromiseResult must be called inside a Resolved child')
  return result.result
}

export function usePromiseError() {
  const result = usePromiseState()
  if (result.state !== 'rejected')
    throw new PromiseManagerError('usePromiseError must be called inside a Rejected child')
  return result.error
}

export function ManagePromise<T = any>(props: ManagePromiseProps<T>) {
  const { promise, children } = props
  const result = usePromise<T>(promise)
  return (
    <InternalPromiseContext.Provider value={result}>
      {isFunctionChildren(children) ? children(result) : children}
    </InternalPromiseContext.Provider>
  )
}

export function Resolved<T = any>(props: Props<T>) {
  const { children } = props
  const status = usePromiseState()
  if (status.state !== 'resolved') return null
  return <>{isFunctionChildren(children) ? children(status.result) : children}</>
}

export function Rejected(props: Props<any>) {
  const { children } = props
  const status = usePromiseState()
  if (status.state !== 'rejected') return null
  return <>{isFunctionChildren(children) ? children(status.error) : children}</>
}

export const Pending: React.FC = ({ children }) => {
  const status = usePromiseState().state
  if (status !== 'pending') return null
  return <>{children}</>
}

export class PromiseManagerError extends Error {
  constructor(message?: string) {
    super(`${pkgName}: ${message}`)
  }
}
