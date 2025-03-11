import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "./ui/card";
import { KoreanCharacter } from "../data/koreanCharacters";

interface FlashcardProps {
  character: KoreanCharacter;
  isFlipped: boolean;
  onFlip: () => void;
}

const Flashcard: React.FC<FlashcardProps> = ({
  character,
  isFlipped,
  onFlip,
}) => {
  // Animation variants for the card flip
  const variants = {
    front: {
      rotateY: 0,
      transition: { duration: 0.3 },
    },
    back: {
      rotateY: 180,
      transition: { duration: 0.3 },
    },
  };

  // Get category label with proper capitalization
  const getCategoryLabel = (category: string) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  // Get frequency indicator color
  const getFrequencyColor = (frequency: string) => {
    switch (frequency) {
      case "high":
        return "bg-green-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="h-full w-full flex items-center justify-center">
      <div
        className="w-full max-w-md h-full max-h-[350px] perspective-1000 cursor-pointer"
        onClick={onFlip}
      >
        <motion.div
          className="w-full h-full relative preserve-3d"
          animate={isFlipped ? "back" : "front"}
          variants={variants}
        >
          {/* Front side - English */}
          <Card
            className={`absolute w-full h-full backface-hidden ${
              isFlipped ? "hidden" : ""
            } flex flex-col`}
          >
            <CardContent className="flex flex-col items-center justify-center h-full p-6">
              <div className="text-7xl font-bold mb-8 flex-grow flex items-center justify-center">
                {character.english}
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium">Category:</span>
                  <span className="text-sm">
                    {getCategoryLabel(character.category)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Frequency:</span>
                  <span
                    className={`inline-block w-3 h-3 rounded-full ${getFrequencyColor(
                      character.frequency
                    )}`}
                  ></span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Back side - Korean */}
          <Card
            className={`absolute w-full h-full backface-hidden rotateY-180 ${
              !isFlipped ? "hidden" : ""
            } flex flex-col`}
          >
            <CardContent className="flex flex-col items-center justify-center h-full p-6">
              <div className="text-9xl font-bold mb-8 flex-grow flex items-center justify-center">
                {character.korean}
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="text-xl mb-4">{character.english}</div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium">Category:</span>
                  <span className="text-sm">
                    {getCategoryLabel(character.category)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Flashcard;
