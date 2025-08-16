import { useState, useEffect, useRef } from "react";

export default function Modal({ open, onClose, height = 369, children }) {
  const TARGET_HEIGHT = height;
  const [animated, setAnimated] = useState(false); 

  // 오버레이, 모달 위치 상태
  const [overlayVisible, setOverlayVisible] = useState(false); 
  const [panelH, setPanelH] = useState(0);

  // 드래그
  const [isDragging, setIsDragging] = useState(false);
  const startYRef = useRef(0);
  const panelHRef = useRef(0);
  const isDraggingRef = useRef(false);

  // 종료(드래그 너무 빨리 할 시 대비)
  const [isClosing, setIsClosing] = useState(false);
  const closeTimerRef = useRef(null);
  const closingBySelfRef = useRef(false);

  useEffect(() => { panelHRef.current = panelH; }, [panelH]);
  useEffect(() => { isDraggingRef.current = isDragging; }, [isDragging]);

  // 모달 활성화 시 
  useEffect(() => {
    if (open) {
      setOverlayVisible(true);
      setIsClosing(false);
      setAnimated(false);      
      setPanelH(0);
      requestAnimationFrame(() => {
        setAnimated(true);
        requestAnimationFrame(() => setPanelH(TARGET_HEIGHT));
      });
    } else if (overlayVisible) {
      closingBySelfRef.current = false;
      setIsClosing(true);
      setIsDragging(false);
      setAnimated(true);      
      setPanelH(0);
    }
  }, [open, TARGET_HEIGHT]);

  useEffect(() => {
    if (!overlayVisible) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = original; };
  }, [overlayVisible]);

  const finalizeClose = () => {
    setOverlayVisible(false);
    setIsClosing(false);
    setAnimated(false);
    if (closingBySelfRef.current && onClose) onClose();
    closingBySelfRef.current = false;
  };

  const scheduleFinalizeClose = (ms = 240) => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(finalizeClose, ms);
  };

  useEffect(() => () => { if (closeTimerRef.current) clearTimeout(closeTimerRef.current); }, []);

  const requestClose = () => {
    closingBySelfRef.current = true;
    setIsDragging(false);
    setIsClosing(true);
    setPanelH(0);
    scheduleFinalizeClose(); 
  };

  const handleTransitionEnd = () => {
    if (panelH === 0 && isClosing) {
      finalizeClose();
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    }
  };

  const handlePointerDown = (e) => {
    e.preventDefault();
    if (e.currentTarget && e.currentTarget.setPointerCapture && e.pointerId != null) {
      e.currentTarget.setPointerCapture(e.pointerId); 
    }
    setIsDragging(true);
    isDraggingRef.current = true;
    startYRef.current = e.touches ? e.touches[0].clientY : (e.clientY ?? 0);

    const onMove = (ev) => {
      if (!isDraggingRef.current) return;
      ev.preventDefault();
      const y = ev.touches ? ev.touches[0].clientY : (ev.clientY ?? 0);
      const dy = y - startYRef.current;
      if (dy <= 0) { setPanelH(TARGET_HEIGHT); return; }
      const nextH = Math.max(0, Math.min(TARGET_HEIGHT, TARGET_HEIGHT - (Number.isFinite(dy) ? dy : 0)));
      setPanelH(nextH);
    };

    const onEnd = () => {
      setIsDragging(false);
      isDraggingRef.current = false;
      if (e.currentTarget && e.currentTarget.releasePointerCapture && e.pointerId != null) { e.currentTarget.releasePointerCapture(e.pointerId); }
      const pulled = TARGET_HEIGHT - panelHRef.current;
      if (pulled > 120) {
        requestClose();
      } else {
        setPanelH(TARGET_HEIGHT);
      }
      window.removeEventListener('pointermove', onMove, { capture: true });
      window.removeEventListener('pointerup', onEnd, { capture: true });
      window.removeEventListener('pointercancel', onEnd, { capture: true });
      window.removeEventListener('touchmove', onMove, { capture: true });
      window.removeEventListener('touchend', onEnd, { capture: true });
      window.removeEventListener('touchcancel', onEnd, { capture: true });
    };

    window.addEventListener('pointermove', onMove, { passive: false, capture: true });
    window.addEventListener('pointerup', onEnd, { passive: false, capture: true });
    window.addEventListener('pointercancel', onEnd, { passive: false, capture: true });
    window.addEventListener('touchmove', onMove, { passive: false, capture: true });
    window.addEventListener('touchend', onEnd, { passive: false, capture: true });
    window.addEventListener('touchcancel', onEnd, { passive: false, capture: true });
  };

  if (!overlayVisible) return null;

  return (
    <div
      className={`absolute inset-0 z-50 ${open || isClosing ? 'bg-bg-modal' : 'bg-black/0'} transition-colors duration-500 ${isClosing && panelH === 0 ? 'pointer-events-none' : ''}`}
      onClick={requestClose}
    >
      <div className="absolute left-0 right-0 bottom-0 w-full" onClick={(e) => e.stopPropagation()}>
        <div
          className={`w-full rounded-t-[24px] bg-white overflow-hidden`}
          style={{ height: panelH, transition: (!isDragging && animated) ? 'height 300ms ease-out' : 'none' }}
          onTransitionEnd={handleTransitionEnd}
        >
          <div className="w-full h-10 flex justify-center items-center cursor-grab active:cursor-grabbing"
          onPointerDown={handlePointerDown}>
            <div
              className="w-[105px] h-1 bg-gray-40 rounded-[4px]"
            />
          </div>
          <div className="overflow-auto" style={{ maxHeight: TARGET_HEIGHT - 40 }}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}