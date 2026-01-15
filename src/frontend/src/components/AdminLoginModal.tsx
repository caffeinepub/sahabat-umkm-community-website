import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useStartAdminSession } from '../hooks/useQueries';
import { useActor } from '../hooks/useActor';
import { AlertCircle, Loader2, RefreshCw } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminLoginModal({ isOpen, onClose }: AdminLoginModalProps) {
  const { identity, login, loginStatus } = useInternetIdentity();
  const { actor, isFetching: actorFetching } = useActor();
  const startAdminSession = useStartAdminSession();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string>('');
  const [isRetrying, setIsRetrying] = useState(false);

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';
  const isActorReady = !!actor && !actorFetching;

  // Clear error and form when modal opens
  useEffect(() => {
    if (isOpen) {
      setError('');
      setIsRetrying(false);
      setUsername('');
      setPassword('');
    }
  }, [isOpen]);

  // Check if actor becomes available after initial load
  useEffect(() => {
    if (isActorReady && isRetrying) {
      setIsRetrying(false);
      setError('');
    }
  }, [isActorReady, isRetrying]);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!isAuthenticated) {
      setError('Anda harus masuk terlebih dahulu menggunakan Internet Identity.');
      return;
    }

    if (!username || !password) {
      setError('Mohon masukkan username dan password.');
      return;
    }

    if (!isActorReady) {
      setError('Koneksi ke backend sedang diinisialisasi. Silakan tunggu sebentar dan coba lagi.');
      setIsRetrying(true);
      return;
    }

    try {
      await startAdminSession.mutateAsync({ username, password });
      // Clear form and close modal on success
      setUsername('');
      setPassword('');
      onClose();
    } catch (err: any) {
      console.error('Admin login error:', err);
      
      // Extract and translate error messages
      let errorMessage = 'Terjadi kesalahan saat masuk sebagai admin. Silakan coba lagi.';
      
      if (err.message) {
        if (err.message.includes('Invalid credentials')) {
          errorMessage = 'Login gagal. Periksa username dan password.';
        } else if (err.message.includes('Unauthorized')) {
          errorMessage = 'Login gagal. Username atau password salah.';
        } else if (err.message.includes('Actor not available')) {
          errorMessage = 'Koneksi ke backend gagal. Silakan muat ulang halaman.';
          setIsRetrying(true);
        } else if (err.message.includes('Failed to start admin session after retries')) {
          errorMessage = 'Koneksi ke backend gagal setelah beberapa percobaan. Silakan periksa koneksi internet Anda dan coba lagi.';
        } else if (err.message.includes('network') || err.message.includes('timeout')) {
          errorMessage = 'Koneksi jaringan bermasalah. Silakan periksa koneksi internet Anda.';
          setIsRetrying(true);
        } else {
          // Show the actual backend error message
          errorMessage = err.message;
        }
      }
      
      setError(errorMessage);
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

  const handleRetry = () => {
    setError('');
    setIsRetrying(false);
    // The actor will automatically retry initialization
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

          {/* Backend connection status */}
          {actorFetching && (
            <Alert>
              <Loader2 className="h-4 w-4 animate-spin" />
              <AlertDescription>
                Menghubungkan ke backend...
              </AlertDescription>
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
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div className="rounded-lg bg-muted p-4">
                <p className="text-sm text-muted-foreground mb-2">
                  Anda sudah masuk. Masukkan kredensial admin untuk mengaktifkan sesi admin.
                </p>
                <p className="text-xs text-muted-foreground">
                  Hanya pengguna dengan izin admin yang dapat mengakses panel ini.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan username"
                  disabled={startAdminSession.isPending || actorFetching}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  disabled={startAdminSession.isPending || actorFetching}
                  required
                />
              </div>

              {isRetrying && (
                <Button
                  type="button"
                  onClick={handleRetry}
                  variant="outline"
                  className="w-full"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Coba Lagi Koneksi
                </Button>
              )}

              <Button
                type="submit"
                className="w-full bg-umkm-blue hover:bg-umkm-blue/90"
                disabled={startAdminSession.isPending || actorFetching || !isActorReady}
              >
                {startAdminSession.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Memverifikasi...
                  </>
                ) : actorFetching ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Menghubungkan...
                  </>
                ) : (
                  'Aktifkan Sesi Admin'
                )}
              </Button>
            </form>
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
