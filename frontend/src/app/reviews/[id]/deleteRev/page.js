'use client';

import { useState } from 'react';
import DeleteForm from '@/app/components/DeleteForm';

export default function DeleteReview({ onReviewDeleted }) {
  const [inputID, setInputID] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const deleteRev = async () => {
    setError(null);
    setSuccess(null);

    if (!inputID || isNaN(inputID)) {
      setError('Please enter a valid ID');
      setTimeout(() => setError(null), 3000);
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch(
        `http://localhost:8000/flashcards/reviews/${inputID}`,
        {
          method: 'DELETE',
        }
      );
      if (res.status == 404) throw new Error('review not found');
      if (!res.ok) throw new Error('Failed to delete card');
      onReviewDeleted();
      setInputID('');
      setSuccess('Card deleted successfully!');
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err) {
      console.error('error fetching data: ', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DeleteForm
      inputID={inputID}
      setInputID={setInputID}
      funcName={deleteRev}
      isLoading={isLoading}
      error={error}
      success={success}
    />
  );
}
