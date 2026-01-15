import { useState, useRef } from 'react';
import { Upload, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAddPengajuanProduk } from '../hooks/useQueries';

export default function ProductSubmission() {
  const [namaUsaha, setNamaUsaha] = useState('');
  const [kategori, setKategori] = useState('');
  const [hubungiSelanjutnya, setHubungiSelanjutnya] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addPengajuanMutation = useAddPengajuanProduk();

  // Compress image with medium quality (0.75) to balance clarity and file size
  const compressImage = async (file: File, maxSizeMB: number = 2): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const size = Math.min(img.width, img.height);
          canvas.width = size;
          canvas.height = size;
          
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Failed to get canvas context'));
            return;
          }

          // Calculate center crop coordinates
          const offsetX = (img.width - size) / 2;
          const offsetY = (img.height - size) / 2;

          // Draw cropped image
          ctx.drawImage(img, offsetX, offsetY, size, size, 0, 0, size, size);

          // Use medium quality (0.75) for optimal balance between clarity and file size
          // This maintains good visual sharpness while reducing file size effectively
          let quality = 0.75;
          const maxSizeBytes = maxSizeMB * 1024 * 1024;

          const tryCompress = () => {
            canvas.toBlob(
              (blob) => {
                if (!blob) {
                  reject(new Error('Failed to compress image'));
                  return;
                }

                // If size is acceptable or quality is at minimum threshold, use this version
                if (blob.size <= maxSizeBytes || quality <= 0.6) {
                  const compressedFile = new File([blob], file.name, { type: 'image/jpeg' });
                  resolve(compressedFile);
                } else {
                  // Reduce quality slightly and try again (smaller steps for better control)
                  quality -= 0.05;
                  tryCompress();
                }
              },
              'image/jpeg',
              quality
            );
          };

          tryCompress();
        };
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = event.target?.result as string;
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 5MB before processing)
    if (file.size > 5 * 1024 * 1024) {
      setImageError('Ukuran file maksimal 5MB');
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      setImageError('File harus berupa gambar');
      return;
    }

    setImageError(null);
    setIsCompressing(true);

    try {
      let processedFile = file;

      // Compress if file exceeds 2MB
      if (file.size > 2 * 1024 * 1024) {
        processedFile = await compressImage(file, 2);
      } else {
        // Just crop to 1:1 without compression for smaller files
        processedFile = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
              const canvas = document.createElement('canvas');
              const size = Math.min(img.width, img.height);
              canvas.width = size;
              canvas.height = size;
              
              const ctx = canvas.getContext('2d');
              if (!ctx) {
                reject(new Error('Failed to get canvas context'));
                return;
              }

              // Calculate center crop coordinates
              const offsetX = (img.width - size) / 2;
              const offsetY = (img.height - size) / 2;

              // Draw cropped image
              ctx.drawImage(img, offsetX, offsetY, size, size, 0, 0, size, size);

              canvas.toBlob((blob) => {
                if (blob) {
                  const croppedFile = new File([blob], file.name, { type: file.type });
                  resolve(croppedFile);
                } else {
                  reject(new Error('Failed to create blob'));
                }
              }, file.type);
            };
            img.onerror = () => reject(new Error('Failed to load image'));
            img.src = event.target?.result as string;
          };
          reader.onerror = () => reject(new Error('Failed to read file'));
          reader.readAsDataURL(file);
        });
      }

      // Create preview
      const previewReader = new FileReader();
      previewReader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      previewReader.readAsDataURL(processedFile);

      setImageFile(processedFile);
    } catch (error) {
      console.error('Image processing error:', error);
      setImageError('Gagal memproses gambar. Silakan coba lagi.');
    } finally {
      setIsCompressing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setImageError(null);
    setIsSubmitting(true);

    if (!namaUsaha || !kategori) {
      setImageError('Mohon lengkapi semua field yang wajib diisi');
      setIsSubmitting(false);
      return;
    }

    if (!imageFile) {
      setImageError('Mohon upload foto produk');
      setIsSubmitting(false);
      return;
    }

    try {
      // Convert image to base64
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const base64Image = event.target?.result as string;

          await addPengajuanMutation.mutateAsync({
            foto: base64Image,
            kategori,
            namaUsaha,
            hubungiSelanjutnya: hubungiSelanjutnya || null,
          });

          // Reset form
          setNamaUsaha('');
          setKategori('');
          setHubungiSelanjutnya('');
          setImageFile(null);
          setImagePreview(null);
          setImageError(null);
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }

          // Show success message
          setShowSuccess(true);
          setTimeout(() => setShowSuccess(false), 5000);
        } catch (error: any) {
          console.error('Product submission error:', error);
          
          // Translate error messages to Indonesian
          let errorMessage = 'Gagal mengirim pengajuan. Silakan coba lagi.';
          
          if (error.message) {
            if (error.message.includes('Actor not available')) {
              errorMessage = 'Koneksi ke backend gagal. Silakan muat ulang halaman dan coba lagi.';
            } else if (error.message.includes('network') || error.message.includes('timeout')) {
              errorMessage = 'Koneksi jaringan bermasalah. Silakan periksa koneksi internet Anda dan coba lagi.';
            } else if (error.message.includes('Failed to add product submission after retries')) {
              errorMessage = 'Gagal mengirim pengajuan setelah beberapa percobaan. Silakan coba lagi nanti.';
            } else {
              errorMessage = error.message;
            }
          }
          
          setImageError(errorMessage);
        } finally {
          setIsSubmitting(false);
        }
      };
      
      reader.onerror = () => {
        setImageError('Gagal membaca file gambar. Silakan coba lagi.');
        setIsSubmitting(false);
      };
      
      reader.readAsDataURL(imageFile);
    } catch (error: any) {
      console.error('File reading error:', error);
      setImageError('Gagal memproses gambar. Silakan coba lagi.');
      setIsSubmitting(false);
    }
  };

  const isFormDisabled = isSubmitting || addPengajuanMutation.isPending || isCompressing;

  return (
    <section className="py-16 bg-gradient-to-b from-umkm-blue/5 to-background">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Kirim Produk UMKM
            </h1>
            <p className="text-muted-foreground">
              Ajukan produk UMKM Anda untuk ditampilkan di website kami
            </p>
          </div>

          {showSuccess && (
            <Alert className="mb-6 bg-green-50 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Pengajuan produk berhasil dikirim! Admin akan meninjau pengajuan Anda.
              </AlertDescription>
            </Alert>
          )}

          {imageError && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{imageError}</AlertDescription>
            </Alert>
          )}

          {isCompressing && (
            <Alert className="mb-6 bg-blue-50 border-blue-200">
              <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />
              <AlertDescription className="text-blue-800">
                Mengompres gambar...
              </AlertDescription>
            </Alert>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Form Pengajuan Produk</CardTitle>
              <CardDescription>
                Lengkapi informasi produk UMKM Anda di bawah ini
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Image Upload */}
                <div className="space-y-2">
                  <Label htmlFor="foto">
                    Upload Foto Produk <span className="text-red-500">*</span>
                  </Label>
                  <div className="flex flex-col items-center gap-4">
                    {imagePreview ? (
                      <div className="relative w-64 h-64 rounded-lg overflow-hidden border-2 border-border">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={() => {
                            setImageFile(null);
                            setImagePreview(null);
                            if (fileInputRef.current) {
                              fileInputRef.current.value = '';
                            }
                          }}
                          disabled={isFormDisabled}
                        >
                          Hapus
                        </Button>
                      </div>
                    ) : (
                      <div
                        onClick={() => !isFormDisabled && fileInputRef.current?.click()}
                        className={`w-64 h-64 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center ${
                          isFormDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-umkm-blue'
                        } transition-colors`}
                      >
                        <Upload className="h-12 w-12 text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground text-center px-4">
                          Klik untuk upload foto
                          <br />
                          <span className="text-xs">(Gambar akan dipotong otomatis menjadi 1:1)</span>
                        </p>
                      </div>
                    )}
                    <Input
                      ref={fileInputRef}
                      id="foto"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      disabled={isFormDisabled}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Format: JPG, PNG. Maksimal 5MB. Gambar akan dipotong otomatis ke rasio 1:1 (persegi) dan dikompres jika melebihi 2MB.
                  </p>
                </div>

                {/* Kategori */}
                <div className="space-y-2">
                  <Label htmlFor="kategori">
                    Kategori <span className="text-red-500">*</span>
                  </Label>
                  <Select value={kategori} onValueChange={setKategori} disabled={isFormDisabled}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Kuliner">Kuliner</SelectItem>
                      <SelectItem value="Kriya">Kriya</SelectItem>
                      <SelectItem value="Jasa">Jasa</SelectItem>
                      <SelectItem value="Lain-lain">Lain-lain</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Nama Usaha */}
                <div className="space-y-2">
                  <Label htmlFor="namaUsaha">
                    Nama Usaha <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="namaUsaha"
                    value={namaUsaha}
                    onChange={(e) => setNamaUsaha(e.target.value)}
                    placeholder="Masukkan nama usaha"
                    disabled={isFormDisabled}
                    required
                  />
                </div>

                {/* Hubungi Selanjutnya */}
                <div className="space-y-2">
                  <Label htmlFor="hubungiSelanjutnya">
                    Hubungi Selanjutnya (Opsional)
                  </Label>
                  <Input
                    id="hubungiSelanjutnya"
                    value={hubungiSelanjutnya}
                    onChange={(e) => setHubungiSelanjutnya(e.target.value)}
                    placeholder="Nomor telepon atau link WhatsApp"
                    disabled={isFormDisabled}
                  />
                  <p className="text-xs text-muted-foreground">
                    Contoh: 08123456789 atau https://wa.me/628123456789
                  </p>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full bg-umkm-blue hover:bg-umkm-blue/90"
                  disabled={isFormDisabled}
                >
                  {isFormDisabled ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {isCompressing ? 'Memproses gambar...' : 'Mengirim...'}
                    </>
                  ) : (
                    'Kirim Pengajuan Produk'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
