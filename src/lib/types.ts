export type Deck = {
  id: string;
  creator: string;
  name: string;
  is_private: boolean;
  is_complete: boolean;
  hero: string;
  list: Record<string, number>;
  created_at: string;
  last_updated: string;
  description: string;
};

export type Hero = {
  name: string;
  image: string;
  class: string[];
  mainSuperPower: string;
  altSuperPowers: string[];
  description: string;
};

export type Card = {
  name: string;
  image: string;
  set: string;
  rarity: string;
  class: string;
  type: string;
  tribes: string[];
  cost: number;
  strength: number | null;
  health: number | null;
  abilities: string;
  flavour: string;
};

export type User = {
  username: string;
  profile_image: string;
  id: string;
  created_at: string;
};

export type Query = (
  | {
      property: "strength" | "s" | "health" | "h" | "cost" | "c";
      compare: "=" | ":" | "<" | ">" | "<=" | ">=";
      value: number;
    }
  | {
      property: "tribe" | "t" | "abilities" | "a" | "flavour" | "f" | "name";
      value: string | number;
    }
  | {
      property: "set";
      value:
        | "basic"
        | "b"
        | "premium"
        | "p"
        | "galactic"
        | "g"
        | "colossal"
        | "c"
        | "triassic"
        | "t";
    }
  | {
      property: "rarity" | "r";
      value:
        | "common"
        | "c"
        | "uncommon"
        | "u"
        | "rare"
        | "r"
        | "superrare"
        | "s"
        | "legendary"
        | "l"
        | "event"
        | "e"
        | "token"
        | "t";
    }
  | {
      property: "class";
      value:
        | "guardian"
        | "kabloom"
        | "megagrow"
        | "smarty"
        | "solar"
        | "removed"
        | "beastly"
        | "brainy"
        | "crazy"
        | "hearty"
        | "sneaky";
    }
  | {
      property: "type";
      value:
        | "plant"
        | "trick"
        | "environment"
        | "zombie"
        | "p"
        | "t"
        | "e"
        | "fighter"
        | "f";
    }
  | {
      property: "or";
      orSections: Query[];
    }
)[];
