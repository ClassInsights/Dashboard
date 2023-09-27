import Image from 'next/image';
import { ThemeMode, useTheme } from '../contexts/ThemeContext';
import { useRouter } from 'next/navigation';

const Footer = () => {
  const theme = useTheme();
  const router = useRouter();
  return (
    <footer className='absolute bottom-0 pb-5 w-full flex flex-col md:flex-row justify-between items-center select-none'>
      <p className='text-onBackground dark:text-dark-onBackground'>
        © {new Date().getFullYear()} HAK/HAS/HLW Landeck
      </p>
      <div>
        <a href='https://github.com/ClassInsights' target='_blank' draggable={false}>
          <div className='flex items-center'>
            <p className='text-onBackground dark:text-dark-onBackground mr-2'>GitHub</p>
            <Image
              src='/github.svg'
              alt='GitHub'
              height={50}
              width={50}
              draggable={false}
              className={`h-auto w-auto  cursor-pointer onBackground-dark dark:onBackground-light `}
            />
          </div>
        </a>
      </div>
    </footer>
  );
};

export default Footer;
