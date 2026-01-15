import { ArrowRight, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGetAllProdukAnggota } from '../hooks/useQueries';
import { Badge } from '@/components/ui/badge';
import WhatsAppLink from './WhatsAppLink';

interface HeroProps {
  onNavigate: (section: string) => void;
}

export default function Hero({ onNavigate }: HeroProps) {
  const { data: products = [], isLoading } = useGetAllProdukAnggota();

  return (
    <>
      {/* Hero Section */}
      <section className="relative">
        <div className="relative h-[600px] overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="/assets/dynamic-data-visualization-3d.jpg"
              alt="Hero Background"
              className="w-full h-full object-cover object-center"
              loading="eager"
              fetchPriority="high"
            />
            <div className="absolute inset-0 bg-umkm-blue/70" />
          </div>

          <div className="relative container mx-auto px-4 h-full flex items-center">
            <div className="max-w-3xl text-white">
              <div className="mb-8">
                <img
                  src="/assets/logo su putih.png"
                  alt="Sahabat UMKM"
                  className="h-24 w-auto mb-6"
                  loading="eager"
                  fetchPriority="high"
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
                  asChild
                  size="lg"
                  className="bg-umkm-orange hover:bg-umkm-orange/90 text-white"
                >
                  <a
                    href="https://form.svhrt.com/62132b74a14ddb59768a98f3"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Bergabung Sekarang
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </a>
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
      </section>

      {/* Produk Anggota Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
              Produk Anggota
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Temukan berbagai produk dan layanan berkualitas dari anggota komunitas Sahabat UMKM
            </p>
          </div>

          {/* Products Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-card rounded-lg shadow-lg border border-border overflow-hidden animate-pulse">
                  <div className="w-full h-64 bg-muted" />
                  <div className="p-6">
                    <div className="h-4 bg-muted rounded mb-3 w-20" />
                    <div className="h-6 bg-muted rounded mb-2 w-3/4" />
                    <div className="h-4 bg-muted rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-xl text-muted-foreground">
                Belum ada produk yang dipublikasikan
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div
                  key={Number(product.id)}
                  className="bg-card rounded-lg shadow-lg border border-border overflow-hidden hover:shadow-xl transition-shadow"
                >
                  {/* Product Image */}
                  {product.foto ? (
                    <div className="w-full h-64 overflow-hidden bg-muted">
                      <img
                        src={product.foto}
                        alt={product.namaUsaha}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-64 bg-muted flex items-center justify-center">
                      <Package className="h-16 w-16 text-muted-foreground" />
                    </div>
                  )}

                  {/* Product Info */}
                  <div className="p-6">
                    <Badge variant="secondary" className="mb-3">
                      {product.kategori}
                    </Badge>
                    <h3 className="text-xl font-bold mb-2 text-foreground">
                      {product.namaUsaha}
                    </h3>
                    {product.hubungiSelanjutnya && (
                      <div className="text-sm">
                        <WhatsAppLink contact={product.hubungiSelanjutnya} />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* View All Button */}
          {products.length > 0 && (
            <div className="text-center mt-12">
              <Button
                onClick={() => onNavigate('products')}
                size="lg"
                className="bg-umkm-blue hover:bg-umkm-blue/90 text-white"
              >
                Lihat Semua Produk
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
