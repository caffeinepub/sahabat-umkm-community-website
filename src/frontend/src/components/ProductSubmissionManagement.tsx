import { useState } from 'react';
import { CheckCircle, XCircle, Loader2, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  useGetAllPengajuanProduk,
  useApprovePengajuanProduk,
  useRejectPengajuanProduk,
} from '../hooks/useQueries';
import type { PengajuanProduk } from '../backend';
import WhatsAppLink from './WhatsAppLink';

export default function ProductSubmissionManagement() {
  const { data: submissions = [], isLoading } = useGetAllPengajuanProduk();
  const approveMutation = useApprovePengajuanProduk();
  const rejectMutation = useRejectPengajuanProduk();
  const [processingId, setProcessingId] = useState<bigint | null>(null);

  const handleApprove = async (submission: PengajuanProduk) => {
    if (confirm(`Setujui produk "${submission.namaUsaha}"?`)) {
      setProcessingId(submission.id);
      try {
        await approveMutation.mutateAsync(submission.id);
      } finally {
        setProcessingId(null);
      }
    }
  };

  const handleReject = async (submission: PengajuanProduk) => {
    if (confirm(`Tolak produk "${submission.namaUsaha}"? Pengajuan akan dihapus.`)) {
      setProcessingId(submission.id);
      try {
        await rejectMutation.mutateAsync(submission.id);
      } finally {
        setProcessingId(null);
      }
    }
  };

  if (isLoading) {
    return (
      <section className="py-16 bg-gradient-to-b from-umkm-blue/5 to-background">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-umkm-blue" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-b from-umkm-blue/5 to-background">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Kelola Pengajuan Produk
          </h1>
          <p className="text-muted-foreground">
            Tinjau dan kelola pengajuan produk dari anggota UMKM
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Pengajuan</CardDescription>
              <CardTitle className="text-3xl">{submissions.length}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Submissions List */}
        {submissions.length === 0 ? (
          <Alert>
            <Package className="h-4 w-4" />
            <AlertDescription>
              Belum ada pengajuan produk yang masuk.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {submissions.map((submission) => (
              <Card key={submission.id.toString()} className="overflow-hidden">
                {/* Product Image */}
                {submission.foto && (
                  <div className="aspect-square w-full overflow-hidden bg-muted">
                    <img
                      src={submission.foto}
                      alt={submission.namaUsaha}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <CardContent className="p-4">
                  <div className="space-y-3">
                    {/* Business Name */}
                    <div>
                      <h3 className="font-semibold text-lg text-foreground">
                        {submission.namaUsaha}
                      </h3>
                    </div>

                    {/* Category */}
                    <div>
                      <Badge variant="secondary">{submission.kategori}</Badge>
                    </div>

                    {/* Contact Info */}
                    {submission.hubungiSelanjutnya && (
                      <div className="text-sm">
                        <span className="font-medium text-muted-foreground">Kontak: </span>
                        <WhatsAppLink contact={submission.hubungiSelanjutnya} />
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        onClick={() => handleApprove(submission)}
                        disabled={processingId === submission.id}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                        size="sm"
                      >
                        {processingId === submission.id &&
                        approveMutation.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Setujui
                          </>
                        )}
                      </Button>
                      <Button
                        onClick={() => handleReject(submission)}
                        disabled={processingId === submission.id}
                        variant="destructive"
                        className="flex-1"
                        size="sm"
                      >
                        {processingId === submission.id &&
                        rejectMutation.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <XCircle className="h-4 w-4 mr-1" />
                            Tolak
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
