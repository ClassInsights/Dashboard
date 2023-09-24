'use client';

import { ThemeMode, useTheme } from '../contexts/ThemeContext';

const Menu = ({ onClose }: { onClose: () => void }) => {
  const themeData = useTheme();

  const menuItems = [
    {
      name: themeData.themeMode === ThemeMode.Light ? 'Dunkeler Modus' : 'Heller Modus',
      handleClick: () => {
        themeData.setTheme(
          themeData.themeMode === ThemeMode.Light ? ThemeMode.Dark : ThemeMode.Light
        );
        onClose();
      },
    },
    {
      name: 'Abmelden',
      handleClick: () => {
        localStorage.removeItem('token');
        onClose();
      },
    },
  ];

  return (
    <div className='absolute right-0 w-40 bg-secondary dark:bg-dark-secondary rounded-lg overflow-hidden drop-shadow-lg'>
      {menuItems.map((item, index) => (
        <div
          onClick={item.handleClick}
          key={index}
          className={`px-4 py-2 select-none hover:bg-tertiary cursor-pointer transition-colors dark:hover:bg-dark-tertiary
          ${
            index < menuItems.length - 1
              ? 'border-tertiary border-b-1 dark:border-dark-tertiary'
              : ''
          }`}
        >
          <p
            className={
              index == menuItems.length - 1
                ? 'text-error dark:text-dark-error'
                : 'text-onBackground dark:text-dark-onBackground'
            }
          >
            {item.name}
          </p>
        </div>
      ))}
    </div>
  );
};

export default Menu;
