import React from 'react';

function HomePage() {
  return (
    <div className="home-content">
      <h2 className="home-title">Welcome to RAG-based Q&A!</h2>
      <p className="home-description">
        This application helps you get answers from your documents and even video content.
        Just upload your PDF or provide a video URL, and start asking questions!
      </p>
      <div className="features-list">
        <h3>Key Features:</h3>
        <ul>
          <li>📚 PDF Document Analysis</li>
          <li>▶️ Video Content Insights & Q&A</li>
          <li>💬 Intelligent Question Answering</li>
          <li>⚡ Fast and Accurate Responses</li>
        </ul>
      </div>
      {/* Updated call-to-action text for better SEO and user experience */}
      <p className="call-to-action">
        Explore diverse content types with ease!
      </p>
    </div>
  );
}

export default HomePage;

