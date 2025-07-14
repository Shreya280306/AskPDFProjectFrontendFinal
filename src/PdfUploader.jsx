import React, { useState } from 'react';
import { ServerURL } from './main.jsx';

// function PdfUploader({sendDataToParent}) {
function PdfUploader() {  
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [query, setQuery] = useState('');
  const [queryResult, setQueryResult] = useState('');
  

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage('');
  };

  const handleUpload = async () => {    
    if (!file) {
      setMessage('Please select a PDF file.');
      return;
    }
    setUploading(true);
    setMessage('');
    const formData = new FormData();
    formData.append('files', file);
    try {
      const response = await fetch(`${ServerURL}/upload-pdf/`, {
        method: 'POST',
        body: formData,
      });
      if (response.ok) {
        setMessage('Upload successful!');
      } else {
        setMessage('Upload failed.');
      }
    } catch (error) {
      setMessage('Error uploading file.');
    } finally {
      setUploading(false);
    }
  };

  const handlePromptChange = (e) => {
    setQuery(e.target.value);
    setQueryResult('');
  };

  const handleQuery = async () => {
    console.log("Querying API with:", query);

    if (!query.trim()) {
      setQueryResult('Please enter a prompt.');
      return;
    }
    setQueryResult('Querying...');
    try {
      const response = await fetch(`${ServerURL}/query/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: query, k: 3 }),
      });
      if (response.ok) {
        let data = await response.json();
        let answer = data.answer;
        // Remove \n and first/last double quotes if present
        if (typeof answer === 'string') {
          answer = answer.replace(/\\n/g, '');
          if (answer.startsWith('"') && answer.endsWith('"')) {
            answer = answer.substring(1, answer.length - 1);
          }
        }
        setQueryResult(answer);
      } else {
        setQueryResult('Query failed.');
      }
    } catch (error) {
      setQueryResult('Error querying API.');
    }
  };

  return (
    <>
    <div style={{ margin: '2rem 0' }}>
      <h2>Upload PDF</h2>
      <input
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
        disabled={uploading}
      />
      <button onClick={handleUpload} disabled={uploading || !file} style={{ marginLeft: '1rem' }}>
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
      {message && <div style={{ marginTop: '1rem', color: message.includes('successful') ? 'green' : 'red' }}>{message}</div>}

      <div className='prompt-section'>
        <input
             color="#f5f5f5" 
             type="text"
             placeholder="Type your question..."
             value={query}
             onChange={handlePromptChange}
           />
        <button onClick={handleQuery} disabled={!query.trim()}>
          Ask
        </button>
        {/* {queryResult && (
          <pre style={{ marginTop: '1rem', background: '#f4f4f4', padding: '1rem', borderRadius: '4px' }}>{queryResult}</pre>
        )} */}
        <div className="output-section">
           <h3>Output</h3>
           <div className="output-box">{queryResult || 'No response yet.'}</div>
         </div>
      </div>
    </div>
    </>
  );
}

export default PdfUploader;
