import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { MemberProfile, Event, Article, Photo, UserProfile, AdminSessionId } from '../backend';

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

// Admin Session Management
export function useStartAdminSession() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.startAdminSession();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminStatus'] });
    },
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
    retry: false,
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
