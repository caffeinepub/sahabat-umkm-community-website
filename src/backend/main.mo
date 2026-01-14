import Map "mo:core/Map";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import List "mo:core/List";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import MixinStorage "blob-storage/Mixin";

actor {
  // Types
  type MemberId = Nat;
  type EventId = Nat;
  type ArticleId = Nat;
  type PhotoId = Nat;
  type AdminSessionId = Nat;

  module MemberProfile {
    public func compareByBusinessName(a : MemberProfile, b : MemberProfile) : Order.Order {
      Text.compare(a.businessName, b.businessName);
    };

    public func compareByCategory(a : MemberProfile, b : MemberProfile) : Order.Order {
      Text.compare(a.category, b.category);
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

  type AdminSession = {
    id : AdminSessionId;
    isActive : Bool;
    lastActivity : Time.Time;
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
  let adminSessions = Map.empty<AdminSessionId, AdminSession>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  var nextMemberId = 1;
  var nextEventId = 1;
  var nextArticleId = 1;
  var nextPhotoId = 1;
  var nextSessionId = 1;

  include MixinStorage();

  // Authorization
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Admin Session Management
  public shared ({ caller }) func startAdminSession() : async AdminSessionId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can start a session");
    };

    let sessionId = nextSessionId;
    nextSessionId += 1;

    let session : AdminSession = {
      id = sessionId;
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
    let session = switch (adminSessions.get(sessionId)) {
      case (null) { return false };
      case (?s) { s };
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

  // Member Directory
  public shared ({ caller }) func registerMember(name : Text, businessName : Text, description : Text, contact : Text, category : Text, products : [Text], website : ?Text, address : Text) : async MemberId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can register as members");
    };

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
    };

    memberProfiles.add(memberId, profile);
    memberId;
  };

  public query ({ caller }) func getAllMemberProfiles() : async [MemberProfile] {
    // Public community website - guests can view member directory
    memberProfiles.values().toArray();
  };

  public query ({ caller }) func getMemberProfilesByCategory(category : Text) : async [MemberProfile] {
    // Public community website - guests can view member directory
    memberProfiles.values().toArray().filter(func(p) { p.category == category });
  };

  public query ({ caller }) func searchMemberProfilesByBusinessName(searchTerm : Text) : async [MemberProfile] {
    // Public community website - guests can search member directory
    memberProfiles.values().toArray().filter(func(p) { p.businessName.contains(#text searchTerm) });
  };

  // Event Management
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

  public query ({ caller }) func getUpcomingEvents() : async [Event] {
    // Public community website - guests can view events
    let upcomingEvents = List.empty<Event>();
    for (event in events.values()) {
      if (event.isUpcoming) {
        upcomingEvents.add(event);
      };
    };
    upcomingEvents.toArray();
  };

  public query ({ caller }) func getPastEvents() : async [Event] {
    // Public community website - guests can view events
    let pastEvents = List.empty<Event>();
    for (event in events.values()) {
      if (not event.isUpcoming) {
        pastEvents.add(event);
      };
    };
    pastEvents.toArray();
  };

  public query ({ caller }) func getEventsByLocation(location : Text) : async [Event] {
    // Public community website - guests can view events
    events.values().toArray().filter(func(e) { e.location == location });
  };

  // News and Articles
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

  public query ({ caller }) func getAllArticles() : async [Article] {
    // Public community website - guests can view articles
    articles.values().toArray();
  };

  // Photo Gallery
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

  public query ({ caller }) func getAllPhotos() : async [Photo] {
    // Public community website - guests can view photo gallery
    photos.values().toArray();
  };

  public query ({ caller }) func getPhotosByCategory(category : Text) : async [Photo] {
    // Public community website - guests can view photo gallery
    photos.values().toArray().filter(func(p) { p.category == category });
  };

  // Sort Queries
  public query ({ caller }) func getMemberProfilesByBusinessName() : async [MemberProfile] {
    // Public community website - guests can view sorted member directory
    memberProfiles.values().toArray().sort(MemberProfile.compareByBusinessName);
  };

  public query ({ caller }) func getMemberProfilesByCategorySorted() : async [MemberProfile] {
    // Public community website - guests can view sorted member directory
    memberProfiles.values().toArray().sort(MemberProfile.compareByCategory);
  };

  public query ({ caller }) func getEventsByDate() : async [Event] {
    // Public community website - guests can view sorted events
    events.values().toArray().sort(Event.compareByDate);
  };

  public query ({ caller }) func getArticlesByDate() : async [Article] {
    // Public community website - guests can view sorted articles
    articles.values().toArray().sort(Article.compareByDate);
  };

  public query ({ caller }) func getPhotosByUploadDate() : async [Photo] {
    // Public community website - guests can view sorted photos
    photos.values().toArray().sort(Photo.compareByUploadDate);
  };
};
