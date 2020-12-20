import * as React from 'react'
const pkgName = require('../package.json').name

type FunctionChildren<T> = (result: T) => React.ReactNode
type ChildrenOrFunction<T> = React.ReactNode | FunctionChildren<T>

function isFunctionChildren<T = any>(x: ChildrenOrFunction<T>): x is FunctionChildren<T> {
  return typeof x === 'function'
}

export interface ManagePromiseProps<T = any> {
  children: ChildrenOrFunction<PromiseStatus<T>>
  promise: Promise<T>
}

export interface Props<T = any> {
  children: ChildrenOrFunction<T>
}

export type ResolvedResult<T> = {
  status: 'resolved'
  result: T
}

export type RejectedResult = {
  status: 'rejected'
  error: any
}

export type PendingResult = {
  status: 'pending'
}

export type PromiseStatus<T> = ResolvedResult<T> | RejectedResult | PendingResult

export function usePromise<T>(promise: Promise<T>) {
  const [status, setStatus] = React.useState<PromiseStatus<T>>({ status: 'pending' })

  React.useEffect(() => {
    let shouldUpdate = true

    // should I reset state to pending when new promise is passed?
    // setState({ state: "pending" }) + [promise] as a dependency

    promise
      .then(result => shouldUpdate && setStatus({ status: 'resolved', result }))
      .catch(error => shouldUpdate && setStatus({ status: 'rejected', error }))

    return () => {
      shouldUpdate = false
    }
  }, [])

  return status
}

const InternalPromiseContext = React.createContext<PromiseStatus<any> | 'unset'>('unset')

export function usePromiseStatus<T = any>() {
  const status = React.useContext(InternalPromiseContext)
  if (status === 'unset')
    throw new PromiseManagerError('usePromiseStatus must be called inside a ManagePromise child')
  return status as PromiseStatus<T>
}

export function usePromiseResult<T = any>() {
  const result = usePromiseStatus<T>()
  if (result.status !== 'resolved')
    throw new PromiseManagerError('usePromiseResult must be called inside a Resolved child')
  return result.result
}

export function usePromiseError() {
  const result = usePromiseStatus()
  if (result.status !== 'rejected')
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
  const status = usePromiseStatus()
  if (status.status !== 'resolved') return null
  return <>{isFunctionChildren(children) ? children(status.result) : children}</>
}

export function Rejected(props: Props<any>) {
  const { children } = props
  const status = usePromiseStatus()
  if (status.status !== 'rejected') return null
  return <>{isFunctionChildren(children) ? children(status.error) : children}</>
}

export const Pending: React.FC = ({ children }) => {
  const status = usePromiseStatus().status
  if (status !== 'pending') return null
  return <>{children}</>
}

export class PromiseManagerError extends Error {
  constructor(message?: string) {
    super(`${pkgName}: ${message}`)
  }
}
