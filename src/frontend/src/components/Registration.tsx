import { useState } from 'react';
import { useRegisterMember } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, UserPlus } from 'lucide-react';

export default function Registration() {
  const { identity } = useInternetIdentity();
  const registerMember = useRegisterMember();
  const [showSuccess, setShowSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    businessName: '',
    description: '',
    contact: '',
    category: '',
    products: '',
    website: '',
    address: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!identity) {
      alert('Silakan login terlebih dahulu untuk mendaftar');
      return;
    }

    try {
      const productsArray = formData.products
        .split(',')
        .map((p) => p.trim())
        .filter((p) => p.length > 0);

      await registerMember.mutateAsync({
        name: formData.name,
        businessName: formData.businessName,
        description: formData.description,
        contact: formData.contact,
        category: formData.category,
        products: productsArray,
        website: formData.website || null,
        address: formData.address,
      });

      setShowSuccess(true);
      setFormData({
        name: '',
        businessName: '',
        description: '',
        contact: '',
        category: '',
        products: '',
        website: '',
        address: '',
      });

      setTimeout(() => setShowSuccess(false), 5000);
    } catch (error) {
      console.error('Registration error:', error);
      alert('Terjadi kesalahan saat mendaftar. Silakan coba lagi.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">Bergabung dengan Kami</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Daftarkan bisnis UMKM Anda dan jadilah bagian dari komunitas Sahabat UMKM
          </p>
        </div>

        {/* Success Alert */}
        {showSuccess && (
          <Alert className="max-w-2xl mx-auto mb-8 bg-green-50 border-green-200">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <AlertDescription className="text-green-800">
              Pendaftaran berhasil! Profil bisnis Anda telah ditambahkan ke direktori anggota.
            </AlertDescription>
          </Alert>
        )}

        {/* Registration Form */}
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl">
              <UserPlus className="h-6 w-6 mr-2 text-umkm-blue" />
              Formulir Pendaftaran Anggota
            </CardTitle>
            <CardDescription>
              Lengkapi informasi di bawah ini untuk mendaftarkan bisnis UMKM Anda
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!identity ? (
              <Alert>
                <AlertDescription>
                  Silakan login terlebih dahulu untuk mendaftar sebagai anggota.
                </AlertDescription>
              </Alert>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">Informasi Pribadi</h3>
                  
                  <div>
                    <Label htmlFor="name">Nama Lengkap *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Nama lengkap Anda"
                    />
                  </div>

                  <div>
                    <Label htmlFor="contact">Nomor Kontak *</Label>
                    <Input
                      id="contact"
                      name="contact"
                      value={formData.contact}
                      onChange={handleChange}
                      required
                      placeholder="Nomor telepon atau WhatsApp"
                    />
                  </div>
                </div>

                {/* Business Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">Informasi Bisnis</h3>
                  
                  <div>
                    <Label htmlFor="businessName">Nama Bisnis *</Label>
                    <Input
                      id="businessName"
                      name="businessName"
                      value={formData.businessName}
                      onChange={handleChange}
                      required
                      placeholder="Nama usaha/bisnis Anda"
                    />
                  </div>

                  <div>
                    <Label htmlFor="category">Kategori Bisnis *</Label>
                    <Input
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                      placeholder="Contoh: Kuliner, Fashion, Kerajinan, dll"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Deskripsi Bisnis *</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      required
                      placeholder="Ceritakan tentang bisnis Anda"
                      rows={4}
                    />
                  </div>

                  <div>
                    <Label htmlFor="products">Produk/Layanan *</Label>
                    <Input
                      id="products"
                      name="products"
                      value={formData.products}
                      onChange={handleChange}
                      required
                      placeholder="Pisahkan dengan koma (contoh: Kue, Roti, Snack)"
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      Pisahkan setiap produk/layanan dengan koma
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="address">Alamat Usaha *</Label>
                    <Textarea
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      placeholder="Alamat lengkap usaha Anda"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="website">Website (Opsional)</Label>
                    <Input
                      id="website"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      placeholder="https://website-anda.com"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full bg-umkm-blue hover:bg-umkm-blue/90"
                  disabled={registerMember.isPending}
                >
                  {registerMember.isPending ? 'Mendaftar...' : 'Daftar Sekarang'}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Benefits Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-lg">Jaringan Luas</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Terhubung dengan pelaku UMKM lainnya dan perluas jaringan bisnis Anda
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-lg">Pelatihan & Workshop</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Akses ke berbagai pelatihan dan workshop untuk mengembangkan bisnis
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-lg">Promosi Gratis</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Bisnis Anda akan ditampilkan di direktori anggota untuk meningkatkan visibilitas
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
