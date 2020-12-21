# React Promise Manager

Yet another Promise utility library for React.

<!-- TOC depthFrom:2 -->

- [Getting Started](#getting-started)
- [`usePromise`](#usepromise)
- [`ManagedPromise`](#managedpromise)
  - [Accessing PromiseState via function](#accessing-promisestate-via-function)
  - [Accessing PromiseState via hook](#accessing-promisestate-via-hook)

<!-- /TOC -->

## Getting Started

```
npm install react react-promise-manager
```

## `usePromise`

Accepts a promise and returns PromiseState.

```jsx
import { usePromise } from 'react-promise-manager'

const App = () => {
  const promiseState = usePromise(fetchMyData)

  if (promiseState.state === 'pending') return 'loading... ⏱'
  if (promiseState.state === 'rejected') {
    return `Oops, something went wrong 😞: ${promiseState.error}`
  }

  const { result } = promiseState
  return (
    <div>
      <h1>Here's my data! 🎉</h1>
      <pre>{JSON.stringify(promiseResult)}</pre>
    </div>
  )
}
```

## `ManagedPromise`

Pass a promise to `ManagedPromise` and with `Resolved`, `Rejected` and `Pending` you can choose what to render accordingly to the promise state.

```jsx
import { ManagedPromise, Pending, Rejected, Resolved } from 'react-promise-manager'

const App = () => (
  <ManagedPromise promise={fetchMyData}>
    <Pending>loading... ⏱</Pending>
    <Rejected>Oops, something went wrong 😞</Rejected>
    <Resolved>
      <MyComponent />
    </Resolved>
  </ManagedPromise>
)
```

### Accessing PromiseState via function

To access the result or the error returned by the promise, a function can be passed to `Resolved` and `Rejected` as child:

```jsx
const App = () => (
  <ManagedPromise promise={myPromise}>
    <Resolved>{result => <MyComponent result={result} />}</Resolved>
    <Rejected>{error => <MyErrorHandler error={error} />}</Rejected>
  </ManagedPromise>
)
```

The same thing can be done with `ManagedPromise` to access PromiseState:

```jsx
const App = () => (
  <ManagedPromise promise={myPromise}>
    {promiseState => ... }
  </ManagedPromise>
)
```

### Accessing PromiseState via hook

Alternatively, the result or error of the promise can be accessed with `usePromiseResult` and `usePromiseError`:

```jsx
const MyComponent = () => {
  const result = usePromiseResult()
  ...
}

const MyErrorHandler = () => {
  const result = usePromiseError()
  ...
}

const App = () => (
  <ManagedPromise promise={myPromise}>
    <Resolved>
      <MyComponent />
    </Resolved>
    <Rejected>
      <MyErrorHandler />
    </Rejected>
  </ManagedPromise>
)
```

Full PromiseState can be accesed with `usePromiseState`:

```jsx
const MyComponent = () => {
  const promiseState = usePromiseState()
  ...
}

const App = () => (
  <ManagedPromise promise={myPromise}>
    <MyComponent />
  </ManagedPromise>
)
```

- `usePromiseState` can be used only in a `ManagedPromise` child
- `usePromiseResult` can be used only in a `Resolved` child
- `usePromiseError` can be used only in a `Rejected` child
