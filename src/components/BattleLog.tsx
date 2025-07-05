import React from 'react';
import { Scroll } from 'lucide-react';

interface BattleLogProps {
  logs: string[];
  isVisible: boolean;
}

const BattleLog: React.FC<BattleLogProps> = ({ logs, isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-2 mb-4">
        <Scroll className="w-5 h-5 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-800">Battle Log</h3>
      </div>
      
      <div className="bg-gray-50 rounded-lg p-4 max-h-40 overflow-y-auto">
        {logs.length === 0 ? (
          <p className="text-gray-500 text-center italic">
            Battle log will appear here...
          </p>
        ) : (
          <div className="space-y-2">
            {logs.map((log, index) => (
              <div
                key={index}
                className="bg-white p-3 rounded border-l-4 border-blue-500 animate-fadeIn"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <p className="text-sm text-gray-800">{log}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BattleLog;