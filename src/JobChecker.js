import React, { useState } from 'react';
import './JobChecker.css';

const JobChecker = () => {
  const [links, setLinks] = useState('');
  const [role, setRole] = useState('web');
  const [ai, setAI] = useState('groq');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const linkList = links
      .split('\n')
      .map(link => link.trim())
      .filter(link => link !== '');

    if (linkList.length === 0) return;

    setLoading(true);
    setResults([]);

    try {
      const res = await fetch(process.env.REACT_APP_BACKEND_API + `?profile=${role}&ai=${ai}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ links: linkList }),
      });

      const data = await res.json();
      setResults(data.results || []);
    } catch (err) {
      console.error(err);
      alert('There was an error checking the jobs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Job Link Checker</h1>

      <form onSubmit={handleSubmit}>
        <label>Paste job links (one per line):</label>
        <textarea
          rows={10}
          value={links}
          onChange={(e) => setLinks(e.target.value)}
          placeholder="https://example.com/job-1&#10;https://example.com/job-2"
        />

        <label>Job Role:</label>
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="web">Web Developer</option>
          <option value="devops">DevOps</option>
          <option value="data">ML / Data</option>
        </select>

        <label>AI Choice:</label>
        <select value={ai} onChange={(e) => setAI(e.target.value)}>
          <option value="groq">Groq - Not So Accurate but Fast</option>
          <option value="gemini">Gemini - Accurate but Slow</option>
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
                <th>Url</th>
                <th>Location</th>
                <th>Clearance</th>
                <th>Travel</th>
                <th>Status</th>
                <th>US-Based</th>
                <th>Suitable</th>
                <th>Explanation</th>
              </tr>
            </thead>
            <tbody>
              {results.map((job, i) => (
                <tr key={i} className={job.suitable === 'Yes' ? 'approved' : 'rejected'}>
                  <td>{job.title}</td>
                  <td>
                    <a href={job.url} target="_blank" rel="noopener noreferrer">
                      {job.title}
                    </a>
                  </td>
                  <td>{job.location || 'Unknown'}</td>
                  <td>{job.clearance || 'Unknown'}</td>
                  <td>{job.travel || 'Unknown'}</td>
                  <td>{job.suitable === 'Yes' ? '✅ Approved' : '❌ Rejected'}</td>
                  <td>{job.us_based || 'Unknown'}</td>
                  <td>{job.suitable || 'No'}</td>
                  <td>{job.explanation || 'None'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default JobChecker;
