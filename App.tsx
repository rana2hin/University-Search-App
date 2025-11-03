import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { universityData } from './universityData';
import { University } from './types';
import StateFilter from './components/StateFilter';
import UniversityCard from './components/UniversityCard';
import MapView from './components/MapView';
import { getUniqueStates } from './utils/location';
import { AdmissionRequirementsModal } from './components/AdmissionRequirementsModal';
import { MapIcon, ListBulletIcon, SearchIcon, FilterIcon, XMarkIcon, ArrowUpIcon } from './components/icons';

type Tab = 'list' | 'map';

const App: React.FC = () => {
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('list');
  const [modalData, setModalData] = useState<{ university: University } | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);

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

  const scrollToTop = useCallback(() => {
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = originalStyle;
    }

    const handleResize = () => {
      if (window.innerWidth >= 768) { // md breakpoint
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      document.body.style.overflow = originalStyle;
      window.removeEventListener('resize', handleResize);
    };
  }, [isSidebarOpen]);

  // Listener for the back-to-top button
  useEffect(() => {
    const handleScroll = () => {
      if (scrollContainerRef.current) {
        setShowBackToTop(scrollContainerRef.current.scrollTop > 300);
      }
    };

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);


  return (
    <div className="bg-slate-900 text-slate-100 h-screen font-sans flex flex-col md:flex-row overflow-hidden">
      {/* Backdrop for mobile sidebar */}
      {isSidebarOpen && (
        <div 
            className="fixed inset-0 bg-black/60 z-30 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
            aria-hidden="true"
        ></div>
      )}

      <aside 
        id="filters-sidebar"
        className={`fixed top-0 left-0 h-full w-72 bg-slate-900 border-r border-white/10 p-4 flex flex-col z-40
        md:relative md:h-auto md:w-72 md:lg:w-80 md:flex-shrink-0 md:translate-x-0
        transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        role="dialog"
        aria-modal={isSidebarOpen}
        aria-label="Filters"
      >
        <div className="flex justify-between items-center mb-6 flex-shrink-0">
          <h1 className="text-2xl font-bold text-sky-400">US University Explorer</h1>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-slate-400 hover:text-white" aria-label="Close filters">
              <XMarkIcon />
          </button>
        </div>
        
        <div className="mb-6">
          <label htmlFor="search-university" className="block text-sm font-medium text-slate-400 mb-2">
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
              className="w-full bg-slate-800/80 backdrop-blur-sm border border-white/10 text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
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

      <main className="flex-1 flex flex-col p-4 md:p-6 relative min-h-0">
        <header className="flex-shrink-0 mb-4">
          <h1 className="text-xl font-bold text-sky-400 md:hidden mb-4">US University Explorer</h1>
          <div className="flex items-center justify-between flex-wrap gap-y-2">
             <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsSidebarOpen(true)} 
                  className="md:hidden bg-slate-800 p-2 rounded-lg text-slate-300 hover:bg-slate-700 active:bg-slate-600 transition-colors"
                  aria-label="Open filters"
                  aria-controls="filters-sidebar"
                  aria-expanded={isSidebarOpen}
                >
                    <FilterIcon />
                </button>
                <div className="flex bg-slate-800 rounded-xl p-1">
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
              </div>
              <div className="text-slate-400 text-sm">
                Showing {filteredUniversities.length} of {universityData.length} universities
              </div>
          </div>
        </header>

        <div ref={scrollContainerRef} className="flex-1 overflow-auto rounded-2xl bg-slate-800/50 relative z-0">
          {activeTab === 'list' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 p-4">
              {filteredUniversities.map(uni => (
                <UniversityCard key={uni.name} university={uni} onSearchRequirements={openModal} />
              ))}
            </div>
          )}
          {activeTab === 'map' && <MapView universities={filteredUniversities} />}
        </div>
        
        {activeTab === 'list' && showBackToTop && (
            <button
            onClick={scrollToTop}
            className="fixed z-20 bottom-6 right-6 md:right-10 bg-sky-600 hover:bg-sky-500 text-white p-3 rounded-full shadow-lg transition-all duration-300 ease-in-out hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-sky-500"
            aria-label="Back to top"
            >
                <ArrowUpIcon />
            </button>
        )}
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
        className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
        isActive
            ? 'bg-sky-500 text-white shadow-md'
            : 'text-slate-300 hover:bg-slate-700'
        }`}
    >
        {icon}
        <span>{label}</span>
    </button>
);


export default App;