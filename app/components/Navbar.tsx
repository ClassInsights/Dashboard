import Image from 'next/image';
import Menu from './Menu';

const Navbar = () => {
  return (
    <nav className='w-full flex justify-between items-center py-3 bg-background dark:bg-dark-background'>
      <div className='flex items-center'>
        <Image src='/logo.svg' alt='ClassInsights Logo' width={40} height={40} />
        <h3 className='text-xl ml-4'>ClassInsights</h3>
      </div>
      <div className='flex items-center'>
        <div className='hidden sm:flex items-center mr-4'>
          <p>Jakob Wassertheurer</p>
        </div>
        <div className='group'>
          <div className='rounded-full overflow-x-clip overflow-y-hidden h-12 w-12 flex items-center justify-center'>
            <Image src='/avatar.jpg' alt='Avatar' width={50} height={50} />
          </div>
          <div className='opacity-0 invisible group-hover:visible group-hover:opacity-100 transition-opacity'>
            <Menu />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
