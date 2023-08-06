'use client'

import React, { useEffect, useState } from 'react';

interface ModalProperties {
    isVisible: boolean,
    onClose: () => void,
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
      if (e.target.id === 'wrapper') {
        onClose();
      }
    };
  
    if (!show) return null;
    return (
      <div
        className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center z-50 transition-opacity duration-500"
        id="wrapper"
        onClick={handleClose}
        style={{ opacity: isVisible ? 1 : 0 }}
      >
        <div
          className={`${width} flex flex-col transition-transform duration-500`}
          style={{ transform: transitioning ? 'translateY(0)' : 'translateY(-100%)' }}
        >
          <button className="text-white text-xl place-self-end" onClick={() => onClose()}>
            X
          </button>
          <div className="bg-white p-2 rounded">{children}</div>
        </div>
      </div>
    );
  };
  
  export default Modal;
  


  
  
  
  
  
  