'use client';

import { useCallback, useEffect } from 'react';

interface ModalProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ children, isOpen, onClose }) => {
  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => (event.key === 'Escape' ? onClose() : null),
    [onClose]
  );

  useEffect(() => {
    if (isOpen) document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isOpen, handleKeyPress]);

  if (!isOpen) return null;
  return (
    <div className='fixed inset-0 shadow-lg'>
      <div
        className='absolute h-full w-full bg-onBackground dark:bg-dark-background opacity-70'
        onClick={onClose}
      />
      <div className='h-full md:h-3/5 absolute w-full md:w-3/4 lg:w-4/6 xl:w-6/12 2xl:w-2/5 bg-secondary dark:bg-dark-secondary'>
        {children}
      </div>
    </div>
  );
};

export default Modal;
