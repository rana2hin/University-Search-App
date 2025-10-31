import React, { useState, useEffect, useCallback } from 'react';
// FIX: Removed `Type` as `responseSchema` is no longer used.
import { GoogleGenAI } from '@google/genai';
import { University } from '../types';
import { XMarkIcon, AcademicCapIcon, ClipboardIcon } from './icons';

interface AdmissionRequirementsModalProps {
  university: University;
  onClose: () => void;
}

interface AdmissionData {
  usRank: string;
  qsRank: string;
  universityName: string;
  deptName: string;
  degree: string;
  url: string;
  deadline: string;
  gre: string;
  gpa: string;
  transcriptVerification: string;
  fund: string;
  fee: string;
  waiver: string;
  gradCoName: string;
  gradCoMail: string;
  state: string;
}

const tableHeaders = [
    { key: 'universityName', label: 'University' },
    { key: 'deptName', label: 'Department' },
    { key: 'degree', label: 'Degree' },
    { key: 'deadline', label: 'Deadline' },
    { key: 'gre', label: 'GRE' },
    { key: 'gpa', label: 'Min. GPA' },
    { key: 'fee', label: 'Fee' },
    { key: 'waiver', label: 'Waiver' },
    { key: 'fund', label: 'Funding' },
    { key: 'transcriptVerification', label: 'Transcript' },
    { key: 'usRank', label: 'US Rank' },
    { key: 'qsRank', label: 'QS Rank' },
    { key: 'gradCoName', label: 'Coordinator' },
    { key: 'gradCoMail', label: 'Coordinator Email' },
    { key: 'url', label: 'URL' },
    { key: 'state', label: 'State' },
];


// FIX: Removed `responseSchema` as it is not supported with the `googleSearch` tool.

export const AdmissionRequirementsModal: React.FC<AdmissionRequirementsModalProps> = ({ university, onClose }) => {
  const [data, setData] = useState<AdmissionData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copyStatus, setCopyStatus] = useState('Copy Table');

  const fetchAdmissionData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    // FIX: Added variables to hold raw and parsed text for better debugging.
    let rawText = '';
    let jsonTextToParse = '';
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      // FIX: Updated prompt to explicitly request JSON format to improve reliability.
      const prompt = `For ${university.name}, search for the admission requirements for MS and PhD programs in Statistics, Applied Statistics, Biostatistics, and Data Science. Do not include undergraduate programs. Format the results as a JSON array where each object represents a program and has the following keys: "usRank", "qsRank", "universityName", "deptName", "degree", "url", "deadline", "gre", "gpa", "transcriptVerification", "fund", "fee", "waiver", "gradCoName", "gradCoMail", "state". If a piece of information is not found for a program, the value for that key should be "N/A". Ensure the output is only a valid JSON string and nothing else.`;
      
      // FIX: Removed `responseMimeType` and `responseSchema` as they are not supported with the `googleSearch` tool.
      const response = await ai.models.generateContent({
        model: "gemini-2.5-pro",
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
        },
      });
      
      rawText = response.text.trim();
      
      // FIX: Added logic to extract JSON from the text response, as it's not guaranteed to be clean JSON when using googleSearch.
      // The model might return the JSON inside a markdown block. Let's extract it.
      const jsonRegex = /```json\s*([\s\S]*?)\s*```/;
      const match = rawText.match(jsonRegex);

      if (match && match[1]) {
        jsonTextToParse = match[1];
      } else {
        // If no markdown block, find the first '[' and last ']'
        const startIndex = rawText.indexOf('[');
        const endIndex = rawText.lastIndexOf(']');
        if (startIndex !== -1 && endIndex > startIndex) {
          jsonTextToParse = rawText.substring(startIndex, endIndex + 1);
        } else {
          jsonTextToParse = rawText; // Fallback to the raw text if no array found
        }
      }
      
      const parsedData = JSON.parse(jsonTextToParse) as AdmissionData[];
      
      if (!parsedData || parsedData.length === 0) {
        setError("Could not find specific program information using the current search. You can try searching the university's website directly.");
      } else {
        setData(parsedData);
      }

    } catch (e) {
      // FIX: Improved error handling and logging.
      console.error("Original model response:", rawText);
      console.error("Attempted to parse:", jsonTextToParse);
      console.error(e);
      setError("An AI error occurred. The model may have returned an unexpected format. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [university]);

  useEffect(() => {
    fetchAdmissionData();
  }, [fetchAdmissionData]);
  
  const handleCopy = () => {
    const tableAsString = [
        tableHeaders.map(h => h.label).join('\t'),
        ...data.map(row => tableHeaders.map(h => row[h.key as keyof AdmissionData] ?? '').join('\t'))
    ].join('\n');

    navigator.clipboard.writeText(tableAsString).then(() => {
        setCopyStatus('Copied!');
        setTimeout(() => setCopyStatus('Copy Table'), 2000);
    });
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-gray-800 rounded-lg shadow-2xl w-full max-w-7xl max-h-[90vh] flex flex-col border border-gray-600" onClick={(e) => e.stopPropagation()}>
        <header className="flex items-center justify-between p-4 border-b border-gray-700 flex-shrink-0">
          <div className="flex items-center gap-3">
             <AcademicCapIcon />
             <h2 className="text-lg font-bold">
                Admission Requirements for <span className="text-cyan-400">{university.name}</span>
             </h2>
          </div>
          {data.length > 0 && !isLoading && (
             <button onClick={handleCopy} className="text-sm bg-gray-700 hover:bg-gray-600 text-cyan-300 px-3 py-1 rounded-md transition-colors flex items-center gap-2">
                 <ClipboardIcon />
                 {copyStatus}
             </button>
          )}
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <XMarkIcon />
          </button>
        </header>

        <div className="p-1 overflow-auto">
          {isLoading && (
            <div className="flex flex-col items-center justify-center text-gray-400 h-96">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400 mb-4"></div>
              <p>Gemini is searching for admission data...</p>
              <p className="text-xs mt-2">This may take a moment.</p>
            </div>
          )}

          {error && !isLoading && (
             <div className="m-6 text-center text-yellow-400 bg-yellow-500/10 p-4 rounded-md">
                <p>{error}</p>
                 <a 
                    href={`//${university.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block font-bold text-cyan-400 hover:underline"
                 >
                    Visit University Website
                 </a>
            </div>
          )}

          {!isLoading && !error && data.length > 0 && (
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-300">
                    <thead className="text-xs text-cyan-300 uppercase bg-gray-700/50 sticky top-0">
                        <tr>
                            {tableHeaders.map(header => (
                                <th key={header.key} scope="col" className="px-4 py-3 whitespace-nowrap">{header.label}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                       {data.map((row, rowIndex) => (
                           <tr key={rowIndex} className="border-b border-gray-700 hover:bg-gray-700/50">
                                {tableHeaders.map(header => (
                                    <td key={`${rowIndex}-${header.key}`} className="px-4 py-3 whitespace-nowrap">
                                        {header.key === 'url' ? (
                                             row.url && row.url !== 'N/A' ?
                                            <a href={!row.url.startsWith('http') ? `//${row.url}`: row.url} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">
                                                Link
                                            </a> : 'N/A'
                                        ) : (
                                            row[header.key as keyof AdmissionData] || 'N/A'
                                        )}
                                    </td>
                                ))}
                           </tr>
                       ))}
                    </tbody>
                </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
