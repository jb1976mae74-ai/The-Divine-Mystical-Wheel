import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
  ReactNode,
  UIEvent
} from 'react';

export interface VirtualizedListProps<T> {
  items: T[];
  estimateItemHeight?: number;
  overscan?: number;
  renderItem: (item: T, index: number) => ReactNode;
  keyExtractor: (item: T, index: number) => string | number;
  className?: string;
  contentClassName?: string;
  maxHeight?: number | string;
  minHeight?: number | string;
  height?: number | string;
  emptyComponent?: ReactNode;
  headerComponent?: ReactNode;
  footerComponent?: ReactNode;
  gap?: number;
  onScroll?: (e: UIEvent<HTMLDivElement>) => void;
  autoScrollToBottom?: boolean;
}

/**
 * High-performance virtualized list component for rendering large datasets
 * with dynamic height measurement, overscan buffering, and zero dependencies.
 * Dramatically reduces DOM node count from thousands to just visible items.
 */
export function VirtualizedList<T>({
  items,
  estimateItemHeight = 120,
  overscan = 4,
  renderItem,
  keyExtractor,
  className = '',
  contentClassName = '',
  maxHeight,
  minHeight,
  height = '100%',
  emptyComponent,
  headerComponent,
  footerComponent,
  gap = 12,
  onScroll: externalOnScroll
}: VirtualizedListProps<T>) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(600);
  const measuredHeights = useRef<Map<number, number>>(new Map());
  const [, forceUpdate] = useState({});

  // Update container height on resize
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateHeight = () => {
      if (el.clientHeight > 0) {
        setContainerHeight(el.clientHeight);
      }
    };

    updateHeight();

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.height > 0) {
          setContainerHeight(entry.contentRect.height);
        }
      }
    });

    resizeObserver.observe(el);
    return () => resizeObserver.disconnect();
  }, []);

  // Compute item positions and total list height
  const { itemPositions, totalHeight } = useMemo(() => {
    const positions: { top: number; height: number }[] = [];
    let currentTop = 0;

    for (let i = 0; i < items.length; i++) {
      const h = measuredHeights.current.get(i) ?? estimateItemHeight;
      positions.push({ top: currentTop, height: h });
      currentTop += h + gap;
    }

    const total = positions.length > 0
      ? positions[positions.length - 1].top + positions[positions.length - 1].height
      : 0;

    return { itemPositions: positions, totalHeight: total };
  }, [items.length, estimateItemHeight, gap, forceUpdate]);

  // Compute visible range with overscan
  const { startIndex, endIndex } = useMemo(() => {
    if (items.length === 0) return { startIndex: 0, endIndex: 0 };

    const startBoundary = Math.max(0, scrollTop);
    const endBoundary = scrollTop + containerHeight;

    let start = 0;
    let end = items.length - 1;

    // Binary search or linear scan for start index
    for (let i = 0; i < itemPositions.length; i++) {
      const pos = itemPositions[i];
      if (pos.top + pos.height >= startBoundary) {
        start = Math.max(0, i - overscan);
        break;
      }
    }

    // Find end index
    for (let i = start; i < itemPositions.length; i++) {
      const pos = itemPositions[i];
      if (pos.top > endBoundary) {
        end = Math.min(items.length - 1, i + overscan);
        break;
      }
    }

    return {
      startIndex: start,
      endIndex: Math.min(items.length - 1, end + overscan)
    };
  }, [scrollTop, containerHeight, itemPositions, items.length, overscan]);

  // Scroll handler with RAF for ultra-fluid 60fps rendering
  const isScrollingRef = useRef(false);
  const handleScroll = useCallback(
    (e: UIEvent<HTMLDivElement>) => {
      const target = e.currentTarget;
      if (!isScrollingRef.current) {
        isScrollingRef.current = true;
        requestAnimationFrame(() => {
          setScrollTop(target.scrollTop);
          isScrollingRef.current = false;
        });
      }
      if (externalOnScroll) {
        externalOnScroll(e);
      }
    },
    [externalOnScroll]
  );

  // ResizeObserver for measuring individual rendered items
  const itemResizeObserver = useRef<ResizeObserver | null>(null);

  useEffect(() => {
    itemResizeObserver.current = new ResizeObserver((entries) => {
      let needsRerender = false;
      for (const entry of entries) {
        const indexStr = (entry.target as HTMLElement).dataset.index;
        if (indexStr !== undefined) {
          const index = parseInt(indexStr, 10);
          const measuredH = Math.round(entry.borderBoxSize?.[0]?.blockSize ?? entry.contentRect.height);
          const prevH = measuredHeights.current.get(index);
          if (measuredH > 0 && (!prevH || Math.abs(measuredH - prevH) > 2)) {
            measuredHeights.current.set(index, measuredH);
            needsRerender = true;
          }
        }
      }
      if (needsRerender) {
        forceUpdate({});
      }
    });

    return () => {
      itemResizeObserver.current?.disconnect();
    };
  }, []);

  const setItemRef = useCallback((element: HTMLDivElement | null, index: number) => {
    if (element && itemResizeObserver.current) {
      element.dataset.index = index.toString();
      itemResizeObserver.current.observe(element);
    }
  }, []);

  if (items.length === 0) {
    return (
      <div className={className} style={{ height, maxHeight, minHeight }}>
        {emptyComponent || (
          <div className="p-8 text-center text-slate-500 font-serif text-xs">
            No items in archive.
          </div>
        )}
      </div>
    );
  }

  // Render items within visible range
  const visibleItems = [];
  for (let i = startIndex; i <= endIndex && i < items.length; i++) {
    const item = items[i];
    const key = keyExtractor(item, i);
    const pos = itemPositions[i] || { top: i * (estimateItemHeight + gap), height: estimateItemHeight };

    visibleItems.push(
      <div
        key={key}
        ref={(el) => setItemRef(el, i)}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          transform: `translateY(${pos.top}px)`,
          willChange: 'transform'
        }}
      >
        {renderItem(item, i)}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className={`overflow-y-auto relative custom-scrollbar ${className}`}
      style={{
        height,
        maxHeight,
        minHeight,
        contain: 'paint layout'
      }}
    >
      {headerComponent}
      <div
        className={`relative w-full ${contentClassName}`}
        style={{
          height: `${totalHeight}px`,
          minHeight: '100%'
        }}
      >
        {visibleItems}
      </div>
      {footerComponent}
    </div>
  );
}

export default VirtualizedList;
