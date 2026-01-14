import { ArrowRight, Users, Calendar, Newspaper } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeroProps {
  onNavigate: (section: string) => void;
}

export default function Hero({ onNavigate }: HeroProps) {
  return (
    <section className="relative">
      {/* Hero Background */}
      <div className="relative h-[600px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/assets/aerial-view-sandy-beach-with-tourists-swimming.jpg"
            alt="Hero Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-umkm-blue/85 to-umkm-blue/75" />
        </div>

        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="max-w-3xl text-white">
            <div className="mb-8">
              <img
                src="/assets/logo su putih.png"
                alt="Sahabat UMKM"
                className="h-24 w-auto mb-6"
              />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Sahabat UMKM
            </h1>
            <p className="text-xl md:text-2xl mb-4 text-white/95">
              A Light of Future BPC Karawang
            </p>
            <p className="text-lg md:text-xl mb-8 text-white/90">
              Bersama membangun dan mengembangkan UMKM Indonesia menuju masa depan yang lebih cerah
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                onClick={() => onNavigate('registration')}
                size="lg"
                className="bg-umkm-orange hover:bg-umkm-orange/90 text-white"
              >
                Bergabung Sekarang
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                onClick={() => onNavigate('about')}
                size="lg"
                variant="outline"
                className="bg-white/10 border-white text-white hover:bg-white/20"
              >
                Pelajari Lebih Lanjut
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="container mx-auto px-4 -mt-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card rounded-lg shadow-lg p-6 border border-border">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-umkm-blue/10 rounded-lg">
                <Users className="h-8 w-8 text-umkm-blue" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground">Anggota</h3>
                <p className="text-muted-foreground">Komunitas UMKM</p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg shadow-lg p-6 border border-border">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-umkm-orange/10 rounded-lg">
                <Calendar className="h-8 w-8 text-umkm-orange" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground">Acara</h3>
                <p className="text-muted-foreground">Program & Kegiatan</p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg shadow-lg p-6 border border-border">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-umkm-red/10 rounded-lg">
                <Newspaper className="h-8 w-8 text-umkm-red" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground">Berita</h3>
                <p className="text-muted-foreground">Update & Artikel</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="relative rounded-lg overflow-hidden shadow-lg group cursor-pointer" onClick={() => onNavigate('events')}>
            <img
              src="/assets/generated/umkm-meeting.dim_800x600.jpg"
              alt="UMKM Meeting"
              className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
              <div className="p-6 text-white">
                <h3 className="text-2xl font-bold mb-2">Acara Mendatang</h3>
                <p className="text-white/90">Ikuti berbagai acara dan workshop untuk mengembangkan bisnis Anda</p>
              </div>
            </div>
          </div>

          <div className="relative rounded-lg overflow-hidden shadow-lg group cursor-pointer" onClick={() => onNavigate('members')}>
            <img
              src="/assets/generated/entrepreneurs-group.dim_800x600.jpg"
              alt="Entrepreneurs Group"
              className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
              <div className="p-6 text-white">
                <h3 className="text-2xl font-bold mb-2">Direktori Anggota</h3>
                <p className="text-white/90">Temukan dan terhubung dengan pelaku UMKM lainnya</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
