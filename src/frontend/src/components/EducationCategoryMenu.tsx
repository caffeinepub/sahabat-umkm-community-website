import { GraduationCap, TrendingUp, Award, ShoppingCart, Cog, Palette, DollarSign, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface EducationCategoryMenuProps {
  onSelectCategory: (category: string) => void;
}

export default function EducationCategoryMenu({ onSelectCategory }: EducationCategoryMenuProps) {
  const categories = [
    {
      id: 'Marketing',
      label: 'Marketing',
      icon: TrendingUp,
      description: 'Strategi pemasaran dan promosi bisnis',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 hover:bg-blue-100',
    },
    {
      id: 'Branding',
      label: 'Branding',
      icon: Award,
      description: 'Membangun identitas dan citra merek',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 hover:bg-purple-100',
    },
    {
      id: 'Selling',
      label: 'Selling',
      icon: ShoppingCart,
      description: 'Teknik penjualan dan closing',
      color: 'text-green-600',
      bgColor: 'bg-green-50 hover:bg-green-100',
    },
    {
      id: 'Manajemen Produksi',
      label: 'Manajemen Produksi',
      icon: Cog,
      description: 'Pengelolaan proses produksi',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 hover:bg-orange-100',
    },
    {
      id: 'Desain',
      label: 'Desain',
      icon: Palette,
      description: 'Desain produk dan visual branding',
      color: 'text-pink-600',
      bgColor: 'bg-pink-50 hover:bg-pink-100',
    },
    {
      id: 'Manajemen Keuangan',
      label: 'Manajemen Keuangan',
      icon: DollarSign,
      description: 'Pengelolaan keuangan bisnis',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50 hover:bg-emerald-100',
    },
    {
      id: 'Lain-lain',
      label: 'Lain-lain',
      icon: MoreHorizontal,
      description: 'Topik edukasi lainnya',
      color: 'text-gray-600',
      bgColor: 'bg-gray-50 hover:bg-gray-100',
    },
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <GraduationCap className="h-12 w-12 text-umkm-blue mr-3" />
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">Kelola Konten Edukasi</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Pilih kategori untuk mengelola konten edukasi
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Card
                key={category.id}
                className="hover:shadow-lg transition-all cursor-pointer border-2 hover:border-umkm-blue/50"
                onClick={() => onSelectCategory(category.id)}
              >
                <CardHeader>
                  <div className={`w-16 h-16 rounded-full ${category.bgColor} flex items-center justify-center mb-4 transition-colors`}>
                    <Icon className={`h-8 w-8 ${category.color}`} />
                  </div>
                  <CardTitle className="text-xl">{category.label}</CardTitle>
                  <CardDescription className="text-sm">
                    {category.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    variant="outline"
                    className="w-full border-umkm-blue text-umkm-blue hover:bg-umkm-blue hover:text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectCategory(category.id);
                    }}
                  >
                    Kelola Konten
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* View All Button */}
        <div className="text-center mt-8">
          <Button
            variant="outline"
            size="lg"
            onClick={() => onSelectCategory('all')}
            className="border-umkm-blue text-umkm-blue hover:bg-umkm-blue hover:text-white"
          >
            Lihat Semua Konten
          </Button>
        </div>
      </div>
    </section>
  );
}
