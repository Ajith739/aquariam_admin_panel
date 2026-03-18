import { useEffect, useRef } from 'react';

export default function Modal({ isOpen, onClose, title, children, footer }) {
  const contentRef = useRef(null);

  // Pure CSS animation — no GSAP, no inline opacity manipulation
  useEffect(() => {
    if (isOpen && contentRef.current) {
      contentRef.current.style.animation = 'none';
      void contentRef.current.offsetHeight; // reflow
      contentRef.current.style.animation = '';
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content modal-animate" ref={contentRef}>
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
}
