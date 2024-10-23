'use client';
import { useState, useEffect } from 'react';

const FlashcardViewer = ({ flashcards }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % flashcards.length);
    setShowAnswer(false); // Reset answer visibility when moving to the next card
  };

  const handlePrevious = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + flashcards.length) % flashcards.length
    );
    setShowAnswer(false); // Reset answer visibility when moving to the previous card
  };

  if (flashcards.length === 0) {
    return (
      <p className="text-center text-gray-500">No flashcards available.</p>
    );
  }

  const { question, answer } = flashcards[currentIndex];
  return (
    <div className="max-w-md mx-auto p-6 border border-gray-300 rounded-lg shadow-lg bg-white mt-10">
      <h3 className="text-5xl text-blue-600 font-semibold text-center mb-6">{`Question ${
        currentIndex + 1
      }:`}</h3>
      <div
        className="cursor-pointer text-2xl text-blue-600 mb-4 hover:text-blue-800 transition-colors duration-200 text-center"
        onClick={() => setShowAnswer(!showAnswer)}
      >
        {question}
      </div>
      {showAnswer && (
        <div className="answer mt-4 text-lg text-black bg-gray-100 p-4 rounded border-l-4 border-blue-500">
          <strong>Answer:</strong> {answer}
        </div>
      )}
      <div className="navigation mt-6 flex justify-between">
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors duration-200"
          onClick={handlePrevious}
          disabled={flashcards.length <= 1}
        >
          Previous
        </button>
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors duration-200"
          onClick={handleNext}
          disabled={flashcards.length <= 1}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default function FlashcardViewerPage() {
  const [flashcards, setFlashcards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch flashcards for the viewer
  const fetchAllCards = async () => {
    try {
      const res = await fetch('http://localhost:8000/flashcards');
      if (!res.ok) throw new Error('Network response was not ok!');
      const data = await res.json();
      setFlashcards(data);
    } catch (err) {
      console.error('Error fetching data: ', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllCards();
  }, []);

  if (isLoading) return <h2 className="text-center text-2xl">Loading...</h2>;
  if (error)
    return (
      <h2 className="text-center text-xl text-red-500">No cards to show</h2>
    );

  return (
    <div className="container mx-auto p-5">
      <h2 className="text-3xl font-bold mb-6 text-center">Flashcard Viewer</h2>
      <FlashcardViewer flashcards={flashcards} />
    </div>
  );
}
