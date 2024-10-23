'use client';

export default function UpdateForm({
  handleSubmit,
  comment,
  setComment,
  rating,
  setRating,
  isLoading,
  buttonText,
}) {
  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-lg shadow-md p-4 max-w-sm mx-auto"
      aria-label="Review Form"
    >
      <h1 className="text-2xl font-bold text-gray-700 mb-4 text-center">
        {buttonText}
      </h1>

      <div className="mb-4">
        <label className="block text-gray-700 mb-2" htmlFor="comment">
          Comment:
        </label>
        <input
          id="comment"
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="border border-gray-300 rounded-md p-2 w-full text-gray-600"
          placeholder="Optional comment"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 mb-2" htmlFor="rating">
          Rating (1-5):
        </label>
        <input
          id="rating"
          type="number"
          value={rating}
          onChange={(e) => setRating(parseInt(e.target.value, 10))}
          min="1"
          max="5"
          required
          className="border border-gray-300 rounded-md p-2 w-full text-gray-600"
          aria-describedby="ratingHelp"
        />
        <small id="ratingHelp" className="text-gray-500">
          Please rate the flashcard between 1 (lowest) and 5 (highest).
        </small>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-500 text-white font-bold py-2 rounded-md hover:bg-blue-600 disabled:opacity-50 transition duration-200"
      >
        {buttonText}
      </button>

      {isLoading && (
        <p className="text-yellow-500 text-center mt-4">Loading...</p>
      )}
    </form>
  );
}
