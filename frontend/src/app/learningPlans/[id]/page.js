'use client';
import { useState } from 'react';

export default function GetPlanByID() {
  const [plan, setPlan] = useState('');
  const [planID, setPlanID] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    if (isLoading) return;
    setIsLoading(true);
    setError(null);
    if (!planID || isNaN(planID)) {
      setError('Please enter a valid ID');
      setIsLoading(false);
      setTimeout(() => {
        setError(null);
      }, 3000);
      return;
    }
    try {
      const res = await fetch(
        `http://localhost:8000/flashcards/learning-plans/${planID}`
      );
      if (!res.ok) throw new Error("Network not ok or item doesn't exist");
      const data = await res.json();
      setPlan(data);
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to close the card (reset the plan state)
  const handleClose = () => {
    setPlan('');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-sm mx-auto">
      {error && <h2 className="text-red-500 text-center mt-2">{error}</h2>}
      <h2 className="text-xl text-gray-600 font-bold text-center mb-4">
        Get Plan By ID
      </h2>
      <input
        type="number"
        value={planID}
        onChange={(e) => setPlanID(e.target.value)}
        placeholder="Type the ID of the Plan..."
        className="border border-gray-300 text-gray-600 rounded-md p-2 w-full mb-4"
      />
      <button
        onClick={handleSubmit}
        disabled={isLoading}
        className="w-full bg-blue-500 text-white font-bold py-2 rounded-md transition duration-200 hover:bg-blue-600"
      >
        Submit
      </button>
      {/* Show loading message */}
      {isLoading && (
        <h2 className="text-yellow-500 text-center mt-4">Loading...</h2>
      )}
      {plan.ID && (
        <div
          key={plan.ID}
          className="mt-g bg-gray-100 text-gray-500 p-4 rounded-md"
        >
          <h2 className="text-lg font-semibold mb-2">Plan</h2>
          <ul className="list-disc pl-5">
            <li>ID: {plan.ID}</li>
            <li>FlashcardID: {plan.flashcard_id}</li>
            <li>Difficulty: {plan.difficulty_level}</li>
            <li>Rating: {plan.rating} </li>
            <li>Repetitions: {plan.repetitions}</li>
            <li>State: {plan.state}</li>
            <li>Current Interval: {plan.current_interval}</li>
            <li>
              Review Date: {new Date(plan.review_date).toLocaleDateString()}
            </li>
            <li>Created: {new Date(plan.CreatedAt).toLocaleDateString()}</li>
            <li>Updated: {new Date(plan.UpdatedAt).toLocaleDateString()}</li>
          </ul>
          {/* Close button to hide the plan details */}
          <button
            onClick={handleClose}
            className="mt-4 bg-red-500 text-white font-bold py-2 px-4 rounded-md transition duration-200 hover:bg-red-600"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}
