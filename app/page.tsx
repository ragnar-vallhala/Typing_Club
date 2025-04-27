"use client";

import { useState, useEffect } from "react";

const paragraphs = [
  "The quick brown fox jumps over the lazy dog.",
  "A journey of a thousand miles begins with a single step.",
  "To be or not to be, that is the question.",
  "All we have to decide is what to do with the time that is given us.",
  "It is our choices that show what we truly are, far more than our abilities.",
  "The stars whispered secrets to those who dared to look up and listen.",
  "In the silence between heartbeats, the universe holds its breath.",
  "Autumn leaves danced like flames in the wind, burning without consuming.",
  "The old typewriter keys clacked like a telegraph from another century.",
  "Her laughter was the soundtrack of summer evenings and firefly light.",
  "The scent of old books is the perfume of civilizations past.",
  "Time flows like ink from a broken pen, staining everything it touches.",
  "The city breathed around me, its pulse synchronized to traffic lights.",
  "Dawn arrived wearing pink chiffon, scattering diamonds across the dew.",
  "Some truths are written in disappearing ink - visible only when you're not looking directly.",
  "The piano remembered what the pianist had forgotten.",
  "Midnight conversations with yourself are the most honest dialogues you'll ever have.",
  "The ocean doesn't apologize for its depth, nor the mountain for its height.",
  "Childhood memories are postcards from a country we can never revisit.",
  "The moon was a comma in the sky's endless sentence.",
  "We are all constellations of the people we've loved and lost.",
  "The library was a cathedral of whispered wisdom and paper saints.",
  "Her words hung in the air like smoke after a gunshot.",
  "The first snow fell like a promise no one was sure could be kept.",
  "Some silences grow louder the longer they're left undisturbed.",
  "The teacup held the ghost of warmth, the memory of conversation.",
  "Streetlights flickered like faulty memories of the sun.",
  "The violin wept openly while the cello grieved in private.",
  "Old photographs are time machines with limited seating.",
  "The forest remembers every footstep, even after the path disappears.",
  "His handshake contained the weight of unspoken contracts.",
  "The abandoned house stood like a parenthesis with nothing between them.",
  "Rain on a tin roof is nature's lullaby for the sleepless.",
  "The dictionary is the cemetery where words go to die respectably.",
  "Her smile was sunrise after a month of overcast days.",
  "The chessboard was a battlefield of infinite possibilities.",
  "Some questions are Russian nesting dolls - each answer reveals another question.",
  "The thunder growled its disapproval of our human concerns.",
  "Fog transformed the familiar into something mysterious and new.",
  "The baker's hands told stories of midnight kneading and dawn deliveries.",
  "The river wrote and rewrote its memoir in ever-changing ink.",
  "His lies were snowflakes - intricate, beautiful, and melting under scrutiny.",
  "The antique clock measured time in coughs and creaks rather than seconds.",
  "Fireworks are the universe winking at us with colored light.",
  "The old dog's graying muzzle marked the passage of time more accurately than any clock.",
  "The bridge stood as a handshake between two unwilling shores.",
  "Her diary was a museum of moments too fragile for daylight.",
  "The wind carried echoes of every conversation it had ever overheard.",
  "The barista crafted lattes like a pharmacist dispensing liquid courage.",
  "Dust motes danced in sunbeams like stars in a private galaxy.",
  "The abandoned carnival was childhood's ghost town.",
  "His apology arrived like winter - too late to save the harvest.",
  "The old map whispered promises of places that might not exist anymore.",
  "The symphony was mathematics made audible and emotional.",
  "Falling in love is the one freefall where you hope never to hit bottom."
];

const TypingSpeedGame = () => {
  const [textToType, setTextToType] = useState(paragraphs[0]);
  const [userInput, setUserInput] = useState("");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [accuracy, setAccuracy] = useState(100);
  const [errors, setErrors] = useState(0);
  const [highestWpm, setHighestWpm] = useState(0);
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [targetWordCount, setTargetWordCount] = useState(0);
  const [highlightedText, setHighlightedText] = useState<JSX.Element[]>([]);
  const [errorAnalysis, setErrorAnalysis] = useState<JSX.Element>(<></>);

  useEffect(() => {
    selectRandomParagraph();
  }, []);

  const selectRandomParagraph = () => {
    const randomIndex = Math.floor(Math.random() * paragraphs.length);
    const newText = paragraphs[randomIndex];
    setTextToType(newText);
    setTargetWordCount(newText.trim().split(/\s+/).length);
    setHighlightedText(highlightErrors("", newText));
  };

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (startTime !== null && !gameOver) {
      intervalId = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        setTimeElapsed(elapsed);

        if (elapsed >= 60) {
          endGame();
        }
      }, 1000);
    }

    return () => clearInterval(intervalId);
  }, [startTime, gameOver]);

  const highlightErrors = (input: string, target: string) => {
    const targetWords = target.split(/(\s+)/).filter(word => word.length > 0);
    const inputWords = input.split(/(\s+)/).filter(word => word.length > 0);
    
    return targetWords.map((word, index) => {
      if (word.match(/\s+/)) {
        return <span key={`space-${index}`}>{word}</span>;
      }
      
      const inputWord = index < inputWords.length ? inputWords[index] : "";
      const isIncorrect = inputWord !== word && inputWord !== "";
      
      return (
        <span 
          key={`word-${index}`}
          className={isIncorrect ? "bg-red-100 text-red-800" : ""}
        >
          {word}
        </span>
      );
    });
  };

  const generateErrorAnalysis = () => {
    const targetWords = textToType.split(/(\s+)/).filter(word => word.length > 0);
    const inputWords = userInput.split(/(\s+)/).filter(word => word.length > 0);
    
    return (
      <div className="mt-6 text-left">
        <h3 className="text-xl font-semibold text-indigo-700 mb-3">Error Analysis:</h3>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-700">Original Text:</h4>
            <p className="text-gray-800 bg-indigo-50 p-3 rounded">
              {highlightErrors(userInput, textToType)}
            </p>
          </div>
          <div>
            <h4 className="font-medium text-gray-700">Your Input:</h4>
            <p className="text-gray-800 bg-gray-50 p-3 rounded">
              {inputWords.map((word, index) => {
                const targetWord = index < targetWords.length ? targetWords[index] : "";
                const isIncorrect = word !== targetWord && !word.match(/\s+/);
                
                return (
                  <span
                    key={`input-word-${index}`}
                    className={isIncorrect ? "bg-red-100 text-red-800" : ""}
                  >
                    {word}
                  </span>
                );
              })}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {targetWords.map((word, index) => {
              const inputWord = index < inputWords.length ? inputWords[index] : "";
              if (word !== inputWord && !word.match(/\s+/)) {
                return (
                  <div key={`error-${index}`} className="bg-red-50 p-2 rounded">
                    <p className="text-red-700">
                      <span className="font-medium">Expected:</span> {word}
                    </p>
                    <p className="text-red-700">
                      <span className="font-medium">Typed:</span> {inputWord || "[missing]"}
                    </p>
                    <p className="text-red-700">
                      <span className="font-medium">Position:</span> Word {index + 1}
                    </p>
                  </div>
                );
              }
              return null;
            }).filter(Boolean)}
          </div>
        </div>
      </div>
    );
  };

  const calculateMetrics = (input: string) => {
    setHighlightedText(highlightErrors(input, textToType));

    const currentWords = input.trim().split(/\s+/);
    const currentWordCount = input.trim() === "" ? 0 : currentWords.length;
    setWordCount(currentWordCount);

    let correctChars = 0;
    for (let i = 0; i < Math.min(input.length, textToType.length); i++) {
      if (input[i] === textToType[i]) {
        correctChars++;
      }
    }
    const newAccuracy = input.length > 0 ? (correctChars / input.length) * 100 : 100;
    setAccuracy(newAccuracy);

    let errorCount = 0;
    const targetWords = textToType.split(/\s+/);
    const inputWords = input.split(/\s+/);
    
    for (let i = 0; i < Math.min(inputWords.length, targetWords.length); i++) {
      if (inputWords[i] !== targetWords[i]) {
        errorCount++;
      }
    }
    errorCount += Math.max(0, inputWords.length - targetWords.length);
    setErrors(errorCount);

    const wordsTyped = input.length / 5;
    const minutesElapsed = timeElapsed / 60;
    const newWpm = minutesElapsed > 0 ? Math.round(wordsTyped / minutesElapsed) : 0;
    setWpm(newWpm);

    if (input === textToType) {
      setIsTypingComplete(true);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setUserInput(input);

    if (startTime === null) {
      setStartTime(Date.now());
    }

    if (!gameOver) {
      calculateMetrics(input);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      resetGame();
    }
    if (e.key === "Enter") {
      e.preventDefault();
      endGame();
    }
  };

  const endGame = () => {
    setGameOver(true);
    calculateMetrics(userInput);
    setErrorAnalysis(generateErrorAnalysis());
    if (wpm > highestWpm) {
      setHighestWpm(wpm);
    }
  };

  const resetGame = () => {
    selectRandomParagraph();
    setUserInput("");
    setStartTime(null);
    setTimeElapsed(0);
    setWpm(0);
    setGameOver(false);
    setAccuracy(100);
    setErrors(0);
    setIsTypingComplete(false);
    setWordCount(0);
    setErrorAnalysis(<></>);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-indigo-100 flex flex-col items-center justify-center p-6 font-sans">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden">
        {gameOver ? (
          <div className="p-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-indigo-600 mb-6">
                {isTypingComplete ? "Completed!" : "Test Ended"}
              </h1>
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-indigo-50 p-4 rounded-xl">
                  <h2 className="text-lg font-semibold text-indigo-700 mb-1">Your Speed</h2>
                  <p className="text-3xl font-bold text-indigo-600">
                    {wpm} <span className="text-lg text-indigo-400">WPM</span>
                  </p>
                </div>
                <div className="bg-indigo-50 p-4 rounded-xl">
                  <h2 className="text-lg font-semibold text-indigo-700 mb-1">Accuracy</h2>
                  <p className="text-3xl font-bold text-indigo-600">{accuracy.toFixed(1)}%</p>
                </div>
                <div className="bg-indigo-50 p-4 rounded-xl">
                  <h2 className="text-lg font-semibold text-indigo-700 mb-1">Time</h2>
                  <p className="text-3xl font-bold text-indigo-600">
                    {timeElapsed}s
                  </p>
                </div>
              </div>
              <p className="text-lg text-gray-600 mb-6">
                You made {errors} error{errors !== 1 ? "s" : ""} during the test.
              </p>
            </div>
            
            {errorAnalysis}
            
            <div className="text-center mt-8">
              <button
                onClick={resetGame}
                className="px-8 py-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-semibold shadow-md"
              >
                Play Again
              </button>
            </div>
          </div>
        ) : (
          <div className="p-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-indigo-600">Typing Speed Test</h1>
              <div className="flex items-center space-x-4">
                <span className="text-lg font-semibold text-indigo-500">
                  Time: {timeElapsed}s
                </span>
                <span className="text-lg font-semibold text-indigo-500">WPM: {wpm}</span>
              </div>
            </div>
            <div className="mb-6 p-4 bg-indigo-50 rounded-xl border-l-4 border-indigo-400">
              <p className="text-lg text-gray-700 leading-relaxed">
                {highlightedText}
              </p>
            </div>
            <input
              type="text"
              value={userInput}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Start typing here... (Press Enter to finish)"
              className="w-full p-4 text-lg bg-gray-50 border-2 border-indigo-200 rounded-xl focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
              autoFocus
            />
            <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
              <span>Accuracy: {accuracy.toFixed(1)}%</span>
              <span>Errors: {errors}</span>
              <span>Characters: {userInput.length}/{textToType.length}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TypingSpeedGame;