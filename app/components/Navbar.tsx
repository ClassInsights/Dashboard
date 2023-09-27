'use client';

import Image from 'next/image';
import { ThemeMode, useTheme } from '../contexts/ThemeContext';
import { useCallback } from 'react';

const Navbar = () => {
  const theme = useTheme();
  const switchTheme = useCallback(
    () => theme.setTheme(theme.themeMode == ThemeMode.Dark ? ThemeMode.Light : ThemeMode.Dark),
    [theme]
  );
  return (
    <nav className='w-full flex justify-between items-center py-4 bg-background dark:bg-dark-background'>
      <div className='flex items-center'>
        <Image
          src='/logo.svg'
          alt='ClassInsights Logo'
          width={25}
          height={25}
          className='w-8 h-8'
        />
        <h3 className='text-xl ml-4 text-onBackground dark:text-dark-onBackground select-none'>
          ClassInsights
        </h3>
      </div>
      <div className='flex items-center'>
        <div className='hidden sm:flex items-center mr-4'>
          <p className='text-onBackground dark:text-dark-onBackground select-none'>
            Jakob Wassertheurer
          </p>
        </div>
        <div onClick={switchTheme}>
          <Image
            src='/brightness.svg'
            alt='Brightness Switch'
            width={25}
            height={25}
            className={`transition-transform cursor-pointer
            ${
              theme.themeMode == ThemeMode.Dark
                ? 'rotate-180 onBackground-dark'
                : 'onBackground-light'
            }`}
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
