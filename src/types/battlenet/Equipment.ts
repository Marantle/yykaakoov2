export interface Equipment {
    _links:             Links;
    character:          Character;
    equipped_items:     EquippedItem[];
    equipped_item_sets: Set[];
}

export interface Links {
    self: Self;
}

export interface Self {
    href: string;
}

export interface Character {
    key:    Self;
    name:   string;
    id:     number;
    realm?: Character;
    slug?:  string;
}

export interface Set {
    item_set:       Character;
    items:          ItemElement[];
    effects:        Effect[];
    display_string: string;
}

export interface Effect {
    display_string: string;
    required_count: number;
    is_active?:     boolean;
}

export interface ItemElement {
    item:         Character;
    is_equipped?: boolean;
}

export interface EquippedItem {
    item:                    MediaClass;
    slot:                    Binding;
    quantity:                number;
    context:                 number;
    bonus_list?:             number[];
    quality:                 Binding;
    name:                    string;
    modified_appearance_id?: number;
    media:                   MediaClass;
    item_class:              Character;
    item_subclass:           Character;
    inventory_type:          Binding;
    binding:                 Binding;
    armor?:                  Armor;
    stats?:                  Stat[];
    sell_price:              SellPrice;
    requirements?:           Requirements;
    set?:                    Set;
    level:                   Durability;
    transmog?:               Transmog;
    durability?:             Durability;
    name_description?:       NameDescription;
    sockets?:                Socket[];
    is_subclass_hidden?:     boolean;
    enchantments?:           Enchantment[];
    limit_category?:         string;
    spells?:                 Spell[];
    modified_crafting_stat?: ModifiedCraftingStat[];
    unique_equipped?:        string;
    weapon?:                 Weapon;
}

export interface Armor {
    value:   number;
    display: NameDescription;
}

export interface NameDescription {
    display_string: string;
    color:          Color;
}

export interface Color {
    r: number;
    g: number;
    b: number;
    a: number;
}

export interface Binding {
    type: string;
    name: string;
}

export interface Durability {
    value:          number;
    display_string: string;
}

export interface Enchantment {
    display_string:   string;
    enchantment_id:   number;
    enchantment_slot: EnchantmentSlot;
    source_item?:     Character;
}

export interface EnchantmentSlot {
    id:   number;
    type: string;
}

export interface MediaClass {
    key: Self;
    id:  number;
}

export interface ModifiedCraftingStat {
    id:   number;
    type: string;
    name: string;
}

export interface Requirements {
    level:             Durability;
    playable_classes?: PlayableClasses;
}

export interface PlayableClasses {
    links:          Character[];
    display_string: string;
}

export interface SellPrice {
    value:           number;
    display_strings: DisplayStrings;
}

export interface DisplayStrings {
    header: Header;
    gold:   string;
    silver: string;
    copper: string;
}

export enum Header {
    SellPrice = "Sell Price:",
}

export interface Socket {
    socket_type:    Binding;
    item:           Character;
    display_string: string;
    media:          MediaClass;
}

export interface Spell {
    spell:       Character;
    description: string;
}

export interface Stat {
    type:            Binding;
    value:           number;
    display:         NameDescription;
    is_negated?:     boolean;
    is_equip_bonus?: boolean;
}

export interface Transmog {
    item:                        Character;
    display_string:              string;
    item_modified_appearance_id: number;
}

export interface Weapon {
    damage:       Damage;
    attack_speed: Durability;
    dps:          Durability;
}

export interface Damage {
    min_value:      number;
    max_value:      number;
    display_string: string;
    damage_class:   Binding;
}
