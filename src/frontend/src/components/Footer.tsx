import { SiFacebook, SiInstagram, SiX, SiYoutube } from 'react-icons/si';
import { Mail, Phone, MapPin, Heart } from 'lucide-react';

interface FooterProps {
  onNavigate: (section: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="col-span-1 md:col-span-2">
            <img
              src="/assets/logo su putih.png"
              alt="Sahabat UMKM"
              className="h-16 w-auto mb-4"
            />
            <p className="text-muted-foreground mb-4">
              Komunitas yang berdedikasi untuk mendukung dan mengembangkan usaha mikro, kecil, dan menengah di Indonesia.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-umkm-blue transition-colors"
              >
                <SiFacebook className="h-6 w-6" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-umkm-orange transition-colors"
              >
                <SiInstagram className="h-6 w-6" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-umkm-blue transition-colors"
              >
                <SiX className="h-6 w-6" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-umkm-red transition-colors"
              >
                <SiYoutube className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Tautan Cepat</h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="text-muted-foreground hover:text-umkm-blue transition-colors"
                >
                  Tentang Kami
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('events')}
                  className="text-muted-foreground hover:text-umkm-blue transition-colors"
                >
                  Acara
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('news')}
                  className="text-muted-foreground hover:text-umkm-blue transition-colors"
                >
                  Berita
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('members')}
                  className="text-muted-foreground hover:text-umkm-blue transition-colors"
                >
                  Direktori Anggota
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('registration')}
                  className="text-muted-foreground hover:text-umkm-blue transition-colors"
                >
                  Daftar
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Kontak</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 text-umkm-orange flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground text-sm">
                  BPC Karawang, Jawa Barat, Indonesia
                </span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-2 text-umkm-orange flex-shrink-0" />
                <a
                  href="mailto:info@sahabatumkm.id"
                  className="text-muted-foreground text-sm hover:text-umkm-blue transition-colors"
                >
                  info@sahabatumkm.id
                </a>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-2 text-umkm-orange flex-shrink-0" />
                <span className="text-muted-foreground text-sm">+62 xxx xxxx xxxx</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>
            © 2025. Built with <Heart className="inline h-4 w-4 text-umkm-red" /> using{' '}
            <a
              href="https://caffeine.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-umkm-blue hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
