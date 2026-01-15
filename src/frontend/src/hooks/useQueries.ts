import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { MemberProfile, Event, Article, Photo, UserProfile, AdminSessionId, Edukasi, EdukasiId, ProdukAnggota, ProdukId, MemberId, PengajuanProduk, PengajuanProdukId } from '../backend';

// User Profile
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// Admin Session Management with retry logic and credentials
export function useStartAdminSession() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: { username: string; password: string }) => {
      if (!actor) throw new Error('Actor not available');
      
      // Implement retry logic with exponential backoff
      const maxRetries = 3;
      let lastError: Error | null = null;
      
      for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
          const sessionId = await actor.startAdminSession(credentials.username, credentials.password);
          return sessionId;
        } catch (error: any) {
          lastError = error;
          
          // Don't retry on authorization errors
          if (error.message && (
            error.message.includes('Unauthorized') || 
            error.message.includes('Invalid credentials') ||
            error.message.includes('Only admins') ||
            error.message.includes('permission')
          )) {
            throw error;
          }
          
          // Wait before retrying (exponential backoff)
          if (attempt < maxRetries - 1) {
            const delay = Math.min(1000 * Math.pow(2, attempt), 5000);
            await new Promise(resolve => setTimeout(resolve, delay));
          }
        }
      }
      
      throw lastError || new Error('Failed to start admin session after retries');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminStatus'] });
    },
    retry: false, // We handle retries manually
  });
}

export function useEndAdminSession() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (sessionId: AdminSessionId) => {
      if (!actor) throw new Error('Actor not available');
      return actor.endAdminSession(sessionId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminStatus'] });
    },
  });
}

export function useCheckAdminStatus() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['adminStatus'],
    queryFn: async () => {
      if (!actor) return false;
      try {
        return await actor.isCallerAdmin();
      } catch {
        return false;
      }
    },
    enabled: !!actor && !isFetching,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * Math.pow(2, attemptIndex), 3000),
  });
}

// Member Profiles
export function useGetAllMemberProfiles() {
  const { actor, isFetching } = useActor();

  return useQuery<MemberProfile[]>({
    queryKey: ['memberProfiles'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllMemberProfiles();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetMembersForAdmin() {
  const { actor, isFetching } = useActor();

  return useQuery<MemberProfile[]>({
    queryKey: ['membersForAdmin'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMembersForAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSearchMemberProfiles(searchTerm: string) {
  const { actor, isFetching } = useActor();

  return useQuery<MemberProfile[]>({
    queryKey: ['memberProfiles', 'search', searchTerm],
    queryFn: async () => {
      if (!actor || !searchTerm) return [];
      return actor.searchMemberProfilesByBusinessName(searchTerm);
    },
    enabled: !!actor && !isFetching && !!searchTerm,
  });
}

export function useRegisterMember() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      name: string;
      businessName: string;
      description: string;
      contact: string;
      category: string;
      products: string[];
      website: string | null;
      address: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.registerMember(
        data.name,
        data.businessName,
        data.description,
        data.contact,
        data.category,
        data.products,
        data.website,
        data.address
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['memberProfiles'] });
      queryClient.invalidateQueries({ queryKey: ['membersForAdmin'] });
    },
  });
}

export function useVerifyMember() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { memberId: MemberId; verified: boolean }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.verifyMember(data.memberId, data.verified);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['membersForAdmin'] });
      queryClient.invalidateQueries({ queryKey: ['memberProfiles'] });
    },
  });
}

export function useUpdateMemberIdNumber() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { memberId: MemberId; memberIdNumber: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateMemberIdNumber(data.memberId, data.memberIdNumber);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['membersForAdmin'] });
      queryClient.invalidateQueries({ queryKey: ['memberProfiles'] });
    },
  });
}

// Events
export function useGetUpcomingEvents() {
  const { actor, isFetching } = useActor();

  return useQuery<Event[]>({
    queryKey: ['events', 'upcoming'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getUpcomingEvents();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetPastEvents() {
  const { actor, isFetching } = useActor();

  return useQuery<Event[]>({
    queryKey: ['events', 'past'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPastEvents();
    },
    enabled: !!actor && !isFetching,
  });
}

// Articles
export function useGetAllArticles() {
  const { actor, isFetching } = useActor();

  return useQuery<Article[]>({
    queryKey: ['articles'],
    queryFn: async () => {
      if (!actor) return [];
      const articles = await actor.getAllArticles();
      return articles.sort((a, b) => Number(b.date - a.date));
    },
    enabled: !!actor && !isFetching,
  });
}

// Photos
export function useGetAllPhotos() {
  const { actor, isFetching } = useActor();

  return useQuery<Photo[]>({
    queryKey: ['photos'],
    queryFn: async () => {
      if (!actor) return [];
      const photos = await actor.getAllPhotos();
      return photos.sort((a, b) => Number(b.uploadDate - a.uploadDate));
    },
    enabled: !!actor && !isFetching,
  });
}

// Edukasi (Education Content)
export function useGetAllEdukasi() {
  const { actor, isFetching } = useActor();

  return useQuery<Edukasi[]>({
    queryKey: ['edukasi'],
    queryFn: async () => {
      if (!actor) return [];
      const edukasiList = await actor.getAllEdukasi();
      return edukasiList.sort((a, b) => Number(b.date - a.date));
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddEdukasi() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      title: string;
      content: string;
      author: string;
      image: string | null;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addEdukasi(data.title, data.content, data.author, data.image);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['edukasi'] });
    },
  });
}

export function useEditEdukasi() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      id: EdukasiId;
      title: string;
      content: string;
      author: string;
      image: string | null;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.editEdukasi(data.id, data.title, data.content, data.author, data.image);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['edukasi'] });
    },
  });
}

export function useDeleteEdukasi() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: EdukasiId) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteEdukasi(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['edukasi'] });
    },
  });
}

// Produk Anggota (Member Products)
export function useGetAllProdukAnggota() {
  const { actor, isFetching } = useActor();

  return useQuery<ProdukAnggota[]>({
    queryKey: ['produkAnggota'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllProdukAnggota();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddProdukAnggota() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      foto: string | null;
      kategori: string;
      namaUsaha: string;
      hubungiSelanjutnya: string | null;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addProdukAnggota(
        data.foto,
        data.kategori,
        data.namaUsaha,
        data.hubungiSelanjutnya
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['produkAnggota'] });
    },
  });
}

export function useEditProdukAnggota() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      id: ProdukId;
      foto: string | null;
      kategori: string;
      namaUsaha: string;
      hubungiSelanjutnya: string | null;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.editProdukAnggota(
        data.id,
        data.foto,
        data.kategori,
        data.namaUsaha,
        data.hubungiSelanjutnya
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['produkAnggota'] });
    },
  });
}

export function useDeleteProdukAnggota() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: ProdukId) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteProdukAnggota(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['produkAnggota'] });
    },
  });
}

// Pengajuan Produk (Product Submissions) with retry logic
export function useGetAllPengajuanProduk() {
  const { actor, isFetching } = useActor();

  return useQuery<PengajuanProduk[]>({
    queryKey: ['pengajuanProduk'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllPengajuanProduk();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddPengajuanProduk() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      foto: string | null;
      kategori: string;
      namaUsaha: string;
      hubungiSelanjutnya: string | null;
    }) => {
      if (!actor) throw new Error('Actor not available');
      
      // Implement retry logic with exponential backoff
      const maxRetries = 3;
      let lastError: Error | null = null;
      
      for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
          const result = await actor.addPengajuanProduk(
            data.foto,
            data.kategori,
            data.namaUsaha,
            data.hubungiSelanjutnya
          );
          return result;
        } catch (error: any) {
          lastError = error;
          
          // Don't retry on validation errors
          if (error.message && (
            error.message.includes('validation') ||
            error.message.includes('invalid') ||
            error.message.includes('required')
          )) {
            throw error;
          }
          
          // Wait before retrying (exponential backoff)
          if (attempt < maxRetries - 1) {
            const delay = Math.min(1000 * Math.pow(2, attempt), 5000);
            await new Promise(resolve => setTimeout(resolve, delay));
          }
        }
      }
      
      throw lastError || new Error('Failed to add product submission after retries');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pengajuanProduk'] });
    },
    retry: false, // We handle retries manually
  });
}

export function useApprovePengajuanProduk() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (pengajuanId: PengajuanProdukId) => {
      if (!actor) throw new Error('Actor not available');
      return actor.approvePengajuanProduk(pengajuanId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pengajuanProduk'] });
      queryClient.invalidateQueries({ queryKey: ['produkAnggota'] });
    },
  });
}

export function useRejectPengajuanProduk() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (pengajuanId: PengajuanProdukId) => {
      if (!actor) throw new Error('Actor not available');
      return actor.rejectPengajuanProduk(pengajuanId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pengajuanProduk'] });
    },
  });
}
