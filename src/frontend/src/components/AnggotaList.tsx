import { useState, useMemo } from 'react';
import { Search, Users, Building2, Tag } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useGetAllMemberProfiles } from '../hooks/useQueries';

export default function AnggotaList() {
  const { data: members = [], isLoading } = useGetAllMemberProfiles();
  const [searchTerm, setSearchTerm] = useState('');

  // Filter members based on search term
  const filteredMembers = useMemo(() => {
    if (!searchTerm.trim()) {
      return members;
    }

    const lowerSearchTerm = searchTerm.toLowerCase();
    return members.filter((member) => {
      return (
        member.name.toLowerCase().includes(lowerSearchTerm) ||
        member.businessName.toLowerCase().includes(lowerSearchTerm) ||
        member.category.toLowerCase().includes(lowerSearchTerm)
      );
    });
  }, [members, searchTerm]);

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Daftar Anggota Komunitas Sahabat UMKM Karawang
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Temukan anggota komunitas kami berdasarkan nama, kategori usaha, atau nama usaha
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Cari berdasarkan nama, kategori, atau nama usaha..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 text-base"
            />
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-umkm-blue"></div>
            <p className="mt-4 text-muted-foreground">Memuat data anggota...</p>
          </div>
        )}

        {/* Results Count */}
        {!isLoading && (
          <div className="mb-6 text-center">
            <p className="text-muted-foreground">
              Menampilkan <span className="font-semibold text-foreground">{filteredMembers.length}</span> dari{' '}
              <span className="font-semibold text-foreground">{members.length}</span> anggota
            </p>
          </div>
        )}

        {/* Members Grid */}
        {!isLoading && filteredMembers.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMembers.map((member) => (
              <Card key={member.id.toString()} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-start justify-between">
                    <span className="text-lg">{member.name}</span>
                    {member.verified && (
                      <Badge variant="default" className="bg-green-600 hover:bg-green-700">
                        Terverifikasi
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <Building2 className="h-5 w-5 text-umkm-blue mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-muted-foreground">Nama Usaha</p>
                      <p className="font-medium text-foreground">{member.businessName}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2">
                    <Tag className="h-5 w-5 text-umkm-blue mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-muted-foreground">Kategori</p>
                      <Badge variant="outline" className="mt-1">
                        {member.category}
                      </Badge>
                    </div>
                  </div>

                  {member.description && (
                    <div className="pt-2 border-t border-border">
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {member.description}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* No Results */}
        {!isLoading && filteredMembers.length === 0 && members.length > 0 && (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Tidak ada hasil ditemukan
            </h3>
            <p className="text-muted-foreground">
              Coba ubah kata kunci pencarian Anda
            </p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && members.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Belum ada anggota terdaftar
            </h3>
            <p className="text-muted-foreground">
              Anggota yang terdaftar akan muncul di sini
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
