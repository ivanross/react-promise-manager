import * as React from 'react'
import * as Utils from './utils'
import { act, create } from 'react-test-renderer'
import { usePromise } from '../src'

describe(usePromise, () => {
  it('should have initial state equal pending', async () => {
    let promiseState
    const render = jest.fn()
    const { promise } = Utils.controllablePromise()

    act(() => {
      const Component = () => {
        promiseState = usePromise(promise, [])
        render()
        return <div />
      }
      create(<Component />)
    })

    expect(render.mock.calls.length).toBe(1)
    expect(promiseState).toEqual({ state: 'pending' })
  })

  it('should update when promise is resolved', async () => {
    let promiseState
    const render = jest.fn()
    const { promise, resolve } = Utils.controllablePromise()

    await act(async () => {
      const Component = () => {
        promiseState = usePromise(promise, [])
        render()
        return <div />
      }
      create(<Component />)
      await Utils.tick()
      resolve('resolved value')
      await Utils.tick()
    })

    expect(render.mock.calls.length).toBe(2)
    expect(promiseState).toEqual({ state: 'resolved', result: 'resolved value' })
  })

  it('should update when promise is rejected', async () => {
    let promiseState
    const render = jest.fn()
    const { promise, reject } = Utils.controllablePromise()

    await act(async () => {
      const Component = () => {
        promiseState = usePromise(promise, [])
        render()
        return <div />
      }
      create(<Component />)
      await Utils.tick()
      reject('rejected value')
      await Utils.tick()
    })

    expect(render.mock.calls.length).toBe(2)
    expect(promiseState).toEqual({ state: 'rejected', error: 'rejected value' })
  })

  it('should update when function promise is resolved', async () => {
    let promiseState, resolve: any
    const render = jest.fn()

    const promiseFn = () => {
      const controlled = Utils.controllablePromise()
      resolve = controlled.resolve
      return controlled.promise
    }

    await act(async () => {
      const Component = () => {
        promiseState = usePromise(promiseFn, [])
        render()
        return <div />
      }
      create(<Component />)
      await Utils.tick()
      resolve('resolved value')
      await Utils.tick()
    })

    expect(render.mock.calls.length).toBe(2)
    expect(promiseState).toEqual({ state: 'resolved', result: 'resolved value' })
  })

  it('should update when function promise is rejected', async () => {
    let promiseState, reject: any
    const render = jest.fn()

    const promiseFn = () => {
      const controlled = Utils.controllablePromise()
      reject = controlled.reject
      return controlled.promise
    }

    await act(async () => {
      const Component = () => {
        promiseState = usePromise(promiseFn, [])
        render()
        return <div />
      }
      create(<Component />)
      await Utils.tick()
      reject('rejected value')
      await Utils.tick()
    })

    expect(render.mock.calls.length).toBe(2)
    expect(promiseState).toEqual({ state: 'rejected', error: 'rejected value' })
  })
})
