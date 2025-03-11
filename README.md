# Korean Character Flashcard Application

An interactive web application for learning to write Korean characters through flashcards, drawing practice, and spaced repetition.

## Features

- **Flashcard System**: Two-sided flashcards with English transliteration on one side and Korean character on the reverse
- **Drawing Canvas**: Interactive drawing space to practice writing characters with adjustable grid lines
- **Self-Assessment**: 5-point rating system to track your learning progress
- **Spaced Repetition**: Characters appear more or less frequently based on your self-assessment ratings
- **Offline Support**: Full functionality without internet connection using IndexedDB for local storage

## Technical Stack

- **Frontend**: React with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Animation**: Framer Motion
- **Storage**: IndexedDB (via idb library)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/korean-character-flashcards.git
cd korean-character-flashcards
```

2. Install dependencies

```bash
npm install
# or
yarn
```

3. Start the development server

```bash
npm run dev
# or
yarn dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

1. **View Flashcard**: The application displays an English transliteration of a Korean character
2. **Practice Writing**: Use the drawing canvas to practice writing the character
3. **Check Your Work**: Flip the card to see the correct Korean character
4. **Rate Your Performance**: Rate your attempt on a scale of 1-5
5. **Spaced Repetition**: Characters you struggle with will appear more frequently

## Project Structure

- `/src/components`: React components
- `/src/contexts`: React context providers
- `/src/data`: Korean character data
- `/src/hooks`: Custom React hooks
- `/src/lib`: Utility functions and storage logic

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Thanks to all contributors who have helped with the development of this application
- Inspired by spaced repetition learning systems like Anki
