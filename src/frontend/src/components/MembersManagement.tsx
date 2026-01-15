import { useState } from 'react';
import { useGetMembersForAdmin, useVerifyMember, useUpdateMemberIdNumber } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Users, CheckCircle2, XCircle, Loader2, Edit } from 'lucide-react';
import type { MemberProfile, MemberId } from '../backend';

export default function MembersManagement() {
  const { data: members = [], isLoading } = useGetMembersForAdmin();
  const verifyMember = useVerifyMember();
  const updateMemberIdNumber = useUpdateMemberIdNumber();
  const [processingId, setProcessingId] = useState<MemberId | null>(null);
  const [editingMember, setEditingMember] = useState<MemberProfile | null>(null);
  const [memberIdNumber, setMemberIdNumber] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleVerify = async (memberId: MemberId, verified: boolean) => {
    setProcessingId(memberId);
    try {
      await verifyMember.mutateAsync({ memberId, verified });
    } catch (error) {
      console.error('Error verifying member:', error);
      alert('Terjadi kesalahan saat memverifikasi anggota. Silakan coba lagi.');
    } finally {
      setProcessingId(null);
    }
  };

  const handleEditClick = (member: MemberProfile) => {
    setEditingMember(member);
    setMemberIdNumber(member.memberIdNumber || '');
  };

  const handleSaveMemberId = async () => {
    if (!editingMember) return;

    setIsSaving(true);
    try {
      await updateMemberIdNumber.mutateAsync({
        memberId: editingMember.id,
        memberIdNumber: memberIdNumber.trim(),
      });
      setEditingMember(null);
      setMemberIdNumber('');
    } catch (error) {
      console.error('Error updating member ID:', error);
      alert('Terjadi kesalahan saat menyimpan nomor ID anggota. Silakan coba lagi.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCloseDialog = () => {
    setEditingMember(null);
    setMemberIdNumber('');
  };

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground flex items-center gap-3">
            <Users className="h-10 w-10 text-umkm-blue" />
            Kelola Anggota
          </h1>
          <p className="text-xl text-muted-foreground">
            Kelola dan verifikasi anggota Sahabat UMKM
          </p>
        </div>

        {/* Members Table */}
        <Card>
          <CardHeader>
            <CardTitle>Daftar Anggota Terdaftar</CardTitle>
            <CardDescription>
              Total {members.length} anggota terdaftar
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-umkm-blue" />
              </div>
            ) : members.length === 0 ? (
              <Alert>
                <AlertDescription>
                  Belum ada anggota yang terdaftar.
                </AlertDescription>
              </Alert>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16">No.</TableHead>
                      <TableHead>Nama</TableHead>
                      <TableHead>Nama Usaha</TableHead>
                      <TableHead>Kategori</TableHead>
                      <TableHead>Kontak</TableHead>
                      <TableHead>Alamat</TableHead>
                      <TableHead>Nomor ID Anggota</TableHead>
                      <TableHead>Status Verifikasi</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {members.map((member, index) => (
                      <TableRow key={member.id.toString()}>
                        <TableCell className="font-medium text-muted-foreground">
                          {index + 1}
                        </TableCell>
                        <TableCell className="font-medium">{member.name}</TableCell>
                        <TableCell>{member.businessName}</TableCell>
                        <TableCell>{member.category}</TableCell>
                        <TableCell>{member.contact}</TableCell>
                        <TableCell className="max-w-xs truncate">{member.address}</TableCell>
                        <TableCell>
                          {member.memberIdNumber ? (
                            <span className="font-mono text-sm">{member.memberIdNumber}</span>
                          ) : (
                            <span className="text-muted-foreground text-sm italic">Belum diisi</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {member.verified ? (
                            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Terverifikasi
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-gray-600">
                              <XCircle className="h-3 w-3 mr-1" />
                              Belum Terverifikasi
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditClick(member)}
                              className="text-umkm-blue hover:text-umkm-blue hover:bg-blue-50"
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                            {member.verified ? (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleVerify(member.id, false)}
                                disabled={processingId === member.id}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                {processingId === member.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  'Batalkan Verifikasi'
                                )}
                              </Button>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleVerify(member.id, true)}
                                disabled={processingId === member.id}
                                className="text-green-600 hover:text-green-700 hover:bg-green-50"
                              >
                                {processingId === member.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  'Verifikasi'
                                )}
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Total Anggota</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-umkm-blue">{members.length}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Terverifikasi</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-600">
                {members.filter((m) => m.verified).length}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Belum Terverifikasi</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-600">
                {members.filter((m) => !m.verified).length}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Member Dialog */}
      <Dialog open={!!editingMember} onOpenChange={(open) => !open && handleCloseDialog()}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Informasi Anggota</DialogTitle>
            <DialogDescription>
              Masukkan atau edit nomor ID anggota untuk {editingMember?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="memberName">Nama Anggota</Label>
              <Input
                id="memberName"
                value={editingMember?.name || ''}
                disabled
                className="bg-muted"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="businessName">Nama Usaha</Label>
              <Input
                id="businessName"
                value={editingMember?.businessName || ''}
                disabled
                className="bg-muted"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="memberIdNumber">Nomor ID Anggota</Label>
              <Input
                id="memberIdNumber"
                placeholder="Masukkan nomor ID anggota"
                value={memberIdNumber}
                onChange={(e) => setMemberIdNumber(e.target.value)}
                className="font-mono"
              />
              <p className="text-sm text-muted-foreground">
                Masukkan nomor ID unik untuk anggota ini
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleCloseDialog}
              disabled={isSaving}
            >
              Batal
            </Button>
            <Button
              onClick={handleSaveMemberId}
              disabled={isSaving || !memberIdNumber.trim()}
              className="bg-umkm-blue hover:bg-umkm-blue/90"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                'Simpan'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
