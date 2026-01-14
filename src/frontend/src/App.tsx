import { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Events from './components/Events';
import News from './components/News';
import Gallery from './components/Gallery';
import Members from './components/Members';
import Registration from './components/Registration';
import Footer from './components/Footer';
import ProfileSetupModal from './components/ProfileSetupModal';
import AdminLoginModal from './components/AdminLoginModal';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile, useCheckAdminStatus } from './hooks/useQueries';

export default function App() {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const { data: isAdmin } = useCheckAdminStatus();
  const [activeSection, setActiveSection] = useState<string>('home');
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  const isAuthenticated = !!identity;
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  // Global keyboard shortcut listener for Ctrl+Shift+A
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key === 'A') {
        event.preventDefault();
        setShowAdminLogin((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header 
        activeSection={activeSection} 
        onNavigate={setActiveSection}
        isAdmin={isAdmin || false}
      />
      
      <main>
        {activeSection === 'home' && <Hero onNavigate={setActiveSection} />}
        {activeSection === 'about' && <About />}
        {activeSection === 'events' && <Events />}
        {activeSection === 'news' && <News />}
        {activeSection === 'gallery' && <Gallery />}
        {activeSection === 'members' && <Members />}
        {activeSection === 'registration' && <Registration />}
      </main>

      <Footer onNavigate={setActiveSection} />

      {showProfileSetup && <ProfileSetupModal />}
      
      {showAdminLogin && (
        <AdminLoginModal 
          isOpen={showAdminLogin}
          onClose={() => setShowAdminLogin(false)}
        />
      )}
    </div>
  );
}
