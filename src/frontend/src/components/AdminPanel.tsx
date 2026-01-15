import { LayoutDashboard, FileText, Image, Package, GraduationCap, Users, LogOut, ClipboardList } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';

interface AdminPanelProps {
  onNavigate: (section: string) => void;
}

export default function AdminPanel({ onNavigate }: AdminPanelProps) {
  const { clear } = useInternetIdentity();
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
  };

  const adminActions = [
    {
      id: 'manage-articles',
      label: 'Kelola Artikel',
      icon: FileText,
      onClick: () => {
        onNavigate('news');
      },
    },
    {
      id: 'manage-gallery',
      label: 'Kelola Galeri',
      icon: Image,
      onClick: () => {
        onNavigate('gallery');
      },
    },
    {
      id: 'manage-products',
      label: 'Kelola Produk Anggota',
      icon: Package,
      onClick: () => {
        onNavigate('products');
      },
    },
    {
      id: 'manage-education',
      label: 'Kelola Konten Edukasi',
      icon: GraduationCap,
      onClick: () => {
        onNavigate('education-category-menu');
      },
    },
    {
      id: 'manage-members',
      label: 'Kelola Anggota',
      icon: Users,
      onClick: () => {
        onNavigate('members-management');
      },
    },
    {
      id: 'manage-submissions',
      label: 'Kelola Pengajuan Produk',
      icon: ClipboardList,
      onClick: () => {
        onNavigate('submission-management');
      },
    },
  ];

  return (
    <div className="w-full bg-umkm-blue/10 border-b border-umkm-blue/20 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          {/* Admin Panel Title */}
          <div className="flex items-center gap-2 text-umkm-blue">
            <LayoutDashboard className="h-5 w-5" />
            <span className="font-semibold text-sm">Panel Admin</span>
          </div>

          {/* Admin Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 sm:ml-auto">
            {adminActions.map((action) => {
              const Icon = action.icon;
              return (
                <Button
                  key={action.id}
                  onClick={action.onClick}
                  variant="outline"
                  size="sm"
                  className="bg-white hover:bg-umkm-blue hover:text-white border-umkm-blue/30 text-umkm-blue transition-colors"
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {action.label}
                </Button>
              );
            })}
            
            {/* Logout Button */}
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="bg-umkm-red/10 hover:bg-umkm-red hover:text-white border-umkm-red/30 text-umkm-red transition-colors"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Keluar Admin
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
