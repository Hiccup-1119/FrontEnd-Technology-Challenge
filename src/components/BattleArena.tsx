import React, { useState, useEffect } from 'react';
import { Zap, RotateCcw, Swords } from 'lucide-react';
import { BattlePokemon, BattleResult } from '../types/pokemon';
import { fetchPokemon, fetchMove, getRandomPokemonName, getRandomMove } from '../services/pokemonApi';
import PokemonCard from './PokemonCard';
import BattleLog from './BattleLog';

const BattleArena: React.FC = () => {
  const [player1, setPlayer1] = useState<BattlePokemon | null>(null);
  const [player2, setPlayer2] = useState<BattlePokemon | null>(null);
  const [battleLogs, setBattleLogs] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [battleResult, setBattleResult] = useState<BattleResult | null>(null);
  const [isBattling, setIsBattling] = useState(false);

  const generateRandomPokemon = async (): Promise<void> => {
    setIsLoading(true);
    setBattleResult(null);
    setBattleLogs([]);

    try {
      // Generate two different random Pokémon
      const pokemon1Name = getRandomPokemonName();
      let pokemon2Name = getRandomPokemonName();

      // Ensure we don't get the same Pokémon twice
      while (pokemon1Name === pokemon2Name) {
        pokemon2Name = getRandomPokemonName();
      }

      const [pokemon1, pokemon2] = await Promise.all([
        fetchPokemon(pokemon1Name),
        fetchPokemon(pokemon2Name)
      ]);

      // Get random moves for each Pokémon
      const [move1, move2] = await Promise.all([
        fetchMove(getRandomMove(pokemon1).name),
        fetchMove(getRandomMove(pokemon2).name)
      ]);

      // Create battle Pokémon with HP based on base stats
      const hp1 = pokemon1.stats.find(stat => stat.stat.name === 'hp')?.base_stat || 100;
      const hp2 = pokemon2.stats.find(stat => stat.stat.name === 'hp')?.base_stat || 100;

      const battlePokemon1: BattlePokemon = {
        pokemon: pokemon1,
        selectedMove: move1,
        hp: hp1,
        maxHp: hp1
      };

      const battlePokemon2: BattlePokemon = {
        pokemon: pokemon2,
        selectedMove: move2,
        hp: hp2,
        maxHp: hp2
      };

      setPlayer1(battlePokemon1);
      setPlayer2(battlePokemon2);

      setBattleLogs([
        `${pokemon1.name} and ${pokemon2.name} enter the battlefield!`,
        `${pokemon1.name} prepares ${move1.name}!`,
        `${pokemon2.name} prepares ${move2.name}!`
      ]);

    } catch (error) {
      console.error('Error generating Pokémon:', error);
      setBattleLogs(['Error loading Pokémon. Please try again.']);
    } finally {
      setIsLoading(false);
    }
  };

  const startBattle = async (): Promise<void> => {
    if (!player1 || !player2) return;

    setIsBattling(true);

    // Add battle start message
    setBattleLogs(prev => [...prev, 'The battle begins!']);

    // Wait for dramatic effect
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Determine winner based on move power
    const power1 = player1.selectedMove.power || 0;
    const power2 = player2.selectedMove.power || 0;

    let result: BattleResult;

    if (power1 > power2) {
      result = {
        winner: player1,
        loser: player2,
        battleLog: `${player1.pokemon.name} lands a decisive blow with ${player1.selectedMove.name.replace('-', ' ')} knocking out ${player2.pokemon.name}!`,
        isDraw: false
      };
    } else if (power2 > power1) {
      result = {
        winner: player2,
        loser: player1,
        battleLog: `${player2.pokemon.name} lands a decisive blow with ${player2.selectedMove.name.replace('-', ' ')} knocking out ${player1.pokemon.name}!`,
        isDraw: false
      };
    } else {
      result = {
        winner: null,
        loser: null,
        battleLog: 'Draw! Both Pokémon are equally matched!',
        isDraw: true
      };
    }

    setBattleResult(result);
    setBattleLogs(prev => [...prev, result.battleLog]);
    setIsBattling(false);
  };

  useEffect(() => {
    generateRandomPokemon();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
            Pokémon Battle Arena
          </h1>
          <p className="text-xl text-white/90 drop-shadow">
            Two Pokémon enter, one leaves victorious!
          </p>
        </div>

        {/* Battle Controls */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={generateRandomPokemon}
            disabled={isLoading || isBattling}
            className="flex items-center gap-2 bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RotateCcw className="w-5 h-5" />
            Generate New Battle
          </button>

          <button
            onClick={startBattle}
            disabled={!player1 || !player2 || isLoading || isBattling}
            className="flex items-center gap-2 bg-red-500 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isBattling ? (
              <>
                <Zap className="w-5 h-5 animate-pulse" />
                Battling...
              </>
            ) : (
              <>
                <Swords className="w-5 h-5" />
                Start Battle!
              </>
            )}
          </button>
        </div>

        {/* Battle Arena */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Player 1 */}
          <div className="flex flex-col items-center">
            <h2 className="text-2xl font-bold text-white mb-4 drop-shadow">
              Player 1
            </h2>
            {isLoading ? (
              <PokemonCard
                battlePokemon={{} as BattlePokemon}
                isPlayer={true}
                isLoading={true}
              />
            ) : player1 ? (
              <PokemonCard battlePokemon={player1} isPlayer={true} />
            ) : null}
          </div>

          {/* VS Divider */}
          <div className="hidden lg:flex items-center justify-center">
            <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg">
              <span className="text-2xl font-bold text-gray-800">VS</span>
            </div>
          </div>

          {/* Player 2 */}
          <div className="flex flex-col items-center">
            <h2 className="text-2xl font-bold text-white mb-4 drop-shadow">
              Player 2
            </h2>
            {isLoading ? (
              <PokemonCard
                battlePokemon={{} as BattlePokemon}
                isPlayer={false}
                isLoading={true}
              />
            ) : player2 ? (
              <PokemonCard battlePokemon={player2} isPlayer={false} />
            ) : null}
          </div>
        </div>

        {/* Mobile VS */}
        <div className="flex lg:hidden items-center justify-center mb-8">
          <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg">
            <span className="text-2xl font-bold text-gray-800">VS</span>
          </div>
        </div>

        {/* Battle Result */}
        {battleResult && (
          <div className="text-center mb-8">
            <div className={`inline-block px-8 py-4 rounded-lg font-bold text-xl shadow-lg ${battleResult.isDraw
              ? 'bg-yellow-500 text-white'
              : 'bg-green-500 text-white'
              }`}>
              {battleResult.isDraw ? 'It\'s a Draw!' :
                `${battleResult.winner?.pokemon.name} Wins!`
              }
            </div>
          </div>
        )}

        {/* Battle Log */}
        <BattleLog logs={battleLogs} isVisible={battleLogs.length > 0} />
      </div>
    </div>
  );
};

export default BattleArena;