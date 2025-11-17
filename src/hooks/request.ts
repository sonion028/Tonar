import { useState, useRef, useCallback } from 'react';

/**
 * @author: sonion
 * @description: 异步操作锁，防止重复调用。通过返回的 Promise 确定是否执行中，执行中不可重复触发。
 * @param {function} asyncAction - 异步方法，需返回Promise
 */
export const useAsyncActionLock = <T extends unknown[], R>(
  asyncAction: (...args: T) => Promise<R>,
  msg?: string
) => {
  const [isLoading, setIsLoading] = useState(false); // 对外可能需要触发渲染
  const syncLoading = useRef(isLoading); // 对内，同步更改，返回的函数不更改
  const setLoading = useCallback(
    (val: boolean) => {
      syncLoading.current = val;
      setIsLoading(val);
    },
    [syncLoading, setIsLoading]
  );

  const handler = useCallback<(...args: T) => Promise<R> | Promise<void>>(
    (...args: T) => {
      if (syncLoading.current) {
        console.warn(msg || '正在提交中，请稍后再试');
        return Promise.resolve(void 0);
      }
      setLoading(true);
      return new Promise<R>((resolve, reject) => {
        try {
          resolve(asyncAction?.(...args));
        } catch (err) {
          reject(err);
        }
      }).finally(() => {
        setLoading(false);
      });
    },
    [asyncAction, msg, setLoading]
  );

  return [isLoading, handler] as const;
};
