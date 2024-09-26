import { Button } from "@/components/ui/button";

function SubmitButton({ isSubmitting }: { isSubmitting: boolean }) {
    return (
        <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit'}
        </Button>
    );
}

function CloseButton({ handleClose }: { handleClose: () => void }) {
    return (
        <Button className="modal-close-button flex-shrink-0" aria-label="close" onClick={handleClose}>
            Close
        </Button>
    );
}

export { SubmitButton, CloseButton };