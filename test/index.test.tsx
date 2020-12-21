import * as React from 'react'
import * as Utils from './utils'
import { act, create } from 'react-test-renderer'
import { ManagedPromise, Resolved, Rejected, Pending } from '../src'

describe(ManagedPromise, () => {
  it('renders Pending child, then Resolved child', async () => {
    const renderPending = jest.fn()
    const renderResolved = jest.fn()
    const renderRejected = jest.fn()
    const ComponentPending = () => (renderPending(), (<div />))
    const ComponentResolved = () => (renderResolved(), (<div />))
    const ComponentRejected = () => (renderRejected(), (<div />))

    const mockPromise = Utils.controlPromise(2000)

    act(() => {
      create(
        <ManagedPromise promise={mockPromise.promise}>
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

    await Utils.tick()
    expect(renderPending.mock.calls.length).toBe(1)
    expect(renderResolved.mock.calls.length).toBe(0)
    expect(renderRejected.mock.calls.length).toBe(0)

    Utils.mockClear(renderPending, renderResolved, renderRejected)

    act(() => {
      mockPromise.resolve()
    })
    await Utils.tick()

    expect(renderPending.mock.calls.length).toBe(0)
    expect(renderResolved.mock.calls.length).toBe(1)
    expect(renderRejected.mock.calls.length).toBe(0)
  })

  it('renders Pending child, then Rejected child', async () => {
    const renderPending = jest.fn()
    const renderResolved = jest.fn()
    const renderRejected = jest.fn()
    const ComponentPending = () => (renderPending(), (<div />))
    const ComponentResolved = () => (renderResolved(), (<div />))
    const ComponentRejected = () => (renderRejected(), (<div />))

    const mockPromise = Utils.controlPromise(2000)

    act(() => {
      create(
        <ManagedPromise promise={mockPromise.promise}>
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

    await Utils.tick()
    expect(renderPending.mock.calls.length).toBe(1)
    expect(renderResolved.mock.calls.length).toBe(0)
    expect(renderRejected.mock.calls.length).toBe(0)

    Utils.mockClear(renderPending, renderResolved, renderRejected)

    act(() => {
      mockPromise.reject()
    })
    await Utils.tick()

    expect(renderPending.mock.calls.length).toBe(0)
    expect(renderResolved.mock.calls.length).toBe(0)
    expect(renderRejected.mock.calls.length).toBe(1)
  })
})
