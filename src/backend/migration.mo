import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Time "mo:core/Time";

module {
  type OldActor = {
    memberProfiles : Map.Map<Nat, { id : Nat; name : Text }>;
    events : Map.Map<Nat, { id : Nat; title : Text }>;
    articles : Map.Map<Nat, { id : Nat; title : Text }>;
    photos : Map.Map<Nat, { id : Nat; title : Text }>;
    userProfiles : Map.Map<Nat, { name : Text }>;
    nextMemberId : Nat;
    nextEventId : Nat;
    nextArticleId : Nat;
    nextPhotoId : Nat;
  };

  type AdminSession = {
    id : Nat;
    isActive : Bool;
    lastActivity : Time.Time;
  };

  type NewActor = {
    memberProfiles : Map.Map<Nat, { id : Nat; name : Text }>;
    events : Map.Map<Nat, { id : Nat; title : Text }>;
    articles : Map.Map<Nat, { id : Nat; title : Text }>;
    photos : Map.Map<Nat, { id : Nat; title : Text }>;
    userProfiles : Map.Map<Nat, { name : Text }>;
    adminSessions : Map.Map<Nat, AdminSession>;
    nextMemberId : Nat;
    nextEventId : Nat;
    nextArticleId : Nat;
    nextPhotoId : Nat;
    nextSessionId : Nat;
  };
  public func run(old : OldActor) : NewActor {
    {
      old with
      adminSessions = Map.empty<Nat, AdminSession>(),
      nextSessionId = 1
    };
  };
};
