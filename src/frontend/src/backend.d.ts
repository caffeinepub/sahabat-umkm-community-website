import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface UserProfile {
    name: string;
    email?: string;
    phone?: string;
}
export interface Photo {
    id: PhotoId;
    url: string;
    title: string;
    category: string;
    uploadDate: bigint;
}
export type PhotoId = bigint;
export type EventId = bigint;
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
}
export interface Article {
    id: ArticleId;
    title: string;
    content: string;
    date: bigint;
    author: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addArticle(title: string, content: string, author: string): Promise<ArticleId>;
    addEvent(title: string, description: string, location: string, date: bigint, isUpcoming: boolean): Promise<EventId>;
    addPhoto(title: string, category: string, url: string): Promise<PhotoId>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    endAdminSession(sessionId: AdminSessionId): Promise<void>;
    getAllArticles(): Promise<Array<Article>>;
    getAllMemberProfiles(): Promise<Array<MemberProfile>>;
    getAllPhotos(): Promise<Array<Photo>>;
    getArticlesByDate(): Promise<Array<Article>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getEventsByDate(): Promise<Array<Event>>;
    getEventsByLocation(location: string): Promise<Array<Event>>;
    getMemberProfilesByBusinessName(): Promise<Array<MemberProfile>>;
    getMemberProfilesByCategory(category: string): Promise<Array<MemberProfile>>;
    getMemberProfilesByCategorySorted(): Promise<Array<MemberProfile>>;
    getPastEvents(): Promise<Array<Event>>;
    getPhotosByCategory(category: string): Promise<Array<Photo>>;
    getPhotosByUploadDate(): Promise<Array<Photo>>;
    getUpcomingEvents(): Promise<Array<Event>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    registerMember(name: string, businessName: string, description: string, contact: string, category: string, products: Array<string>, website: string | null, address: string): Promise<MemberId>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    searchMemberProfilesByBusinessName(searchTerm: string): Promise<Array<MemberProfile>>;
    startAdminSession(): Promise<AdminSessionId>;
    validateAdminSession(sessionId: AdminSessionId): Promise<boolean>;
}
