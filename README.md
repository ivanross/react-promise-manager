# React Promise Manager

Yet another Promise utility library for React.

<!-- TOC depthFrom:2 -->

- [Getting Started](#getting-started)
- [`usePromise`](#usepromise)
- [`ManagePromise`](#managepromise)
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

## `ManagePromise`

Pass a promise to `ManagePromise` and with `Resolved`, `Rejected` and `Pending` you can choose what to render accordingly to the promise state.

```jsx
import { ManagePromise, Pending, Rejected, Resolved } from 'react-promise-manager'

const App = () => (
  <ManagePromise promise={fetchMyData}>
    <Pending>loading... ⏱</Pending>
    <Rejected>Oops, something went wrong 😞</Rejected>
    <Resolved>
      <MyComponent />
    </Resolved>
  </ManagePromise>
)
```

### Accessing PromiseState via function

To access the result or the error returned by the promise, a function can be passed to `Resolved` and `Rejected` as child:

```jsx
const App = () => (
  <ManagePromise promise={myPromise}>
    <Resolved>{result => <MyComponent result={result} />}</Resolved>
    <Rejected>{error => <MyErrorHandler error={error} />}</Rejected>
  </ManagePromise>
)
```

The same thing can be done with `ManagePromise` to access PromiseState:

```jsx
const App = () => (
  <ManagePromise promise={myPromise}>
    {promiseState => ... }
  </ManagePromise>
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
  <ManagePromise promise={myPromise}>
    <Resolved>
      <MyComponent />
    </Resolved>
    <Rejected>
      <MyErrorHandler />
    </Rejected>
  </ManagePromise>
)
```

Full PromiseState can be accesed with `usePromiseState`:

```jsx
const MyComponent = () => {
  const promiseState = usePromiseState()
  ...
}

const App = () => (
  <ManagePromise promise={myPromise}>
    <MyComponent />
  </ManagePromise>
)
```

- `usePromiseState` can be used only in a `ManagePromise` child
- `usePromiseResult` can be used only in a `Resolved` child
- `usePromiseError` can be used only in a `Rejected` child
