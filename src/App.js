import React, { useState } from 'react';
import './App.css';

const App = () => {
  const [links, setLinks] = useState('');
  const [role, setRole] = useState('web');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const linkList = links.split('\n').filter(line => line.trim() !== '');
    if (linkList.length === 0) return;

    setLoading(true);
    setResults([]);

    try {
      const res = await fetch(`http://127.0.0.1:4000/check-jobs?profile=${role}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ links: linkList })
      });
      const data = await res.json();
      setResults(data.results || []);
    } catch (err) {
      console.error(err);
      alert("There was an error checking the jobs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Job Link Checker</h1>

      <form onSubmit={handleSubmit}>
        <label>Paste job links (one per line):</label>
        <textarea value={links} onChange={(e) => setLinks(e.target.value)} rows={10} />

        <label>Select Role:</label>
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="web">Web Developer</option>
          <option value="devops">DevOps</option>
          <option value="ml">ML / Data</option>
        </select>

        <button type="submit" disabled={loading}>
          {loading ? 'Checking...' : 'Check Jobs'}
        </button>
      </form>

      {results.length > 0 && (
        <div className="results">
          <h2>Results</h2>
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Location</th>
                <th>Clearance</th>
                <th>Travel</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {results.map((job, i) => (
                <tr key={i} className={job.approve ? 'approved' : 'rejected'}>
                  <td><a href={job.url} target="_blank" rel="noopener noreferrer">{job.title}</a></td>
                  <td>{job.location}</td>
                  <td>{job.clearance ? 'Yes' : 'No'}</td>
                  <td>{job.travel}</td>
                  <td>{job.approve ? '✅ Approved' : '❌ Rejected'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default App;
