import { useState } from 'react';
import { Menu, X, Shield } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface HeaderProps {
  activeSection: string;
  onNavigate: (section: string) => void;
  isAdmin?: boolean;
}

export default function Header({ activeSection, onNavigate, isAdmin = false }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Beranda' },
    { id: 'about', label: 'Tentang Kami' },
    { id: 'news', label: 'Berita' },
    { id: 'gallery', label: 'Galeri' },
    { id: 'education', label: 'Edukasi' },
    { id: 'products', label: 'Produk Anggota' },
    { id: 'anggota', label: 'Anggota' },
    { id: 'product-submission', label: 'Kirim Produk UMKM' },
    { id: 'registration', label: 'Daftar' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => {
              onNavigate('home');
              setMobileMenuOpen(false);
            }}
            className="flex items-center py-2"
          >
            <img
              src="/assets/logo flat SU BPC Karawang png.png"
              alt="Sahabat UMKM BPC Karawang"
              className="h-12 w-auto md:h-14 object-contain"
            />
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
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

          {/* Admin Badge (Desktop) */}
          <div className="hidden lg:flex items-center gap-3">
            {isAdmin && (
              <Badge variant="default" className="bg-umkm-orange hover:bg-umkm-orange/90">
                <Shield className="h-3 w-3 mr-1" />
                Admin
              </Badge>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-md hover:bg-accent"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 space-y-2">
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
            {isAdmin && (
              <div className="px-4 pt-2">
                <Badge variant="default" className="bg-umkm-orange hover:bg-umkm-orange/90">
                  <Shield className="h-3 w-3 mr-1" />
                  Admin
                </Badge>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
