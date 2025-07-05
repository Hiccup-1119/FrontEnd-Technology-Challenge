import { Pokemon, Move } from '../types/pokemon';

const BASE_URL = 'https://pokeapi.co/api/v2';

// List of popular Pokémon for random selection
const POKEMON_NAMES = [
  'pikachu', 'charizard', 'blastoise', 'venusaur', 'alakazam', 'machamp',
  'gengar', 'dragonite', 'mewtwo', 'mew', 'typhlosion', 'feraligatr',
  'meganium', 'lugia', 'ho-oh', 'blaziken', 'swampert', 'sceptile',
  'rayquaza', 'garchomp', 'lucario', 'dialga', 'palkia', 'giratina',
  'arceus', 'reshiram', 'zekrom', 'kyurem', 'greninja', 'talonflame',
  'sylveon', 'goodra', 'decidueye', 'incineroar', 'primarina', 'solgaleo',
  'lunala', 'necrozma', 'dragapult', 'corviknight', 'toxapex', 'mimikyu'
];

export const fetchPokemon = async (name: string): Promise<Pokemon> => {
  const response = await fetch(`${BASE_URL}/pokemon/${name.toLowerCase()}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch Pokémon: ${name}`);
  }
  return response.json();
};

export const fetchMove = async (name: string): Promise<Move> => {
  const response = await fetch(`${BASE_URL}/move/${name.toLowerCase()}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch move: ${name}`);
  }
  return response.json();
};

export const getRandomPokemonName = (): string => {
  const randomIndex = Math.floor(Math.random() * POKEMON_NAMES.length);
  return POKEMON_NAMES[randomIndex];
};

export const getRandomMove = (pokemon: Pokemon): { name: string; url: string } => {
  // Filter moves that are more likely to have power values
  const viableMoves = pokemon.moves.filter(move => {
    const moveName = move.move.name;
    // Exclude status moves that typically don't have power
    const statusMoves = ['growl', 'tail-whip', 'sand-attack', 'string-shot', 'harden', 'withdraw'];
    return !statusMoves.includes(moveName);
  });
  
  const movesToChooseFrom = viableMoves.length > 0 ? viableMoves : pokemon.moves;
  const randomIndex = Math.floor(Math.random() * movesToChooseFrom.length);
  return movesToChooseFrom[randomIndex].move;
};