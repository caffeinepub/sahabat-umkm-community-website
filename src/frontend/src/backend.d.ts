import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Photo {
    id: PhotoId;
    url: string;
    title: string;
    category: string;
    uploadDate: bigint;
}
export interface UserProfile {
    name: string;
    email?: string;
    phone?: string;
}
export type ProdukId = bigint;
export type PhotoId = bigint;
export type EventId = bigint;
export interface Article {
    id: ArticleId;
    title: string;
    content: string;
    date: bigint;
    author: string;
}
export interface Event {
    id: EventId;
    title: string;
    date: bigint;
    description: string;
    isUpcoming: boolean;
    location: string;
}
export type MemberId = bigint;
export type AdminSessionId = bigint;
export type ArticleId = bigint;
export interface MemberProfile {
    id: MemberId;
    verified: boolean;
    contact: string;
    userId: Principal;
    name: string;
    businessName: string;
    description: string;
    website?: string;
    address: string;
    category: string;
    products: Array<string>;
    memberIdNumber?: MemberIdNumber;
}
export interface PengajuanProduk {
    id: PengajuanProdukId;
    namaUsaha: string;
    foto?: string;
    kategori: string;
    hubungiSelanjutnya?: string;
}
export interface Edukasi {
    id: EdukasiId;
    title: string;
    content: string;
    date: bigint;
    author: string;
    image?: string;
}
export type MemberIdNumber = string;
export type PengajuanProdukId = bigint;
export type EdukasiId = bigint;
export interface ProdukAnggota {
    id: ProdukId;
    namaUsaha: string;
    foto?: string;
    kategori: string;
    hubungiSelanjutnya?: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addArticle(title: string, content: string, author: string): Promise<ArticleId>;
    addEdukasi(title: string, content: string, author: string, image: string | null): Promise<EdukasiId>;
    addEvent(title: string, description: string, location: string, date: bigint, isUpcoming: boolean): Promise<EventId>;
    addPengajuanProduk(foto: string | null, kategori: string, namaUsaha: string, hubungiSelanjutnya: string | null): Promise<PengajuanProdukId>;
    addPhoto(title: string, category: string, url: string): Promise<PhotoId>;
    addProdukAnggota(foto: string | null, kategori: string, namaUsaha: string, hubungiSelanjutnya: string | null): Promise<ProdukId>;
    approvePengajuanProduk(pengajuanId: PengajuanProdukId): Promise<ProdukId>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteEdukasi(id: EdukasiId): Promise<void>;
    deleteProdukAnggota(id: ProdukId): Promise<void>;
    editEdukasi(id: EdukasiId, title: string, content: string, author: string, image: string | null): Promise<void>;
    editProdukAnggota(id: ProdukId, foto: string | null, kategori: string, namaUsaha: string, hubungiSelanjutnya: string | null): Promise<void>;
    endAdminSession(sessionId: AdminSessionId): Promise<void>;
    getAllArticles(): Promise<Array<Article>>;
    getAllEdukasi(): Promise<Array<Edukasi>>;
    getAllMemberProfiles(): Promise<Array<MemberProfile>>;
    getAllPengajuanProduk(): Promise<Array<PengajuanProduk>>;
    getAllPhotos(): Promise<Array<Photo>>;
    getAllProdukAnggota(): Promise<Array<ProdukAnggota>>;
    getAnggotaListByCategorySorted(category: string): Promise<Array<MemberProfile>>;
    getArticlesByDate(): Promise<Array<Article>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getEdukasiByDate(): Promise<Array<Edukasi>>;
    getEventsByDate(): Promise<Array<Event>>;
    getEventsByLocation(location: string): Promise<Array<Event>>;
    getMemberProfilesByBusinessName(): Promise<Array<MemberProfile>>;
    getMemberProfilesByCategory(category: string): Promise<Array<MemberProfile>>;
    getMemberProfilesByCategorySorted(): Promise<Array<MemberProfile>>;
    getMembersForAdmin(): Promise<Array<MemberProfile>>;
    getPastEvents(): Promise<Array<Event>>;
    getPengajuanByKategori(category: string): Promise<Array<PengajuanProduk>>;
    getPengajuanByKategoriSorted(): Promise<Array<PengajuanProduk>>;
    getPengajuanByNamaUsahaSorted(): Promise<Array<PengajuanProduk>>;
    getPhotosByCategory(category: string): Promise<Array<Photo>>;
    getPhotosByUploadDate(): Promise<Array<Photo>>;
    getProdukByKategori(category: string): Promise<Array<ProdukAnggota>>;
    getProdukByKategoriSorted(): Promise<Array<ProdukAnggota>>;
    getProdukByNamaUsahaSorted(): Promise<Array<ProdukAnggota>>;
    getSortedAnggotaList(): Promise<Array<MemberProfile>>;
    getUpcomingEvents(): Promise<Array<Event>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    registerMember(name: string, businessName: string, description: string, contact: string, category: string, products: Array<string>, website: string | null, address: string): Promise<MemberId>;
    rejectPengajuanProduk(pengajuanId: PengajuanProdukId): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    searchAnggota(searchTerm: string): Promise<Array<MemberProfile>>;
    searchMemberProfilesByBusinessName(searchTerm: string): Promise<Array<MemberProfile>>;
    startAdminSession(username: string, password: string): Promise<AdminSessionId>;
    updateMemberIdNumber(memberId: MemberId, memberIdNumber: string): Promise<void>;
    validateAdminSession(sessionId: AdminSessionId): Promise<boolean>;
    verifyMember(memberId: MemberId, verified: boolean): Promise<void>;
}
