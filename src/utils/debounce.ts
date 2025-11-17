/**
 * @author: sonion
 * @description: 防抖
 * @param {(...args: any[])=>void} fn
 * @param {number} delay - 毫秒
 * @return {(...args: any[])=>void}
 */
export const debounce = <A extends unknown[], R, T = unknown>(
  fn: (this: T, ...args: A) => R,
  delay: number
): ((this: T, ...args: A) => void) => {
  let timer: ReturnType<typeof setTimeout>

  return function (...args: A): void {
    timer && clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this as unknown as ThisParameterType<typeof fn>, args)
    }, delay)
  }
}
