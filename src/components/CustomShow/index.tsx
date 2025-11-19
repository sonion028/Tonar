import { type FC, type ReactNode, type PropsWithChildren } from 'react';

export type CustomShowProps<T> = PropsWithChildren<{
  when: T | null | void | false;
  fallback?: ReactNode;
}>;

export interface CustomShowType<T> extends FC<CustomShowProps<T>> {
  (props: CustomShowProps<T>): ReactNode;
}

/**
 * @author: sonion
 * @description: 根据条件渲染内容，替代用三目运算和短路规则条件渲染
 * @param {*} when 条件
 * @param {*} fallback 不满足条件时的渲染内容
 * @param {*} children 满足条件时的渲染内容
 */
function CustomShow<T>({
  when,
  fallback = void 0,
  children,
}: CustomShowProps<T>): ReactNode {
  return <>{when ? children : fallback}</>;
}

export default CustomShow;
