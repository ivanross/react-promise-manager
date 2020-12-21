import * as React from 'react'
const pkgName = require('../package.json').name

type FunctionChildren<T> = (result: T) => React.ReactNode
type ChildrenOrFunction<T> = React.ReactNode | FunctionChildren<T>

function isFunctionChildren<T = any>(x: ChildrenOrFunction<T>): x is FunctionChildren<T> {
  return typeof x === 'function'
}

export interface ManagedPromiseProps<Result, Error> {
  children?: ChildrenOrFunction<PromiseState<Result, Error>>
  promise: Promise<Result> | (() => Promise<Result>)
}

export interface Props<T> {
  children?: ChildrenOrFunction<T>
}

export type ResolvedResult<Result> = {
  state: 'resolved'
  result: Result
}

export type RejectedResult<Error> = {
  state: 'rejected'
  error: Error
}

export type PendingResult = {
  state: 'pending'
}

export type PromiseState<Result, Error> =
  | ResolvedResult<Result>
  | RejectedResult<Error>
  | PendingResult

export function usePromise<Result = any, Error = any>(
  promise: Promise<Result> | (() => Promise<Result>),
  deps: React.DependencyList
) {
  const [state, setState] = React.useState<PromiseState<Result, Error>>({ state: 'pending' })

  React.useEffect(() => {
    let shouldUpdate = true

    const p = typeof promise === 'function' ? promise : () => promise

    p()
      .then(result => shouldUpdate && setState({ state: 'resolved', result }))
      .catch(error => shouldUpdate && setState({ state: 'rejected', error }))

    return () => {
      shouldUpdate = false
    }
  }, deps)

  return state
}

const InternalPromiseContext = React.createContext<PromiseState<any, any> | 'unset'>('unset')

export function usePromiseState<Result = any, Error = any>() {
  const status = React.useContext(InternalPromiseContext)
  if (status === 'unset')
    throw new PromiseManagerError('usePromiseState must be called inside a ManagePromise child')
  return status as PromiseState<Result, Error>
}

export function usePromiseResult<Result = any>() {
  const result = usePromiseState<Result>()
  if (result.state !== 'resolved')
    throw new PromiseManagerError('usePromiseResult must be called inside a Resolved child')
  return result.result
}

export function usePromiseError<Error = any>() {
  const result = usePromiseState<any, Error>()
  if (result.state !== 'rejected')
    throw new PromiseManagerError('usePromiseError must be called inside a Rejected child')
  return result.error
}

export function ManagedPromise<Result = any, Error = any>(
  props: ManagedPromiseProps<Result, Error>
) {
  const { promise, children } = props
  const result = usePromise<Result, Error>(promise, [])
  return (
    <InternalPromiseContext.Provider value={result}>
      {isFunctionChildren(children) ? children(result) : children}
    </InternalPromiseContext.Provider>
  )
}

export function Resolved<Result = any>(props: Props<Result>) {
  const { children } = props
  const status = usePromiseState()
  if (status.state !== 'resolved') return null
  return <>{isFunctionChildren(children) ? children(status.result) : children}</>
}

export function Rejected<Error = any>(props: Props<Error>) {
  const { children } = props
  const status = usePromiseState<any, Error>()
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
