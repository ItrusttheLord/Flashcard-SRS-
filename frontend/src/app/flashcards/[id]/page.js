'use client';

import { useState } from 'react';

export default function GetCardById() {
  const [card, setCard] = useState({});
  const [inputID, setInputID] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [error, setErr] = useState(null);

  const fetchCard = async () => {
    setCard({});
    setErr(null);
    setLoading(true);

    if (!inputID || isNaN(inputID)) {
      setErr('Please enter a valid ID');
      setTimeout(() => setErr(null), 3000);
    }

    try {
      const res = await fetch(`http://localhost:8000/flashcards/${inputID}`);
      if (!res.ok) throw new Error('Network response not ok');
      const data = await res.json();
      setCard(data);
    } catch (err) {
      console.error('Error fetching data: ', err);
      setErr(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setCard('');
  };

  return (
    <div
      // className="bg-white rounded-lg shadow-md p-6 mx-w-lg mx-auto"
      className="bg-white rounded-lg shadow-md p-6 max-w-sm mx-auto"
    >
      <h2 className="text-xl text-gray-600 font-bold text-center mb-4">
        Get Card By ID
      </h2>
      <input
        type="number"
        value={inputID}
        onChange={(e) => setInputID(e.target.value)}
        placeholder="Type the ID of the card..."
        className="border border-gray-300 text-gray-600 rounded-md p-2 w-full mb-4"
      />
      <button
        onClick={fetchCard}
        className="w-full bg-blue-500 text-white font-bold py-2 rounded-md transition duration-200 hover:bg-blue-600"
      >
        Submit
      </button>
      {card.ID && (
        <div
          key={card.ID}
          className="mt-g bg-gray-100 text-gray-500 p-4 rounded-md"
        >
          <h2 className="text-lg font-semibold mb-2">Card</h2>
          <ul className="list-disc pl-5">
            <li>ID: {card.ID}</li>
            <li>Question: {card.question} </li>
            <li>Answer: {card.answer}</li>
            <li>Difficult: {card.difficult}</li>
            <li>Created: {new Date(card.CreatedAt).toLocaleDateString()}</li>
            <li>Updated: {new Date(card.UpdatedAt).toLocaleDateString()}</li>
            <li>
              Next Review: {new Date(card.nextReviewDate).toLocaleDateString()}
            </li>
            <li>Interval: {card.interval}</li>
          </ul>
          <button
            onClick={handleClose}
            className="mt-4 bg-red-500 text-white font-bold py-2 px-4 rounded-md transition duration-200 hover:bg-red-600"
          >
            Close
          </button>
        </div>
      )}
      {/* Show loading message */}
      {error && (
        <h2 className="text-red-500 text-center mt-2">
          please enter a valid ID
        </h2>
      )}
      {isLoading && (
        <h2 className="text-yellow-500 text-center mt-4">Loading...</h2>
      )}
    </div>
  );
}
