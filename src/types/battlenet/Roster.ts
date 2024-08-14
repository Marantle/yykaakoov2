export interface Roster {
    _links:  Links;
    guild:   Guild;
    members: Member[];
}

export interface Links {
    self: Self;
}

export interface Self {
    href: string;
}

export interface Guild {
    key:     Self;
    name:    string;
    id:      number;
    realm:   Realm;
    faction: Faction;
}

export interface Faction {
    type: string;
    name: string;
}

export interface Realm {
    key:   Self;
    name?: string;
    id:    number;
    slug:  Slug;
}

export enum Slug {
    Auchindoun = "auchindoun",
    Dunemaul = "dunemaul",
    Sylvanas = "sylvanas",
}

export interface Member {
    character: Character;
    rank:      number;
}

export interface Character {
    key:            Self;
    name:           string;
    id:             number;
    realm:          Realm;
    level:          number;
    playable_class: Playable;
    playable_race:  Playable;
}

export interface Playable {
    key: Self;
    id:  number;
}
