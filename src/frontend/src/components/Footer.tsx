import { Mail, Phone, MapPin } from 'lucide-react';
import { SiFacebook, SiInstagram, SiX, SiLinkedin } from 'react-icons/si';

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
              src="/assets/logo flat SU BPC Karawang png.png"
              alt="Sahabat UMKM BPC Karawang"
              className="h-16 md:h-20 w-auto mb-4 object-contain"
              loading="lazy"
              decoding="async"
            />
            <p className="text-muted-foreground mb-4">
              Bersama membangun dan mengembangkan UMKM Indonesia menuju masa depan yang lebih cerah.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-muted-foreground hover:text-umkm-blue transition-colors"
                aria-label="Facebook"
              >
                <SiFacebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-umkm-blue transition-colors"
                aria-label="Instagram"
              >
                <SiInstagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-umkm-blue transition-colors"
                aria-label="X (Twitter)"
              >
                <SiX className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-umkm-blue transition-colors"
                aria-label="LinkedIn"
              >
                <SiLinkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Navigasi Cepat</h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="text-muted-foreground hover:text-umkm-blue transition-colors"
                >
                  Beranda
                </button>
              </li>
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
                  onClick={() => onNavigate('news')}
                  className="text-muted-foreground hover:text-umkm-blue transition-colors"
                >
                  Berita
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('gallery')}
                  className="text-muted-foreground hover:text-umkm-blue transition-colors"
                >
                  Galeri
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('education')}
                  className="text-muted-foreground hover:text-umkm-blue transition-colors"
                >
                  Edukasi
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('products')}
                  className="text-muted-foreground hover:text-umkm-blue transition-colors"
                >
                  Produk Anggota
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('anggota')}
                  className="text-muted-foreground hover:text-umkm-blue transition-colors"
                >
                  Anggota
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('product-submission')}
                  className="text-muted-foreground hover:text-umkm-blue transition-colors"
                >
                  Kirim Produk UMKM
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
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-umkm-blue mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground text-sm">
                  Karawang, Jawa Barat, Indonesia
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-umkm-blue flex-shrink-0" />
                <a
                  href="mailto:info@sahabatumkm.id"
                  className="text-muted-foreground hover:text-umkm-blue transition-colors text-sm"
                >
                  info@sahabatumkm.id
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-umkm-blue flex-shrink-0" />
                <a
                  href="tel:+62123456789"
                  className="text-muted-foreground hover:text-umkm-blue transition-colors text-sm"
                >
                  +62 123 456 789
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>
            © 2025. Built with ❤️ using{' '}
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
