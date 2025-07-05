import { describe, it, expect, beforeEach } from 'vitest';
import { fetchPokemon, fetchMove, getRandomPokemonName, getRandomMove } from '../services/pokemonApi';
import { Pokemon } from '../types/pokemon';

// Mock fetch for testing
global.fetch = vi.fn();

describe('Pokemon API Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchPokemon', () => {
    it('should fetch pokemon data successfully', async () => {
      const mockPokemon: Partial<Pokemon> = {
        id: 25,
        name: 'pikachu',
        sprites: {
          front_default: 'https://example.com/pikachu-front.png',
          back_default: 'https://example.com/pikachu-back.png'
        },
        stats: [
          { base_stat: 35, stat: { name: 'hp' } }
        ],
        types: [
          { type: { name: 'electric' } }
        ],
        moves: [
          { move: { name: 'thunderbolt', url: 'https://example.com/thunderbolt' } }
        ]
      };

      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockPokemon
      });

      const result = await fetchPokemon('pikachu');
      
      expect(fetch).toHaveBeenCalledWith('https://pokeapi.co/api/v2/pokemon/pikachu');
      expect(result).toEqual(mockPokemon);
    });

    it('should throw error when fetch fails', async () => {
      (fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 404
      });

      await expect(fetchPokemon('invalidpokemon')).rejects.toThrow('Failed to fetch Pokémon: invalidpokemon');
    });
  });

  describe('fetchMove', () => {
    it('should fetch move data successfully', async () => {
      const mockMove = {
        name: 'thunderbolt',
        power: 90,
        pp: 15,
        type: { name: 'electric' }
      };

      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockMove
      });

      const result = await fetchMove('thunderbolt');
      
      expect(fetch).toHaveBeenCalledWith('https://pokeapi.co/api/v2/move/thunderbolt');
      expect(result).toEqual(mockMove);
    });
  });

  describe('getRandomPokemonName', () => {
    it('should return a valid pokemon name', () => {
      const pokemonName = getRandomPokemonName();
      expect(typeof pokemonName).toBe('string');
      expect(pokemonName.length).toBeGreaterThan(0);
    });

    it('should return different names on multiple calls', () => {
      const names = new Set();
      for (let i = 0; i < 10; i++) {
        names.add(getRandomPokemonName());
      }
      // Should have at least 2 different names in 10 calls (very likely)
      expect(names.size).toBeGreaterThan(1);
    });
  });

  describe('getRandomMove', () => {
    it('should return a random move from pokemon moves', () => {
      const mockPokemon: Pokemon = {
        id: 25,
        name: 'pikachu',
        sprites: {
          front_default: 'front.png',
          back_default: 'back.png'
        },
        stats: [],
        types: [],
        moves: [
          { move: { name: 'thunderbolt', url: 'url1' } },
          { move: { name: 'quick-attack', url: 'url2' } },
          { move: { name: 'iron-tail', url: 'url3' } }
        ]
      };

      const selectedMove = getRandomMove(mockPokemon);
      
      expect(selectedMove).toHaveProperty('name');
      expect(selectedMove).toHaveProperty('url');
      expect(['thunderbolt', 'quick-attack', 'iron-tail']).toContain(selectedMove.name);
    });

    it('should filter out status moves when possible', () => {
      const mockPokemon: Pokemon = {
        id: 25,
        name: 'pikachu',
        sprites: {
          front_default: 'front.png',
          back_default: 'back.png'
        },
        stats: [],
        types: [],
        moves: [
          { move: { name: 'growl', url: 'url1' } }, // status move
          { move: { name: 'thunderbolt', url: 'url2' } }, // attack move
          { move: { name: 'tail-whip', url: 'url3' } } // status move
        ]
      };

      // Run multiple times to check if it prefers non-status moves
      const results = [];
      for (let i = 0; i < 20; i++) {
        results.push(getRandomMove(mockPokemon).name);
      }

      // Should prefer thunderbolt over status moves
      expect(results).toContain('thunderbolt');
    });
  });
});