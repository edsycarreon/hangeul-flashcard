import React, {
  useRef,
  useState,
  useEffect,
  HTMLAttributes,
  useCallback,
} from "react";
import { cn } from "../lib/utils";
import { Button } from "./ui/button";
import { getSettings } from "../lib/storage";
import { cardNavigationEvents } from "../contexts/FlashcardContext";

interface DrawingCanvasProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onDrawingComplete"> {
  width?: number;
  height?: number;
  onDrawingComplete?: () => void;
  className?: string;
}

export const DrawingCanvas: React.FC<DrawingCanvasProps> = ({
  width = 400,
  height = 400,
  onDrawingComplete,
  className,
  ...props
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [showGuideLines, setShowGuideLines] = useState(true);
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [hasDrawn, setHasDrawn] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [canvasSize, setCanvasSize] = useState({ width, height });

  // Define clearCanvas as a useCallback to ensure it's stable across renders
  const clearCanvas = useCallback(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    if (!context) return;

    context.clearRect(0, 0, canvasSize.width, canvasSize.height);

    // Redraw guide lines
    if (showGuideLines) {
      drawGuideLines(context);
    }

    setHasDrawn(false);
  }, [canvasSize.width, canvasSize.height, showGuideLines]);

  // Initialize canvas context and handle resizing
  useEffect(() => {
    const updateCanvasSize = () => {
      if (!containerRef.current) return;

      const container = containerRef.current;
      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;

      // Make the canvas square based on the smaller dimension
      const size = Math.min(containerWidth, containerHeight, 500);

      setCanvasSize({
        width: size,
        height: size,
      });
    };

    // Initial size update
    updateCanvasSize();

    // Add resize listener
    window.addEventListener("resize", updateCanvasSize);

    return () => {
      window.removeEventListener("resize", updateCanvasSize);
    };
  }, []);

  // Initialize canvas context
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    // Set canvas resolution for high DPI displays
    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvasSize.width * dpr;
    canvas.height = canvasSize.height * dpr;
    canvas.style.width = `${canvasSize.width}px`;
    canvas.style.height = `${canvasSize.height}px`;
    context.scale(dpr, dpr);

    // Set default styles
    context.lineCap = "round";
    context.lineJoin = "round";
    context.strokeStyle = "#000000";
    context.lineWidth = strokeWidth;

    setCtx(context);

    // Load user settings
    const loadSettings = async () => {
      const settings = await getSettings();
      if (settings) {
        setShowGuideLines(settings.showGuideLines);
        setStrokeWidth(settings.strokeWidth);
        context.lineWidth = settings.strokeWidth;
      }
    };

    loadSettings();

    // Draw initial guide lines
    drawGuideLines(context);
  }, [canvasSize.width, canvasSize.height, strokeWidth]);

  // Subscribe to card navigation events to clear canvas
  useEffect(() => {
    console.log("Setting up card navigation listener");

    // Clear canvas when card changes
    const handleCardNavigation = () => {
      console.log("Card navigation event received, clearing canvas");
      clearCanvas();
    };

    // Subscribe to card navigation events
    const unsubscribe = cardNavigationEvents.subscribe(handleCardNavigation);

    // Cleanup subscription on unmount
    return () => {
      console.log("Cleaning up card navigation listener");
      unsubscribe();
    };
  }, [clearCanvas]);

  // Draw guide lines
  const drawGuideLines = (context: CanvasRenderingContext2D) => {
    if (!showGuideLines) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    // Clear existing guide lines
    context.save();
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.restore();

    // Draw background
    context.fillStyle = "#f8f8f8";
    context.fillRect(0, 0, canvasSize.width, canvasSize.height);

    // Draw grid lines
    context.strokeStyle = "#e0e0e0";
    context.lineWidth = 1;

    // Horizontal lines
    context.beginPath();
    const horizontalSpacing = canvasSize.height / 4;
    for (let i = 1; i < 4; i++) {
      const y = i * horizontalSpacing;
      context.moveTo(0, y);
      context.lineTo(canvasSize.width, y);
    }
    context.stroke();

    // Vertical lines
    context.beginPath();
    const verticalSpacing = canvasSize.width / 4;
    for (let i = 1; i < 4; i++) {
      const x = i * verticalSpacing;
      context.moveTo(x, 0);
      context.lineTo(x, canvasSize.height);
    }
    context.stroke();

    // Reset stroke style for drawing
    context.strokeStyle = "#000000";
    context.lineWidth = strokeWidth;
  };

  // Handle mouse/touch events
  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    if (!ctx) return;

    setIsDrawing(true);
    setHasDrawn(true);

    const { offsetX, offsetY } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(offsetX, offsetY);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !ctx) return;

    const { offsetX, offsetY } = getCoordinates(e);
    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!ctx) return;

    setIsDrawing(false);
    ctx.closePath();
  };

  // Helper to get coordinates from mouse or touch event
  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { offsetX: 0, offsetY: 0 };

    let offsetX, offsetY;

    if ("touches" in e) {
      // Touch event
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      offsetX = touch.clientX - rect.left;
      offsetY = touch.clientY - rect.top;
    } else {
      // Mouse event
      offsetX = e.nativeEvent.offsetX;
      offsetY = e.nativeEvent.offsetY;
    }

    return { offsetX, offsetY };
  };

  // Toggle guide lines
  const toggleGuideLines = () => {
    setShowGuideLines(!showGuideLines);
    if (ctx) {
      drawGuideLines(ctx);
    }
  };

  // Handle done button click
  const handleDone = () => {
    if (onDrawingComplete) {
      onDrawingComplete();
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn("flex flex-col items-center w-full h-full", className)}
      {...props}
    >
      <div className="flex-1 flex items-center justify-center w-full mb-4">
        <canvas
          ref={canvasRef}
          className="border border-gray-300 rounded-md touch-none shadow-md"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
      </div>
      <div className="flex justify-center gap-4 mb-2">
        <Button
          variant="outline"
          onClick={clearCanvas}
          disabled={!hasDrawn}
          size="sm"
        >
          Clear
        </Button>
        <Button variant="outline" onClick={toggleGuideLines} size="sm">
          {showGuideLines ? "Hide Grid" : "Show Grid"}
        </Button>
        <Button
          variant="default"
          onClick={handleDone}
          disabled={!hasDrawn}
          size="sm"
        >
          Done
        </Button>
      </div>
    </div>
  );
};
