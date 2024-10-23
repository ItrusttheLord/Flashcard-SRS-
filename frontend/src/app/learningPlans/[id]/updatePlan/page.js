'use client';
import { useState } from 'react';
import UpdatePlanForm from '../../components/UpdatePlanform';

const DIFFICULTY_OPTIONS = ['Easy', 'Medium', 'Hard'];
const STATE_OPTIONS = ['New', 'Learning', 'Known', 'Mastered'];

export default function UpdatePlan({ onPlanUpdated }) {
  const [planID, setPlanID] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [rating, setRating] = useState('');
  const [repetitions, setRepetitions] = useState('');
  const [state, setState] = useState('');
  const [reviewDate, setReviewDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    if (
      !planID ||
      !difficulty ||
      !rating ||
      isNaN(rating) ||
      !repetitions ||
      !state ||
      !reviewDate
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
      !DIFFICULTY_OPTIONS.includes(difficulty) ||
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
    try {
      const res = await fetch(
        `http://localhost:8000/flashcards/learning-plans/${planID}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            difficulty_level: difficulty,
            state: state,
            repetitions: parseInt(repetitions),
            rating: parseInt(rating),
            review_date: new Date(reviewDate).toISOString(),
          }),
        }
      );

      if (!res.ok) {
        const errorResponse = await res.json();
        throw new Error(errorResponse.message || 'Failed to create card');
      }
      // Notify parent component to re-fetch
      onPlanUpdated();
      setPlanID('');
      setDifficulty('');
      setState('');
      setRepetitions('');
      setRating('');
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-sm mx-auto">
      {error && <h2 className="text-red-500 text-center">{error}</h2>}
      <input
        type="number"
        value={planID}
        onChange={(e) => setPlanID(e.target.value)}
        placeholder="Plan ID"
        className="border border-gray-300 rounded-md p-2 text-gray-600 w-full"
      />
      <UpdatePlanForm
        handleSubmit={handleSubmit}
        difficulty={difficulty}
        setDifficulty={setDifficulty}
        rating={rating}
        setRating={setRating}
        repetitions={repetitions}
        setRepetitions={setRepetitions}
        setState={setState}
        state={state}
        reviewDate={reviewDate}
        setReviewDate={setReviewDate}
        isLoading={isLoading}
        buttonText="Update Plan"
      />
      {isLoading && <h2 className="text-yellow-500 text-center">Loading...</h2>}
      {/* <div className="mb-4">
        <label className="block text-gray-700 mb-2" htmlFor="reviewDate">
          Review Date:
        </label>
        <input
          id="reviewDate"
          type="date"
          value={reviewDate} // "YYYY-MM-DD" format
          onChange={(e) => setReviewDate(e.target.value)} // Set review date directly
          required
          className="border border-gray-300 text-gray-600 rounded-md p-2 w-full"
        />
      </div> */}
    </div>
  );
}
