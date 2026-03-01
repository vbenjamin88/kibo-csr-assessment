import { useRef, useEffect, useCallback } from 'react';

/**
 * Enables drag-to-scroll (like mobile touch swipe) on desktop.
 * Click and drag to scroll the container - same feel as mobile.
 */
export function useDragToScroll<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const isDragging = useRef(false);
  const startY = useRef(0);
  const startScrollTop = useRef(0);

  const handleMouseDown = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('a, button, input, textarea, [role="button"]')) return;
    const el = ref.current;
    if (!el) return;
    isDragging.current = true;
    startY.current = e.clientY;
    startScrollTop.current = el.scrollTop;
    el.style.cursor = 'grabbing';
    el.style.userSelect = 'none';
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging.current) return;
    const el = ref.current;
    if (!el) return;
    e.preventDefault();
    const dy = startY.current - e.clientY;
    el.scrollTop = startScrollTop.current + dy;
    startY.current = e.clientY;
    startScrollTop.current = el.scrollTop;
  }, []);

  const handleMouseUp = useCallback(() => {
    const el = ref.current;
    if (el) {
      el.style.cursor = 'grab';
      el.style.userSelect = '';
    }
    isDragging.current = false;
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    el.style.cursor = 'grab';
    return () => {
      el.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseDown, handleMouseMove, handleMouseUp]);

  return ref;
}
