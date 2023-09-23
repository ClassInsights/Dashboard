'use client';

import { ThemeMode, useTheme } from '../contexts/ThemeContext';

const Menu = () => {
  const themeData = useTheme();

  const menuItems = [
    {
      name: 'Dunkler Modus',
      handleClick: () =>
        themeData.setTheme(
          themeData.themeMode === ThemeMode.Light ? ThemeMode.Dark : ThemeMode.Light
        ),
    },
    { name: 'Abmelden', handleClick: () => console.log('logout') },
  ];

  return (
    <div className='absolute right-0 bg-secondary dark:bg-dark-secondary rounded-lg overflow-hidden drop-shadow-lg'>
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
          <p>{item.name}</p>
        </div>
      ))}
    </div>
  );
};

export default Menu;
