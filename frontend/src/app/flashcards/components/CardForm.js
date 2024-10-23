'use client';
const DIFFICULTY_OPTIONS = ['Easy', 'Medium', 'Hard'];
export default function CardForm({
  handleSubmit,
  question,
  setQuestion,
  answer,
  setAnswer,
  difficult,
  setDifficult,
  rating,
  setRating,
  isLoading,
  buttonText,
}) {
  return (
    <form
      onSubmit={handleSubmit}
      // className="bg-white rounded-lg shadow-md p-6"
      className="bg-white rounded-lg shadow-md p-4 max-w-sm mx-auto"
    >
      <h1 className="text-2xl font-bold text-gray-700 mb-4 text-center">
        {buttonText}
      </h1>
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">
          Question:
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
            placeholder="Enter your question here"
            className="border border-gray-300 rounded-md p-2 w-full"
          />
        </label>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">
          Answer:
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            required
            placeholder="Enter the answer here"
            className="border border-gray-300 rounded-md p-2 w-full"
          />
        </label>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 mb-2">
          Difficulty:
          <select
            value={difficult}
            onChange={(e) => setDifficult(e.target.value)}
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
        <label className="block text-gray-700 mb-2">
          Rating:
          <input
            type="number"
            value={rating}
            onChange={(e) => setRating(parseInt(e.target.value, 10))}
            min="1"
            max="5"
            required
            className="border border-gray-300 rounded-md p-2 w-full"
          />
        </label>
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-500 text-white font-bold py-2 rounded-md hover:bg-blue-600 disabled:opacity-50 transition duration-200"
      >
        {buttonText}
      </button>
    </form>
  );
}
