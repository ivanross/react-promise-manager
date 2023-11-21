// https://prismjs.com/download.html#themes=prism-okaidia&languages=markup+css+clike+javascript+jsx&plugins=line-numbers
import * as React from 'react'
import PrismJS from '../prism/prism.js'
import '../prism/prism.css'

export const Prism: React.FC = ({ children }) => {
  React.useEffect(PrismJS.highlightAll, [])
  return <>{children}</>
}
