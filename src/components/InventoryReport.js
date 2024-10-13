import React, { useState } from 'react';
import axios from 'axios';
import '../css/InventoryReport.css';

const InventoryReport = () => {
  const [reportType, setReportType] = useState('current');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [report, setReport] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setReport(null);

    try {
      let url = `http://localhost:3001/api/inventory-report?reportType=${reportType}`;
      if (reportType === 'custom') {
        url += `&startDate=${startDate}&endDate=${endDate}`;
      }

      const response = await axios.get(url);
      setReport(response.data);
    } catch (err) {
      console.error('Error fetching report:', err);
      setError('Failed to fetch report. Please try again. ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="inventory-report">
      <h2>Inventory Report</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Report Type:
            <select value={reportType} onChange={(e) => setReportType(e.target.value)}>
              <option value="current">Current Inventory</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
              <option value="custom">Custom Date Range</option>
            </select>
          </label>
        </div>
        {reportType === 'custom' && (
          <>
            <div>
              <label>
                Start Date:
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
              </label>
            </div>
            <div>
              <label>
                End Date:
                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
              </label>
            </div>
          </>
        )}
        <button type="submit">Generate Report</button>
      </form>

      {error && <p className="error">{error}</p>}

      {report && (
        <table>
          <thead>
            <tr>
              <th>Ingredient</th>
              <th>Initial Amount</th>
              <th>Final Amount</th>
              <th>Total Restocked</th>
              <th>Total Used</th>
              <th>Net Change</th>
            </tr>
          </thead>
          <tbody>
            {report.map((item, index) => (
              <tr key={index}>
                <td>{item.ingredient_name}</td>
                <td>{item.initial_amount}</td>
                <td>{item.final_amount}</td>
                <td>{item.total_restocked}</td>
                <td>{item.total_used}</td>
                <td>{item.net_change}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default InventoryReport;