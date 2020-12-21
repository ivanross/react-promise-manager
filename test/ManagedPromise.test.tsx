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
