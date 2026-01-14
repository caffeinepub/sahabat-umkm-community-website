import { useGetAllPhotos } from '../hooks/useQueries';
import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Gallery() {
  const { data: photos = [], isLoading } = useGetAllPhotos();
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  const categories = Array.from(new Set(photos.map((p) => p.category)));
  const allCategories = ['Semua', ...categories];

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">Galeri Foto</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Dokumentasi kegiatan dan momen berharga dari komunitas Sahabat UMKM
          </p>
        </div>

        {/* Gallery Content */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Memuat galeri...</p>
          </div>
        ) : photos.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground">Belum ada foto tersedia</p>
            <p className="text-muted-foreground mt-2">Pantau terus untuk update galeri terbaru</p>
          </div>
        ) : (
          <Tabs defaultValue="Semua" className="w-full">
            <TabsList className="flex flex-wrap justify-center mb-8 h-auto">
              {allCategories.map((category) => (
                <TabsTrigger key={category} value={category} className="m-1">
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>

            {allCategories.map((category) => (
              <TabsContent key={category} value={category}>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {photos
                    .filter((photo) => category === 'Semua' || photo.category === category)
                    .map((photo) => (
                      <div
                        key={Number(photo.id)}
                        className="group relative aspect-square overflow-hidden rounded-lg shadow-md cursor-pointer hover:shadow-xl transition-shadow"
                        onClick={() => setSelectedPhoto(photo.url)}
                      >
                        <img
                          src={photo.url}
                          alt={photo.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end">
                          <div className="p-4 text-white w-full">
                            <h3 className="font-semibold text-sm mb-1">{photo.title}</h3>
                            <p className="text-xs text-white/80">{formatDate(photo.uploadDate)}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        )}

        {/* Photo Detail Dialog */}
        <Dialog open={!!selectedPhoto} onOpenChange={() => setSelectedPhoto(null)}>
          <DialogContent className="max-w-4xl p-0">
            {selectedPhoto && (
              <img
                src={selectedPhoto}
                alt="Photo"
                className="w-full h-auto max-h-[90vh] object-contain"
              />
            )}
          </DialogContent>
        </Dialog>

        {/* Default Gallery Images (if no photos from backend) */}
        {photos.length === 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-8">
            <img
              src="/assets/generated/umkm-meeting.dim_800x600.jpg"
              alt="UMKM Meeting"
              className="w-full h-64 object-cover rounded-lg shadow-lg"
            />
            <img
              src="/assets/generated/umkm-storefront.dim_800x600.jpg"
              alt="UMKM Storefront"
              className="w-full h-64 object-cover rounded-lg shadow-lg"
            />
            <img
              src="/assets/generated/entrepreneurs-group.dim_800x600.jpg"
              alt="Entrepreneurs Group"
              className="w-full h-64 object-cover rounded-lg shadow-lg"
            />
            <img
              src="/assets/generated/workspace.dim_800x600.jpg"
              alt="Workspace"
              className="w-full h-64 object-cover rounded-lg shadow-lg"
            />
            <img
              src="/assets/generated/marketplace.dim_800x600.jpg"
              alt="Marketplace"
              className="w-full h-64 object-cover rounded-lg shadow-lg"
            />
          </div>
        )}
      </div>
    </section>
  );
}
