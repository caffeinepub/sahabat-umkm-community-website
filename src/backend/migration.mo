import Map "mo:core/Map";

module {
  type OldActor = {
    memberProfiles : Map.Map<Nat, { id : Nat; userId : Principal; name : Text; businessName : Text; description : Text; contact : Text; category : Text; products : [Text]; website : ?Text; address : Text; verified : Bool; memberIdNumber : ?Text }>;
    events : Map.Map<Nat, { id : Nat; title : Text; description : Text; location : Text; date : Nat; isUpcoming : Bool }>;
    articles : Map.Map<Nat, { id : Nat; title : Text; content : Text; author : Text; date : Nat }>;
    photos : Map.Map<Nat, { id : Nat; title : Text; category : Text; url : Text; uploadDate : Nat }>;
    edukasiContent : Map.Map<Nat, { id : Nat; title : Text; content : Text; author : Text; date : Nat; image : ?Text }>;
    produkAnggota : Map.Map<Nat, { id : Nat; foto : ?Text; kategori : Text; namaUsaha : Text; hubungiSelanjutnya : ?Text }>;
    pengajuanProduk : Map.Map<Nat, { id : Nat; foto : ?Text; kategori : Text; namaUsaha : Text; hubungiSelanjutnya : ?Text }>;
    adminSessions : Map.Map<Nat, { id : Nat; principal : Principal; isActive : Bool; lastActivity : Int }>;
    userProfiles : Map.Map<Principal, { name : Text; email : ?Text; phone : ?Text }>;
    adminCredentials : Map.Map<Text, { username : Text; passwordHash : Text }>;
    nextMemberId : Nat;
    nextEventId : Nat;
    nextArticleId : Nat;
    nextPhotoId : Nat;
    nextProdukId : Nat;
    nextPengajuanProdukId : Nat;
    nextSessionId : Nat;
    nextEdukasiId : Nat;
  };

  type NewActor = {
    memberProfiles : Map.Map<Nat, { id : Nat; userId : Principal; name : Text; businessName : Text; description : Text; contact : Text; category : Text; products : [Text]; website : ?Text; address : Text; verified : Bool; memberIdNumber : ?Text }>;
    events : Map.Map<Nat, { id : Nat; title : Text; description : Text; location : Text; date : Nat; isUpcoming : Bool }>;
    articles : Map.Map<Nat, { id : Nat; title : Text; content : Text; author : Text; date : Nat }>;
    photos : Map.Map<Nat, { id : Nat; title : Text; category : Text; url : Text; uploadDate : Nat }>;
    edukasiContent : Map.Map<Nat, { id : Nat; title : Text; content : Text; author : Text; date : Nat; image : ?Text }>;
    produkAnggota : Map.Map<Nat, { id : Nat; foto : ?Text; kategori : Text; namaUsaha : Text; hubungiSelanjutnya : ?Text }>;
    pengajuanProduk : Map.Map<Nat, { id : Nat; foto : ?Text; kategori : Text; namaUsaha : Text; hubungiSelanjutnya : ?Text }>;
    adminSessions : Map.Map<Nat, { id : Nat; principal : Principal; isActive : Bool; lastActivity : Int }>;
    userProfiles : Map.Map<Principal, { name : Text; email : ?Text; phone : ?Text }>;
    adminCredentials : Map.Map<Text, { username : Text; passwordHash : Text }>;
    nextMemberId : Nat;
    nextEventId : Nat;
    nextArticleId : Nat;
    nextPhotoId : Nat;
    nextProdukId : Nat;
    nextPengajuanProdukId : Nat;
    nextSessionId : Nat;
    nextEdukasiId : Nat;
  };

  public func run(old : OldActor) : NewActor {
    {
      memberProfiles = old.memberProfiles;
      events = old.events;
      articles = old.articles;
      photos = old.photos;
      edukasiContent = old.edukasiContent;
      produkAnggota = old.produkAnggota;
      pengajuanProduk = old.pengajuanProduk;
      adminSessions = old.adminSessions;
      userProfiles = old.userProfiles;
      adminCredentials = old.adminCredentials;
      nextMemberId = old.nextMemberId;
      nextEventId = old.nextEventId;
      nextArticleId = old.nextArticleId;
      nextPhotoId = old.nextPhotoId;
      nextProdukId = old.nextProdukId;
      nextPengajuanProdukId = old.nextPengajuanProdukId;
      nextSessionId = old.nextSessionId;
      nextEdukasiId = old.nextEdukasiId;
    };
  };
};
