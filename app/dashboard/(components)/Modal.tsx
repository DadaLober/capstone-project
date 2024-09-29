import { Button } from '@/components/ui/button';
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import '@/app/dashboard/(components)/modal.css';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
    const [isBrowser, setIsBrowser] = useState(false);

    useEffect(() => {
        setIsBrowser(true);
    }, []);

    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : 'unset';
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    if (!isBrowser) {
        return null;
    }

    const modalContent = (
        <div className={`modal ${isOpen ? 'is-open' : ''}`}>
            <div className="modal-content">
                <Button className="modal-close-button" onClick={onClose}>
                    Close
                </Button>
                {children}
            </div>
        </div>
    );

    return isOpen
        ? ReactDOM.createPortal(
            modalContent,
            document.getElementById('modal-root') as HTMLElement
        )
        : null;
};

export default Modal;
