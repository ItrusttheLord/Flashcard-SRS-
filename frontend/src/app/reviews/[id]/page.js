'use client';
import { useState } from 'react';

export default function GetReviewByID() {
  const [review, setReview] = useState('');
  const [reviewID, setReviewID] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchReview = async () => {
    setIsLoading(true);
    setError(null);
    if (!reviewID || isNaN(reviewID)) {
      setError('Please enter a valid ID');
      setTimeout(() => {
        setError(null);
      }, 300);
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:8000/flashcards/reviews/${reviewID}`
      );
      if (!res.ok) throw new Error('Failed to fetch the review');
      const data = await res.json();
      setReview(data);
      setReviewID('');
    } catch (err) {
      console.error('error fetching data: ' + err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setReview('');
  };

  return (
    <div
      // className="bg-white rounded-lg shadow-md p-6 mx-w-lg mx-auto"
      className="bg-white rounded-lg shadow-md p-6 max-w-sm mx-auto"
    >
      {error && <h2 className="text-red-500 text-center mt-2">{error}</h2>}
      <h2 className="text-xl text-gray-600 font-bold text-center mb-4">
        Get Review By ID
      </h2>
      <input
        type="number"
        value={reviewID}
        onChange={(e) => setReviewID(e.target.value)}
        placeholder="Type the ID of the review..."
        className="border border-gray-300 text-gray-600 rounded-md p-2 w-full mb-4"
      />
      <button
        onClick={fetchReview}
        disabled={isLoading}
        className="w-full bg-blue-500 text-white font-bold py-2 rounded-md transition duration-200 hover:bg-blue-600"
      >
        Submit
      </button>
      {/* Show loading message */}
      {isLoading && (
        <h2 className="text-yellow-500 text-center mt-4">Loading...</h2>
      )}
      {review.ID && (
        <div
          key={review.ID}
          className="mt-g bg-gray-100 text-gray-500 p-4 rounded-md"
        >
          <h2 className="text-lg font-semibold mb-2">Review</h2>
          <ul className="list-disc pl-5">
            <li>ID: {review.ID}</li>
            <li>FlashcardID: {review.flashcard_id}</li>
            <li>Comment: {review.comment}</li>
            <li>Rating: {review.rating} </li>
            <li>Created: {new Date(review.CreatedAt).toLocaleDateString()}</li>
            <li>Updated: {new Date(review.UpdatedAt).toLocaleDateString()}</li>
            <li>
              Next Review:{' '}
              {new Date(review.nextReviewDate).toLocaleDateString()}
            </li>
          </ul>
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
