import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useStartAdminSession } from '../hooks/useQueries';
import { AlertCircle, Loader2 } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminLoginModal({ isOpen, onClose }: AdminLoginModalProps) {
  const { identity, login, loginStatus } = useInternetIdentity();
  const startAdminSession = useStartAdminSession();
  const [error, setError] = useState<string>('');

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  const handleAdminLogin = async () => {
    setError('');
    
    if (!isAuthenticated) {
      setError('Anda harus masuk terlebih dahulu menggunakan Internet Identity.');
      return;
    }

    try {
      await startAdminSession.mutateAsync();
      onClose();
    } catch (err: any) {
      console.error('Admin login error:', err);
      if (err.message?.includes('Unauthorized')) {
        setError('Akses ditolak. Anda tidak memiliki izin admin.');
      } else {
        setError('Terjadi kesalahan saat masuk sebagai admin. Silakan coba lagi.');
      }
    }
  };

  const handleInternetIdentityLogin = async () => {
    setError('');
    try {
      await login();
    } catch (err: any) {
      console.error('Internet Identity login error:', err);
      setError('Gagal masuk dengan Internet Identity. Silakan coba lagi.');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Panel Login Admin</DialogTitle>
          <DialogDescription>
            Masuk sebagai administrator untuk mengakses kontrol admin.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {!isAuthenticated ? (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Anda harus masuk dengan Internet Identity terlebih dahulu sebelum mengakses panel admin.
              </p>
              <Button
                onClick={handleInternetIdentityLogin}
                disabled={isLoggingIn}
                className="w-full bg-umkm-blue hover:bg-umkm-blue/90"
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  'Masuk dengan Internet Identity'
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-lg bg-muted p-4">
                <p className="text-sm text-muted-foreground mb-2">
                  Anda sudah masuk. Klik tombol di bawah untuk mengaktifkan sesi admin.
                </p>
                <p className="text-xs text-muted-foreground">
                  Hanya pengguna dengan izin admin yang dapat mengakses panel ini.
                </p>
              </div>

              <Button
                onClick={handleAdminLogin}
                disabled={startAdminSession.isPending}
                className="w-full bg-umkm-blue hover:bg-umkm-blue/90"
              >
                {startAdminSession.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Memverifikasi...
                  </>
                ) : (
                  'Aktifkan Sesi Admin'
                )}
              </Button>
            </div>
          )}

          <div className="pt-4 border-t">
            <p className="text-xs text-muted-foreground text-center">
              Pintasan keyboard: <kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl + Shift + A</kbd>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
