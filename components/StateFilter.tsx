import React, { useState, useEffect, useRef } from 'react';
import { SearchIcon, XMarkIcon, ChevronDownIcon } from './icons';

interface StateFilterProps {
  states: string[];
  selectedStates: string[];
  onStateChange: (state: string) => void;
}

const StateFilter: React.FC<StateFilterProps> = ({ states, selectedStates, onStateChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const filteredStates = states.filter(state =>
    state.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRemoveState = (e: React.MouseEvent, state: string) => {
    e.stopPropagation();
    onStateChange(state);
  };

  return (
    <div className="flex flex-col flex-1 min-h-0" ref={filterRef}>
      <label id="state-filter-label" className="block text-sm font-medium text-slate-400 mb-2">Filter by State</label>
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full bg-slate-800/80 backdrop-blur-sm border border-slate-700 text-white rounded-xl p-2 text-left flex items-center justify-between focus:outline-none focus:ring-1 focus:ring-sky-500/50 focus:border-sky-500 min-h-[42px] transition-colors"
          aria-labelledby="state-filter-label"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <div className="flex flex-wrap gap-1.5 items-center flex-1">
            {selectedStates.length > 0 ? (
              selectedStates.map(state => (
                <span key={state} className="bg-sky-500/30 text-sky-200 text-sm font-medium px-3 py-1 rounded-full flex items-center">
                  {state}
                  <button
                    onClick={(e) => handleRemoveState(e, state)}
                    className="ml-1.5 text-sky-300 hover:text-white transition-colors"
                    aria-label={`Remove ${state}`}
                  >
                    <XMarkIcon className="w-3 h-3" />
                  </button>
                </span>
              ))
            ) : (
              <span className="text-slate-400 px-1">Select an option</span>
            )}
          </div>
          <ChevronDownIcon className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute z-10 mt-1 w-full bg-slate-800/80 backdrop-blur-lg border border-slate-700 rounded-xl shadow-lg">
            <div className="p-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchIcon />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search states..."
                  className="w-full bg-slate-700 border border-slate-600 text-white rounded-xl pl-10 pr-4 py-2 focus:outline-none focus:ring-1 focus:ring-sky-500/50 focus:border-sky-500 transition-colors"
                  aria-label="Search states"
                  aria-controls="state-listbox"
                  autoFocus
                />
              </div>
            </div>
            <ul
              id="state-listbox"
              role="listbox"
              aria-multiselectable="true"
              className="max-h-60 overflow-y-auto p-2"
            >
              {filteredStates.map(state => (
                <li
                  key={state}
                  onClick={() => onStateChange(state)}
                  role="option"
                  aria-selected={selectedStates.includes(state)}
                  className={`p-2 rounded-lg cursor-pointer text-slate-300 hover:bg-white/10 transition-colors ${selectedStates.includes(state) ? 'bg-sky-500/30 text-white font-semibold' : ''}`}
                >
                  {state}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default StateFilter;