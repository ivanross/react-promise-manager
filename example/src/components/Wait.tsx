import * as React from 'react'
import { ManagedPromise, Resolved, Pending } from '../../../.'
import { wait } from '../utils'

export const Wait: React.FC<{ enter: number; exit: number }> = ({ enter, exit, children }) => (
  <ManagedPromise promise={() => wait(enter)}>
    <Resolved>
      <ManagedPromise promise={() => wait(exit)}>
        <Pending>{children}</Pending>
      </ManagedPromise>
    </Resolved>
  </ManagedPromise>
)
