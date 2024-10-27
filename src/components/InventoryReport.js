import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import '../css/InventoryReport.css';

const InventoryReport = () => {
    const today = new Date().toISOString().split('T')[0];
    
    const [logs, setLogs] = useState([]);
    const [stats, setStats] = useState({
        used: [],
        restock: [],
        discarded: []
    });
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    
    const [dateRange, setDateRange] = useState({
        startDate: today,
        endDate: today
    });

    const fetchLogs = async (dates) => {
      try {
          const params = new URLSearchParams(dates).toString();
          const response = await axios.get(`${REACT_APP_API_URL}/api/inventory-report/logs?${params}`);
          if (response.data && response.data.success) {
              setLogs(response.data.logs);
          } else {
              setLogs([]);
          }
      } catch (err) {
          console.error('Error fetching logs:', err);
          setLogs([]);
      }
  };

  const fetchStats = async (dates) => {
    try {
        const params = new URLSearchParams(dates).toString();
        const response = await axios.get(`${REACT_APP_API_URL}/api/inventory-report/stats?${params}`);  // Updated endpoint
        if (response.data.success) {
            setStats(response.data.stats);
        }
    } catch (err) {
        setError(err.response?.data?.message || 'An error occurred fetching the statistics');
    }
};

  const fetchData = async () => {
      setIsLoading(true);
      setError("");
      
      try {
          // Execute both fetches in parallel
          await Promise.all([
              fetchLogs(dateRange),
              fetchStats(dateRange)
          ]);
      } catch (err) {
          setError('Error fetching data');
      }
      
      setIsLoading(false);
  };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDateChange = (field, value) => {
        setDateRange(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleApplyDateRange = () => {
        fetchData();
    };

    const renderBarChart = (data, title, color) => (
        <div className="chart-container">
            <h2>{title}</h2>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="ingredient_name" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="total_quantity" fill={color} name="Quantity" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );

    if (isLoading) {
        return (
            <div className="inventory-report-container">
                <div className="loading-message">Loading inventory data...</div>
            </div>
        );
    }

    return (
        <div className="inventory-report-container">
            <div className="report-header">
                <h1>Inventory Activity Report</h1>
                
                <div className="date-filters">
                    <div className="date-filter-group">
                        <h3>Date Range</h3>
                        <div className="date-inputs">
                            <input 
                                type="date" 
                                value={dateRange.startDate}
                                onChange={(e) => handleDateChange('startDate', e.target.value)}
                            />
                            <input 
                                type="date" 
                                value={dateRange.endDate}
                                onChange={(e) => handleDateChange('endDate', e.target.value)}
                            />
                            <button 
                                className="apply-date-btn"
                                onClick={handleApplyDateRange}
                            >
                                Apply
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="logs-container">
                <h2>Recent Activity</h2>
                {Array.isArray(logs) && logs.length > 0 ? (
                    <div className="logs-table-container">
                        <table className="logs-table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Time</th>
                                    <th>Item</th>
                                    <th>Action</th>
                                    <th>Change</th>
                                </tr>
                            </thead>
                            <tbody>
                                {logs.map((log) => (
                                    <tr key={log.log_id}>
                                        <td>{log.log_date}</td>
                                        <td>{log.log_time}</td>
                                        <td>{log.ingredient_name}</td>
                                        <td className={`action-${log.action_type}`}>
                                            {log.action_type}
                                        </td>
                                        <td className={log.quantity_change < 0 ? 'quantity-negative' : 'quantity-positive'}>
                                            {log.quantity_change > 0 ? '+' : ''}{log.quantity_change}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="no-data">No logs found for the selected date range</p>
                )}
            </div>

            <div className="stats-grid">
                {renderBarChart(stats.used || [], 'Most Used Items', '#2563eb')}
                {renderBarChart(stats.restock || [], 'Most Restocked Items', '#059669')}
                {renderBarChart(stats.discarded || [], 'Most Discarded Items', '#dc2626')}
            </div>
            
            {error && <div className="error-message">{error}</div>}
        </div>
    );
};

export default InventoryReport;