
import React from 'react';
import SendIcon from './icons/SendIcon';

interface InputAreaProps {
  userInput: string;
  setUserInput: (value: string) => void;
  onSendMessage: () => void;
  isLoading: boolean;
  isCorrectionFlowActive: boolean;
}

const InputArea: React.FC<InputAreaProps> = ({
  userInput,
  setUserInput,
  onSendMessage,
  isLoading,
  isCorrectionFlowActive,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isLoading && !isCorrectionFlowActive) {
        onSendMessage();
      }
    }
  };

  return (
    <div className="p-4 bg-slate-50 dark:bg-slate-700 border-t border-slate-200 dark:border-slate-600">
      <div className="flex items-center space-x-4">
        <textarea
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isCorrectionFlowActive ? "Continúa con la revisión actual o finalízala." : "Escribe o pega tu texto aquí..."}
          className="flex-1 p-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-500 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none transition-all duration-200 disabled:bg-slate-200 dark:disabled:bg-slate-600"
          rows={3}
          disabled={isLoading || isCorrectionFlowActive}
        />
        <button
          onClick={onSendMessage}
          disabled={isLoading || isCorrectionFlowActive || !userInput.trim()}
          className="p-3 rounded-full bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-slate-400 dark:disabled:bg-slate-500 disabled:cursor-not-allowed transition-all duration-200 self-end"
          aria-label="Analizar Texto"
        >
          {isLoading ? (
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <SendIcon className="w-6 h-6" />
          )}
        </button>
      </div>
    </div>
  );
};

export default InputArea;
