import React, { useState, useMemo, useCallback } from 'react';
import { universityData } from './universityData';
import { University } from './types';
import StateFilter from './components/StateFilter';
import UniversityCard from './components/UniversityCard';
import MapView from './components/MapView';
import { getUniqueStates } from './utils/location';
import { AdmissionRequirementsModal, AdmissionData } from './components/AdmissionRequirementsModal';
import { MapIcon, ListBulletIcon } from './components/icons';

type Tab = 'list' | 'map';

const App: React.FC = () => {
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>('list');
  const [modalData, setModalData] = useState<{ university: University } | null>(null);
  const [cachedResults, setCachedResults] = useState<{ [key: string]: AdmissionData[] }>({});

  const uniqueStates = useMemo(() => getUniqueStates(universityData), []);

  const filteredUniversities = useMemo(() => {
    if (selectedStates.length === 0) {
      return universityData;
    }
    return universityData.filter(uni => selectedStates.includes(uni.state));
  }, [selectedStates]);

  const handleStateChange = useCallback((state: string) => {
    setSelectedStates(prev =>
      prev.includes(state)
        ? prev.filter(s => s !== state)
        : [...prev, state]
    );
  }, []);

  const clearFilters = useCallback(() => {
    setSelectedStates([]);
  }, []);
  
  const openModal = useCallback((university: University) => {
    setModalData({ university });
  }, []);

  const closeModal = useCallback(() => {
    setModalData(null);
  }, []);

  const handleCacheResults = useCallback((universityName: string, data: AdmissionData[]) => {
    setCachedResults(prev => ({
        ...prev,
        [universityName]: data,
    }));
  }, []);


  return (
    <div className="bg-gray-900 text-white min-h-screen font-sans flex flex-col md:flex-row md:h-screen md:overflow-hidden">
      <aside className="w-full md:w-72 lg:w-80 bg-gray-900 border-b md:border-b-0 md:border-r border-gray-700 p-4 flex flex-col flex-shrink-0">
        <h1 className="text-2xl font-bold text-cyan-400 mb-6 flex-shrink-0">US University Explorer</h1>
        <StateFilter
          states={uniqueStates}
          selectedStates={selectedStates}
          onStateChange={handleStateChange}
          onClear={clearFilters}
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
          cachedData={cachedResults[modalData.university.name]}
          onCacheResults={handleCacheResults}
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