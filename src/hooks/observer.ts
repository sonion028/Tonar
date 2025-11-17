import { useCallback, useEffect, useMemo, useRef } from 'react';

import { useCreateSafeRef } from './index';

/**
 * @author: sonion
 * @description: dom变化观察器hook
 * @param {function} callback - 回调函数，参数为 MutationRecord[]
 */
export const useMutationObserver = (
  callback: (entry: MutationRecord[]) => void,
  once = false
) => {
  const observerRef = useRef<MutationObserver>(void 0);
  const callbackRef = useRef(callback);
  callbackRef.current !== callback && (callbackRef.current = callback); // 用useRef存回调，避免每次都创建新的观察对象

  useEffect(
    () => () => {
      observerRef.current?.disconnect?.(); // 上一次观察器取消，observe没有重新运行的话，观察就丢失了
      observerRef.current = void 0;
    },
    []
  );

  // MutationObserver 重新生成对象，observe 不会更新，用 observe 做依赖可能造成
  // MutationObserver 更新了，但没有重新观察。但理论上只有 StrictMode 模式下会重新生成对象
  // 且observe不是作为依赖，而是直接绑定dom或依赖其它重渲染会改变的状态就不会有问题。
  // 或用Set存下历史观察，重生成时恢复，但不能用WeakSet，非必要不建议
  /** 开始观察 因重新生成观察器observe不会更新，故不可以observe是否更新做依赖依据 */
  const observe = useCallback((el?: Node, options?: MutationObserverInit) => {
    observerRef.current ??= new MutationObserver(
      (mutations: MutationRecord[], observer: MutationObserver) => {
        callbackRef.current(mutations);
        once && observer.disconnect();
      }
    );
    el && observerRef.current?.observe?.(el, options);
  }, []);

  /** 获取所有未处理的观察记录 */
  const takeRecords = useCallback(
    (el?: Element | SVGElement) => el && observerRef.current?.takeRecords?.(),
    []
  );

  /** 取消所有观察，用observe重新启用 */
  const disconnect = useCallback(() => observerRef.current?.disconnect?.(), []);

  return {
    /** 开始观察 因重新生成观察器observe不会更新，故不可以observe是否更新做依赖依据 */
    observe,
    takeRecords,
    disconnect,
  };
};

/**
 * @description: 视口交叉观察器hook
 * @param {function} callback - 加载回调。
 * @param {number} [rootMargin] - 提前多少px触发
 * @param {number} [threshold] - 被观察目标与观察区交叉多少触发，0-1
 * @param {boolean} [once] - 是否只触发一次
 * @return {[React.RefObject<HTMLElement>, (element: HTMLElement) => void]} - 返回监听的视口元素的Ref引用；监听方法，传入元素就能监听
 */
export const useIntersectionObserver = ({
  callback,
  rootMargin = 100,
  threshold = 0,
  once = false,
}: {
  callback: (target: Element, root?: HTMLElement) => void;
  rootMargin?: number;
  threshold?: number;
  once?: boolean;
}) => {
  const observerRef = useRef<IntersectionObserver>(void 0);
  const [rootRef, setRootRef] = useCreateSafeRef();
  const callbackRef = useRef(callback);
  callbackRef.current !== callback && (callbackRef.current = callback); // 用useRef存回调，避免每次都创建新的观察对象
  const options = useMemo(
    () => ({
      root: rootRef, // 要观察的区域，视口为null
      rootMargin: `${rootMargin}px`, // 将观察区域向外扩张多少。扩张后就提前交叉了
      threshold, // 被观察目标与观察区交叉多少触发，0-1
    }),
    [rootRef, rootMargin, threshold]
  );

  const prevOptions = useRef(options); // 纪录上一次的options，用于比较是否变化

  useEffect(
    () => () => {
      observerRef.current?.disconnect?.();
      observerRef.current = void 0;
    },
    [options]
  );

  /** 开始观察 */
  const observe = useCallback(
    (el?: Element) => {
      // options变化，取消观察，重新生成观察器
      if (prevOptions.current !== options) {
        observerRef.current?.disconnect?.();
        observerRef.current = void 0;
        prevOptions.current = options; // 纪录新值
      }
      observerRef.current ??= new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            callbackRef.current?.(entry.target, rootRef);
            once && observer.unobserve?.(entry.target); // 取消观察, 因为只需要触发一次。反复触发可不取消
          }
        });
      }, options);
      el && observerRef.current?.observe?.(el);
    },
    [options]
  );

  /** 取消观察 */
  const unobserve = useCallback(
    (el?: HTMLElement) => el && observerRef.current?.unobserve?.(el),
    []
  );

  /** 取消所有观察，用observe重新启用 */
  const disconnect = useCallback(() => observerRef.current?.disconnect?.(), []);
  return { rootRef, setRootRef, observe, unobserve, disconnect };
};

/**
 * @author: sonion
 * @description: 元素尺寸变化观察器hook
 * @param {function} callback - 回调函数，参数为ResizeObserverEntry
 */
export const useResizeObserver = (
  callback: (entry: ResizeObserverEntry) => void,
  once = false
) => {
  const observerRef = useRef<ResizeObserver>(void 0);
  const callbackRef = useRef(callback);
  callbackRef.current !== callback && (callbackRef.current = callback); // 用useRef存回调，避免每次都创建新的观察对象

  useEffect(
    () => () => {
      observerRef.current?.disconnect?.(); // 上一次观察器取消，observe没有重新运行的话，观察就丢失了
      observerRef.current = void 0;
    },
    []
  );

  // ResizeObserver 重新生成对象，observe 不会更新，用 observe 做依赖可能造成
  // ResizeObserver 更新了，但没有重新观察。但理论上只有 StrictMode 模式下会重新生成对象
  // 且observe不是作为依赖，而是直接绑定dom或依赖其它重渲染会改变的状态就不会有问题。
  // 或用Set存下历史观察，重生成时恢复，但不能用WeakSet，非必要不建议
  /** 开始观察 因重新生成观察器observe不会更新，故不可以observe是否更新做依赖依据 */
  const observe = useCallback(
    (el?: Element | SVGElement, options?: ResizeObserverOptions) => {
      observerRef.current ??= new ResizeObserver(
        (entries: ResizeObserverEntry[], observer: ResizeObserver) => {
          entries.forEach((entry) => {
            callbackRef.current?.(entry);
          });
          once && observer.disconnect();
        }
      );
      el && observerRef.current?.observe?.(el, options);
    },
    []
  );

  /** 取消观察 */
  const unobserve = useCallback(
    (el?: Element | SVGElement) => el && observerRef.current?.unobserve?.(el),
    []
  );

  /** 取消所有观察，用observe重新启用 */
  const disconnect = useCallback(() => observerRef.current?.disconnect?.(), []);

  return {
    /** 开始观察 因重新生成观察器observe不会更新，故不可以observe是否更新做依赖依据 */
    observe,
    unobserve,
    disconnect,
  };
};
