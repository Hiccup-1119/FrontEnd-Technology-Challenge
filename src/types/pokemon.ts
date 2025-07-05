export interface Pokemon {
  id: number;
  name: string;
  sprites: {
    front_default: string;
    back_default: string;
  };
  stats: Array<{
    base_stat: number;
    stat: {
      name: string;
    };
  }>;
  types: Array<{
    type: {
      name: string;
    };
  }>;
  moves: Array<{
    move: {
      name: string;
      url: string;
    };
  }>;
}

export interface Move {
  name: string;
  power: number | null;
  pp: number;
  type: {
    name: string;
  };
}

export interface BattlePokemon {
  pokemon: Pokemon;
  selectedMove: Move;
  hp: number;
  maxHp: number;
}

export interface BattleResult {
  winner: BattlePokemon | null;
  loser: BattlePokemon | null;
  battleLog: string;
  isDraw: boolean;
}