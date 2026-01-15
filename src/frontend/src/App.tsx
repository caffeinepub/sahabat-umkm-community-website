import { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import News from './components/News';
import Gallery from './components/Gallery';
import Products from './components/Products';
import Education from './components/Education';
import EducationCategoryMenu from './components/EducationCategoryMenu';
import EducationManagement from './components/EducationManagement';
import Registration from './components/Registration';
import MembersManagement from './components/MembersManagement';
import ProductSubmission from './components/ProductSubmission';
import ProductSubmissionManagement from './components/ProductSubmissionManagement';
import AnggotaList from './components/AnggotaList';
import Footer from './components/Footer';
import ProfileSetupModal from './components/ProfileSetupModal';
import AdminLoginModal from './components/AdminLoginModal';
import AdminPanel from './components/AdminPanel';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile, useCheckAdminStatus } from './hooks/useQueries';

export default function App() {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const { data: isAdmin } = useCheckAdminStatus();
  const [activeSection, setActiveSection] = useState<string>('home');
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [selectedEducationCategory, setSelectedEducationCategory] = useState<string | null>(null);

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

  const handleNavigate = (section: string) => {
    setActiveSection(section);
    setSelectedEducationCategory(null);
  };

  const handleEducationCategorySelect = (category: string) => {
    setSelectedEducationCategory(category);
  };

  const handleBackToEducationMenu = () => {
    setSelectedEducationCategory(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        activeSection={activeSection} 
        onNavigate={handleNavigate}
        isAdmin={isAdmin || false}
      />
      
      {/* Admin Panel - Only visible when admin is logged in */}
      {isAdmin && <AdminPanel onNavigate={handleNavigate} />}
      
      <main>
        {activeSection === 'home' && <Hero onNavigate={handleNavigate} />}
        {activeSection === 'about' && <About />}
        {activeSection === 'news' && <News />}
        {activeSection === 'gallery' && <Gallery />}
        {activeSection === 'education' && <Education />}
        {activeSection === 'education-category-menu' && isAdmin && !selectedEducationCategory && (
          <EducationCategoryMenu onSelectCategory={handleEducationCategorySelect} />
        )}
        {activeSection === 'education-category-menu' && isAdmin && selectedEducationCategory && (
          <EducationManagement 
            category={selectedEducationCategory} 
            onBack={handleBackToEducationMenu}
          />
        )}
        {activeSection === 'products' && <Products />}
        {activeSection === 'anggota' && <AnggotaList />}
        {activeSection === 'product-submission' && <ProductSubmission />}
        {activeSection === 'registration' && <Registration />}
        {activeSection === 'members-management' && isAdmin && <MembersManagement />}
        {activeSection === 'submission-management' && isAdmin && <ProductSubmissionManagement />}
      </main>

      <Footer onNavigate={handleNavigate} />

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
