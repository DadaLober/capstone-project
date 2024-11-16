import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Modal from './Modal';
import { Trash2, AlertTriangle, X } from 'lucide-react';

interface DeleteConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    propertyAddress: string;
}

export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    propertyAddress,
}) => {
    const [confirmationText, setConfirmationText] = useState('');

    const handleConfirm = () => {
        if (confirmationText === propertyAddress) {
            onConfirm();
            onClose();
        }
    };

    const handleClose = () => {
        onClose();
    };

    return (
        <>
            <Modal isOpen={isOpen} onClose={handleClose}>
                <div className="flex flex-col space-y-4">
                    <div className="flex items-center space-x-2 text-red-600">
                        <p className="text-lg font-semibold">Delete Property</p>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-start space-x-2">
                            <AlertTriangle className="h-5 w-5 text-yellow-500 mt-1" />
                            <div>
                                <p>This action cannot be undone. This will permanently delete the property at:</p>
                                <p className="font-medium">{propertyAddress}</p>
                                <p>Please type <span className="font-extrabold">{propertyAddress}</span> to confirm.</p>
                            </div>
                        </div>
                    </div>
                    <Input
                        value={confirmationText}
                        onChange={(e) => setConfirmationText(e.target.value)}
                        placeholder="Type the property address to confirm"
                        className="mt-4"
                    />
                    <div className="flex justify-end space-x-4 mt-6">
                        <Button variant="outline" onClick={onClose}>
                            <X className="h-4 w-4 mr-2" />
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleConfirm}
                            disabled={confirmationText !== propertyAddress}
                        >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Property
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    );
};
