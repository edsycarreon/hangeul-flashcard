import React, { createContext, useContext, useState, useEffect } from "react";
import { KoreanCharacter, allKoreanCharacters } from "../data/koreanCharacters";
import {
  getDueCharacters,
  updateStatsAfterReview,
  getSettings,
  getSessionStats,
} from "../lib/storage";

// Event emitter for card navigation
export const cardNavigationEvents = {
  listeners: new Set<() => void>(),

  subscribe(listener: () => void) {
    console.log("New listener subscribed to card navigation events");
    this.listeners.add(listener);
    return () => {
      console.log("Listener unsubscribed from card navigation events");
      this.listeners.delete(listener);
    };
  },

  emit() {
    console.log(
      "Emitting card navigation event to",
      this.listeners.size,
      "listeners"
    );
    this.listeners.forEach((listener) => {
      try {
        listener();
      } catch (error) {
        console.error("Error in card navigation listener:", error);
      }
    });
  },
};

interface FlashcardContextType {
  currentCharacter: KoreanCharacter | null;
  isFlipped: boolean;
  flipCard: () => void;
  rateCharacter: (rating: number) => void;
  nextCard: () => void;
  previousCard: () => void;
  skipCard: () => void;
  progress: {
    current: number;
    total: number;
    completed: number;
  };
  loading: boolean;
  autoFlip: boolean;
  autoFlipDelay: number;
}

const FlashcardContext = createContext<FlashcardContextType | undefined>(
  undefined
);

export const useFlashcards = () => {
  const context = useContext(FlashcardContext);
  if (!context) {
    throw new Error("useFlashcards must be used within a FlashcardProvider");
  }
  return context;
};

interface FlashcardProviderProps {
  children: React.ReactNode;
}

export const FlashcardProvider: React.FC<FlashcardProviderProps> = ({
  children,
}) => {
  const [characters, setCharacters] = useState<KoreanCharacter[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [history, setHistory] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [autoFlip, setAutoFlip] = useState(false);
  const [autoFlipDelay, setAutoFlipDelay] = useState(3000);
  const [completedCount, setCompletedCount] = useState(0);

  // Load characters due for review
  useEffect(() => {
    const loadCharacters = async () => {
      setLoading(true);

      try {
        // Get all character IDs
        const allIds = allKoreanCharacters.map((char) => char.id);

        // Get IDs of characters due for review
        const dueIds = await getDueCharacters(allIds);

        // Filter characters that are due
        const dueCharacters = allKoreanCharacters.filter((char) =>
          dueIds.includes(char.id)
        );

        // If no characters are due, use all characters
        if (dueCharacters.length === 0) {
          setCharacters(allKoreanCharacters);
        } else {
          setCharacters(dueCharacters);
        }

        // Load settings
        const settings = await getSettings();
        if (settings) {
          setAutoFlip(settings.autoFlip);
          setAutoFlipDelay(settings.autoFlipDelay);
        }

        // Load stats
        const stats = await getSessionStats();
        if (stats) {
          setCompletedCount(stats.masteredCharacters.length);
        }
      } catch (error) {
        console.error("Error loading characters:", error);
        // Fallback to all characters if there's an error
        setCharacters(allKoreanCharacters);
      }

      setLoading(false);
    };

    loadCharacters();
  }, []);

  // Current character
  const currentCharacter =
    characters.length > 0 ? characters[currentIndex] : null;

  // Flip the card
  const flipCard = () => {
    setIsFlipped(!isFlipped);
  };

  // Rate the current character
  const rateCharacter = async (rating: number) => {
    if (!currentCharacter) return;

    try {
      // Update stats and progress
      await updateStatsAfterReview(currentCharacter.id, rating);

      // If rating is good or perfect, increment completed count
      if (rating >= 4) {
        setCompletedCount((prev) => prev + 1);
      }

      // Move to next card
      if (currentIndex < characters.length - 1) {
        // Add current index to history
        setHistory((prev) => [...prev, currentIndex]);

        // Move to next card
        setCurrentIndex(currentIndex + 1);

        // Reset flip state
        setIsFlipped(false);

        // Explicitly emit card navigation event
        console.log("Rating complete, emitting card navigation event");
        cardNavigationEvents.emit();
      }
    } catch (error) {
      console.error("Error updating character rating:", error);
    }
  };

  // Go to next card
  const nextCard = () => {
    if (currentIndex < characters.length - 1) {
      // Add current index to history
      setHistory((prev) => [...prev, currentIndex]);

      // Move to next card
      setCurrentIndex(currentIndex + 1);

      // Reset flip state
      setIsFlipped(false);

      // Emit card navigation event
      cardNavigationEvents.emit();
    }
  };

  // Go to previous card
  const previousCard = () => {
    if (history.length > 0) {
      // Get last index from history
      const prevIndex = history[history.length - 1];

      // Update history
      setHistory((prev) => prev.slice(0, -1));

      // Set current index to previous
      setCurrentIndex(prevIndex);

      // Reset flip state
      setIsFlipped(false);

      // Emit card navigation event
      cardNavigationEvents.emit();
    }
  };

  // Skip current card
  const skipCard = () => {
    if (currentIndex < characters.length - 1) {
      // Move to next card without adding to history
      setCurrentIndex(currentIndex + 1);

      // Reset flip state
      setIsFlipped(false);

      // Emit card navigation event
      cardNavigationEvents.emit();
    }
  };

  // Progress tracking
  const progress = {
    current: currentIndex + 1,
    total: characters.length,
    completed: completedCount,
  };

  const value = {
    currentCharacter,
    isFlipped,
    flipCard,
    rateCharacter,
    nextCard,
    previousCard,
    skipCard,
    progress,
    loading,
    autoFlip,
    autoFlipDelay,
  };

  return (
    <FlashcardContext.Provider value={value}>
      {children}
    </FlashcardContext.Provider>
  );
};

export default FlashcardContext;
