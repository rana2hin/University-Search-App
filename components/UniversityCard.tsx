import React from 'react';
import { University, MailingStatus } from '../types';
import { useLocalTime } from '../hooks/useLocalTime';
import { ExternalLinkIcon, MapPinIcon, AcademicCapIcon } from './icons';

interface UniversityCardProps {
  university: University;
  onSearchRequirements: (university: University) => void;
  style?: React.CSSProperties;
  className?: string;
}

const statusColors: Record<MailingStatus, {
  bg: string;
  text: string;
  border: string;
  shadow: string;
  timeText: string;
  titleText: string;
  buttonBg: string;
  buttonHoverBg: string;
  buttonText: string;
  buttonBorder: string;
}> = {
  [MailingStatus.GOOD]: {
    bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/20', shadow: 'hover:shadow-[0_0_15px_rgba(74,222,128,0.15)]', timeText: 'text-green-400', titleText: 'text-green-400',
    buttonBg: 'bg-green-500/20', buttonHoverBg: 'hover:bg-green-500/30', buttonText: 'text-green-300', buttonBorder: 'border border-green-500/30'
  },
  [MailingStatus.BAD]: {
    bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/20', shadow: 'hover:shadow-[0_0_15px_rgba(234,179,8,0.15)]', timeText: 'text-yellow-400', titleText: 'text-yellow-400',
    buttonBg: 'bg-yellow-500/20', buttonHoverBg: 'hover:bg-yellow-500/30', buttonText: 'text-yellow-300', buttonBorder: 'border border-yellow-500/30'
  },
  [MailingStatus.SLEEPING]: {
    bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/20', shadow: 'hover:shadow-[0_0_15px_rgba(59,130,246,0.15)]', timeText: 'text-blue-400', titleText: 'text-blue-400',
    buttonBg: 'bg-blue-500/20', buttonHoverBg: 'hover:bg-blue-500/30', buttonText: 'text-blue-300', buttonBorder: 'border border-blue-500/30'
  },
};

const UniversityCard: React.FC<UniversityCardProps> = ({ university, onSearchRequirements, style, className = '' }) => {
  const { localTime, mailingStatus } = useLocalTime(university.longitude);
  const color = statusColors[mailingStatus];

  return (
    <div 
      className={`bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-lg p-5 flex flex-col justify-between h-full border ${color.border} ${color.shadow} transition-all duration-300 hover:-translate-y-1 ${className}`}
      style={style}
    >
      <div>
        <div className="flex justify-between items-start mb-3">
          <h2 className={`text-xl font-bold pr-2 ${color.titleText}`}>{university.name}</h2>
          <a
            href={`//${university.website}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-sky-300 transition-colors flex-shrink-0"
            aria-label={`Visit website for ${university.name}`}
          >
            <ExternalLinkIcon />
          </a>
        </div>
        <p className="text-sm text-slate-400 mb-4 flex items-start">
            <MapPinIcon className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
            <span>{university.address}</span>
        </p>
      </div>
      <div className="mt-auto">
        <div className="text-center bg-black/20 rounded-lg p-3 mb-4">
            <div className={`text-3xl font-mono mb-1 ${color.timeText}`}>{localTime}</div>
            <div className={`text-xs font-semibold px-3 py-1 rounded-full inline-block ${color.bg} ${color.text}`}>
                {mailingStatus}
            </div>
        </div>
        <button
          onClick={() => onSearchRequirements(university)}
          className={`w-full font-bold py-2 px-4 rounded-lg transition-all duration-150 ease-in-out transform hover:scale-105 active:scale-100 flex items-center justify-center gap-2 ${color.buttonBg} ${color.buttonHoverBg} ${color.buttonText} ${color.buttonBorder}`}
        >
          <AcademicCapIcon />
          Admission Info
        </button>
      </div>
    </div>
  );
};

export default UniversityCard;