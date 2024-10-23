'use client';

export default function DeleteForm({
  inputID,
  setInputID,
  funcName,
  isLoading,
  error,
  success,
}) {
  return (
    <div className="bg-white rounded-lg shadow-md p-3 max-w-sm mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-center text-gray-600">
        Enter the ID of the item you want to delete
      </h2>
      <input
        type="number"
        value={inputID}
        onChange={(e) => setInputID(e.target.value)}
        placeholder="Item ID"
        className="border border-gray-300 rounded-md p-2 w-full mb-4 text-gray-500"
      />
      <button
        onClick={funcName}
        disabled={isLoading}
        className={`w-full bg-red-500 text-white font-bold py-2 rounded-md transition duration-200 hover:bg-red-600 disabled:opacity-50`}
      >
        DELETE
      </button>
      {/* Show loading message */}
      {isLoading && (
        <h2 className="text-yellow-500 text-center mt-4">Loading...</h2>
      )}

      {/* Show success or error messages */}
      {error && <h2 className="text-red-500 text-center mt-2">{error}</h2>}
      {success && (
        <h2 className="text-green-500 text-center mt-2">{success}</h2>
      )}
    </div>
  );
}
