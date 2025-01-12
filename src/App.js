import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FetchData from './component/FetchData';


function App() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]);

  // Load search history from local storage when the component mounts
  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    setHistory(savedHistory);
  }, []);

  // Save search history to local storage
  const saveHistory = (newHistory) => {
    localStorage.setItem('searchHistory', JSON.stringify(newHistory));
    setHistory(newHistory);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Send the question to the backend (API) and get the answer
      const response = await axios.post('http://localhost:5000/api/ask', { question });
      setAnswer(response.data.answer);

      // Add question to the search history
      const newHistory = [...history, question];
      saveHistory(newHistory); // Update history in local storage
    } catch (err) {
      setError('Error fetching answer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App" style={{ display: 'flex' }}>
      {/* Left Sidebar for Search History */}
      <div style={{ width: '250px', padding: '10px', borderRight: '1px solid #ccc' }}>
        <h2>Search History</h2>
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {history.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>

      {/* Main Content Area */}
      <div style={{ padding: '20px', flex: 1 }}>
        <h1>Ask the Model</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask a question"
            required
            style={{ marginBottom: '10px', padding: '10px', width: '300px' }}
          />
          <button type="submit" style={{ padding: '10px 20px' }}>Submit</button>
        </form>

        {loading && <p>Loading...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {answer && <p><strong>Answer:</strong> {answer}</p>}
      </div>
      <div>
      <FetchData/>
      </div>
    </div>
  );
}

export default App;
