import React from 'react';
import { BattlePokemon } from '../types/pokemon';

interface PokemonCardProps {
  battlePokemon: BattlePokemon;
  isPlayer?: boolean;
  isLoading?: boolean;
}

const PokemonCard: React.FC<PokemonCardProps> = ({
  battlePokemon,
  isPlayer = false,
  isLoading = false
}) => {
  const { pokemon, selectedMove, hp, maxHp } = battlePokemon;
  const hpPercentage = (hp / maxHp) * 100;

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
        <div className="flex flex-col items-center">
          <div className="w-32 h-32 bg-gray-300 rounded-full mb-4"></div>
          <div className="h-6 bg-gray-300 rounded w-24 mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-20 mb-4"></div>
          <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl ${isPlayer ? 'border-l-4 border-blue-500' : 'border-r-4 border-red-500'
      }`}>
      <div className="flex flex-col items-center">
        <div className="relative mb-4">
          <img
            src={isPlayer ? pokemon.sprites.back_default : pokemon.sprites.front_default}
            alt={pokemon.name}
            className="w-32 h-32 object-contain drop-shadow-lg"
          />
          <div className={`absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${isPlayer ? 'bg-blue-500' : 'bg-red-500'
            }`}>
            {isPlayer ? 'P1' : 'P2'}
          </div>
        </div>

        <h3 className="text-xl font-bold text-gray-800 mb-1 capitalize">
          {pokemon.name}
        </h3>

        <div className="flex items-center gap-2 mb-3">
          {pokemon.types.map((type, index) => (
            <span
              key={index}
              className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getTypeColor(type.type.name)
                }`}
            >
              {type.type.name}
            </span>
          ))}
        </div>

        <div className="w-full mb-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-gray-600">HP</span>
            <span className="text-sm font-medium text-gray-800">{hp}/{maxHp}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${hpPercentage > 50 ? 'bg-green-500' :
                  hpPercentage > 25 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
              style={{ width: `${hpPercentage}%` }}
            ></div>
          </div>
        </div>

        <div className="w-full bg-gray-50 rounded-lg p-3">
          <h4 className="text-sm font-semibold text-gray-700 mb-1">Selected Move</h4>
          <p className="text-lg font-bold text-gray-900 capitalize mb-1">
            {selectedMove.name.replace('-', ' ')}
          </p>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">
              Power: {selectedMove.power || 'N/A'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const getTypeColor = (type: string): string => {
  const colors: Record<string, string> = {
    normal: 'bg-gray-500',
    fire: 'bg-red-500',
    water: 'bg-blue-500',
    electric: 'bg-yellow-500',
    grass: 'bg-green-500',
    ice: 'bg-blue-300',
    fighting: 'bg-red-700',
    poison: 'bg-purple-500',
    ground: 'bg-yellow-600',
    flying: 'bg-indigo-400',
    psychic: 'bg-pink-500',
    bug: 'bg-green-400',
    rock: 'bg-yellow-800',
    ghost: 'bg-purple-700',
    dragon: 'bg-indigo-700',
    dark: 'bg-gray-800',
    steel: 'bg-gray-400',
    fairy: 'bg-pink-300',
  };
  return colors[type] || 'bg-gray-500';
};

export default PokemonCard;