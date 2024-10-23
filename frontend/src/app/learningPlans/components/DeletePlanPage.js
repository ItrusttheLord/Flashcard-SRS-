'use client';
import { useRouter } from 'next/navigation';
import DeletePlan from '../[id]/deletePlan/page';

export default function DeletePlanPage() {
  const router = useRouter();

  const handlePlanDeleted = () => {
    // Only navigate back when necessary
    if (confirm('Plan Deleted successfully. Navigate back to flashcards?')) {
      router.push('/flashcards?refresh=true');
    }
  };

  return (
    <div className="container mx-auto p-5">
      <h2 className="text-3xl font-bold mb-6 text-center">Delete a Plan</h2>
      <DeletePlan onPlanDeleted={handlePlanDeleted} />
    </div>
  );
}
