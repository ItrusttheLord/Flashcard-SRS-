import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">
        Welcome to the Flashcard App
      </h1>
      <div className="mb-6">
        <Link
          href="/flashcards"
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300 mx-2"
        >
          Flashcards
        </Link>
      </div>
      <p className="text-gray-600 max-w-md text-center">
        Explore our collection of flashcards to enhance your learning
        experience. Whether you are preparing for an exam or just want to learn
        something new, we have the right resources for you.
      </p>
    </div>
  );
}
