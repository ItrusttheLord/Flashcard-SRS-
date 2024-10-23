'use client';
import { useRouter } from 'next/navigation';
import CreateReview from './create/page';
import UpdateRevPage from './components/UpdateRev';
import DeletePage from './components/DeletePage';
import GetReviewByID from './[id]/page';

export default function ReviewsPage() {
  const router = useRouter();

  const handleReviewCreated = () => {
    // Onavigate back when
    if (confirm('Review created successfully. Navigate back to flashcards?')) {
      router.push('/flashcards?refresh=true');
    }
  };

  return (
    <div className="container mx-auto p-5">
      <h2 className="text-3xl font-bold mb-6 text-center">Create a Review</h2>
      <CreateReview onReviewCreated={handleReviewCreated} />
      <div>
        <UpdateRevPage />
      </div>
      <div>
        <DeletePage />
      </div>
      <div>
        <GetReviewByID />
      </div>
    </div>
  );
}
