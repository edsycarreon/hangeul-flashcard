import React from "react";
import { cn } from "../../lib/utils";

interface RatingProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  value?: number;
  max?: number;
  onChange?: (value: number) => void;
  readonly?: boolean;
  size?: "sm" | "md" | "lg";
  colorScheme?: {
    1: string;
    2: string;
    3: string;
    4: string;
    5: string;
  };
  labels?: {
    1: string;
    2: string;
    3: string;
    4: string;
    5: string;
  };
}

export const Rating = React.forwardRef<HTMLDivElement, RatingProps>(
  (
    {
      value = 0,
      max = 5,
      onChange,
      readonly = false,
      size = "md",
      colorScheme = {
        1: "text-red-500",
        2: "text-orange-500",
        3: "text-yellow-500",
        4: "text-lime-500",
        5: "text-green-500",
      },
      labels = {
        1: "Incorrect",
        2: "Needs Improvement",
        3: "Passable",
        4: "Good",
        5: "Perfect",
      },
      className,
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      sm: "text-sm gap-1",
      md: "text-base gap-2",
      lg: "text-lg gap-3",
    };

    const iconSizes = {
      sm: "w-5 h-5",
      md: "w-6 h-6",
      lg: "w-8 h-8",
    };

    // Create an array of rating numbers
    const ratings = Array.from({ length: max }, (_, i) => i + 1);

    // Get the color for the current value
    const getColor = (rating: number) => {
      return value >= rating
        ? colorScheme[rating as keyof typeof colorScheme] || ""
        : "text-gray-300";
    };

    // Get the label for the current value
    const getLabel = () => {
      return value ? labels[value as keyof typeof labels] || "" : "";
    };

    return (
      <div
        ref={ref}
        className={cn("flex flex-col items-center", className)}
        {...props}
      >
        <div className={cn("flex items-center", sizeClasses[size])}>
          {ratings.map((rating) => (
            <button
              key={rating}
              type="button"
              className={cn(
                "focus:outline-none",
                getColor(rating),
                readonly
                  ? "cursor-default"
                  : "cursor-pointer transition-transform hover:scale-110"
              )}
              onClick={() => !readonly && onChange?.(rating)}
              disabled={readonly}
              aria-label={`Rate ${rating} out of ${max}`}
            >
              <svg
                className={iconSizes[size]}
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </button>
          ))}
        </div>
        {value > 0 && (
          <div
            className={cn("mt-2 text-center", `text-${size}`, getColor(value))}
          >
            {getLabel()}
          </div>
        )}
      </div>
    );
  }
);
