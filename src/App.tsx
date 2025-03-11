import { FlashcardProvider } from "./contexts/FlashcardContext";
import FlashcardScreen from "./components/FlashcardScreen";
import { initDB } from "./lib/storage";
import { useEffect, useState } from "react";

function App() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize the database on app load
  useEffect(() => {
    const initialize = async () => {
      try {
        await initDB();
        setIsInitialized(true);
      } catch (err) {
        console.error("Failed to initialize database:", err);
        setError(
          "Failed to initialize the application. Please refresh and try again."
        );
      }
    };

    initialize();
  }, []);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen w-full bg-gray-50">
        <div className="text-center p-6 max-w-md">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-700 mb-4">{error}</p>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => window.location.reload()}
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen w-full bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">
            Korean Character Flashcards
          </h1>
          <p className="text-gray-600 mb-4">Initializing application...</p>
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen w-full bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-800">
            Korean Character Flashcards
          </h1>
          <p className="text-gray-600 text-sm">
            Learn to write Korean characters through practice
          </p>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center w-full">
        <FlashcardProvider>
          <FlashcardScreen />
        </FlashcardProvider>
      </main>

      <footer className="bg-white border-t border-gray-200">
        <div className="container mx-auto px-4 py-3 text-center text-gray-500 text-sm">
          <p>Korean Character Flashcard App © {new Date().getFullYear()}</p>
          <p className="mt-1">
            A tool for learning to write Korean Hangul characters through
            practice and spaced repetition
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
