import { useEffect } from "react";
import { useFlashcards } from "../contexts/FlashcardContext";
import { Flashcard } from "./Flashcard";
import { DrawingCanvas } from "./DrawingCanvas";
import RatingComponent from "./RatingComponent";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Card, CardContent } from "./ui/card";

const FlashcardScreen: React.FC = () => {
  const {
    currentCharacter,
    isFlipped,
    flipCard,
    rateCharacter,
    previousCard,
    skipCard,
    progress,
    loading,
    autoFlip,
    autoFlipDelay,
  } = useFlashcards();

  // Auto-flip timer
  useEffect(() => {
    if (autoFlip && !isFlipped && currentCharacter) {
      const timer = setTimeout(() => {
        flipCard();
      }, autoFlipDelay);

      return () => clearTimeout(timer);
    }
  }, [autoFlip, autoFlipDelay, isFlipped, currentCharacter, flipCard]);

  // Handle drawing completion
  const handleDrawingComplete = () => {
    if (!isFlipped) {
      flipCard();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Loading Flashcards...</h2>
          <Progress value={33} className="w-64" />
        </div>
      </div>
    );
  }

  if (!currentCharacter) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <Card className="w-full max-w-md p-6">
          <CardContent className="text-center">
            <h2 className="text-2xl font-bold mb-4">No Flashcards Available</h2>
            <p className="mb-4">
              There are no flashcards due for review at this time.
            </p>
            <Button onClick={() => window.location.reload()}>Refresh</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl px-4">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left panel - Flashcard */}
        <div className="w-full md:w-1/2 flex flex-col">
          <div className="h-[400px] mb-4">
            <Flashcard
              character={currentCharacter}
              isFlipped={isFlipped}
              onFlip={flipCard}
            />
          </div>

          <div className="flex justify-between items-center mb-4">
            <Button
              onClick={previousCard}
              variant="outline"
              disabled={progress.current <= 1}
            >
              Previous
            </Button>

            <div className="text-center">
              <div className="text-sm text-gray-500 mb-1">
                Card {progress.current} of {progress.total}
              </div>
              <Progress
                value={(progress.current / progress.total) * 100}
                className="w-32 h-2"
              />
            </div>

            <Button onClick={skipCard} variant="outline">
              Skip
            </Button>
          </div>

          {isFlipped && (
            <div className="mb-4">
              <RatingComponent onRate={rateCharacter} />
            </div>
          )}

          {!isFlipped && (
            <div className="text-center mb-4">
              <Button onClick={flipCard} variant="default">
                Flip Card
              </Button>
              <p className="text-sm text-gray-500 mt-2">
                Try to write the character, then click "Done" when finished
              </p>
            </div>
          )}
        </div>

        {/* Right panel - Drawing Canvas */}
        <div className="w-full md:w-1/2 flex flex-col">
          <h2 className="text-xl font-bold mb-4 text-center">Practice Area</h2>
          <div className="flex-1">
            <DrawingCanvas
              width={350}
              height={350}
              onDrawingComplete={handleDrawingComplete}
            />
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Mastered Characters: {progress.completed}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlashcardScreen;
