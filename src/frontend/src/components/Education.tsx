import { Calendar, User, ArrowRight, GraduationCap, Plus, Edit, Trash2, Loader2, X } from 'lucide-react';
import { useGetAllEdukasi, useAddEdukasi, useEditEdukasi, useDeleteEdukasi, useCheckAdminStatus } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import type { Edukasi } from '../backend';
import { toast } from 'sonner';

export default function Education() {
  const { data: edukasiList = [], isLoading } = useGetAllEdukasi();
  const { data: isAdmin } = useCheckAdminStatus();
  const [selectedEdukasi, setSelectedEdukasi] = useState<Edukasi | null>(null);
  const [showManageDialog, setShowManageDialog] = useState(false);
  const [editingEdukasi, setEditingEdukasi] = useState<Edukasi | null>(null);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string>('');

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: '',
    image: '',
  });

  const addMutation = useAddEdukasi();
  const editMutation = useEditEdukasi();
  const deleteMutation = useDeleteEdukasi();

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
      setFormData({
        title: edukasi.title,
        content: edukasi.content,
        author: edukasi.author,
        image: edukasi.image || '',
      });
    } else {
      setEditingEdukasi(null);
      setFormData({
        title: '',
        content: '',
        author: '',
        image: '',
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
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.content.trim() || !formData.author.trim()) {
      toast.error('Mohon lengkapi semua field yang wajib diisi');
      return;
    }

    try {
      if (editingEdukasi) {
        await editMutation.mutateAsync({
          id: editingEdukasi.id,
          title: formData.title,
          content: formData.content,
          author: formData.author,
          image: formData.image || null,
        });
        toast.success('Konten edukasi berhasil diperbarui');
      } else {
        await addMutation.mutateAsync({
          title: formData.title,
          content: formData.content,
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

  const handleOpenPdfModal = (url: string) => {
    setPdfUrl(url);
    setShowPdfModal(true);
  };

  const handleClosePdfModal = () => {
    setShowPdfModal(false);
    setPdfUrl('');
  };

  const isPdfContent = (edukasi: Edukasi) => {
    return edukasi.image && edukasi.image.startsWith('data:application/pdf');
  };

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <GraduationCap className="h-12 w-12 text-umkm-blue mr-3" />
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">Edukasi</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Materi pembelajaran, tips bisnis, dan panduan untuk mengembangkan UMKM Anda
          </p>
          
          {/* Admin Add Button */}
          {isAdmin && (
            <div className="mt-6">
              <Button
                onClick={() => handleOpenManageDialog()}
                className="bg-umkm-blue hover:bg-umkm-blue/90"
              >
                <Plus className="h-4 w-4 mr-2" />
                Tambah Konten Edukasi
              </Button>
            </div>
          )}
        </div>

        {/* Education Content Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-umkm-blue mb-4" />
            <p className="text-muted-foreground">Memuat konten edukasi...</p>
          </div>
        ) : edukasiList.length === 0 ? (
          <div className="text-center py-12">
            <GraduationCap className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
            <p className="text-xl text-muted-foreground">Belum ada konten edukasi tersedia</p>
            <p className="text-muted-foreground mt-2">Pantau terus untuk materi pembelajaran terbaru</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {edukasiList.map((edukasi) => (
              <Card key={Number(edukasi.id)} className="hover:shadow-lg transition-shadow flex flex-col">
                {edukasi.image && !isPdfContent(edukasi) && (
                  <div className="w-full h-48 overflow-hidden rounded-t-lg">
                    <img
                      src={edukasi.image}
                      alt={edukasi.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-xl line-clamp-2">{edukasi.title}</CardTitle>
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
                      {isPdfContent(edukasi) ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenPdfModal(edukasi.image!)}
                          className="text-umkm-blue hover:text-umkm-blue/80"
                        >
                          Lihat
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedEdukasi(edukasi)}
                          className="text-umkm-blue hover:text-umkm-blue/80"
                        >
                          Baca
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      )}
                      {isAdmin && (
                        <>
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
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Education Detail Dialog */}
        <Dialog open={!!selectedEdukasi} onOpenChange={() => setSelectedEdukasi(null)}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            {selectedEdukasi && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-2xl">{selectedEdukasi.title}</DialogTitle>
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
                {selectedEdukasi.image && !isPdfContent(selectedEdukasi) && (
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
                <Label htmlFor="title">Judul *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Masukkan judul konten edukasi"
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
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseManageDialog}
                  disabled={addMutation.isPending || editMutation.isPending}
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  disabled={addMutation.isPending || editMutation.isPending}
                  className="bg-umkm-blue hover:bg-umkm-blue/90"
                >
                  {(addMutation.isPending || editMutation.isPending) && (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  )}
                  {editingEdukasi ? 'Perbarui' : 'Tambah'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Full-Screen PDF Modal */}
        {showPdfModal && (
          <div
            className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex flex-col"
            onClick={handleClosePdfModal}
          >
            <div className="flex items-center justify-end p-4">
              <Button
                onClick={handleClosePdfModal}
                variant="ghost"
                size="icon"
                className="text-foreground hover:bg-accent rounded-full"
              >
                <X className="h-6 w-6" />
              </Button>
            </div>
            <div
              className="flex-1 overflow-auto px-4 pb-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="max-w-5xl mx-auto h-full">
                <iframe
                  src={pdfUrl}
                  className="w-full h-full min-h-[80vh] rounded-lg border border-border bg-card"
                  title="PDF Viewer"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
