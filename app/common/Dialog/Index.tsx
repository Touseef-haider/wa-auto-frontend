"use client";

import React, { ReactNode } from "react";
import Button from "../Button/Index";
import { HiX } from "react-icons/hi";

interface DialogProps {
  isOpen: boolean;
  title?: string;
  children: ReactNode;
  onClose: () => void;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
  disabled?:boolean
}

const Dialog: React.FC<DialogProps> = ({
  isOpen,
  title,
  children,
  onClose,
  onConfirm,
  confirmText = "Confirm",
  cancelText = "Cancel",
  disabled
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={onClose} // optional: close when clicking outside
      ></div>

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-lg w-11/12 md:w-1/3 p-6 z-10 transition-transform transform scale-100">
        <div role="button" onClick={onClose} className="absolute cursor-pointer top-2 right-4">
          <HiX size={24} />
        </div>
        {/* Header */}
        {title && (
          <h2 className="text-lg font-bold mb-4">{title}</h2>
        )}

        {/* Body */}
        <div className="mb-6">{children}</div>

        {/* Actions */}
        <div className="flex justify-end space-x-3">
          {/* <Button
            onClick={onClose}
            className="px-4 py-2 bg-orange-600"
            title={cancelText}
            type="button"
          /> */}
          {onConfirm && (
            <Button
              type="button"
              disabled={disabled}
              title={confirmText}
              onClick={onConfirm}
              className="px-6 py-2"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dialog;
