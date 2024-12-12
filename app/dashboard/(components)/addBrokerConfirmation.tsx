import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Modal from './Modal';
import { UserPlus, AlertTriangle, X } from 'lucide-react';

interface AddBrokerConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    userEmail: string;
}

export const AddBrokerConfirmationModal: React.FC<AddBrokerConfirmationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    userEmail,
}) => {
    const [confirmationText, setConfirmationText] = useState('');

    const handleConfirm = () => {
        if (confirmationText === userEmail) {
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
                    <div className="flex items-center space-x-2 text-blue-600">
                        <p className="text-lg font-semibold">Add as Broker</p>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-start space-x-2">
                            <AlertTriangle className="h-5 w-5 text-yellow-500 mt-1" />
                            <div className='flex flex-col space-y-4'>
                                <p>This action will grant broker privileges to this user. Please ensure this is the correct action.</p>
                                <p>Please type <span className="font-extrabold">{userEmail}</span> to confirm.</p>
                            </div>
                        </div>
                    </div>
                    <Input
                        value={confirmationText}
                        onChange={(e) => setConfirmationText(e.target.value)}
                        placeholder="Type the user's email to confirm"
                        className="mt-4"
                    />
                    <div className="flex justify-end space-x-4 mt-6">
                        <Button variant="outline" onClick={onClose}>
                            <X className="h-4 w-4 mr-2" />
                            Cancel
                        </Button>
                        <Button
                            variant="default"
                            onClick={handleConfirm}
                            disabled={confirmationText !== userEmail}
                        >
                            <UserPlus className="h-4 w-4 mr-2" />
                            Add as Broker
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    );
};