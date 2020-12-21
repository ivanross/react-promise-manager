import 'react-app-polyfill/ie11'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {
  ManagePromise,
  Resolved,
  Pending,
  Rejected,
  usePromiseResult,
  usePromiseError,
  usePromiseState,
} from '../.'

const wait = async (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

const mockSuccessfulFetch = () => wait(3000).then(() => ({ data: [{ id: 1 }, { id: 2 }] }))
const mockFailingFetch = () => wait(2000).then(() => JSON.parse('[['))

const App = () => {
  const p = mockSuccessfulFetch()
  return (
    <div>
      <ManagePromise promise={p}>{state => <pre>{JSON.stringify(state)}</pre>}</ManagePromise>

      <ManagePromise promise={mockFailingFetch()}>
        <Pending>
          <pre> --- First pending --- </pre>
        </Pending>
        <Resolved>
          <pre> *** First resolved ***</pre>
        </Resolved>

        <Rejected>
          {error => {
            console.log('error from function component', error)
            return <pre> !!! First rejected !!!</pre>
          }}
        </Rejected>

        <Rejected>
          <FirstRejected />
        </Rejected>

        <PromiseLogger />
        {/* Nested handler */}
        <ManagePromise promise={mockSuccessfulFetch()}>
          <PromiseLogger />
          <Pending>
            <pre> --- Second pending --- </pre>
          </Pending>
          <Resolved<{ data: any[] }>>
            {({ data }) => <pre> *** Second resolved *** {JSON.stringify(data)}</pre>}
          </Resolved>
          <Resolved>
            <SecondResolved />
          </Resolved>
          <Rejected>
            <pre> !!! Second rejected !!!</pre>
          </Rejected>
        </ManagePromise>
      </ManagePromise>
    </div>
  )
}

const FirstRejected = () => {
  const result = usePromiseError()
  return <pre> !!! First rejected !!! with hook {JSON.stringify(result)}</pre>
}

const SecondResolved = () => {
  const result = usePromiseResult()
  return <pre> *** Second resolved *** with hook {JSON.stringify(result)}</pre>
}

const PromiseLogger = () => {
  return <pre>PROMISE LOGGER: {JSON.stringify(usePromiseState())}</pre>
}
ReactDOM.render(<App />, document.getElementById('root'))
