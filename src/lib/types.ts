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
