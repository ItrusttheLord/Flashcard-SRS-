'use client';
import { useState } from 'react';
import CreatePlanForm from '../components/CreatePlansForm';

const DIFFICULTY_OPTIONS = ['Easy', 'Medium', 'Hard'];
const STATE_OPTIONS = ['New', 'Learning', 'Known', 'Mastered'];

export default function CreateLearninPlan({ onPlanCreated }) {
  const [flashcardID, setFlashcardID] = useState('');
  const [difficult, setDifficult] = useState('');
  const [rating, setRating] = useState('');
  const [repetitions, setRepetitions] = useState('');
  const [state, setState] = useState('');
  const [reviewDate, setReviewDate] = useState('');
  const [currInt, setCurrInt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validation: Ensure all fields are filled
    if (
      !flashcardID ||
      !difficult ||
      !rating ||
      isNaN(rating) ||
      !repetitions ||
      !state ||
      !reviewDate ||
      !currInt
    ) {
      setError(
        'All fields are required or make sure to enter the appropiate elements for each field'
      );
      setTimeout(() => {
        setError(null);
      }, 3000);
      return;
    }
    if (new Date(reviewDate) < new Date()) {
      setError('Review date cannot be in the past.');
      setTimeout(() => {
        setError(null);
      }, 3000);
      return;
    }

    // Validate difficulty level
    if (
      !DIFFICULTY_OPTIONS.includes(difficult) ||
      !STATE_OPTIONS.includes(state)
    ) {
      setError(
        'Make sure that Difficulty level is Easy, Medium, or Hard and that the State is New,Learning,Known,or Mastered'
      );
      setTimeout(() => {
        setError(null);
      }, 3000);
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch(
        `http://localhost:8000/flashcards/${flashcardID}/learning-plans`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            difficulty_level: difficult,
            state: state,
            repetitions: parseInt(repetitions),
            rating: parseInt(rating),
            current_interval: parseInt(currInt),
            review_date: new Date(reviewDate).toISOString(),
          }),
        }
      );
      if (!res.ok) {
        const errorResponse = await res.json();
        throw new Error(errorResponse.message || 'Failed to create card');
      }
      // Notify parent component to re-fetch
      onPlanCreated();

      setDifficult('');
      setState('');
      setRepetitions('');
      setRating('');
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-sm mx-auto">
      {error && <h2 className="text-red-500 text-center">{error}</h2>}
      {isLoading && <h2 className="text-yellow-500 text-center">Loading...</h2>}
      <div className="mt-2">
        <label className="block text-gray-700 mb-2" htmlFor="reviewDate">
          Current Interval:
        </label>
        <input
          type="number"
          value={currInt}
          onChange={(e) => setCurrInt(e.target.value)}
          required
          className="border border-gray-300 text-gray-600 rounded-md p-2 w-full"
        />
      </div>
      <CreatePlanForm
        handleSubmit={handleSubmit}
        flashcardID={flashcardID}
        setFlashcardID={setFlashcardID}
        difficult={difficult}
        setDifficult={setDifficult}
        rating={rating}
        setRating={setRating}
        repetitions={repetitions}
        setRepetitions={setRepetitions}
        setState={setState}
        state={state}
        reviewDate={reviewDate}
        setReviewDate={setReviewDate}
        isLoading={isLoading}
        buttonText="Create Plan"
      />
    </div>
  );
}
