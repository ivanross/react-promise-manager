export const wait = async (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const inRange = (n: number, [min, max]: [number, number]) => n >= min && n <= max

export const getCssVar = (property: string) => {
  return getComputedStyle(document.documentElement).getPropertyValue(property)
}

export const getCssSec = (property: string) => {
  return parseFloat(getCssVar(property).slice(0, -1)) * 1000
}
