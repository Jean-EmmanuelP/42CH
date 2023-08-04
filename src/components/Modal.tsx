import React from 'react';

interface ModalProperties {
    isVisible: boolean,
    onClose: () => void,
    children: React.ReactNode;
    width: string;
}

const Modal = ({isVisible, onClose, children, width} : ModalProperties) => {
    if (!isVisible) return null;
    
    const handleClose = (e:any) => {
        if (e.target.id === 'wrapper' ) onClose();
    }
    console.log(`my width is`, width);
    return (
        <div className='fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center z-50' id="wrapper" onClick={handleClose}>
            <div className={`${width} flex flex-col`}>
                <button className='text-white text-xl place-self-end' onClick={() => onClose()}>X</button>
                <div className='bg-white p-2 rounded'>{children}</div>
            </div>
        </div>
    ) 
}

export default Modal;