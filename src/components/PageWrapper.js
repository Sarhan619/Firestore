// src/components/PageWrapper.js
export default function PageWrapper({ children, title }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-br from-purple-700 via-pink-600 to-red-500 p-6">
      <div className="w-full max-w-xl bg-white bg-opacity-10 backdrop-blur-md rounded-lg shadow-lg p-8 mt-12 text-white">
        {title && (
          <h1 className="text-3xl font-bold mb-6 text-center drop-shadow-lg">
            {title}
          </h1>
        )}
        {children}
      </div>
    </div>
  );
}
