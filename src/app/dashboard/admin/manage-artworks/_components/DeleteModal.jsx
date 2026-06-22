"use client";
import { AlertDialog, Button } from "@heroui/react";

export default function DeleteModal({ isOpen, onClose, onConfirm, artTitle, isDeleting }) {
  return (
    <AlertDialog isOpen={isOpen} onClose={onClose}>
      <AlertDialog.Backdrop>
        <AlertDialog.Container>
          <AlertDialog.Dialog className="bg-[#0f172a] border border-slate-800 p-6 rounded-xl max-w-md w-full">
            <AlertDialog.CloseTrigger className="text-slate-400 hover:text-white absolute right-4 top-4" />
            
            <AlertDialog.Header className="space-y-2">
              <AlertDialog.Heading className="text-xl font-bold text-white">
                Delete Artwork?
              </AlertDialog.Heading>
            </AlertDialog.Header>

            <AlertDialog.Body className="py-4">
              <p className="text-sm text-slate-400">
                Are you sure you want to delete <span className="text-rose-400 font-semibold">"{artTitle}"</span>? This action cannot be undone and will permanently remove it from ArtHub.
              </p>
            </AlertDialog.Body>

            <AlertDialog.Footer className="flex justify-end gap-3 mt-4">
              <Button 
                onClick={onClose} 
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium px-4 py-2 rounded-lg text-xs transition"
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button 
                onClick={onConfirm} 
                className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-4 py-2 rounded-lg text-xs transition flex items-center gap-2"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  "Delete Permanently"
                )}
              </Button>
            </AlertDialog.Footer>
          </AlertDialog.Dialog>
        </AlertDialog.Container>
      </AlertDialog.Backdrop>
    </AlertDialog>
  );
}