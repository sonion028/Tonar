# Tonar

Tonar: A frontend library with utils, hooks, and React components.

# Installation

```bash
npm install tonar
pnpm add tonar
yarn add tonar
```

# Usage

### All（utils、hooks、components）所有

```jsx
import { useDistinctState } from 'tonar';
```

### Components（轮播、自定义展示、异步自定义展示、错误边界）组件

```jsx
import {
  Carousel,
  CustomShow,
  AsyncCustomShow,
  ErrorBoundary,
} from 'tonar/components';
```

### Hooks（安全引用、差异才更新的状态、静态属性、异步操作锁、定时器、RAf定时器、保持稳定的最新回调、交叉观察器、突变观察器、调整观察器、本地存储）

```jsx
import {
  useCreateSafeRef,
  useDistinctState,
  useStaticState,
  useAsyncActionLock,
  useInterval,
  useRAfInterval,
  useLatestCallback,
  useIntersectionObserver,
  useMutationObserver,
  useResizeObserver,
  useStorage,
} from 'tonar/hooks';
```

### Utils（防抖、深拷贝、字符串转哈希值、浏览器原生下载、Blob下载、获取react子节点中符合多个指定类型的节点数组、获取react子节点中单个指定类型的节点、RAf定时器、清除RAf定时器）

```jsx
import {
  debounce,
  deepClone,
  stringToHash,
  browserNativeDownload,
  blobDownload,
  extractChildrenListByType,
  extractChildrenByType,
  rAfInterval,
  clearRAfInterval,
} from 'tonar/utils';
```
