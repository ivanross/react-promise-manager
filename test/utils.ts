export const sleep = (ms: number) => new Promise(res => setTimeout(res, ms))
export const tick = () => sleep(0)
export const controlPromise = (autoResolveAfter: number) => {
  let resolve: any
  let reject: any
  const promise = new Promise((_resolve, _reject) => {
    resolve = _resolve
    reject = _reject
    sleep(autoResolveAfter).then(_resolve)
  })

  return { promise, resolve, reject }
}
export const mockClear = (...fns: jest.Mock<any, any>[]) => {
  fns.forEach(fn => fn.mockClear())
}
