import * as React from 'react'
import { ANIMATION } from '../constants'
import { Wait } from './Wait'
import gsap from 'gsap'

const PI = Math.PI

const aOff = PI / 2
const getPath = (r: number, a: number) => {
  const x = Math.cos(a) * r
  const y = Math.sin(a) * r
  const largeArc = (a % (PI * 2)) + aOff <= PI ? 0 : 1
  const sweep = a + aOff >= 2 * PI ? 0 : 1

  return `
  M 0 ${-r} 
  A ${r} ${r} 0 ${largeArc} ${sweep} ${x} ${y}
  L 0 0`
}

interface Props {
  duration: number
  radius: number
  perc?: number
  fail?: boolean
}

export const Clock: React.FC<Props & { delay: number }> = ({ delay, ...props }) => (
  <Wait enter={delay} exit={props.duration + ANIMATION}>
    <ClockSVG {...props} />
  </Wait>
)

const ClockSVG: React.FC<Props> = ({ duration, radius, perc = 1, fail = false }) => {
  const pathRef = React.useRef<SVGPathElement>(null)
  const animation = React.useRef({ angle: 0 }).current
  const [stopped, setStopped] = React.useState(false)

  React.useEffect(() => {
    gsap.to(animation, {
      angle: Math.PI * 2 * perc,
      duration: duration / 1000,
      ease: 'linear',
      onUpdate: () => {
        const p = pathRef.current
        if (!p) return
        p.setAttribute('d', getPath(radius, animation.angle - Math.PI / 2))
      },
      onComplete: () => setStopped(true),
    })
  }, [])

  return (
    <svg
      className="overflow-visible fade-in transition shadow-2 br-pill"
      width={radius * 2}
      height={radius * 2}
      viewBox={`0 0 ${radius * 2} ${radius * 2}`}
      style={{ transform: !stopped ? '' : 'scale(1.5)', opacity: !stopped ? 1 : 0 }}
    >
      <g transform={`translate(${radius} ${radius})`}>
        <circle r={radius} fill="#aaa" />
        <path
          ref={pathRef}
          d={getPath(radius, animation.angle - Math.PI / 2)}
          fill={stopped && fail ? '#f00' : '#eee'}
        />
        <circle r={radius} fill="none" stroke={stopped && fail ? '#700' : '#999'} strokeWidth="2" />
      </g>
    </svg>
  )
}
