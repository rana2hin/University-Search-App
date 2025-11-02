import React, { useState, useMemo, useCallback } from 'react';
import { universityData } from './universityData';
import { University } from './types';
import StateFilter from './components/StateFilter';
import UniversityCard from './components/UniversityCard';
import MapView from './components/MapView';
import { getUniqueStates } from './utils/location';
import { AdmissionRequirementsModal } from './components/AdmissionRequirementsModal';
import { MapIcon, ListBulletIcon, SearchIcon } from './components/icons';

type Tab = 'list' | 'map';

const App: React.FC = () => {
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('list');
  const [modalData, setModalData] = useState<{ university: University } | null>(null);

  const uniqueStates = useMemo(() => getUniqueStates(universityData), []);

  const filteredUniversities = useMemo(() => {
    let universities = universityData;

    if (selectedStates.length > 0) {
      universities = universities.filter(uni => selectedStates.includes(uni.state));
    }

    if (searchTerm) {
      universities = universities.filter(uni =>
        uni.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return universities;
  }, [selectedStates, searchTerm]);

  const handleStateChange = useCallback((state: string) => {
    setSelectedStates(prev =>
      prev.includes(state)
        ? prev.filter(s => s !== state)
        : [...prev, state]
    );
  }, []);

  const handleSearchChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  }, []);
  
  const openModal = useCallback((university: University) => {
    setModalData({ university });
  }, []);

  const closeModal = useCallback(() => {
    setModalData(null);
  }, []);

  return (
    <div className="bg-gray-900 text-white min-h-screen font-sans flex flex-col md:flex-row md:h-screen md:overflow-hidden">
      <aside className="w-full md:w-72 lg:w-80 bg-gray-900 border-b md:border-b-0 md:border-r border-gray-700 p-4 flex flex-col flex-shrink-0">
        <h1 className="text-2xl font-bold text-cyan-400 mb-6 flex-shrink-0">US University Explorer</h1>
        
        <div className="mb-6">
          <label htmlFor="search-university" className="block text-sm font-medium text-gray-400 mb-2">
            Search by Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon />
            </div>
            <input
              type="text"
              id="search-university"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="e.g., Stanford"
              className="w-full bg-gray-800 border border-gray-600 text-white rounded-md pl-10 pr-4 py-2 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              aria-label="Search by university name"
            />
          </div>
        </div>

        <StateFilter
          states={uniqueStates}
          selectedStates={selectedStates}
          onStateChange={handleStateChange}
        />
      </aside>

      <main className="flex-1 flex flex-col p-4 md:p-6 overflow-hidden">
        <div className="flex-shrink-0 mb-4">
          <div className="flex items-center justify-between">
             <div className="flex bg-gray-800 rounded-lg p-1">
                <TabButton
                  label="List View"
                  icon={<ListBulletIcon />}
                  isActive={activeTab === 'list'}
                  onClick={() => setActiveTab('list')}
                />
                <TabButton
                  label="Map View"
                  icon={<MapIcon />}
                  isActive={activeTab === 'map'}
                  onClick={() => setActiveTab('map')}
                />
              </div>
              <div className="text-gray-400 text-sm">
                Showing {filteredUniversities.length} of {universityData.length} universities
              </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto rounded-lg bg-gray-800/50">
          {activeTab === 'list' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 p-4">
              {filteredUniversities.map(uni => (
                <UniversityCard key={uni.name} university={uni} onSearchRequirements={openModal} />
              ))}
            </div>
          )}
          {activeTab === 'map' && <MapView universities={filteredUniversities} />}
        </div>
      </main>

      {modalData && (
        <AdmissionRequirementsModal
          university={modalData.university}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

interface TabButtonProps {
    label: string;
    icon: React.ReactNode;
    isActive: boolean;
    onClick: () => void;
}

const TabButton: React.FC<TabButtonProps> = ({ label, icon, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
        isActive
            ? 'bg-cyan-500 text-white shadow-md'
            : 'text-gray-300 hover:bg-gray-700'
        }`}
    >
        {icon}
        <span>{label}</span>
    </button>
);


export default App;