'use client';

import { ThemeMode, useTheme } from '@/app/contexts/ThemeContext';
import Image from 'next/image';
import { useCallback, useEffect } from 'react';

interface ModalProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ children, isOpen, onClose }) => {
  const theme = useTheme();
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
    <div className='fixed inset-0 shadow-lg z-50 flex justify-center md:items-center items-end'>
      <div
        className='absolute h-full w-full bg-onBackground dark:bg-dark-background opacity-70'
        onClick={onClose}
      />
      <div className='relative h-[90%] md:h-3/4 w-full md:w-3/4 overflow-hidden lg:w-4/6 xl:w-7/12 2xl:w-1/2 bg-secondary dark:bg-dark-secondary md:rounded-2xl rounded-t-2xl'>
        <div className='px-5 border-b-1 border-tertiary dark:border-dark-tertiary'>
          <div className='w-full h-10 flex justify-between items-center'>
            <span />
            <p className='text-onBackground dark:text-dark-onBackground select-none'>
              Gruppen verknüpfen
            </p>
            <Image
              src='/close.svg'
              alt='Close Settings'
              height={25}
              width={25}
              className={`cursor-pointer
              ${theme.themeMode == ThemeMode.Dark ? 'onBackground-dark' : 'onBackground-light'}`}
              onClick={onClose}
              draggable={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
