import { Calendar, MapPin, Clock } from 'lucide-react';
import { useGetUpcomingEvents, useGetPastEvents } from '../hooks/useQueries';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function Events() {
  const { data: upcomingEvents = [], isLoading: upcomingLoading } = useGetUpcomingEvents();
  const { data: pastEvents = [], isLoading: pastLoading } = useGetPastEvents();

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">Acara & Kegiatan</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Ikuti berbagai acara, workshop, dan kegiatan yang kami selenggarakan untuk mengembangkan bisnis UMKM Anda
          </p>
        </div>

        {/* Events Tabs */}
        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="upcoming">Acara Mendatang</TabsTrigger>
            <TabsTrigger value="past">Acara Sebelumnya</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming">
            {upcomingLoading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Memuat acara...</p>
              </div>
            ) : upcomingEvents.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-xl text-muted-foreground">Belum ada acara mendatang</p>
                <p className="text-muted-foreground mt-2">Pantau terus untuk update acara terbaru</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingEvents.map((event) => (
                  <Card key={Number(event.id)} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <Badge className="bg-umkm-blue">Mendatang</Badge>
                      </div>
                      <CardTitle className="text-xl">{event.title}</CardTitle>
                      <CardDescription className="flex items-center text-sm mt-2">
                        <Calendar className="h-4 w-4 mr-2" />
                        {formatDate(event.date)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">{event.description}</p>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 mr-2 text-umkm-orange" />
                        {event.location}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="past">
            {pastLoading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Memuat acara...</p>
              </div>
            ) : pastEvents.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-xl text-muted-foreground">Belum ada acara sebelumnya</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pastEvents.map((event) => (
                  <Card key={Number(event.id)} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <Badge variant="secondary">Selesai</Badge>
                      </div>
                      <CardTitle className="text-xl">{event.title}</CardTitle>
                      <CardDescription className="flex items-center text-sm mt-2">
                        <Calendar className="h-4 w-4 mr-2" />
                        {formatDate(event.date)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">{event.description}</p>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 mr-2 text-umkm-orange" />
                        {event.location}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-r from-umkm-blue to-umkm-blue/80 rounded-lg p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Ingin Mengadakan Acara?</h2>
          <p className="text-lg mb-6 text-white/90">
            Hubungi kami untuk berkolaborasi dalam menyelenggarakan acara yang bermanfaat bagi komunitas UMKM
          </p>
        </div>
      </div>
    </section>
  );
}
