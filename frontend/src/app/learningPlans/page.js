'use client';
import { useRouter } from 'next/navigation';
import CreateLearninPlan from './create/page';
import UpdatePlanPage from './components/UpdatePage';
import DeletePlanPage from './components/DeletePlanPage';
import GetPlanByID from './[id]/page';

export default function ReviewsPage() {
  const router = useRouter();

  const handlePlanCreated = () => {
    // Only navigate back when necessary
    if (confirm('Plan created successfully. Navigate back to flashcards?')) {
      router.push('/flashcards?refresh=true');
    }
  };

  return (
    <div className="container mx-auto p-5">
      <h2 className="text-3xl font-bold mb-6 text-center">Create a Plan</h2>
      <CreateLearninPlan onPlanCreated={handlePlanCreated} />
      <div>
        <UpdatePlanPage />
      </div>
      <div>
        <DeletePlanPage />
      </div>
      <GetPlanByID />
    </div>
  );
}
