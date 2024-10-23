'use client';
import { useRouter } from 'next/navigation';
import UpdatePlan from '../[id]/updatePlan/page';

export default function UpdatePlanPage() {
  const router = useRouter();

  const handlePlanUpdated = () => {
    // Only navigate back when necessary
    if (confirm('Plan Updated successfully. Navigate back to flashcards?')) {
      router.push('/flashcards?refresh=true');
    }
  };

  return (
    <div className="container mx-auto p-5">
      <h2 className="text-3xl font-bold mb-6 text-center">Update a Plan</h2>
      <UpdatePlan onPlanUpdated={handlePlanUpdated} />
    </div>
  );
}
