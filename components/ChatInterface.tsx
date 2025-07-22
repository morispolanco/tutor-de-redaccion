
import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage, Correction } from '../types';
import { getCorrections, getFurtherExplanation } from '../services/geminiService';
import InputArea from './InputArea';
import CorrectionCard from './CorrectionCard';

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 'initial', sender: 'bot', text: '¡Hola! Soy tu tutor de redacción. Pega un texto que quieras mejorar y lo analizaré por ti.' }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentCorrections, setCurrentCorrections] = useState<Correction[]>([]);
  const [currentCorrectionIndex, setCurrentCorrectionIndex] = useState(0);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const isCorrectionFlowActive = currentCorrections.length > 0;

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addMessage = (message: Omit<ChatMessage, 'id'>) => {
    setMessages(prev => [...prev, { ...message, id: crypto.randomUUID() }]);
  };

  const handleSendText = async () => {
    if (!userInput.trim()) return;

    addMessage({ sender: 'user', text: userInput });
    const textToAnalyze = userInput;
    setUserInput('');
    setIsLoading(true);

    addMessage({ sender: 'bot', text: '¡Entendido! Estoy analizando tu texto. Dame un momento...' });

    try {
      const corrections = await getCorrections(textToAnalyze);
      if (corrections && corrections.length > 0) {
        setCurrentCorrections(corrections);
        setCurrentCorrectionIndex(0);
        addMessage({ sender: 'bot', text: `He encontrado ${corrections.length} sugerencia(s) para mejorar tu texto. Vamos a revisarlas una por una.` });
        addMessage({
          sender: 'bot',
          isCorrectionCard: true,
          correction: corrections[0],
          isLastCorrection: corrections.length === 1
        });
      } else {
        addMessage({ sender: 'bot', text: '¡Tu texto está muy bien! No encontré ninguna sugerencia de mejora por ahora. ¡Sigue escribiendo así!' });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Ocurrió un error inesperado.";
      addMessage({ sender: 'bot', text: `Lo siento, tuve problemas para analizar tu texto. ${errorMessage}` });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextCorrection = () => {
    if (currentCorrectionIndex < currentCorrections.length - 1) {
      const nextIndex = currentCorrectionIndex + 1;
      setCurrentCorrectionIndex(nextIndex);
      addMessage({
        sender: 'bot',
        isCorrectionCard: true,
        correction: currentCorrections[nextIndex],
        isLastCorrection: nextIndex === currentCorrections.length - 1
      });
    } else {
      addMessage({ sender: 'bot', text: '¡Hemos terminado la revisión! Espero que estas sugerencias te sean útiles. ¿Quieres analizar otro texto?' });
      setCurrentCorrections([]);
      setCurrentCorrectionIndex(0);
    }
  };

  const handleFurtherExplanation = async (correction: Correction) => {
    setIsLoading(true);
    addMessage({ sender: 'bot', text: 'Claro, déjame darte una explicación más detallada...' });
    try {
      const explanation = await getFurtherExplanation(correction);
      addMessage({ sender: 'bot', text: explanation });
    } catch (error) {
       const errorMessage = error instanceof Error ? error.message : "Ocurrió un error inesperado.";
      addMessage({ sender: 'bot', text: `Lo siento, no pude generar una explicación más detallada. ${errorMessage}` });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[80vh]">
      <div className="flex-1 p-6 overflow-y-auto space-y-6">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex items-end gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.sender === 'bot' && (
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">AI</div>
            )}
            <div className={`max-w-lg ${msg.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-100'} ${!msg.isCorrectionCard && 'rounded-xl p-4'}`}>
              {msg.isCorrectionCard && msg.correction ? (
                <CorrectionCard
                  correction={msg.correction}
                  isLast={!!msg.isLastCorrection}
                  onNext={handleNextCorrection}
                  onExplainMore={handleFurtherExplanation}
                />
              ) : (
                <p className="whitespace-pre-wrap">{msg.text}</p>
              )}
            </div>
          </div>
        ))}
         {isLoading && !isCorrectionFlowActive && (
             <div className="flex items-end gap-3 justify-start">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">AI</div>
                <div className="bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-100 rounded-xl p-4">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150"></span>
                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-300"></span>
                    </div>
                </div>
             </div>
         )}
        <div ref={chatEndRef} />
      </div>
      <InputArea
        userInput={userInput}
        setUserInput={setUserInput}
        onSendMessage={handleSendText}
        isLoading={isLoading}
        isCorrectionFlowActive={isCorrectionFlowActive}
      />
    </div>
  );
};

export default ChatInterface;
