'use client';
import { useState, useEffect } from 'react';
import CreateCard from './create/page';
import DeleteItem from './[id]/delete/page';
import UpdateCard from './[id]/edit/page';
import GetCardById from './[id]/page';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Flashcards() {
  const [flashcards, setFlashcards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  // Fetch all cards
  const fetchAllCards = async () => {
    try {
      const res = await fetch('http://localhost:8000/flashcards');
      if (!res.ok) throw new Error('Network response was not ok!');
      const data = await res.json();
      setFlashcards(data);
    } catch (err) {
      console.error('Error fetching data: ', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllCards();
    // Check if refresh query exists to re-fetch cards
    if (router?.query?.refresh) {
      fetchAllCards();
    }
  }, [router?.query?.refresh]); // Use optional chaining to avoid errors

  // Re-fetch the flashcards after a new one is created
  const handleCardCreated = () => {
    fetchAllCards();
  };
  // Re-fetch after deleting card
  const handleCardDeleted = () => {
    fetchAllCards();
  };
  //Re-fetch after Updating
  const handleCardUpdated = () => {
    fetchAllCards();
  };
  // Check the query params to decide whether to re-fetch cards

  // const handleReviewCreated = () => {
  //   fetchAllCards(); // Re-fetch flashcards after review is created
  // };
  if (isLoading) return <h2>Loading...</h2>;
  if (error) return <h2>No cards to Show</h2>;

  return (
    <div className="container mx-auto p-5">
      <h2 className="text-3xl font-bold mb-6 text-center">Flashcards</h2>

      {/* Button to navigate to the Study all cards Page */}
      <div className="text-center mb-6">
        <Link
          href="/cardsDueToday"
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Cards Due
        </Link>
      </div>

      {/* Button to navigate to the Study all cards Page */}
      <div className="text-center mb-6">
        <Link
          href="/studyFlashcards"
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Study Flashcards
        </Link>
      </div>

      {/* Button to navigate to the  Review page */}
      <div className="text-center mb-6">
        <Link
          href="/reviews"
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Review Page
        </Link>
      </div>

      {/* Button to navigate to the LearningPlan page */}
      <div className="text-center mb-6">
        <Link
          href="/learningPlans"
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Learning Plan Page
        </Link>
      </div>

      {/* Form components */}
      <div className="mb-6">
        <DeleteItem onCardDeleted={handleCardDeleted} />
      </div>
      <div className="mb-6">
        <GetCardById />
      </div>
      <div className="mb-6">
        <CreateCard onCardCreated={handleCardCreated} />
      </div>
      <div className="mb-6">
        <UpdateCard onCardUpdated={handleCardUpdated} />
      </div>

      {/* Flashcards List */}
      {flashcards.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {flashcards.map((card) => (
            <div key={card.ID} className="bg-white rounded-lg shadow-lg p-4">
              <h3 className="text-lg text-gray-500 font-semibold">
                ID: {card.ID}
              </h3>
              <h3 className="text-lg text-gray-500">
                Question: {card.question}
              </h3>
              <h3 className="text-lg text-gray-500">Answer: {card.answer}</h3>
              <h3 className="text-lg text-gray-500">
                Difficulty: {card.difficult}
              </h3>
              <h3 className="text-sm text-gray-500">Rating: {card.rating}</h3>
              <h3 className="text-sm text-gray-500">
                Created: {new Date(card.CreatedAt).toLocaleDateString()}
              </h3>
              <h3 className="text-sm text-gray-500">
                Updated: {new Date(card.UpdatedAt).toLocaleDateString()}
              </h3>
              <h3 className="text-sm text-gray-500">
                Next Review:{' '}
                {new Date(card.nextReviewDate).toLocaleDateString()}
              </h3>
              <h3 className="text-sm text-gray-500">
                Interval: {card.interval}
              </h3>
              {/* Display Reviews */}
              <h3 className="text-lg text-gray-600 font-bold mt-4">Reviews:</h3>
              {card.reviews.length > 0 ? (
                <ul className="list-disc ml-5">
                  {card.reviews.map((review) => (
                    <li key={review.ID} className="text-sm text-gray-600">
                      <p className="text-red-700 font-bold">
                        Review ID: {review.ID}
                      </p>
                      <p>Rating: {review.rating}</p>
                      <p>Comment: {review.comment}</p>
                      <p>
                        Next Review:{' '}
                        {new Date(review.nextReviewDate).toLocaleDateString()}
                        <p>
                          Created At:{' '}
                          {new Date(review.CreatedAt).toLocaleDateString()}
                        </p>
                        <p>
                          Updated At:{' '}
                          {new Date(review.UpdatedAt).toLocaleDateString()}
                        </p>
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500"> No reviews available.</p>
              )}
              {/* Display Learning Plan */}
              <h3 className="text-lg text-gray-600 font-bold mt-4">
                Learning Plan:
              </h3>
              {card.learning_plan.length > 0 ? (
                <ul className="list-disc ml-5">
                  {card.learning_plan.map((plan) => (
                    <li key={plan.ID} className="text-sm text-gray-600">
                      <p className="text-green-700 font-bold">
                        Plan ID: {plan.ID}
                      </p>
                      <p>Difficulty Level: {plan.difficulty_level}</p>
                      <p>Rating: {plan.rating}</p>
                      <p>Repetitions: {plan.repetitions}</p>
                      <p>State: {plan.state}</p>
                      <p>Current Interval: {plan.current_interval}</p>
                      <p>
                        Review Date:{' '}
                        {new Date(plan.review_date).toLocaleDateString()}
                      </p>
                      <p>
                        Created At:{' '}
                        {new Date(plan.CreatedAt).toLocaleDateString()}
                      </p>
                      <p>
                        Updated At:{' '}
                        {new Date(plan.UpdatedAt).toLocaleDateString()}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">
                  No learning plan available.
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <h2 className="text-center text-xl text-gray-500 mt-4">
          Sorry, no cards to display
        </h2>
      )}
    </div>
  );
}
