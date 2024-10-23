'use client';
import { useState } from 'react';
import UpdateForm from '../../components/UpdateForm';

export default function UpdateReview({ onReviewUpdated }) {
  const [reviewID, setReviewID] = useState('');
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
    setIsLoading(true);
    if (!comment || isNaN(rating) || !rating || !reviewID) {
      setError(
        'Please make sure to fill all the requierd fills or make sure you are passing an integer for the rating.'
      );
      setTimeout(() => {
        setError(null);
      }, 3000);
      return;
    }
    try {
      const res = await fetch(
        `http://localhost:8000/flashcards/reviews/${reviewID}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
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
      setIsSuccess('Card Updated Successfully!');
      onReviewUpdated();
      setInputID('');
      setComment('');
      setRating('');
      setTimeout(() => {
        setIsSuccess(null);
      }, 3000);
    } catch (err) {
      console.error('error fetching', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-sm mx-auto">
      <div className="mb-2">
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
      <h2 className="text-gray-600 mb-2">Enter Review ID</h2>
      <input
        type="number"
        value={reviewID}
        onChange={(e) => setReviewID(e.target.value)}
        placeholder="Review ID"
        className="border border-gray-300 rounded-md p-2 w-full text-gray-600"
      />
      {error && <h2 className="text-red-500 text-center mb-4">{error}</h2>}
      <UpdateForm
        handleSubmit={handleSubmit}
        comment={comment}
        setComment={setComment}
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
