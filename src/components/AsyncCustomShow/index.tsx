import { type FC, type ReactNode, useEffect, useState } from 'react';

export type AsyncCustomShowProps<T> = {
  when: Promise<T> | void | null | false;
  fallback?: ReactNode;
  children: (value: T | void | null | false) => ReactNode;
};

export interface AsyncCustomShowType<T> extends FC<AsyncCustomShowProps<T>> {
  (props: AsyncCustomShowProps<T>): JSX.Element;
}

/**
 * @author: sonion
 * @description: 异步展示组件
 * @param {*} when 异步 Promise
 * @param {*} fallback 异步失败时的展示
 * @param {*} children 异步成功时的展示
 * @return {*} - 替代异步条件渲染
 */
function AsyncCustomShow<T>({
  when,
  fallback,
  children,
}: AsyncCustomShowProps<T>) {
  const [show, setShow] = useState<Awaited<typeof when>>(void 0);
  useEffect(() => {
    if (!when) return;
    Promise.resolve(when).then(setShow);
  }, [when]);
  return <>{show ? children(show) : fallback}</>;
}

export default AsyncCustomShow;
