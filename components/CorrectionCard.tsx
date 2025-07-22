
import React, { useState } from 'react';
import type { Correction } from '../types';
import SparklesIcon from './icons/SparklesIcon';

interface CorrectionCardProps {
  correction: Correction;
  isLast: boolean;
  onNext: () => void;
  onExplainMore: (correction: Correction) => void;
}

const CorrectionCard: React.FC<CorrectionCardProps> = ({ correction, isLast, onNext, onExplainMore }) => {
  const [isExplaining, setIsExplaining] = useState(false);

  const handleExplainMore = () => {
      setIsExplaining(true);
      onExplainMore(correction);
      // We don't set isExplaining to false here, as the new explanation will appear as a new message.
      // The loading state will be managed in the parent component.
  }

  return (
    <div className="bg-white dark:bg-slate-700 rounded-lg shadow-md border border-slate-200 dark:border-slate-600 p-5 w-full max-w-full">
      <h3 className="font-bold text-lg text-blue-600 dark:text-blue-400 mb-3">{correction.rule}</h3>
      
      <div className="space-y-4">
        <div>
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1">Texto original:</p>
          <p className="bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 p-3 rounded-md italic">
            "{correction.originalFragment}"
          </p>
        </div>
        
        <div>
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1 flex items-center">
            <SparklesIcon className="w-4 h-4 mr-1 text-green-500"/>
            Sugerencia:
          </p>
          <p className="bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 p-3 rounded-md">
            "{correction.correctedFragment}"
          </p>
        </div>

        <div>
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1">Explicación:</p>
            <p className="text-slate-700 dark:text-slate-200">{correction.explanation}</p>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-600 flex flex-col sm:flex-row gap-3">
        <button 
          onClick={onNext}
          className="flex-1 w-full sm:w-auto px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          {isLast ? 'Finalizar Revisión' : 'Entendido, siguiente'}
        </button>
        <button 
          onClick={handleExplainMore}
          disabled={isExplaining}
          className="flex-1 w-full sm:w-auto px-4 py-2 bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-100 font-semibold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400 transition-colors disabled:opacity-50"
        >
          {isExplaining ? 'Explicando...' : 'Explicar mejor'}
        </button>
      </div>
    </div>
  );
};

export default CorrectionCard;
