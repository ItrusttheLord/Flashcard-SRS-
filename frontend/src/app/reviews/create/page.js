'use client';
import { useState } from 'react';
import ReviewForm from '../components/ReviewForm';

export default function CreateReview({ onReviewCreated }) {
  const [flashcardID, setFlashcardID] = useState('');
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState('');
  const [nextReview, setNexReview] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSuccess(null);

    // Validation: Ensure all fields are filled
    if (!flashcardID || !rating || isNaN(rating) || !nextReview) {
      setError('Please fill the required fields');
      setTimeout(() => {
        setError(null);
      }, 3000);
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch(
        `http://localhost:8000/flashcards/${flashcardID}/reviews`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            comment,
            rating: parseInt(rating),
            nextReviewDate: new Date(nextReview).toISOString(),
          }),
        }
      );
      if (!res.ok) {
        const errorResponse = await res.json();
        throw new Error(errorResponse.message || 'Failed to create card');
      }
      // Notify parent component to re-fetch cards
      setIsSuccess('Card Created Successfully!');
      onReviewCreated();
      setFlashcardID('');
      setComment('');
      setRating('');
      setTimeout(() => {
        setIsSuccess(null);
      }, 3000);
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-sm mx-auto">
      <div className="mt-2">
        <label className="block text-gray-700 mb-2" htmlFor="reviewDate">
          Next Review Date:
        </label>
        <input
          id="reviewDate"
          type="date"
          value={nextReview}
          onChange={(e) => setNexReview(e.target.value)}
          required
          className="border border-gray-300 text-gray-600 rounded-md p-2 w-full"
        />
      </div>
      <ReviewForm
        handleSubmit={handleSubmit}
        flashcardID={flashcardID}
        setFlashcardID={setFlashcardID}
        comment={comment}
        setComment={setComment}
        rating={rating}
        setRating={setRating}
        isLoading={isLoading}
        buttonText="Create Review"
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
