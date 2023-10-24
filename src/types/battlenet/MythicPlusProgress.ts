export interface MythicPlusProgress {
    _links:                Links;
    current_period:        CurrentPeriod;
    seasons:               Period[];
    character:             RealmClass;
    current_mythic_rating: Rating;
    code?:                 number;
}

export interface Links {
    self: Self;
}

export interface Self {
    href: string;
}

export interface RealmClass {
    key:    Self;
    name?:  string;
    id:     number;
    realm?: RealmClass;
    slug?:  Slug;
}

export enum Slug {
    Darksorrow = "darksorrow",
    Sylvanas = "sylvanas",
}

export interface Rating {
    color:  Color;
    rating: number;
}

export interface Color {
    r: number;
    g: number;
    b: number;
    a: number;
}

export interface CurrentPeriod {
    period:    Period;
    best_runs: BestRun[];
}

export interface BestRun {
    completed_timestamp:      number;
    duration:                 number;
    keystone_level:           number;
    keystone_affixes:         RealmClass[];
    members:                  Member[];
    dungeon:                  RealmClass;
    is_completed_within_time: boolean;
    mythic_rating:            Rating;
    map_rating:               Rating;
}

export interface Member {
    character:           PurpleCharacter;
    specialization:      RealmClass;
    race:                RealmClass;
    equipped_item_level: number;
}

export interface PurpleCharacter {
    name:  string;
    id:    number;
    realm: RealmClass;
}

export interface Period {
    key: Self;
    id:  number;
}
