import React, { useLayoutEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import {motion, AnimatePresence } from "framer-motion";

export default function ProductFormModal({ isOpen, onClose, children }) {
  const contentRef = useRef(null);
  const [contentHeight, setContentHeight] = useState('auto');

  useLayoutEffect(() => {
    if (isOpen && contentRef.current) {
      const updateHeight = () => {
        const newHeight = contentRef.current.scrollHeight;
        setContentHeight(newHeight > window.innerHeight * 0.9 
          ? '90vh' 
          : `${newHeight}px`);
      };

      const resizeObserver = new ResizeObserver(updateHeight);
      resizeObserver.observe(contentRef.current);
      
      updateHeight();
      
      return () => {
        resizeObserver.disconnect();
        setContentHeight('auto');
      };
    }
  }, [isOpen, children]);

  return ReactDOM.createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-[1000] p-2">
          {/* Fondo con blur ligero */}
          <motion.div
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(2px)' }}
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 bg-[#00000043] backdrop-blur-[2px] "
            onClick={onClose}
          />
          
          {/* Contenedor principal del modal */}
          <motion.div
            initial={{ scale: 0.98, opacity: 0, height: 0 }}
            animate={{ 
              scale: 1,
              opacity: 1,
              height: contentHeight
            }}
            exit={{ scale: 0.98, opacity: 0, height: 0 }}
            transition={{ 
              duration: 0.3,
              ease: "easeInOut"
            }}
            className="bg-[#edefee] rounded-lg min-w-[300px] max-w-[800px] w-auto relative"
            style={{
              overflow: 'hidden',
              willChange: 'transform, opacity, height'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Contenedor del contenido con scroll interno */}
            <div 
              ref={contentRef}
              className="p-4 overflow-y-auto"
              style={{
                maxHeight: '90vh',
                boxSizing: 'border-box'
              }}
            >
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}