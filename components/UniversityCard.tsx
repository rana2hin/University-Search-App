import React from 'react';
import { University, MailingStatus } from '../types';
import { useLocalTime } from '../hooks/useLocalTime';
import { ExternalLinkIcon, MapPinIcon, AcademicCapIcon } from './icons';

interface UniversityCardProps {
  university: University;
  onSearchRequirements: (university: University) => void;
}

const statusColors: Record<MailingStatus, { bg: string; text: string; }> = {
  [MailingStatus.GOOD]: { bg: 'bg-green-500/20', text: 'text-green-400' },
  [MailingStatus.BAD]: { bg: 'bg-yellow-500/20', text: 'text-yellow-400' },
  [MailingStatus.SLEEPING]: { bg: 'bg-blue-500/20', text: 'text-blue-400' },
};

const UniversityCard: React.FC<UniversityCardProps> = ({ university, onSearchRequirements }) => {
  const { localTime, mailingStatus } = useLocalTime(university.longitude);
  const color = statusColors[mailingStatus];

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-5 flex flex-col justify-between h-full border border-gray-700 hover:border-cyan-500 transition-colors duration-300">
      <div>
        <div className="flex justify-between items-start mb-3">
          <h2 className="text-xl font-bold text-cyan-400 pr-2">{university.name}</h2>
          <a
            href={`//${university.website}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-cyan-300 transition-colors flex-shrink-0"
            aria-label={`Visit website for ${university.name}`}
          >
            <ExternalLinkIcon />
          </a>
        </div>
        <p className="text-sm text-gray-400 mb-4 flex items-start">
            <MapPinIcon className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
            <span>{university.address}</span>
        </p>
      </div>
      <div className="mt-auto">
        <div className="text-center bg-gray-900/50 rounded-lg p-3 mb-4">
            <div className="text-3xl font-mono text-white mb-1">{localTime}</div>
            <div className={`text-xs font-semibold px-3 py-1 rounded-full inline-block ${color.bg} ${color.text}`}>
                {mailingStatus}
            </div>
        </div>
        <button
          onClick={() => onSearchRequirements(university)}
          className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-4 rounded-md transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2"
        >
          <AcademicCapIcon />
          Admission Info
        </button>
      </div>
    </div>
  );
};

export default UniversityCard;