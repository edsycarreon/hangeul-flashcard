import { openDB } from "idb";

// Interface defining the structure of character progress data
export interface CharacterProgress {
  characterId: string;
  rating: number;
  lastReviewed: Date;
  nextReviewDate: Date;
  reviewCount: number;
}

// Interface defining user settings
export interface Settings {
  id: "settings";
  showGuideLines: boolean;
  strokeWidth: number;
  autoFlip: boolean;
  autoFlipDelay: number;
}

// Interface for session stats
export interface SessionStats {
  id: "stats";
  totalReviews: number;
  averageRating: number;
  masteredCharacters: string[]; // IDs of characters with rating >= 4
  lastSessionDate: Date;
}

// Database name and version
const DB_NAME = "koreanFlashcardDB";
const DB_VERSION = 1;

// Initialize the database
export async function initDB() {
  const db = await openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Create object stores
      if (!db.objectStoreNames.contains("characterProgress")) {
        db.createObjectStore("characterProgress", { keyPath: "characterId" });
      }

      if (!db.objectStoreNames.contains("settings")) {
        db.createObjectStore("settings", { keyPath: "id" });
      }

      if (!db.objectStoreNames.contains("sessionStats")) {
        db.createObjectStore("sessionStats", { keyPath: "id" });
      }
    },
  });

  return db;
}

// Save character progress
export async function saveCharacterProgress(progress: CharacterProgress) {
  const db = await initDB();
  await db.put("characterProgress", progress);
}

// Get character progress
export async function getCharacterProgress(
  characterId: string
): Promise<CharacterProgress | undefined> {
  const db = await initDB();
  return db.get("characterProgress", characterId);
}

// Get all character progress
export async function getAllCharacterProgress(): Promise<CharacterProgress[]> {
  const db = await initDB();
  return db.getAll("characterProgress");
}

// Save settings
export async function saveSettings(settings: Settings) {
  const db = await initDB();
  await db.put("settings", settings);
}

// Get settings
export async function getSettings(): Promise<Settings | undefined> {
  const db = await initDB();
  const settings = await db.get("settings", "settings");

  if (!settings) {
    // Return default settings if none exist
    const defaultSettings: Settings = {
      id: "settings",
      showGuideLines: true,
      strokeWidth: 3,
      autoFlip: false,
      autoFlipDelay: 3000,
    };
    await saveSettings(defaultSettings);
    return defaultSettings;
  }

  return settings;
}

// Save session stats
export async function saveSessionStats(stats: SessionStats) {
  const db = await initDB();
  await db.put("sessionStats", stats);
}

// Get session stats
export async function getSessionStats(): Promise<SessionStats | undefined> {
  const db = await initDB();
  const stats = await db.get("sessionStats", "stats");

  if (!stats) {
    // Return default stats if none exist
    const defaultStats: SessionStats = {
      id: "stats",
      totalReviews: 0,
      averageRating: 0,
      masteredCharacters: [],
      lastSessionDate: new Date(),
    };
    await saveSessionStats(defaultStats);
    return defaultStats;
  }

  return stats;
}

// Calculate the next review date based on rating
export function calculateNextReviewDate(rating: number): Date {
  const now = new Date();
  let daysToAdd = 1;

  switch (rating) {
    case 1: // Incorrect
      daysToAdd = 0.25; // 6 hours
      break;
    case 2: // Needs Improvement
      daysToAdd = 1;
      break;
    case 3: // Passable
      daysToAdd = 3;
      break;
    case 4: // Good
      daysToAdd = 7;
      break;
    case 5: // Perfect
      daysToAdd = 14;
      break;
    default:
      daysToAdd = 1;
  }

  const nextDate = new Date(now);
  nextDate.setDate(now.getDate() + daysToAdd);

  return nextDate;
}

// Get characters due for review
export async function getDueCharacters(
  characterIds: string[]
): Promise<string[]> {
  const allProgress = await getAllCharacterProgress();

  // Get current date
  const now = new Date();

  // Filter characters that are due for review or have no progress data
  const dueCharacterIds = characterIds.filter((id) => {
    const progress = allProgress.find((p) => p.characterId === id);

    // If no progress, it's due
    if (!progress) return true;

    // If next review date is before or equal to now, it's due
    return new Date(progress.nextReviewDate) <= now;
  });

  return dueCharacterIds;
}

// Update stats after a review
export async function updateStatsAfterReview(
  characterId: string,
  rating: number
) {
  const stats = (await getSessionStats()) || {
    id: "stats",
    totalReviews: 0,
    averageRating: 0,
    masteredCharacters: [],
    lastSessionDate: new Date(),
  };

  // Update the total reviews and calculate new average
  const newTotal = stats.totalReviews + 1;
  const newAverage =
    (stats.averageRating * stats.totalReviews + rating) / newTotal;

  // Update mastered characters if rating is >= 4
  let masteredCharacters = [...stats.masteredCharacters];
  if (rating >= 4 && !masteredCharacters.includes(characterId)) {
    masteredCharacters.push(characterId);
  } else if (rating < 4 && masteredCharacters.includes(characterId)) {
    masteredCharacters = masteredCharacters.filter((id) => id !== characterId);
  }

  const updatedStats: SessionStats = {
    ...stats,
    totalReviews: newTotal,
    averageRating: newAverage,
    masteredCharacters,
    lastSessionDate: new Date(),
  };

  await saveSessionStats(updatedStats);

  // Update the character progress
  const progress = (await getCharacterProgress(characterId)) || {
    characterId,
    rating: 0,
    lastReviewed: new Date(),
    nextReviewDate: new Date(),
    reviewCount: 0,
  };

  const updatedProgress: CharacterProgress = {
    ...progress,
    rating,
    lastReviewed: new Date(),
    nextReviewDate: calculateNextReviewDate(rating),
    reviewCount: progress.reviewCount + 1,
  };

  await saveCharacterProgress(updatedProgress);
}
