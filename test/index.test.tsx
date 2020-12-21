import * as React from 'react'
import * as Utils from './utils'
import { act, create } from 'react-test-renderer'
import { ManagedPromise, Resolved, Rejected, Pending, usePromise } from '../src'

describe(ManagedPromise, () => {
  it('should render Pending child, then Resolved child', async () => {
    const renderPending = jest.fn()
    const renderResolved = jest.fn()
    const renderRejected = jest.fn()
    const ComponentPending = () => (renderPending(), (<div />))
    const ComponentResolved = () => (renderResolved(), (<div />))
    const ComponentRejected = () => (renderRejected(), (<div />))

    const { promise, resolve } = Utils.controllablePromise()

    act(() => {
      create(
        <ManagedPromise promise={promise}>
          <Pending>
            <ComponentPending />
          </Pending>
          <Resolved>
            <ComponentResolved />
          </Resolved>
          <Rejected>
            <ComponentRejected />
          </Rejected>
        </ManagedPromise>
      )
    })

    expect(renderPending.mock.calls.length).toBe(1)
    expect(renderResolved.mock.calls.length).toBe(0)
    expect(renderRejected.mock.calls.length).toBe(0)

    Utils.mockClear(renderPending, renderResolved, renderRejected)

    await act(async () => {
      resolve()
      await Utils.tick()
    })

    expect(renderPending.mock.calls.length).toBe(0)
    expect(renderResolved.mock.calls.length).toBe(1)
    expect(renderRejected.mock.calls.length).toBe(0)
  })

  it('should render Pending child, then Rejected child', async () => {
    const renderPending = jest.fn()
    const renderResolved = jest.fn()
    const renderRejected = jest.fn()
    const ComponentPending = () => (renderPending(), (<div />))
    const ComponentResolved = () => (renderResolved(), (<div />))
    const ComponentRejected = () => (renderRejected(), (<div />))

    const { promise, reject } = Utils.controllablePromise()

    act(() => {
      create(
        <ManagedPromise promise={promise}>
          <Pending>
            <ComponentPending />
          </Pending>
          <Resolved>
            <ComponentResolved />
          </Resolved>
          <Rejected>
            <ComponentRejected />
          </Rejected>
        </ManagedPromise>
      )
    })

    expect(renderPending.mock.calls.length).toBe(1)
    expect(renderResolved.mock.calls.length).toBe(0)
    expect(renderRejected.mock.calls.length).toBe(0)

    Utils.mockClear(renderPending, renderResolved, renderRejected)

    await act(async () => {
      reject()
      await Utils.tick()
    })

    expect(renderPending.mock.calls.length).toBe(0)
    expect(renderResolved.mock.calls.length).toBe(0)
    expect(renderRejected.mock.calls.length).toBe(1)
  })
})

describe(usePromise, () => {
  it('should update when promise is resolved', async () => {
    let promiseState = {}
    const { promise, resolve } = Utils.controllablePromise()

    const Component = () => {
      promiseState = usePromise(promise, [])
      return null
    }

    act(() => void create(<Component />))

    expect(promiseState).toEqual({ state: 'pending' })

    await act(async () => {
      resolve('resolved value')
      await Utils.tick()
    })

    expect(promiseState).toEqual({ state: 'resolved', result: 'resolved value' })
  })

  it('should update when promise is rejected', async () => {
    let promiseState = {}
    const { promise, reject } = Utils.controllablePromise()

    const Component = () => {
      promiseState = usePromise(promise, [])
      return null
    }

    act(() => void create(<Component />))

    expect(promiseState).toEqual({ state: 'pending' })

    await act(async () => {
      reject('rejected value')
      await Utils.tick()
    })

    expect(promiseState).toEqual({ state: 'rejected', error: 'rejected value' })
  })

  it('should update when function promise is resolved', async () => {
    let promiseState = {}
    const { promise, resolve } = Utils.controllablePromise()

    const Component = () => {
      promiseState = usePromise(() => promise, [])
      return null
    }

    act(() => void create(<Component />))

    expect(promiseState).toEqual({ state: 'pending' })

    await act(async () => {
      resolve('resolved value')
      await Utils.tick()
    })

    expect(promiseState).toEqual({ state: 'resolved', result: 'resolved value' })
  })

  it('should update when function promise is rejected', async () => {
    let promiseState = {}
    const { promise, reject } = Utils.controllablePromise()

    const Component = () => {
      promiseState = usePromise(() => promise, [])
      return null
    }

    act(() => void create(<Component />))

    expect(promiseState).toEqual({ state: 'pending' })

    await act(async () => {
      reject('rejected value')
      await Utils.tick()
    })

    expect(promiseState).toEqual({ state: 'rejected', error: 'rejected value' })
  })
})
