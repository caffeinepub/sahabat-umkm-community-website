import { Target, Eye, Award, Users } from 'lucide-react';

export default function About() {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">Tentang Kami</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Sahabat UMKM adalah komunitas yang berdedikasi untuk mendukung dan mengembangkan usaha mikro, kecil, dan menengah di Indonesia
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-card rounded-lg p-8 shadow-lg border border-border">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-umkm-blue/10 rounded-lg mr-4">
                <Target className="h-8 w-8 text-umkm-blue" />
              </div>
              <h2 className="text-3xl font-bold text-foreground">Misi Kami</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Memberdayakan pelaku UMKM melalui pendampingan, pelatihan, dan akses ke jaringan bisnis yang luas. Kami berkomitmen untuk menciptakan ekosistem yang mendukung pertumbuhan dan keberlanjutan usaha kecil dan menengah.
            </p>
          </div>

          <div className="bg-card rounded-lg p-8 shadow-lg border border-border">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-umkm-orange/10 rounded-lg mr-4">
                <Eye className="h-8 w-8 text-umkm-orange" />
              </div>
              <h2 className="text-3xl font-bold text-foreground">Visi Kami</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Menjadi komunitas UMKM terdepan yang menginspirasi dan membawa perubahan positif bagi perekonomian Indonesia. Kami percaya bahwa UMKM adalah tulang punggung ekonomi yang perlu terus dikembangkan.
            </p>
          </div>
        </div>

        {/* Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8 text-foreground">Nilai-Nilai Kami</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-card rounded-lg p-6 shadow-md border border-border text-center">
              <div className="inline-flex p-4 bg-umkm-blue/10 rounded-full mb-4">
                <Award className="h-10 w-10 text-umkm-blue" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground">Profesionalisme</h3>
              <p className="text-muted-foreground">
                Kami berkomitmen untuk memberikan layanan terbaik dengan standar profesional yang tinggi
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 shadow-md border border-border text-center">
              <div className="inline-flex p-4 bg-umkm-orange/10 rounded-full mb-4">
                <Users className="h-10 w-10 text-umkm-orange" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground">Kolaborasi</h3>
              <p className="text-muted-foreground">
                Membangun jaringan yang kuat melalui kerjasama dan saling mendukung antar anggota
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 shadow-md border border-border text-center">
              <div className="inline-flex p-4 bg-umkm-red/10 rounded-full mb-4">
                <Target className="h-10 w-10 text-umkm-red" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground">Inovasi</h3>
              <p className="text-muted-foreground">
                Mendorong kreativitas dan inovasi untuk menghadapi tantangan bisnis modern
              </p>
            </div>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <img
            src="/assets/generated/umkm-storefront.dim_800x600.jpg"
            alt="UMKM Storefront"
            className="w-full h-64 object-cover rounded-lg shadow-lg"
            loading="lazy"
            decoding="async"
          />
          <img
            src="/assets/generated/workspace.dim_800x600.jpg"
            alt="Workspace"
            className="w-full h-64 object-cover rounded-lg shadow-lg"
            loading="lazy"
            decoding="async"
          />
          <img
            src="/assets/generated/marketplace.dim_800x600.jpg"
            alt="Marketplace"
            className="w-full h-64 object-cover rounded-lg shadow-lg"
            loading="lazy"
            decoding="async"
          />
        </div>

        {/* Contact Info */}
        <div className="mt-16 bg-card rounded-lg p-8 shadow-lg border border-border">
          <h2 className="text-3xl font-bold mb-6 text-center text-foreground">Hubungi Kami</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <h3 className="font-semibold mb-2 text-foreground">Alamat</h3>
              <p className="text-muted-foreground">BPC Karawang, Jawa Barat, Indonesia</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-foreground">Email</h3>
              <p className="text-muted-foreground">info@sahabatumkm.id</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-foreground">Telepon</h3>
              <p className="text-muted-foreground">+62 xxx xxxx xxxx</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
