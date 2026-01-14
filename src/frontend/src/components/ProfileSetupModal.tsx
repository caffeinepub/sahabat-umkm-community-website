import { useState } from 'react';
import { useSaveCallerUserProfile } from '../hooks/useQueries';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ProfileSetupModal() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const saveProfile = useSaveCallerUserProfile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      alert('Nama harus diisi');
      return;
    }

    try {
      await saveProfile.mutateAsync({
        name: name.trim(),
        email: email.trim() || undefined,
        phone: phone.trim() || undefined,
      });
    } catch (error) {
      console.error('Profile setup error:', error);
      alert('Terjadi kesalahan saat menyimpan profil');
    }
  };

  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Selamat Datang!</DialogTitle>
          <DialogDescription>
            Silakan lengkapi profil Anda untuk melanjutkan
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nama Lengkap *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masukkan nama lengkap Anda"
              required
            />
          </div>
          <div>
            <Label htmlFor="email">Email (Opsional)</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
            />
          </div>
          <div>
            <Label htmlFor="phone">Nomor Telepon (Opsional)</Label>
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+62 xxx xxxx xxxx"
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-umkm-blue hover:bg-umkm-blue/90"
            disabled={saveProfile.isPending}
          >
            {saveProfile.isPending ? 'Menyimpan...' : 'Simpan Profil'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
