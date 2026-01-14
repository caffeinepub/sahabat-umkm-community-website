import { useState } from 'react';
import { Menu, X, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';

interface HeaderProps {
  activeSection: string;
  onNavigate: (section: string) => void;
  isAdmin?: boolean;
}

export default function Header({ activeSection, onNavigate, isAdmin = false }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  const isAuthenticated = !!identity;
  const disabled = loginStatus === 'logging-in';

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
    } else {
      try {
        await login();
      } catch (error: any) {
        console.error('Login error:', error);
        if (error.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  const navItems = [
    { id: 'home', label: 'Beranda' },
    { id: 'about', label: 'Tentang Kami' },
    { id: 'events', label: 'Acara' },
    { id: 'news', label: 'Berita' },
    { id: 'gallery', label: 'Galeri' },
    { id: 'members', label: 'Direktori Anggota' },
    { id: 'registration', label: 'Daftar' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => {
              onNavigate('home');
              setMobileMenuOpen(false);
            }}
            className="flex items-center space-x-3"
          >
            <img
              src="/assets/logo su putih.png"
              alt="Sahabat UMKM"
              className="h-10 w-auto"
            />
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeSection === item.id
                    ? 'bg-umkm-blue text-white'
                    : 'text-foreground hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Auth Button & Admin Badge */}
          <div className="hidden md:flex items-center gap-3">
            {isAdmin && (
              <Badge variant="default" className="bg-umkm-orange hover:bg-umkm-orange/90">
                <Shield className="h-3 w-3 mr-1" />
                Admin
              </Badge>
            )}
            <Button
              onClick={handleAuth}
              disabled={disabled}
              variant={isAuthenticated ? 'outline' : 'default'}
              className={isAuthenticated ? '' : 'bg-umkm-blue hover:bg-umkm-blue/90'}
            >
              {disabled ? 'Memproses...' : isAuthenticated ? 'Keluar' : 'Masuk'}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-md hover:bg-accent"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeSection === item.id
                    ? 'bg-umkm-blue text-white'
                    : 'text-foreground hover:bg-accent'
                }`}
              >
                {item.label}
              </button>
            ))}
            <div className="pt-2 space-y-2">
              {isAdmin && (
                <div className="px-4">
                  <Badge variant="default" className="bg-umkm-orange hover:bg-umkm-orange/90">
                    <Shield className="h-3 w-3 mr-1" />
                    Admin
                  </Badge>
                </div>
              )}
              <Button
                onClick={handleAuth}
                disabled={disabled}
                variant={isAuthenticated ? 'outline' : 'default'}
                className={`w-full ${isAuthenticated ? '' : 'bg-umkm-blue hover:bg-umkm-blue/90'}`}
              >
                {disabled ? 'Memproses...' : isAuthenticated ? 'Keluar' : 'Masuk'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
