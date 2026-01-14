import { Calendar, User, ArrowRight } from 'lucide-react';
import { useGetAllArticles } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { Article } from '../backend';

export default function News() {
  const { data: articles = [], isLoading } = useGetAllArticles();
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

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
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">Berita & Artikel</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Update terbaru, tips bisnis, dan kisah sukses dari komunitas Sahabat UMKM
          </p>
        </div>

        {/* Articles Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Memuat artikel...</p>
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground">Belum ada artikel tersedia</p>
            <p className="text-muted-foreground mt-2">Pantau terus untuk update terbaru</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <Card key={Number(article.id)} className="hover:shadow-lg transition-shadow flex flex-col">
                <CardHeader>
                  <CardTitle className="text-xl line-clamp-2">{article.title}</CardTitle>
                  <CardDescription className="flex items-center justify-between text-sm mt-2">
                    <span className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      {formatDate(article.date)}
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <p className="text-muted-foreground line-clamp-3 mb-4 flex-1">
                    {article.content}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <User className="h-4 w-4 mr-2 text-umkm-orange" />
                      {article.author}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedArticle(article)}
                      className="text-umkm-blue hover:text-umkm-blue/80"
                    >
                      Baca
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Article Detail Dialog */}
        <Dialog open={!!selectedArticle} onOpenChange={() => setSelectedArticle(null)}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            {selectedArticle && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-2xl">{selectedArticle.title}</DialogTitle>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2">
                    <span className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      {formatDate(selectedArticle.date)}
                    </span>
                    <span className="flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      {selectedArticle.author}
                    </span>
                  </div>
                </DialogHeader>
                <div className="prose prose-sm max-w-none mt-4">
                  <p className="whitespace-pre-wrap text-foreground">{selectedArticle.content}</p>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}
