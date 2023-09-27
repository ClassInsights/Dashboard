'use client';

import Navbar from './components/Navbar';
import Container from './components/Container';
import LinkGroupModal, { useLinkGroupModal } from './components/modals/LinkGroupModal';
import ConfigSection from './components/ConfigSection';

export default function Home() {
  const groupModal = useLinkGroupModal();

  return (
    <>
      <LinkGroupModal />
      <div className='w-full h-screen'>
        <Navbar />
        <h1 className='mt-20 text-onBackground dark:text-dark-onBackground'>Willkommen, Jakob.</h1>
        <p className='sm:w-[60%] mt-3 text-onBackground dark:text-dark-onBackground'>
          Hier kannst du alle nötigen Einstellungen für eine reibungslose Funktionalität der App
          ClassInsights und den damit verbundenen Diensten tätigen.
        </p>
        <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10'>
          <Container title='Test' label='Registrierte Nutzer' fullHeight>
            <div className='w-full h-20'></div>
          </Container>
          <Container title='Test' label='Registrierte Nutzer'>
            <div className='w-full h-20'></div>
          </Container>
          <Container title='Test' label='Registrierte Nutzer'>
            <div className='w-full h-20'></div>
          </Container>
        </div>
        <ConfigSection
          title='Verknüpfe Gruppen'
          description='Hier kannst du die Azure AD Gruppen mit den WebUntis Klassen verknüpfen.'
          action={groupModal.toggle}
          actionLabel='Einstellungen'
        />
      </div>
    </>
  );
}
