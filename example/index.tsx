import 'react-app-polyfill/ie11'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import 'tachyons'
import { Prism } from './src/components/Prism'
import { inRange, wait } from './src/utils'
import { Clock } from './src/components/Clock'
const PI = Math.PI // cache pi

const c = `
const App = () => (
  <ManagedPromise promise={() => wait(2000)}>
    <div>
      <Pending>waiting</Pending>

      <Resolved>
        done!
        <ManagedPromise promise={() => wait(1000)}>
          <Pending>Waiting child</Pending>
          <Resolved>Done child!</Resolved>
        </ManagedPromise>
      </Resolved>
    </div>
  </ManagedPromise>
)
`
  .trim()
  .split('\n')

const App = () => {
  const [lineRange, setLineRange] = React.useState<[number, number]>([0, c.length])
  React.useEffect(() => {
    async function animation() {
      await wait(2000)
      setLineRange([3, 3])
      await wait(2000)
      setLineRange([5, 11])
      await wait(2000)
      setLineRange([8, 8])
      await wait(2000)
      setLineRange([9, 9])
    }

    animation()
  }, [])
  const highlight = (line: number) => (inRange(line, lineRange) ? 1 : 0.33)
  return (
    <Prism>
      <div className="relative">
        <pre className="line-numbers">
          {c.map((lineCode, lineNumber) => (
            <code
              key={lineNumber}
              className="language-jsx transition-opacity"
              style={{ opacity: highlight(lineNumber) }}
            >
              {lineCode + '\n'}
            </code>
          ))}
        </pre>
        <div className="absolute" style={{ top: 40, left: 500 }}>
          <Clock delay={2000} duration={2000} radius={15} />
        </div>
        <div className="absolute" style={{ top: 180, left: 555 }}>
          <Clock delay={4000} duration={2000} radius={15} perc={0.675} fail />
        </div>
      </div>
    </Prism>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
