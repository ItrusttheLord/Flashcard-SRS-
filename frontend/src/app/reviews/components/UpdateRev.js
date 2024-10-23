'use client';
import { useRouter } from 'next/navigation';
import UpdateReview from '../[id]/updateRev/page';

export default function UpdateRevPage() {
  const router = useRouter();

  const handleReviewUpdated = () => {
    // Only navigate back when necessary
    if (confirm('Review updated successfully. Navigate back to flashcards?')) {
      router.push('/flashcards?refresh=true');
    }
  };

  return (
    <div className="container mx-auto p-5">
      <h2 className="text-3xl font-bold mb-6 text-center">Update a Review</h2>
      <UpdateReview onReviewUpdated={handleReviewUpdated} />
    </div>
  );
}
