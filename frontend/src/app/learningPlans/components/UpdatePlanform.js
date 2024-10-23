const DIFFICULTY_OPTIONS = ['Easy', 'Medium', 'Hard'];
const STATE_OPTIONS = ['New', 'Learning', 'Known', 'Mastered'];

export default function UpdatePlanForm({
  handleSubmit,
  difficulty,
  setDifficulty,
  rating,
  setRating,
  repetitions,
  setRepetitions,
  state,
  setState,
  reviewDate,
  setReviewDate,
  isLoading,
  buttonText,
}) {
  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-lg shadow-md p-4 max-w-sm mx-auto"
      aria-label="Learning Plan Form"
    >
      <h1 className="text-2xl font-bold text-gray-700 mb-4 text-center">
        {buttonText}
      </h1>

      <div className="mb-4">
        <label className="block text-gray-700 mb-2">
          Difficulty:
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            required
            className="border border-gray-300 rounded-md p-2 w-full"
          >
            <option value="" disabled>
              Select difficulty
            </option>
            {DIFFICULTY_OPTIONS.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </label>
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

      <div className="mb-4">
        <label className="block text-gray-700 mb-2" htmlFor="repetitions">
          Repetitions:
        </label>
        <input
          id="repetitions"
          type="number"
          value={repetitions}
          onChange={(e) => setRepetitions(e.target.value)}
          required
          className="border border-gray-300 text-gray-600 rounded-md p-2 w-full"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 mb-2" htmlFor="reviewDate">
          Review Date:
        </label>
        <input
          id="reviewDate"
          type="date"
          value={reviewDate}
          onChange={(e) => setReviewDate(e.target.value)}
          required
          className="border border-gray-300 text-gray-600 rounded-md p-2 w-full"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 mb-2">
          State:
          <select
            value={state}
            onChange={(e) => setState(e.target.value)}
            required
            className="border border-gray-300 rounded-md p-2 w-full"
          >
            <option value="" disabled>
              Select state
            </option>
            {STATE_OPTIONS.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </label>
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
