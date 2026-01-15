import Map "mo:core/Map";
import Array "mo:core/Array";
import List "mo:core/List";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Time "mo:core/Time";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import Iter "mo:core/Iter";
import Char "mo:core/Char";
import Runtime "mo:core/Runtime";

import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import MixinStorage "blob-storage/Mixin";

actor {
  // Types
  type MemberId = Nat;
  type EventId = Nat;
  type ArticleId = Nat;
  type PhotoId = Nat;
  type EdukasiId = Nat;
  type ProdukId = Nat;
  type AdminSessionId = Nat;
  type PengajuanProdukId = Nat;
  type MemberIdNumber = Text;

  module MemberProfile {
    public func compareByBusinessName(a : MemberProfile, b : MemberProfile) : Order.Order {
      Text.compare(a.businessName, b.businessName);
    };

    public func compareByCategory(a : MemberProfile, b : MemberProfile) : Order.Order {
      Text.compare(a.category, b.category);
    };

    public func containsSearchTerm(profile : MemberProfile, searchTerm : Text) : Bool {
      profile.name.contains(#text searchTerm) or
      profile.businessName.contains(#text searchTerm) or
      profile.category.contains(#text searchTerm);
    };
  };

  module Event {
    public func compareByDate(a : Event, b : Event) : Order.Order {
      Nat.compare(a.date, b.date);
    };
  };

  module Article {
    public func compareByDate(a : Article, b : Article) : Order.Order {
      Nat.compare(a.date, b.date);
    };
  };

  module Photo {
    public func compareByUploadDate(a : Photo, b : Photo) : Order.Order {
      Nat.compare(a.uploadDate, b.uploadDate);
    };
  };

  module Edukasi {
    public func compareByDate(a : Edukasi, b : Edukasi) : Order.Order {
      Nat.compare(a.date, b.date);
    };
  };

  module ProdukAnggota {
    public func compareByNamaUsaha(a : ProdukAnggota, b : ProdukAnggota) : Order.Order {
      Text.compare(a.namaUsaha, b.namaUsaha);
    };

    public func compareByKategori(a : ProdukAnggota, b : ProdukAnggota) : Order.Order {
      Text.compare(a.kategori, b.kategori);
    };
  };

  module PengajuanProduk {
    public func compareByNamaUsaha(a : PengajuanProduk, b : PengajuanProduk) : Order.Order {
      Text.compare(a.namaUsaha, b.namaUsaha);
    };

    public func compareByKategori(a : PengajuanProduk, b : PengajuanProduk) : Order.Order {
      Text.compare(a.kategori, b.kategori);
    };
  };

  type MemberProfile = {
    id : MemberId;
    userId : Principal;
    name : Text;
    businessName : Text;
    description : Text;
    contact : Text;
    category : Text;
    products : [Text];
    website : ?Text;
    address : Text;
    verified : Bool;
    memberIdNumber : ?MemberIdNumber;
  };

  type ProdukAnggota = {
    id : ProdukId;
    foto : ?Text;
    kategori : Text;
    namaUsaha : Text;
    hubungiSelanjutnya : ?Text;
  };

  type PengajuanProduk = {
    id : PengajuanProdukId;
    foto : ?Text;
    kategori : Text;
    namaUsaha : Text;
    hubungiSelanjutnya : ?Text;
  };

  type Event = {
    id : EventId;
    title : Text;
    description : Text;
    location : Text;
    date : Nat;
    isUpcoming : Bool;
  };

  type Article = {
    id : ArticleId;
    title : Text;
    content : Text;
    author : Text;
    date : Nat;
  };

  type Photo = {
    id : PhotoId;
    title : Text;
    category : Text;
    url : Text;
    uploadDate : Nat;
  };

  type Edukasi = {
    id : EdukasiId;
    title : Text;
    content : Text;
    author : Text;
    date : Nat;
    image : ?Text;
  };

  type AdminSession = {
    id : AdminSessionId;
    principal : Principal;
    isActive : Bool;
    lastActivity : Time.Time;
  };

  type AdminCredentials = {
    username : Text;
    passwordHash : Text;
  };

  public type UserProfile = {
    name : Text;
    email : ?Text;
    phone : ?Text;
  };

  let memberProfiles = Map.empty<MemberId, MemberProfile>();
  let events = Map.empty<EventId, Event>();
  let articles = Map.empty<ArticleId, Article>();
  let photos = Map.empty<PhotoId, Photo>();
  let edukasiContent = Map.empty<EdukasiId, Edukasi>();
  let produkAnggota = Map.empty<ProdukId, ProdukAnggota>();
  let pengajuanProduk = Map.empty<PengajuanProdukId, PengajuanProduk>();
  let adminSessions = Map.empty<AdminSessionId, AdminSession>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  let adminCredentials = Map.empty<Text, AdminCredentials>();

  var nextMemberId = 1;
  var nextEventId = 1;
  var nextArticleId = 1;
  var nextPhotoId = 1;
  var nextProdukId = 1;
  var nextPengajuanProdukId = 1;
  var nextSessionId = 1;
  var nextEdukasiId = 1;

  include MixinStorage();

  // Authorization
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Simple hash function for password (in production, use proper cryptographic hash)
  private func simpleHash(text : Text) : Text {
    var hash : Nat = 0;
    for (char in text.chars()) {
      hash := (hash * 31 + Nat32.toNat(char.toNat32())) % 1000000007;
    };
    hash.toText();
  };

  // Initialize default admin credentials (should be changed in production)
  private func initializeDefaultAdmin() {
    let defaultAdmin : AdminCredentials = {
      username = "admin";
      passwordHash = simpleHash("admin123"); // Change this in production
    };
    adminCredentials.add("admin", defaultAdmin);
  };

  // Call initialization
  initializeDefaultAdmin();

  // Admin Session Management with credential validation
  public shared ({ caller }) func startAdminSession(username : Text, password : Text) : async AdminSessionId {
    // Validate credentials first
    switch (adminCredentials.get(username)) {
      case (null) {
        Runtime.trap("Unauthorized: Invalid credentials");
      };
      case (?creds) {
        if (creds.passwordHash != simpleHash(password)) {
          Runtime.trap("Unauthorized: Invalid credentials");
        };
      };
    };

    // Grant admin role to the caller if credentials are valid
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      AccessControl.assignRole(accessControlState, caller, caller, #admin);
    };

    // Create session
    let sessionId = nextSessionId;
    nextSessionId += 1;

    let session : AdminSession = {
      id = sessionId;
      principal = caller;
      isActive = true;
      lastActivity = Time.now();
    };

    adminSessions.add(sessionId, session);
    sessionId;
  };

  public shared ({ caller }) func endAdminSession(sessionId : AdminSessionId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can end a session");
    };

    let session = switch (adminSessions.get(sessionId)) {
      case (null) { Runtime.trap("Session not found") };
      case (?s) { s };
    };

    // Verify the session belongs to the caller
    if (session.principal != caller) {
      Runtime.trap("Unauthorized: Can only end your own session");
    };

    if (not session.isActive) {
      Runtime.trap("Session already inactive");
    };

    let updatedSession : AdminSession = {
      session with isActive = false;
      lastActivity = Time.now();
    };

    adminSessions.add(sessionId, updatedSession);
  };

  public query ({ caller }) func validateAdminSession(sessionId : AdminSessionId) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can validate sessions");
    };

    let session = switch (adminSessions.get(sessionId)) {
      case (null) { return false };
      case (?s) { s };
    };

    // Verify the session belongs to the caller
    if (session.principal != caller) {
      return false;
    };

    session.isActive;
  };

  // User Profile Management (required by frontend)
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Member Directory - Public registration (no auth required for guests to register)
  public shared ({ caller }) func registerMember(name : Text, businessName : Text, description : Text, contact : Text, category : Text, products : [Text], website : ?Text, address : Text) : async MemberId {
    // No authorization check - public registration is open to all including guests
    let memberId = nextMemberId;
    nextMemberId += 1;

    let profile : MemberProfile = {
      id = memberId;
      userId = caller;
      name;
      businessName;
      description;
      contact;
      category;
      products;
      website;
      address;
      verified = false;
      memberIdNumber = null;
    };

    memberProfiles.add(memberId, profile);
    memberId;
  };

  public query ({ caller = _ }) func getAllMemberProfiles() : async [MemberProfile] {
    // Public read access - no authorization required
    memberProfiles.values().toArray();
  };

  public query ({ caller = _ }) func getMemberProfilesByCategory(category : Text) : async [MemberProfile] {
    // Public read access - no authorization required
    memberProfiles.values().toArray().filter(func(p) { p.category == category });
  };

  public query ({ caller = _ }) func searchMemberProfilesByBusinessName(searchTerm : Text) : async [MemberProfile] {
    // Public read access - no authorization required
    memberProfiles.values().toArray().filter(func(p) { p.businessName.contains(#text searchTerm) });
  };

  // Anggota Menu & Search Functionality
  public query ({ caller = _ }) func searchAnggota(searchTerm : Text) : async [MemberProfile] {
    // Public read access - no authorization required
    if (searchTerm.trim(#char ' ') == "") {
      return memberProfiles.values().toArray();
    };

    let filteredProfiles = memberProfiles.values().toArray().filter(
      func(profile) { MemberProfile.containsSearchTerm(profile, searchTerm) }
    );

    filteredProfiles.sort(MemberProfile.compareByBusinessName);
  };

  public query ({ caller = _ }) func getAnggotaListByCategorySorted(category : Text) : async [MemberProfile] {
    // Public read access - no authorization required
    memberProfiles.values().toArray().filter(func(p) { p.category == category }).sort(MemberProfile.compareByBusinessName);
  };

  public query ({ caller = _ }) func getSortedAnggotaList() : async [MemberProfile] {
    // Public read access - no authorization required
    memberProfiles.values().toArray().sort(MemberProfile.compareByBusinessName);
  };

  // Produk Anggota Management (Admin only for management)
  public shared ({ caller }) func addProdukAnggota(foto : ?Text, kategori : Text, namaUsaha : Text, hubungiSelanjutnya : ?Text) : async ProdukId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add member products");
    };

    let produkId = nextProdukId;
    nextProdukId += 1;

    let produk : ProdukAnggota = {
      id = produkId;
      foto;
      kategori;
      namaUsaha;
      hubungiSelanjutnya;
    };

    produkAnggota.add(produkId, produk);
    produkId;
  };

  public shared ({ caller }) func editProdukAnggota(id : ProdukId, foto : ?Text, kategori : Text, namaUsaha : Text, hubungiSelanjutnya : ?Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can edit member products");
    };

    switch (produkAnggota.get(id)) {
      case (null) { Runtime.trap("Product not found") };
      case (?_) {
        let updatedProduk : ProdukAnggota = {
          id;
          foto;
          kategori;
          namaUsaha;
          hubungiSelanjutnya;
        };
        produkAnggota.add(id, updatedProduk);
      };
    };
  };

  public shared ({ caller }) func deleteProdukAnggota(id : ProdukId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete member products");
    };

    switch (produkAnggota.get(id)) {
      case (null) { Runtime.trap("Product not found") };
      case (?_) { produkAnggota.remove(id) };
    };
  };

  public query ({ caller = _ }) func getAllProdukAnggota() : async [ProdukAnggota] {
    // Public read access - no authorization required
    produkAnggota.values().toArray();
  };

  public query ({ caller = _ }) func getProdukByKategoriSorted() : async [ProdukAnggota] {
    // Public read access - no authorization required
    produkAnggota.values().toArray().sort(ProdukAnggota.compareByKategori);
  };

  public query ({ caller = _ }) func getProdukByNamaUsahaSorted() : async [ProdukAnggota] {
    // Public read access - no authorization required
    produkAnggota.values().toArray().sort(ProdukAnggota.compareByNamaUsaha);
  };

  public query ({ caller = _ }) func getProdukByKategori(category : Text) : async [ProdukAnggota] {
    // Public read access - no authorization required
    produkAnggota.values().toArray().filter(func(p) { p.kategori == category });
  };

  // Pengajuan Produk Management - Public submission, admin-only review
  public shared ({ caller }) func addPengajuanProduk(foto : ?Text, kategori : Text, namaUsaha : Text, hubungiSelanjutnya : ?Text) : async PengajuanProdukId {
    // No authorization check - public submission is open to all including guests
    let pengajuanId = nextPengajuanProdukId;
    nextPengajuanProdukId += 1;

    let pengajuan : PengajuanProduk = {
      id = pengajuanId;
      foto;
      kategori;
      namaUsaha;
      hubungiSelanjutnya;
    };

    pengajuanProduk.add(pengajuanId, pengajuan);
    pengajuanId;
  };

  public shared ({ caller }) func approvePengajuanProduk(pengajuanId : PengajuanProdukId) : async ProdukId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can approve product submissions");
    };

    switch (pengajuanProduk.get(pengajuanId)) {
      case (null) { Runtime.trap("Submission not found") };
      case (?pengajuan) {
        let produkId = nextProdukId;
        nextProdukId += 1;

        let produk : ProdukAnggota = {
          id = produkId;
          foto = pengajuan.foto;
          kategori = pengajuan.kategori;
          namaUsaha = pengajuan.namaUsaha;
          hubungiSelanjutnya = pengajuan.hubungiSelanjutnya;
        };

        produkAnggota.add(produkId, produk);
        pengajuanProduk.remove(pengajuanId);
        produkId;
      };
    };
  };

  public shared ({ caller }) func rejectPengajuanProduk(pengajuanId : PengajuanProdukId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can reject product submissions");
    };

    switch (pengajuanProduk.get(pengajuanId)) {
      case (null) { Runtime.trap("Submission not found") };
      case (?_) { pengajuanProduk.remove(pengajuanId) };
    };
  };

  public query ({ caller }) func getAllPengajuanProduk() : async [PengajuanProduk] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view product submissions");
    };
    pengajuanProduk.values().toArray();
  };

  public query ({ caller }) func getPengajuanByKategoriSorted() : async [PengajuanProduk] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view product submissions");
    };
    pengajuanProduk.values().toArray().sort(PengajuanProduk.compareByKategori);
  };

  public query ({ caller }) func getPengajuanByNamaUsahaSorted() : async [PengajuanProduk] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view product submissions");
    };
    pengajuanProduk.values().toArray().sort(PengajuanProduk.compareByNamaUsaha);
  };

  public query ({ caller }) func getPengajuanByKategori(category : Text) : async [PengajuanProduk] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view product submissions");
    };
    pengajuanProduk.values().toArray().filter(func(p) { p.kategori == category });
  };

  // Event Management - Admin only for write, public for read
  public shared ({ caller }) func addEvent(title : Text, description : Text, location : Text, date : Nat, isUpcoming : Bool) : async EventId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add events");
    };

    let eventId = nextEventId;
    nextEventId += 1;

    let event : Event = {
      id = eventId;
      title;
      description;
      location;
      date;
      isUpcoming;
    };

    events.add(eventId, event);
    eventId;
  };

  public query ({ caller = _ }) func getUpcomingEvents() : async [Event] {
    // Public read access - no authorization required
    let upcomingEvents = List.empty<Event>();
    for (event in events.values()) {
      if (event.isUpcoming) {
        upcomingEvents.add(event);
      };
    };
    upcomingEvents.toArray();
  };

  public query ({ caller = _ }) func getPastEvents() : async [Event] {
    // Public read access - no authorization required
    let pastEvents = List.empty<Event>();
    for (event in events.values()) {
      if (not event.isUpcoming) {
        pastEvents.add(event);
      };
    };
    pastEvents.toArray();
  };

  public query ({ caller = _ }) func getEventsByLocation(location : Text) : async [Event] {
    // Public read access - no authorization required
    events.values().toArray().filter(func(e) { e.location == location });
  };

  // News and Articles - Admin only for write, public for read
  public shared ({ caller }) func addArticle(title : Text, content : Text, author : Text) : async ArticleId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add articles");
    };

    let articleId = nextArticleId;
    nextArticleId += 1;

    let article : Article = {
      id = articleId;
      title;
      content;
      author;
      date = Int.abs(Time.now());
    };

    articles.add(articleId, article);
    articleId;
  };

  public query ({ caller = _ }) func getAllArticles() : async [Article] {
    // Public read access - no authorization required
    articles.values().toArray();
  };

  // Photo Gallery - Admin only for write, public for read
  public shared ({ caller }) func addPhoto(title : Text, category : Text, url : Text) : async PhotoId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add photos");
    };

    let photoId = nextPhotoId;
    nextPhotoId += 1;

    let photo : Photo = {
      id = photoId;
      title;
      category;
      url;
      uploadDate = Int.abs(Time.now());
    };

    photos.add(photoId, photo);
    photoId;
  };

  public query ({ caller = _ }) func getAllPhotos() : async [Photo] {
    // Public read access - no authorization required
    photos.values().toArray();
  };

  public query ({ caller = _ }) func getPhotosByCategory(category : Text) : async [Photo] {
    // Public read access - no authorization required
    photos.values().toArray().filter(func(p) { p.category == category });
  };

  // Edukasi Content Management - Admin only for write, public for read
  public shared ({ caller }) func addEdukasi(title : Text, content : Text, author : Text, image : ?Text) : async EdukasiId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add educational content");
    };

    let edukasiId = nextEdukasiId;
    nextEdukasiId += 1;

    let edukasi : Edukasi = {
      id = edukasiId;
      title;
      content;
      author;
      date = Int.abs(Time.now());
      image;
    };

    edukasiContent.add(edukasiId, edukasi);
    edukasiId;
  };

  public shared ({ caller }) func editEdukasi(id : EdukasiId, title : Text, content : Text, author : Text, image : ?Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can edit educational content");
    };

    switch (edukasiContent.get(id)) {
      case (null) { Runtime.trap("Content not found") };
      case (?_) {
        let updatedEdukasi : Edukasi = {
          id;
          title;
          content;
          author;
          date = Int.abs(Time.now());
          image;
        };
        edukasiContent.add(id, updatedEdukasi);
      };
    };
  };

  public shared ({ caller }) func deleteEdukasi(id : EdukasiId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete educational content");
    };

    switch (edukasiContent.get(id)) {
      case (null) { Runtime.trap("Content not found") };
      case (?_) { edukasiContent.remove(id) };
    };
  };

  public query ({ caller = _ }) func getAllEdukasi() : async [Edukasi] {
    // Public read access - no authorization required
    edukasiContent.values().toArray();
  };

  // Member Verification Management - Admin only
  public shared ({ caller }) func verifyMember(memberId : MemberId, verified : Bool) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can verify members");
    };

    switch (memberProfiles.get(memberId)) {
      case (null) { Runtime.trap("Member not found") };
      case (?profile) {
        let updatedProfile : MemberProfile = {
          profile with verified;
        };
        memberProfiles.add(memberId, updatedProfile);
      };
    };
  };

  // Update Member ID Number - Admin only
  public shared ({ caller }) func updateMemberIdNumber(memberId : MemberId, memberIdNumber : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update member ID numbers");
    };

    switch (memberProfiles.get(memberId)) {
      case (null) { Runtime.trap("Member not found") };
      case (?profile) {
        let updatedProfile : MemberProfile = {
          profile with memberIdNumber = ?memberIdNumber;
        };
        memberProfiles.add(memberId, updatedProfile);
      };
    };
  };

  // Member Management for Admin - Admin only
  public query ({ caller }) func getMembersForAdmin() : async [MemberProfile] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view member management");
    };
    memberProfiles.values().toArray();
  };

  // Sort Queries - Public read access
  public query ({ caller = _ }) func getMemberProfilesByBusinessName() : async [MemberProfile] {
    // Public read access - no authorization required
    memberProfiles.values().toArray().sort(MemberProfile.compareByBusinessName);
  };

  public query ({ caller = _ }) func getMemberProfilesByCategorySorted() : async [MemberProfile] {
    // Public read access - no authorization required
    memberProfiles.values().toArray().sort(MemberProfile.compareByCategory);
  };

  public query ({ caller = _ }) func getEventsByDate() : async [Event] {
    // Public read access - no authorization required
    events.values().toArray().sort(Event.compareByDate);
  };

  public query ({ caller = _ }) func getArticlesByDate() : async [Article] {
    // Public read access - no authorization required
    articles.values().toArray().sort(Article.compareByDate);
  };

  public query ({ caller = _ }) func getPhotosByUploadDate() : async [Photo] {
    // Public read access - no authorization required
    photos.values().toArray().sort(Photo.compareByUploadDate);
  };

  public query ({ caller = _ }) func getEdukasiByDate() : async [Edukasi] {
    // Public read access - no authorization required
    edukasiContent.values().toArray().sort(Edukasi.compareByDate);
  };
};

