import React from "react";
import { Button } from "./ui/button";

interface RatingComponentProps {
  onRate: (rating: number) => void;
  disabled?: boolean;
}

const RatingComponent: React.FC<RatingComponentProps> = ({
  onRate,
  disabled = false,
}) => {
  const ratings = [
    { value: 1, label: "Incorrect", color: "bg-red-500 hover:bg-red-600" },
    {
      value: 2,
      label: "Needs Improvement",
      color: "bg-orange-500 hover:bg-orange-600",
    },
    { value: 3, label: "Passable", color: "bg-yellow-500 hover:bg-yellow-600" },
    { value: 4, label: "Good", color: "bg-blue-500 hover:bg-blue-600" },
    { value: 5, label: "Perfect", color: "bg-green-500 hover:bg-green-600" },
  ];

  return (
    <div className="flex flex-col space-y-2 w-full">
      <h3 className="text-center font-medium mb-2">Rate Your Performance</h3>
      <div className="flex flex-wrap justify-center gap-2">
        {ratings.map((rating) => (
          <Button
            key={rating.value}
            onClick={() => onRate(rating.value)}
            disabled={disabled}
            className={`${rating.color} text-white`}
          >
            {rating.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default RatingComponent;
