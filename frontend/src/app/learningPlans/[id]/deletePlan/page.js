'use client';
import { useState } from 'react';
import DeleteForm from '@/app/components/DeleteForm';

export default function DeletePlan({ onPlanDeleted }) {
  const [planID, setPlanID] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);
    if (isNaN(planID) || !planID) {
      setError('Please enter a valid ID');
      setTimeout(() => setError(null), 3000);
      return;
    }
    try {
      const res = await fetch(
        `http://localhost:8000/flashcards/learning-plans/${planID}`,
        {
          method: 'DELETE',
        }
      );
      if (!res.ok) throw new Error('Failed to delete card');
      onPlanDeleted();
      setPlanID('');
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DeleteForm
      inputID={planID}
      setInputID={setPlanID}
      funcName={handleSubmit}
      isLoading={isLoading}
      error={error}
    />
  );
}
