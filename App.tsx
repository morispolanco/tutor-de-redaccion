
import React from 'react';
import ChatInterface from './components/ChatInterface';

const App: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100 dark:bg-slate-900 font-sans p-4">
      <div className="w-full max-w-3xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 dark:text-slate-100">
            Tutor de Redacción AI
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Pega tu texto y recibe sugerencias para mejorar tu escritura.
          </p>
        </header>
        <main className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden">
          <ChatInterface />
        </main>
        <footer className="text-center mt-8 text-sm text-slate-500 dark:text-slate-400">
          <p>Desarrollado con el poder de Gemini API.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
