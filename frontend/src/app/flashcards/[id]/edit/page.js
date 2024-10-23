'use client';
import { useState, useRef } from 'react';
import CardForm from '../../components/CardForm';

const DIFFICULTY_OPTIONS = ['Easy', 'Medium', 'Hard'];

export default function UpdateCard({ onCardUpdated }) {
  const [inputID, setInputID] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [difficult, setDifficult] = useState('');
  const [rating, setRating] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(null);

  const inputRef = useRef(null); // Ref for the input field

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSuccess(null);

    // Validation: Ensure all fields are filled
    if (!question || !answer || !difficult || !rating || !inputID)
      return setError('All fields are required');
    if (!inputID || isNaN(inputID)) return setError('Please enter a valid ID');
    // Validate difficulty level
    if (!DIFFICULTY_OPTIONS.includes(difficult))
      return setError('Difficulty level must be Easy, Medium, or Hard');

    setIsLoading(true);

    try {
      const res = await fetch(`http://localhost:8000/flashcards/${inputID}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
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
      setIsSuccess('Card Updated successfully!');
      onCardUpdated();
      setInputID('');
      setQuestion('');
      setAnswer('');
      setDifficult('');
      setRating('');
      // Focus back on the input field after a successful update
      inputRef.current.focus();

      // Clear success message after 3 seconds
      setTimeout(() => {
        setIsSuccess(null);
      }, 3000);
    } catch (err) {
      console.error('error fetching data: ', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-sm mx-auto">
      <h2 className="text-xl font-semibold text-gray-600 mb-2">
        Enter Card's ID
      </h2>
      <input
        ref={inputRef}
        type="number"
        value={inputID}
        onChange={(e) => setInputID(e.target.value)}
        placeholder="Card ID"
        className="border border-gray-300 rounded-md p-2 w-full text-gray-600"
      />
      {error && <h2 className="text-red-500 text-center mb-4">{error}</h2>}
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
        buttonText="Update Card"
      />
      {isLoading && (
        <h2 className="text-yellow-500 text-center mt-4">Loading...</h2>
      )}
      {isSuccess && (
        <h2 className="text-green-500 text-center mt-4">{isSuccess}</h2>
      )}
    </div>
  );
}
