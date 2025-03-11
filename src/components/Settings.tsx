import React, { useState, useEffect } from "react";
import {
  Settings as SettingsType,
  getSettings,
  saveSettings,
} from "../lib/storage";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";

interface SettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSettingsChange: (settings: SettingsType) => void;
}

export const Settings: React.FC<SettingsProps> = ({
  open,
  onOpenChange,
  onSettingsChange,
}) => {
  const [settings, setSettings] = useState<SettingsType>({
    id: "settings",
    showGuideLines: true,
    strokeWidth: 3,
    autoFlip: false,
    autoFlipDelay: 3000,
  });

  const [loading, setLoading] = useState(true);

  // Load settings on mount
  useEffect(() => {
    const loadSettings = async () => {
      setLoading(true);
      try {
        const savedSettings = await getSettings();
        if (savedSettings) {
          setSettings(savedSettings);
        }
      } catch (error) {
        console.error("Error loading settings:", error);
      } finally {
        setLoading(false);
      }
    };

    if (open) {
      loadSettings();
    }
  }, [open]);

  // Save settings
  const handleSave = async () => {
    try {
      await saveSettings(settings);
      onSettingsChange(settings);
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving settings:", error);
    }
  };

  // Update a setting field
  const updateSetting = <K extends keyof SettingsType>(
    key: K,
    value: SettingsType[K]
  ) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Configure your Korean character learning experience
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="py-6 text-center">Loading settings...</div>
        ) : (
          <div className="py-4">
            {/* Guide Lines Setting */}
            <div className="mb-4">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="guide-lines"
                  className="text-sm font-medium text-gray-700"
                >
                  Show guide lines on canvas
                </label>
                <div className="relative inline-block w-10 align-middle select-none">
                  <input
                    type="checkbox"
                    id="guide-lines"
                    checked={settings.showGuideLines}
                    onChange={(e) =>
                      updateSetting("showGuideLines", e.target.checked)
                    }
                    className="sr-only"
                  />
                  <div className="block h-6 bg-gray-200 rounded-full w-10"></div>
                  <div
                    className={`absolute left-0.5 top-0.5 w-5 h-5 rounded-full transition-transform ${
                      settings.showGuideLines
                        ? "transform translate-x-full bg-blue-600"
                        : "bg-white"
                    }`}
                  ></div>
                </div>
              </div>
            </div>

            {/* Stroke Width Setting */}
            <div className="mb-4">
              <label
                htmlFor="stroke-width"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Stroke width: {settings.strokeWidth}px
              </label>
              <input
                type="range"
                id="stroke-width"
                min="1"
                max="10"
                value={settings.strokeWidth}
                onChange={(e) =>
                  updateSetting("strokeWidth", parseInt(e.target.value, 10))
                }
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Auto Flip Setting */}
            <div className="mb-4">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="auto-flip"
                  className="text-sm font-medium text-gray-700"
                >
                  Auto flip cards
                </label>
                <div className="relative inline-block w-10 align-middle select-none">
                  <input
                    type="checkbox"
                    id="auto-flip"
                    checked={settings.autoFlip}
                    onChange={(e) =>
                      updateSetting("autoFlip", e.target.checked)
                    }
                    className="sr-only"
                  />
                  <div className="block h-6 bg-gray-200 rounded-full w-10"></div>
                  <div
                    className={`absolute left-0.5 top-0.5 w-5 h-5 rounded-full transition-transform ${
                      settings.autoFlip
                        ? "transform translate-x-full bg-blue-600"
                        : "bg-white"
                    }`}
                  ></div>
                </div>
              </div>
            </div>

            {/* Auto Flip Delay Setting (only shown if Auto Flip is enabled) */}
            {settings.autoFlip && (
              <div className="mb-4">
                <label
                  htmlFor="auto-flip-delay"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Auto flip delay: {settings.autoFlipDelay / 1000}s
                </label>
                <input
                  type="range"
                  id="auto-flip-delay"
                  min="1000"
                  max="10000"
                  step="1000"
                  value={settings.autoFlipDelay}
                  onChange={(e) =>
                    updateSetting("autoFlipDelay", parseInt(e.target.value, 10))
                  }
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            )}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
