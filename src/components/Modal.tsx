"use client";

import React, { useEffect, useState } from "react";

interface ModalProperties {
  isVisible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  width: string;
}

const Modal = ({ isVisible, onClose, children, width }: ModalProperties) => {
  const [show, setShow] = useState(false);
  const [transitioning, setTransitioning] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShow(true);
      setTimeout(() => setTransitioning(true), 10); // Petite pause pour permettre le rendu initial
    } else {
      setTransitioning(false);
      setTimeout(() => setShow(false), 500); // Durée de la transition
    }
  }, [isVisible]);

  const handleClose = (e: any) => {
    if (e.target.id === "wrapper") {
      onClose();
    }
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            onClose()
        }
    };

    if (isVisible) {
        window.addEventListener('keydown', handleEscape);
    } else {
        window.removeEventListener('keydown', handleEscape);
    }

    return () => {
        window.removeEventListener('keydown', handleEscape);
    };
  }, [isVisible, onClose])

  if (!show) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-25 bg-white backdrop-blur-sm transition-opacity duration-500 ease-in-out"
      id="wrapper"
      onClick={handleClose}
      style={{ opacity: isVisible ? 1 : 0 }}
    >
      <div
        className={`${width} flex flex-col transition-transform duration-500`}
        style={{
          transform: transitioning ? "translateY(0)" : "translateY(-100%)",
        }}
      >
        <button
          className="place-self-end text-xl text-white"
          onClick={() => onClose()}
        >
          X
        </button>
        <div className="rounded bg-white p-2">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
