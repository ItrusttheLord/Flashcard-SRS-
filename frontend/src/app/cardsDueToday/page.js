'use client';
import { useEffect, useState } from 'react';

export default function CardsDuePage() {
  const [flashcards, setFlashcards] = useState([]);
  const [showAnswer, setShowAnswer] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCards = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('http://localhost:8000/flashcards');
      if (!res.ok) throw new Error('Netwok response not ok');
      const data = await res.json();
      setFlashcards(data);
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  if (isLoading) return <h2 className="text-center text-2xl">Loading...</h2>;
  if (error)
    return (
      <h2 className="text-center text-xl text-red-500">No cards to show</h2>
    );

  // filter flashcards by intervals
  const hardCards = flashcards.filter((card) => card.interval === 1);
  const mediumCards = flashcards.filter((card) => card.interval === 2);
  const easyCards = flashcards.filter((card) => card.interval === 7);

  //helper func to display comments from the reveiws
  const renderComments = (reviews) => {
    const comments = reviews.filter(
      (review) => review.comments && review.comments.trim() !== ''
    );
    return comments.length > 0 ? (
      <div className="mt-2">
        <h4 className="font-semibold text-lg">Comments:</h4>
        <ul className="list-disc list-inside">
          {comments.map((review, i) => (
            <li key={i} className="text-gray-700">
              {review.comments}
            </li>
          ))}
        </ul>
      </div>
    ) : (
      <p className="text-gray-500 mt-2">No comments available for this card</p>
    );
  };

  // Helper function to toggle showing answers
  const handleToggleAnswer = (i) => {
    setShowAnswer(showAnswer === i ? null : i); // Toggle visibility of the clicked flashcard's answer
  };

  // Card rendering component
  const renderCard = (card, i) => (
    <div
      key={i}
      className="flashcard p-6 border rounded-lg shadow-md bg-white text-center cursor-pointer transform hover:scale-105 transition-transform duration-200"
      onClick={() => handleToggleAnswer(i)} // Toggle the answer when clicked
    >
      <p className="text-2xl font-bold text-purple-800">{card.question}</p>
      {showAnswer === i && (
        <div className="answer mt-4 text-lg text-gray-700">
          <strong>Answer:</strong> {card.answer}
          {renderComments(card.reviews)} {/* Display comments */}
        </div>
      )}
    </div>
  );

  return (
    <div className="container mx-auto p-5">
      <h2 className="text-3xl font-bold mb-6 text-center">Flashcards Due</h2>

      {/* Hard Cards Section */}
      <div className="mb-10">
        <h3 className="text-2xl font-semibold mb-4 text-center">
          Hard (1-day interval)
        </h3>
        {hardCards.length > 0 ? (
          // Conditionally apply flex if only one card exists
          hardCards.length === 1 ? (
            <div className="flex justify-center">
              {hardCards.map(renderCard)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mx-auto justify-items-center max-w-6xl">
              {hardCards.map(renderCard)}
            </div>
          )
        ) : (
          <p className="text-gray-500 text-center">
            No hard flashcards to review.
          </p>
        )}
      </div>

      {/* Medium Cards Section */}
      <div className="mb-10">
        <h3 className="text-2xl font-semibold mb-4 text-center">
          Medium (2-day interval)
        </h3>
        {mediumCards.length > 0 ? (
          mediumCards.length === 1 ? (
            <div className="flex justify-center">
              {mediumCards.map(renderCard)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mx-auto justify-items-center max-w-6xl">
              {mediumCards.map(renderCard)}
            </div>
          )
        ) : (
          <p className="text-gray-500 text-center">
            No medium flashcards to review.
          </p>
        )}
      </div>

      {/* Easy Cards Section */}
      <div className="mb-10">
        <h3 className="text-2xl font-semibold mb-4 text-center">
          Easy (7-day interval)
        </h3>
        {easyCards.length > 0 ? (
          easyCards.length === 1 ? (
            <div className="flex justify-center">
              {easyCards.map(renderCard)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mx-auto justify-items-center max-w-6xl">
              {easyCards.map(renderCard)}
            </div>
          )
        ) : (
          <p className="text-gray-500 text-center">
            No easy flashcards to review.
          </p>
        )}
      </div>
    </div>
  );
}
