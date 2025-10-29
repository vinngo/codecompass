export default function Features() {
  return (
    <div className="w-full max-w-7xl px-4 sm:px-6 py-16">
      <h2 className="text-4xl font-bold text-center mb-4">
        Main Features of CodeCompass
      </h2>
      <p className="text-gray-400 text-center text-lg mb-16 max-w-3xl mx-auto">
        Everything you need to understand, navigate, and contribute to any
        codebase from day one.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* RAG-Powered Chat */}
        <div className="border border-gray-800 rounded-xl p-8 bg-background hover:border-teal-800/50 transition-colors">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 mb-6 flex items-center justify-center">
              <svg
                className="w-16 h-16 text-cyan-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold mb-4">RAG-Powered Chat</h3>
            <p className="text-gray-400">
              Ask questions about any part of your codebase and get instant,
              contextual answers.
            </p>
          </div>
        </div>

        {/* Auto Documentation */}
        <div className="border border-gray-800 rounded-xl p-8 bg-background hover:border-teal-800/50 transition-colors">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 mb-6 flex items-center justify-center">
              <svg
                className="w-16 h-16 text-teal-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold mb-4">Auto Documentation</h3>
            <p className="text-gray-400">
              Generate comprehensive documentation that stays in sync with your
              code changes.
            </p>
          </div>
        </div>

        {/* Component Trees */}
        <div className="border border-gray-800 rounded-xl p-8 bg-background hover:border-teal-800/50 transition-colors">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 mb-6 flex items-center justify-center">
              <svg
                className="w-16 h-16 text-purple-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold mb-4">Component Trees</h3>
            <p className="text-gray-400">
              Visualize code architecture with interactive component and
              dependency diagrams.
            </p>
          </div>
        </div>

        {/* Enterprise Ready */}
        <div className="border border-gray-800 rounded-xl p-8 bg-background hover:border-teal-800/50 transition-colors">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 mb-6 flex items-center justify-center">
              <svg
                className="w-16 h-16 text-teal-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold mb-4">Enterprise Ready</h3>
            <p className="text-gray-400">
              Deploy locally for security or use our hosted solution for quick
              testing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
