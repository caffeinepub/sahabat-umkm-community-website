import { useState } from 'react';
import { Package, Plus, Edit, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { useGetAllProdukAnggota, useAddProdukAnggota, useEditProdukAnggota, useDeleteProdukAnggota, useCheckAdminStatus } from '../hooks/useQueries';
import type { ProdukAnggota } from '../backend';
import { toast } from 'sonner';
import WhatsAppLink from './WhatsAppLink';

export default function Products() {
  const { data: products = [], isLoading } = useGetAllProdukAnggota();
  const { data: isAdmin } = useCheckAdminStatus();
  const addProduk = useAddProdukAnggota();
  const editProduk = useEditProdukAnggota();
  const deleteProduk = useDeleteProdukAnggota();

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProdukAnggota | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Form state
  const [formData, setFormData] = useState({
    namaUsaha: '',
    kategori: '',
    hubungiSelanjutnya: '',
    foto: null as string | null,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);

  const categories = ['Kuliner', 'Kriya', 'Jasa', 'Lain-lain'];

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(p => p.kategori === selectedCategory);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageError(null);

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setImageError('Ukuran file maksimal 5MB');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setImageError('File harus berupa gambar');
      return;
    }

    // Create image to validate aspect ratio
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    
    img.onload = () => {
      const aspectRatio = img.width / img.height;
      const targetRatio = 1; // 1:1 square ratio
      const tolerance = 0.05;

      if (Math.abs(aspectRatio - targetRatio) > tolerance) {
        setImageError('Rasio gambar harus 1:1 (persegi). Lebar dan tinggi gambar harus sama.');
        URL.revokeObjectURL(objectUrl);
        return;
      }

      // Valid image
      setImageFile(file);
      setImagePreview(objectUrl);
    };

    img.onerror = () => {
      setImageError('Gagal memuat gambar');
      URL.revokeObjectURL(objectUrl);
    };

    img.src = objectUrl;
  };

  const resetForm = () => {
    setFormData({
      namaUsaha: '',
      kategori: '',
      hubungiSelanjutnya: '',
      foto: null,
    });
    setImageFile(null);
    setImagePreview(null);
    setImageError(null);
  };

  const handleAddProduct = async () => {
    if (!formData.namaUsaha || !formData.kategori) {
      toast.error('Nama usaha dan kategori wajib diisi');
      return;
    }

    if (imageError) {
      toast.error('Perbaiki kesalahan gambar terlebih dahulu');
      return;
    }

    try {
      let fotoData: string | null = null;
      
      if (imageFile) {
        const reader = new FileReader();
        fotoData = await new Promise((resolve, reject) => {
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(imageFile);
        });
      }

      await addProduk.mutateAsync({
        namaUsaha: formData.namaUsaha,
        kategori: formData.kategori,
        hubungiSelanjutnya: formData.hubungiSelanjutnya || null,
        foto: fotoData,
      });

      toast.success('Produk berhasil ditambahkan');
      setShowAddDialog(false);
      resetForm();
    } catch (error: any) {
      toast.error(error.message || 'Gagal menambahkan produk');
    }
  };

  const handleEditProduct = async () => {
    if (!editingProduct || !formData.namaUsaha || !formData.kategori) {
      toast.error('Nama usaha dan kategori wajib diisi');
      return;
    }

    if (imageError) {
      toast.error('Perbaiki kesalahan gambar terlebih dahulu');
      return;
    }

    try {
      let fotoData: string | null = formData.foto;
      
      if (imageFile) {
        const reader = new FileReader();
        fotoData = await new Promise((resolve, reject) => {
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(imageFile);
        });
      }

      await editProduk.mutateAsync({
        id: editingProduct.id,
        namaUsaha: formData.namaUsaha,
        kategori: formData.kategori,
        hubungiSelanjutnya: formData.hubungiSelanjutnya || null,
        foto: fotoData,
      });

      toast.success('Produk berhasil diperbarui');
      setShowEditDialog(false);
      setEditingProduct(null);
      resetForm();
    } catch (error: any) {
      toast.error(error.message || 'Gagal memperbarui produk');
    }
  };

  const handleDeleteProduct = async (id: bigint) => {
    if (!confirm('Apakah Anda yakin ingin menghapus produk ini?')) return;

    try {
      await deleteProduk.mutateAsync(id);
      toast.success('Produk berhasil dihapus');
    } catch (error: any) {
      toast.error(error.message || 'Gagal menghapus produk');
    }
  };

  const openEditDialog = (product: ProdukAnggota) => {
    setEditingProduct(product);
    setFormData({
      namaUsaha: product.namaUsaha,
      kategori: product.kategori,
      hubungiSelanjutnya: product.hubungiSelanjutnya || '',
      foto: product.foto || null,
    });
    setImagePreview(product.foto || null);
    setShowEditDialog(true);
  };

  const closeAddDialog = () => {
    setShowAddDialog(false);
    resetForm();
  };

  const closeEditDialog = () => {
    setShowEditDialog(false);
    setEditingProduct(null);
    resetForm();
  };

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Produk Anggota
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Temukan berbagai produk berkualitas dari anggota UMKM kami
          </p>
        </div>

        {/* Admin Controls */}
        {isAdmin && (
          <div className="mb-8 flex justify-between items-center">
            <Button
              onClick={() => setShowAddDialog(true)}
              className="bg-umkm-blue hover:bg-umkm-blue/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Tambah Produk
            </Button>
          </div>
        )}

        {/* Category Filter */}
        <div className="mb-8 flex flex-wrap gap-2 justify-center">
          <Button
            variant={selectedCategory === 'all' ? 'default' : 'outline'}
            onClick={() => setSelectedCategory('all')}
            className={selectedCategory === 'all' ? 'bg-umkm-blue hover:bg-umkm-blue/90' : ''}
          >
            Semua
          </Button>
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(cat)}
              className={selectedCategory === cat ? 'bg-umkm-blue hover:bg-umkm-blue/90' : ''}
            >
              {cat}
            </Button>
          ))}
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Memuat produk...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="max-w-2xl mx-auto">
            <Card className="border-border">
              <CardContent className="p-12 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-umkm-blue/10 mb-6">
                  <Package className="h-10 w-10 text-umkm-blue" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  {selectedCategory === 'all' ? 'Belum Ada Produk' : 'Tidak Ada Produk di Kategori Ini'}
                </h2>
                <p className="text-muted-foreground">
                  {isAdmin 
                    ? 'Klik tombol "Tambah Produk" untuk menambahkan produk baru.'
                    : 'Produk dari anggota UMKM akan segera ditampilkan di sini.'}
                </p>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id.toString()} className="border-border overflow-hidden hover:shadow-lg transition-shadow">
                {product.foto && (
                  <div className="aspect-square overflow-hidden bg-muted">
                    <img
                      src={product.foto}
                      alt={product.namaUsaha}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                )}
                <CardContent className="p-6">
                  <div className="mb-3">
                    <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-umkm-blue/10 text-umkm-blue">
                      {product.kategori}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">
                    {product.namaUsaha}
                  </h3>
                  {product.hubungiSelanjutnya && (
                    <div className="mb-4">
                      <WhatsAppLink contact={product.hubungiSelanjutnya} />
                    </div>
                  )}
                  {isAdmin && (
                    <div className="flex gap-2 mt-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openEditDialog(product)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Hapus
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Add Product Dialog */}
        <Dialog open={showAddDialog} onOpenChange={closeAddDialog}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Tambah Produk Baru</DialogTitle>
              <DialogDescription>
                Lengkapi informasi produk anggota UMKM
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {/* Image Upload */}
              <div className="space-y-2">
                <Label htmlFor="foto">Upload Foto (Rasio 1:1 - Persegi) *</Label>
                <div className="flex flex-col gap-2">
                  <Input
                    id="foto"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="cursor-pointer"
                  />
                  {imageError && (
                    <p className="text-sm text-destructive font-medium">{imageError}</p>
                  )}
                  {imagePreview && !imageError && (
                    <div className="relative aspect-square w-full max-w-md rounded-lg overflow-hidden border border-border">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        loading="eager"
                      />
                      <Button
                        size="icon"
                        variant="destructive"
                        className="absolute top-2 right-2"
                        onClick={() => {
                          setImageFile(null);
                          setImagePreview(null);
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Ukuran maksimal 5MB. Rasio gambar harus 1:1 (persegi). Lebar dan tinggi gambar harus sama.
                </p>
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="kategori">Kategori *</Label>
                <Select
                  value={formData.kategori}
                  onValueChange={(value) => setFormData({ ...formData, kategori: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Business Name */}
              <div className="space-y-2">
                <Label htmlFor="namaUsaha">Nama Usaha *</Label>
                <Input
                  id="namaUsaha"
                  value={formData.namaUsaha}
                  onChange={(e) => setFormData({ ...formData, namaUsaha: e.target.value })}
                  placeholder="Masukkan nama usaha"
                />
              </div>

              {/* Contact */}
              <div className="space-y-2">
                <Label htmlFor="hubungiSelanjutnya">Hubungi Selanjutnya (Nomor WhatsApp)</Label>
                <Input
                  id="hubungiSelanjutnya"
                  value={formData.hubungiSelanjutnya}
                  onChange={(e) => setFormData({ ...formData, hubungiSelanjutnya: e.target.value })}
                  placeholder="Contoh: 081234567890"
                />
                <p className="text-xs text-muted-foreground">
                  Masukkan nomor WhatsApp untuk memudahkan pelanggan menghubungi Anda
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={closeAddDialog}>
                Batal
              </Button>
              <Button
                onClick={handleAddProduct}
                disabled={addProduk.isPending || !formData.namaUsaha || !formData.kategori || !!imageError}
                className="bg-umkm-blue hover:bg-umkm-blue/90"
              >
                {addProduk.isPending ? 'Mempublikasikan...' : 'Publikasikan'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Product Dialog */}
        <Dialog open={showEditDialog} onOpenChange={closeEditDialog}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Produk</DialogTitle>
              <DialogDescription>
                Perbarui informasi produk anggota UMKM
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {/* Image Upload */}
              <div className="space-y-2">
                <Label htmlFor="foto-edit">Upload Foto (Rasio 1:1 - Persegi)</Label>
                <div className="flex flex-col gap-2">
                  <Input
                    id="foto-edit"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="cursor-pointer"
                  />
                  {imageError && (
                    <p className="text-sm text-destructive font-medium">{imageError}</p>
                  )}
                  {imagePreview && !imageError && (
                    <div className="relative aspect-square w-full max-w-md rounded-lg overflow-hidden border border-border">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        loading="eager"
                      />
                      <Button
                        size="icon"
                        variant="destructive"
                        className="absolute top-2 right-2"
                        onClick={() => {
                          setImageFile(null);
                          setImagePreview(null);
                          setFormData({ ...formData, foto: null });
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Ukuran maksimal 5MB. Rasio gambar harus 1:1 (persegi). Lebar dan tinggi gambar harus sama.
                </p>
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="kategori-edit">Kategori *</Label>
                <Select
                  value={formData.kategori}
                  onValueChange={(value) => setFormData({ ...formData, kategori: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Business Name */}
              <div className="space-y-2">
                <Label htmlFor="namaUsaha-edit">Nama Usaha *</Label>
                <Input
                  id="namaUsaha-edit"
                  value={formData.namaUsaha}
                  onChange={(e) => setFormData({ ...formData, namaUsaha: e.target.value })}
                  placeholder="Masukkan nama usaha"
                />
              </div>

              {/* Contact */}
              <div className="space-y-2">
                <Label htmlFor="hubungiSelanjutnya-edit">Hubungi Selanjutnya (Nomor WhatsApp)</Label>
                <Input
                  id="hubungiSelanjutnya-edit"
                  value={formData.hubungiSelanjutnya}
                  onChange={(e) => setFormData({ ...formData, hubungiSelanjutnya: e.target.value })}
                  placeholder="Contoh: 081234567890"
                />
                <p className="text-xs text-muted-foreground">
                  Masukkan nomor WhatsApp untuk memudahkan pelanggan menghubungi Anda
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={closeEditDialog}>
                Batal
              </Button>
              <Button
                onClick={handleEditProduct}
                disabled={editProduk.isPending || !formData.namaUsaha || !formData.kategori || !!imageError}
                className="bg-umkm-blue hover:bg-umkm-blue/90"
              >
                {editProduk.isPending ? 'Menyimpan...' : 'Simpan Perubahan'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}
