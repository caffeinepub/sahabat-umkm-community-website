import { Calendar, User, ArrowRight, GraduationCap, Plus, Edit, Trash2, Loader2, ArrowLeft, FileText } from 'lucide-react';
import { useGetAllEdukasi, useAddEdukasi, useEditEdukasi, useDeleteEdukasi } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Edukasi } from '../backend';
import { toast } from 'sonner';

interface EducationManagementProps {
  category: string;
  onBack: () => void;
}

export default function EducationManagement({ category, onBack }: EducationManagementProps) {
  const { data: edukasiList = [], isLoading } = useGetAllEdukasi();
  const [selectedEdukasi, setSelectedEdukasi] = useState<Edukasi | null>(null);
  const [showManageDialog, setShowManageDialog] = useState(false);
  const [editingEdukasi, setEditingEdukasi] = useState<Edukasi | null>(null);
  const [uploadingPdf, setUploadingPdf] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: '',
    image: '',
    category: category === 'all' ? 'Marketing' : category,
  });

  const addMutation = useAddEdukasi();
  const editMutation = useEditEdukasi();
  const deleteMutation = useDeleteEdukasi();

  // Filter by category
  const filteredEdukasi = category === 'all' 
    ? edukasiList 
    : edukasiList.filter((item) => {
        const itemCategory = item.title.includes('[') 
          ? item.title.match(/\[(.*?)\]/)?.[1] || 'Lain-lain'
          : 'Lain-lain';
        return itemCategory === category;
      });

  // Sort by date (newest first)
  const sortedEdukasi = [...filteredEdukasi].sort((a, b) => Number(b.date - a.date));

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const handleOpenManageDialog = (edukasi?: Edukasi) => {
    if (edukasi) {
      setEditingEdukasi(edukasi);
      const itemCategory = edukasi.title.includes('[') 
        ? edukasi.title.match(/\[(.*?)\]/)?.[1] || 'Lain-lain'
        : 'Lain-lain';
      const titleWithoutCategory = edukasi.title.replace(/\[.*?\]\s*/, '');
      setFormData({
        title: titleWithoutCategory,
        content: edukasi.content,
        author: edukasi.author,
        image: edukasi.image || '',
        category: itemCategory,
      });
    } else {
      setEditingEdukasi(null);
      setFormData({
        title: '',
        content: '',
        author: '',
        image: '',
        category: category === 'all' ? 'Marketing' : category,
      });
    }
    setShowManageDialog(true);
  };

  const handleCloseManageDialog = () => {
    setShowManageDialog(false);
    setEditingEdukasi(null);
    setFormData({
      title: '',
      content: '',
      author: '',
      image: '',
      category: category === 'all' ? 'Marketing' : category,
    });
  };

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate PDF file type
    if (file.type !== 'application/pdf') {
      toast.error('File harus berformat PDF');
      e.target.value = '';
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Ukuran file maksimal 10MB');
      e.target.value = '';
      return;
    }

    try {
      setUploadingPdf(true);
      
      // Convert PDF to base64
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Pdf = event.target?.result as string;
        setFormData({ ...formData, image: base64Pdf });
        toast.success('PDF berhasil diupload');
        setUploadingPdf(false);
      };
      
      reader.onerror = () => {
        toast.error('Gagal membaca file PDF');
        setUploadingPdf(false);
      };
      
      reader.readAsDataURL(file);
    } catch (error: any) {
      console.error('PDF upload error:', error);
      toast.error('Gagal mengupload PDF');
      setUploadingPdf(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation for Marketing category
    if (formData.category === 'Marketing') {
      if (!formData.title.trim() || !formData.author.trim()) {
        toast.error('Mohon lengkapi semua field yang wajib diisi');
        return;
      }
      if (!formData.image) {
        toast.error('Mohon upload file PDF materi');
        return;
      }
    } else {
      // Validation for other categories
      if (!formData.title.trim() || !formData.content.trim() || !formData.author.trim()) {
        toast.error('Mohon lengkapi semua field yang wajib diisi');
        return;
      }
    }

    const titleWithCategory = `[${formData.category}] ${formData.title}`;

    try {
      if (editingEdukasi) {
        await editMutation.mutateAsync({
          id: editingEdukasi.id,
          title: titleWithCategory,
          content: formData.content || 'PDF Material',
          author: formData.author,
          image: formData.image || null,
        });
        toast.success('Konten edukasi berhasil diperbarui');
      } else {
        await addMutation.mutateAsync({
          title: titleWithCategory,
          content: formData.content || 'PDF Material',
          author: formData.author,
          image: formData.image || null,
        });
        toast.success('Konten edukasi berhasil ditambahkan');
      }
      handleCloseManageDialog();
    } catch (error: any) {
      toast.error(error.message || 'Terjadi kesalahan');
    }
  };

  const handleDelete = async (id: bigint) => {
    if (!confirm('Apakah Anda yakin ingin menghapus konten edukasi ini?')) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(id);
      toast.success('Konten edukasi berhasil dihapus');
      if (selectedEdukasi?.id === id) {
        setSelectedEdukasi(null);
      }
    } catch (error: any) {
      toast.error(error.message || 'Terjadi kesalahan');
    }
  };

  const getCategoryLabel = () => {
    if (category === 'all') return 'Semua Kategori';
    return category;
  };

  const isMarketingCategory = formData.category === 'Marketing';

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={onBack}
            className="mb-4 text-umkm-blue hover:text-umkm-blue/80"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke Menu Kategori
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center mb-2">
                <GraduationCap className="h-10 w-10 text-umkm-blue mr-3" />
                <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                  Kelola Konten Edukasi
                </h1>
              </div>
              <p className="text-lg text-muted-foreground">
                Kategori: <span className="font-semibold text-umkm-blue">{getCategoryLabel()}</span>
              </p>
            </div>
            <Button
              onClick={() => handleOpenManageDialog()}
              className="bg-umkm-blue hover:bg-umkm-blue/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Tambah Konten
            </Button>
          </div>
        </div>

        {/* Education Content Display */}
        {isLoading ? (
          <div className="text-center py-12">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-umkm-blue mb-4" />
            <p className="text-muted-foreground">Memuat konten edukasi...</p>
          </div>
        ) : sortedEdukasi.length === 0 ? (
          <div className="text-center py-12">
            <GraduationCap className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
            <p className="text-xl text-muted-foreground">
              Belum ada konten edukasi untuk kategori ini
            </p>
            <Button
              onClick={() => handleOpenManageDialog()}
              className="mt-4 bg-umkm-blue hover:bg-umkm-blue/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Tambah Konten Pertama
            </Button>
          </div>
        ) : category === 'Marketing' ? (
          // Numbered list view for Marketing category
          <div className="bg-card rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6 text-foreground">Daftar Materi Marketing</h2>
            <div className="space-y-4">
              {sortedEdukasi.map((edukasi, index) => {
                const titleWithoutCategory = edukasi.title.replace(/\[.*?\]\s*/, '');
                return (
                  <div
                    key={Number(edukasi.id)}
                    className="flex items-start gap-4 p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex-shrink-0 w-8 h-8 bg-umkm-blue text-white rounded-full flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-foreground mb-1">
                        {titleWithoutCategory}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                        <span className="flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          {edukasi.author}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(edukasi.date)}
                        </span>
                      </div>
                      {edukasi.image && (
                        <a
                          href={edukasi.image}
                          download={`${titleWithoutCategory}.pdf`}
                          className="inline-flex items-center text-umkm-blue hover:text-umkm-blue/80 text-sm font-medium"
                        >
                          <FileText className="h-4 w-4 mr-1" />
                          Download Materi PDF
                        </a>
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenManageDialog(edukasi)}
                        className="text-umkm-blue hover:text-umkm-blue/80"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(edukasi.id)}
                        disabled={deleteMutation.isPending}
                        className="text-destructive hover:text-destructive/80"
                      >
                        {deleteMutation.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          // Grid view for other categories
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedEdukasi.map((edukasi) => {
              const titleWithoutCategory = edukasi.title.replace(/\[.*?\]\s*/, '');
              return (
                <Card key={Number(edukasi.id)} className="hover:shadow-lg transition-shadow flex flex-col">
                  {edukasi.image && (
                    <div className="w-full h-48 overflow-hidden rounded-t-lg">
                      <img
                        src={edukasi.image}
                        alt={titleWithoutCategory}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-xl line-clamp-2">{titleWithoutCategory}</CardTitle>
                    <CardDescription className="flex items-center justify-between text-sm mt-2">
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        {formatDate(edukasi.date)}
                      </span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <p className="text-muted-foreground line-clamp-3 mb-4 flex-1">
                      {edukasi.content}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <User className="h-4 w-4 mr-2 text-umkm-orange" />
                        {edukasi.author}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedEdukasi(edukasi)}
                          className="text-umkm-blue hover:text-umkm-blue/80"
                        >
                          Baca
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenManageDialog(edukasi)}
                          className="text-umkm-blue hover:text-umkm-blue/80"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(edukasi.id)}
                          disabled={deleteMutation.isPending}
                          className="text-destructive hover:text-destructive/80"
                        >
                          {deleteMutation.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Education Detail Dialog */}
        <Dialog open={!!selectedEdukasi} onOpenChange={() => setSelectedEdukasi(null)}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            {selectedEdukasi && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-2xl">
                    {selectedEdukasi.title.replace(/\[.*?\]\s*/, '')}
                  </DialogTitle>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2">
                    <span className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      {formatDate(selectedEdukasi.date)}
                    </span>
                    <span className="flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      {selectedEdukasi.author}
                    </span>
                  </div>
                </DialogHeader>
                {selectedEdukasi.image && (
                  <div className="w-full h-64 overflow-hidden rounded-lg mt-4">
                    <img
                      src={selectedEdukasi.image}
                      alt={selectedEdukasi.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="prose prose-sm max-w-none mt-4">
                  <p className="whitespace-pre-wrap text-foreground">{selectedEdukasi.content}</p>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Manage Education Dialog */}
        <Dialog open={showManageDialog} onOpenChange={handleCloseManageDialog}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingEdukasi ? 'Edit Konten Edukasi' : 'Tambah Konten Edukasi'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div>
                <Label htmlFor="category">Kategori *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                  disabled={isMarketingCategory && category === 'Marketing'}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Branding">Branding</SelectItem>
                    <SelectItem value="Selling">Selling</SelectItem>
                    <SelectItem value="Manajemen Produksi">Manajemen Produksi</SelectItem>
                    <SelectItem value="Desain">Desain</SelectItem>
                    <SelectItem value="Manajemen Keuangan">Manajemen Keuangan</SelectItem>
                    <SelectItem value="Lain-lain">Lain-lain</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="title">
                  {isMarketingCategory ? 'Judul Materi *' : 'Judul *'}
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder={isMarketingCategory ? 'Masukkan judul materi' : 'Masukkan judul konten edukasi'}
                  required
                />
              </div>

              <div>
                <Label htmlFor="author">Penulis *</Label>
                <Input
                  id="author"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  placeholder="Nama penulis"
                  required
                />
              </div>

              {isMarketingCategory ? (
                // PDF upload for Marketing category
                <div>
                  <Label htmlFor="pdf">Upload Materi (PDF) *</Label>
                  <Input
                    id="pdf"
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={handlePdfUpload}
                    disabled={uploadingPdf}
                    className="cursor-pointer"
                  />
                  {uploadingPdf && (
                    <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Mengupload PDF...</span>
                    </div>
                  )}
                  {formData.image && !uploadingPdf && (
                    <div className="flex items-center gap-2 mt-2 text-sm text-umkm-blue">
                      <FileText className="h-4 w-4" />
                      <span>PDF berhasil diupload</span>
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    Format: PDF, Maksimal 10MB
                  </p>
                </div>
              ) : (
                // Image and content fields for other categories
                <>
                  <div>
                    <Label htmlFor="image">URL Gambar (Opsional)</Label>
                    <Input
                      id="image"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      placeholder="https://example.com/image.jpg"
                      type="url"
                    />
                  </div>
                  <div>
                    <Label htmlFor="content">Konten *</Label>
                    <Textarea
                      id="content"
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      placeholder="Tulis konten edukasi di sini..."
                      rows={10}
                      required
                    />
                  </div>
                </>
              )}

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseManageDialog}
                  disabled={addMutation.isPending || editMutation.isPending || uploadingPdf}
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  disabled={addMutation.isPending || editMutation.isPending || uploadingPdf}
                  className="bg-umkm-blue hover:bg-umkm-blue/90"
                >
                  {(addMutation.isPending || editMutation.isPending) && (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  )}
                  {editingEdukasi ? 'Perbarui' : 'Publikasikan'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}
