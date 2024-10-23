'use client';
import { useRouter } from 'next/navigation';
import DeleteReview from '../[id]/deleteRev/page';

export default function DeletePage() {
  const router = useRouter();

  const handleReviewDeleted = () => {
    if (confirm('Review deleted successfully. Navigate back to flashcards?')) {
      router.push('/flashcards?refresh=true');
    }
  };

  return (
    <div className="container mx-auto p-5">
      <h2 className="text-3xl font-bold mb-6 text-center">Delete a Review</h2>
      <DeleteReview onReviewDeleted={handleReviewDeleted} />
    </div>
  );
}
