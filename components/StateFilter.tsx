import React, { useState } from 'react';
import { SearchIcon, XCircleIcon } from './icons';

interface StateFilterProps {
  states: string[];
  selectedStates: string[];
  onStateChange: (state: string) => void;
  onClear: () => void;
}

const StateFilter: React.FC<StateFilterProps> = ({ states, selectedStates, onStateChange, onClear }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStates = states.filter(state =>
    state.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex-shrink-0">
        <label className="block text-sm font-medium text-gray-400 mb-2">Filter by State</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search states..."
            className="w-full bg-gray-800 border border-gray-600 text-white rounded-md pl-10 pr-4 py-2 focus:outline-none focus:ring-1 focus:ring-cyan-500"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto my-4 -mr-2 pr-2">
        <ul className="space-y-1">
          {filteredStates.map(state => (
            <li key={state}>
              <label className="flex items-center text-gray-300 select-none cursor-pointer hover:bg-gray-700 rounded-md p-2 transition-colors">
                <input
                  type="checkbox"
                  checked={selectedStates.includes(state)}
                  onChange={() => onStateChange(state)}
                  className="h-4 w-4 rounded border-gray-500 text-cyan-600 bg-gray-700 focus:ring-cyan-500 focus:ring-offset-gray-800"
                />
                <span className="ml-3 block font-normal truncate">{state}</span>
              </label>
            </li>
          ))}
        </ul>
      </div>

      {selectedStates.length > 0 && (
        <div className="flex-shrink-0 pt-4 border-t border-gray-700">
          <button
            onClick={onClear}
            className="w-full flex items-center justify-center gap-2 text-sm text-red-400 hover:text-red-300 transition-colors"
          >
            <XCircleIcon />
            Clear ({selectedStates.length})
          </button>
        </div>
      )}
    </div>
  );
};

export default StateFilter;