'use client';

import Image from 'next/image';
import Menu from './Menu';
import { useCallback, useState } from 'react';

const Navbar = () => {
  const [showMenu, setShowMenu] = useState<boolean>(false);

  const handleHover = useCallback(() => setShowMenu(true), []);

  const handleLeave = useCallback(async () => {
    // await new Promise((resolve) => setTimeout(resolve, 300));
    setShowMenu(false);
  }, []);

  return (
    <nav className='w-full flex justify-between items-center py-3 bg-background dark:bg-dark-background'>
      <div className='flex items-center'>
        <Image src='/logo.svg' alt='ClassInsights Logo' width={40} height={40} />
        <h3 className='text-xl ml-4 text-onBackground dark:text-dark-onBackground'>
          ClassInsights
        </h3>
      </div>
      <div className='flex items-center'>
        <div className='hidden sm:flex items-center mr-4'>
          <p className='text-onBackground dark:text-dark-onBackground'>Jakob Wassertheurer</p>
        </div>
        <div onMouseEnter={handleHover} onMouseLeave={handleLeave} className='group'>
          <div className='rounded-full overflow-x-clip overflow-y-hidden h-12 w-12 flex items-center justify-center'>
            <Image src='/avatar.jpg' alt='Avatar' width={50} height={50} />
          </div>
          {showMenu && (
            <div className='transition-opacity'>
              <Menu onClose={() => setShowMenu(false)} />
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
