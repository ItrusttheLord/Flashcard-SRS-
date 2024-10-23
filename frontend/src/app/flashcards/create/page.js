'use client';
import { useState } from 'react';
import CardForm from '../components/CardForm';

const DIFFICULTY_OPTIONS = ['Easy', 'Medium', 'Hard'];

export default function CreateCard({ onCardCreated }) {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [difficult, setDifficult] = useState('');
  const [rating, setRating] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validation: Ensure all fields are filled
    if (!question || !answer || !difficult || !rating) {
      setError('All fields are required');
      return;
    }
    // Validate difficulty level
    if (!DIFFICULTY_OPTIONS.includes(difficult)) {
      setError('Difficulty level must be Easy, Medium, or Hard');
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:8000/flashcards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question,
          answer,
          difficult,
          rating: parseInt(rating),
        }),
      });
      if (!res.ok) {
        const errorResponse = await res.json();
        throw new Error(errorResponse.message || 'Failed to create card');
      }
      // Notify parent component to re-fetch cards
      onCardCreated();

      setQuestion('');
      setAnswer('');
      setDifficult('');
      setRating('');
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {error && <h2 className="text-red-500 text-center">{error}</h2>}
      {isLoading && <h2 className="text-yellow-500 text-center">Loading...</h2>}
      <CardForm
        handleSubmit={handleSubmit}
        question={question}
        setQuestion={setQuestion}
        answer={answer}
        setAnswer={setAnswer}
        difficult={difficult}
        setDifficult={setDifficult}
        rating={rating}
        setRating={setRating}
        isLoading={isLoading}
        buttonText="Create Card"
      />
    </div>
  );
}
