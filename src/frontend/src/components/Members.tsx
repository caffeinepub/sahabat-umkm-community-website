import { Search, MapPin, Phone, Globe, Package } from 'lucide-react';
import { useGetAllMemberProfiles } from '../hooks/useQueries';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function Members() {
  const { data: members = [], isLoading } = useGetAllMemberProfiles();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMembers = members.filter(
    (member) =>
      member.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">Direktori Anggota</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Temukan dan terhubung dengan pelaku UMKM di komunitas Sahabat UMKM
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Cari berdasarkan nama bisnis, kategori, atau deskripsi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12"
            />
          </div>
        </div>

        {/* Members Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Memuat anggota...</p>
          </div>
        ) : filteredMembers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground">
              {searchTerm ? 'Tidak ada anggota yang sesuai dengan pencarian' : 'Belum ada anggota terdaftar'}
            </p>
            <p className="text-muted-foreground mt-2">
              {!searchTerm && 'Jadilah yang pertama bergabung dengan komunitas kami'}
            </p>
          </div>
        ) : (
          <>
            <div className="text-center mb-6">
              <p className="text-muted-foreground">
                Menampilkan {filteredMembers.length} dari {members.length} anggota
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMembers.map((member) => (
                <Card key={Number(member.id)} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <Badge className="bg-umkm-blue">{member.category}</Badge>
                      {member.verified && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          Terverifikasi
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-xl">{member.businessName}</CardTitle>
                    <CardDescription className="text-sm">{member.name}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4 line-clamp-3">{member.description}</p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-start text-sm">
                        <MapPin className="h-4 w-4 mr-2 mt-0.5 text-umkm-orange flex-shrink-0" />
                        <span className="text-muted-foreground">{member.address}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Phone className="h-4 w-4 mr-2 text-umkm-orange flex-shrink-0" />
                        <span className="text-muted-foreground">{member.contact}</span>
                      </div>
                      {member.website && (
                        <div className="flex items-center text-sm">
                          <Globe className="h-4 w-4 mr-2 text-umkm-orange flex-shrink-0" />
                          <a
                            href={member.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-umkm-blue hover:underline truncate"
                          >
                            {member.website}
                          </a>
                        </div>
                      )}
                    </div>

                    {member.products.length > 0 && (
                      <div>
                        <div className="flex items-center text-sm font-semibold mb-2">
                          <Package className="h-4 w-4 mr-2 text-umkm-orange" />
                          Produk/Layanan:
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {member.products.slice(0, 3).map((product, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {product}
                            </Badge>
                          ))}
                          {member.products.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{member.products.length - 3} lainnya
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
