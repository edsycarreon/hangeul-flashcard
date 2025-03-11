import React, { useState, useEffect, useCallback } from "react";
import { KoreanCharacter } from "../data/koreanCharacters";
import { Flashcard } from "./Flashcard";
import { DrawingCanvas } from "./DrawingCanvas";
import { Rating } from "./ui/rating";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { getDueCharacters, updateStatsAfterReview } from "../lib/storage";

interface FlashcardDeckProps {
  characters: KoreanCharacter[];
  showGuideLines?: boolean;
  strokeWidth?: number;
  autoFlip?: boolean;
  autoFlipDelay?: number;
}

export const FlashcardDeck: React.FC<FlashcardDeckProps> = ({
  characters,
  showGuideLines = true,
  strokeWidth = 3,
  autoFlip = false,
  autoFlipDelay = 3000,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [rating, setRating] = useState(0);
  const [dueCharacters, setDueCharacters] = useState<string[]>([]);
  const [filteredCharacters, setFilteredCharacters] = useState<
    KoreanCharacter[]
  >([]);
  const [skippedCharacters, setSkippedCharacters] = useState<string[]>([]);
  const [historyStack, setHistoryStack] = useState<number[]>([]);
  const [canGoBack, setCanGoBack] = useState(false);

  // Initialize due characters on mount
  useEffect(() => {
    const initializeDueCharacters = async () => {
      if (characters.length > 0) {
        const characterIds = characters.map((char) => char.id);
        const due = await getDueCharacters(characterIds);
        setDueCharacters(due);
      }
    };

    initializeDueCharacters();
  }, [characters]);

  // Filter characters to include only due and non-skipped
  useEffect(() => {
    if (dueCharacters.length > 0) {
      const filtered = characters.filter(
        (char) =>
          dueCharacters.includes(char.id) &&
          !skippedCharacters.includes(char.id)
      );
      setFilteredCharacters(filtered.length > 0 ? filtered : characters);
    } else {
      setFilteredCharacters(characters);
    }
  }, [characters, dueCharacters, skippedCharacters]);

  // Get current character
  const currentCharacter = filteredCharacters[currentIndex] || characters[0];

  // Handle flip
  const handleFlip = useCallback(() => {
    setIsFlipped((prev) => !prev);
  }, []);

  // Handle canvas clear
  const handleCanvasClear = () => {
    // Canvas was cleared
  };

  // Handle rating change
  const handleRating = async (value: number) => {
    setRating(value);

    if (currentCharacter) {
      // Update stats and progress
      await updateStatsAfterReview(currentCharacter.id, value);
    }
  };

  // Handle next card
  const handleNext = useCallback(() => {
    if (rating === 0) {
      // Require rating before proceeding
      return;
    }

    // Add current index to history for "back" navigation
    setHistoryStack((prev) => {
      const newStack = [...prev, currentIndex];
      // Limit history to 20 items
      return newStack.slice(-20);
    });

    // Reset state for next card
    setRating(0);
    setIsFlipped(false);

    // Move to next card
    setCurrentIndex((index) => {
      const nextIndex = (index + 1) % filteredCharacters.length;
      return nextIndex;
    });
  }, [currentIndex, filteredCharacters.length, rating]);

  // Handle previous card
  const handlePrevious = useCallback(() => {
    if (historyStack.length > 0) {
      const prevIndex = historyStack[historyStack.length - 1];
      setHistoryStack((prev) => prev.slice(0, -1));
      setCurrentIndex(prevIndex);
      setRating(0);
      setIsFlipped(false);
    }
  }, [historyStack]);

  // Handle skip card
  const handleSkip = useCallback(() => {
    if (currentCharacter) {
      setSkippedCharacters((prev) => [...prev, currentCharacter.id]);
    }

    // Move to next card without requiring rating
    setRating(0);
    setIsFlipped(false);

    setCurrentIndex((index) => {
      const nextIndex = (index + 1) % filteredCharacters.length;
      return nextIndex;
    });
  }, [currentCharacter, filteredCharacters.length]);

  // Update canGoBack based on history
  useEffect(() => {
    setCanGoBack(historyStack.length > 0);
  }, [historyStack]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 container mx-auto p-4">
      {/* Left panel: Flashcard */}
      <div className="flex flex-col items-center">
        <Flashcard
          character={currentCharacter}
          isFlipped={isFlipped}
          onFlip={handleFlip}
          autoFlip={autoFlip}
          autoFlipDelay={autoFlipDelay}
        />

        {/* Rating area (only shown after flip) */}
        {isFlipped && (
          <div className="mt-6 w-full">
            <div className="text-center mb-2 text-sm text-gray-600">
              Rate how well you remembered this character:
            </div>
            <Rating
              value={rating}
              onChange={handleRating}
              size="lg"
              className="mb-4"
            />
          </div>
        )}

        {/* Navigation controls */}
        <div className="flex items-center justify-between w-full mt-4">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={!canGoBack}
          >
            Previous
          </Button>

          <Button variant="outline" onClick={handleSkip}>
            Skip
          </Button>

          <Button
            variant="default"
            onClick={handleNext}
            disabled={!isFlipped || rating === 0}
          >
            Next
          </Button>
        </div>

        {/* Progress indicator */}
        <div className="w-full mt-4">
          <Progress
            value={(currentIndex / filteredCharacters.length) * 100}
            className="h-2"
          />
          <div className="text-xs text-gray-500 mt-1 text-right">
            {currentIndex + 1} of {filteredCharacters.length}
          </div>
        </div>
      </div>

      {/* Right panel: Drawing canvas */}
      <div className="flex justify-center items-start">
        <DrawingCanvas
          width={300}
          height={300}
          strokeWidth={strokeWidth}
          showGuideLines={showGuideLines}
          onClear={handleCanvasClear}
        />
      </div>
    </div>
  );
};
