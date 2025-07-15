import './App.css'
import PdfUploader from './PdfUploader';
import HomePage from './HomePage.jsx'; 
import { useState } from 'react';
import { ServerURL } from './main.jsx';

function App() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [currentPage, setCurrentPage] = useState('home'); // Default to 'home'
  const [videoUrl, setVideoUrl] = useState('');
  const [videoMessage, setVideoMessage] = useState('');
  const [ytTranscriptUploaded, setYtTranscriptUploaded] = useState(false);
  const [ytPrompt, setYtPrompt] = useState('');
  const [ytResponse, setYtResponse] = useState('');
  
  const handleSubmit = () => {
    setResponse(`Response to: "${prompt}" from ${currentPage === 'pdf' ? 'PDF' : currentPage === 'video' ? 'video content' : 'general knowledge'}.`);
    setPrompt('');
  };

  const handleVideoAnalysis = async () => {
    if (!videoUrl) {
      setVideoMessage('Please enter a valid video URL.');
      return;
    }
    setVideoMessage('Uploading transcript...');
    try {
      const res = await fetch(`${ServerURL}/upload-youtube/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          video_url: videoUrl,          
          use_fallback: true
        }),
      });
      if (res.ok) {
        console.log("Upload Transcript API Response", res.data);
        setVideoMessage('Transcript uploaded! You can now ask questions.');
        setYtTranscriptUploaded(true);
      } else {
        setVideoMessage('Failed to upload transcript.');
        setYtTranscriptUploaded(false);
      }
    } catch {
      setVideoMessage('Error uploading transcript.');
      setYtTranscriptUploaded(false);
    }
  };

  const renderPageContent = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'about':
        return (
          <div className="about-section content-section">
            <h2 className="about-title">About This Application</h2>
            <p className="about-description">
              This RAG (Retrieval-Augmented Generation) based Q&A system is designed to provide
              answers by leveraging information from uploaded PDF documents and soon, video content.
              It combines powerful language models with a retrieval mechanism to give you accurate
              and contextually relevant responses.
            </p>
            <p className="about-contact">
              For any queries or feedback, please reach out to our support team.
            </p>
          </div>
        );
      case 'pdf':
        return (
          <div className="pdf-section content-section">            
            {/* <PdfUploader sendDataToParent = {setResponse}/> */}
            <PdfUploader/>
          </div>
        );
      case 'video':
        return (
          <div className="video-section content-section">
            <h2>Enter Video URL for YouTube Q&A</h2>
            <input
              type="text"
              placeholder="e.g., https://www.youtube.com/watch?v=xxxxxxxx"
              className="video-url-input"
              value={videoUrl}
              onChange={(e) => {
                setVideoUrl(e.target.value);
                setVideoMessage('');
                setYtTranscriptUploaded(false);
                setYtPrompt('');
                setYtResponse('');
              }}
            />
            <button className="analyze-video-button" onClick={handleVideoAnalysis}>Upload Video</button>
            {videoMessage && (
              <div className={`video-message ${videoMessage.includes('uploaded') ? 'success' : 'error'}`}>
                {videoMessage}
              </div>
            )}
            {/* Q&A Section */}
            {ytTranscriptUploaded && (
              <div className="qa-section-wrapper" style={{ marginTop: '1rem' }}>
                <div className="prompt-section">
                  <input
                    type="text"
                    placeholder="Ask a question about the video..."
                    value={ytPrompt}
                    onChange={(e) => setYtPrompt(e.target.value)}
                  />
                  <button
                    onClick={async () => {
                      if (!ytPrompt.trim() || !videoUrl) {
                        setYtResponse('Please enter a question and upload a video URL.');
                        return;
                      }
                      setYtResponse('Querying...');
                      try {                        
                        const res = await fetch(`${ServerURL}/query-youtube/`, {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ query: ytPrompt, video_url: videoUrl, k: 3, manual_transcript: "string"}),
                        });
                        if (res.ok) {
                          let data = await res.json();
                          let answer = data.answer;
                          console.log("res: ",  res)
                          console.log("data: ",  data)
                          console.log("data.answer: ", data.answer)
                          if (typeof answer === 'string') {
                            answer = answer.replace(/\\n/g, '');
                            if (answer.startsWith('"') && answer.endsWith('"')) {
                              answer = answer.substring(1, answer.length - 1);
                            }
                          }
                          setYtResponse(answer);
                        } else {
                          console.log("Query Failed")
                          setYtResponse('Query failed.');
                        }
                      } catch {
                        console.log("Error Querying API")
                        setYtResponse('Error querying API.');
                      }
                    }}
                  >
                    Ask
                  </button>
                </div>
                <div className="output-section">
                  <h3>Output</h3>
                  <div className="output-box">{ytResponse || 'No response yet.'}</div>
                </div>
              </div>
            )}
          </div>
        );
      default:
        return <HomePage />;
    }
  };

  return (
   <div className="app-container">
         <h1>RAG-based PDF and Youtube Q&A</h1>

      <nav className="navbar">
        <button
          className={currentPage === 'home' ? 'nav-item active' : 'nav-item'}
          onClick={() => setCurrentPage('home')}
        >
          Home
        </button>
        <button
          className={currentPage === 'about' ? 'nav-item active' : 'nav-item'}
          onClick={() => setCurrentPage('about')}
        >
          About
        </button>
        <button
          className={currentPage === 'pdf' ? 'nav-item active' : 'nav-item'}
          onClick={() => setCurrentPage('pdf')}
        >
          Upload PDF
        </button>
        <button
          className={currentPage === 'video' ? 'nav-item active' : 'nav-item'}
          onClick={() => setCurrentPage('video')}
        >
          YouTube Q&A {/* Changed text */}
        </button>
      </nav>

      {renderPageContent()}

      <footer className="footer">© 2025 RAG-based Q&A</footer>
      </div>
    
  );
}

export default App
