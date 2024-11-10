import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Search, ChevronUp, ChevronDown } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';
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
    const [searchTerm, setSearchTerm] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [sortConfig, setSortConfig] = useState({
        key: 'log_date',
        direction: 'desc'
    });
    const [dateRange, setDateRange] = useState({
        startDate: today,
        endDate: today
    });

    const sortData = (data, sortConfig) => {
        const sortedData = [...data];
        sortedData.sort((a, b) => {
            switch (sortConfig.key) {
                case 'log_date':
                    const dateA = new Date(`${a.log_date} ${a.log_time}`);
                    const dateB = new Date(`${b.log_date} ${b.log_time}`);
                    return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
                
                case 'ingredient_name':
                    const nameA = a.ingredient_name.toLowerCase();
                    const nameB = b.ingredient_name.toLowerCase();
                    return sortConfig.direction === 'asc' 
                        ? nameA.localeCompare(nameB)
                        : nameB.localeCompare(nameA);
                
                case 'action_type':
                    const actionA = a.action_type.toLowerCase();
                    const actionB = b.action_type.toLowerCase();
                    return sortConfig.direction === 'asc'
                        ? actionA.localeCompare(actionB)
                        : actionB.localeCompare(actionA);
                
                case 'quantity_change':
                    const qtyA = Number(a.quantity_change);
                    const qtyB = Number(b.quantity_change);
                    return sortConfig.direction === 'asc'
                        ? qtyA - qtyB
                        : qtyB - qtyA;
                
                default:
                    return 0;
            }
        });
        return sortedData;
    };

    const handleSort = (key) => {
        setSortConfig((prevConfig) => ({
            key,
            direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc',
        }));
    };

    const fetchLogs = async (dates, search = "") => {
        try {
            const params = new URLSearchParams({
                ...dates,
                search
            }).toString();
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/inventory-report/logs?${params}`);
            if (response.data && response.data.success) {
                const sortedLogs = sortData(response.data.logs, { key: 'log_date', direction: 'desc' });
                setLogs(sortedLogs);
                setSortConfig({ key: 'log_date', direction: 'desc' });
            } else {
                setLogs([]);
            }
        } catch (err) {
            console.error('Error fetching logs:', err);
            setLogs([]);
        }
    };

    const fetchSuggestions = async (term) => {
        if (!term) {
            setSuggestions([]);
            return;
        }

        try {
            const response = await axios.get(
                `${process.env.REACT_APP_API_URL}/api/inventory-report/suggestions?term=${term}`
            );
            if (response.data && response.data.success) {
                setSuggestions(response.data.suggestions);
            }
        } catch (err) {
            console.error('Error fetching suggestions:', err);
            setSuggestions([]);
        }
    };

    const fetchStats = async (dates) => {
        try {
            const params = new URLSearchParams(dates).toString();
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/inventory-report/stats?${params}`);
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
            await Promise.all([
                fetchLogs(dateRange, searchTerm),
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

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        setShowSuggestions(true);
        fetchSuggestions(value);
    };

    const handleSuggestionClick = (suggestion) => {
        setSearchTerm(suggestion);
        setShowSuggestions(false);
        fetchLogs(dateRange, suggestion);
    };

    const handleDateChange = (field, value) => {
        setDateRange(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleApplyFilters = () => {
        fetchData();
    };

    const renderBarChart = (data, title, color) => {
        const maxValue = Math.max(...data.map(item => item.total_quantity));
        const yAxisMax = Math.ceil(maxValue + (maxValue * 0.1));
    
        return (
            <div className="chart-container">
                <h2>{title}</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                        data={data}
                        margin={{ top: 10, right: 30, left: 20, bottom: 65 }}
                        barSize={20}
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis
                            dataKey="ingredient_name"
                            angle={-45}
                            textAnchor="end"
                            height={60}
                            interval={0}
                            tick={{ fontSize: 12 }}
                        />
                        <YAxis
                            tick={{ fontSize: 12 }}
                            width={40}
                            domain={[0, yAxisMax]}
                            allowDataOverflow={false}
                            tickCount={5}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                padding: '8px'
                            }}
                            cursor={{ fill: '#f3f4f6' }}
                        />
                        <Bar
                            dataKey="total_quantity"
                            fill={color}
                            radius={[2, 2, 0, 0]}
                            name="Quantity"
                        >
                            <LabelList
                                dataKey="total_quantity"
                                position="top"
                                style={{ fontSize: '11px' }}
                            />
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        );
    };

    if (isLoading) {
        return (
            <div className="inventory-report-container">
                <div className="loading-message">Loading inventory data...</div>
            </div>
        );
    }

    const isSameDay = dateRange.startDate === dateRange.endDate;

    return (
        <div className="inventory-report-container">
            <div className="report-header">
                <h1>Inventory Report</h1>
                
                <div className="filters-container">
                    <div className="date-filter-group">
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
                        </div>
                    </div>

                    <div className="search-container">
                        <div className="search-input-wrapper">
                            <Search className="search-icon" size={20} />
                            <input
                                type="text"
                                placeholder="Search ingredients..."
                                value={searchTerm}
                                onChange={handleSearchChange}
                                onFocus={() => setShowSuggestions(true)}
                                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                            />
                        </div>
                        
                        {showSuggestions && suggestions.length > 0 && (
                            <div className="suggestions-dropdown">
                                {suggestions.map((suggestion, index) => (
                                    <div
                                        key={index}
                                        className="suggestion-item"
                                        onClick={() => handleSuggestionClick(suggestion)}
                                    >
                                        {suggestion}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <button 
                        className="apply-filters-btn"
                        onClick={handleApplyFilters}
                    >
                        Apply
                    </button>
                </div>
            </div>
            
            <div className="logs-container">
                <h2>Activity Logs</h2>
                {Array.isArray(logs) && logs.length > 0 ? (
                    <div className="logs-table-container">
                        <table className="logs-table">
                            <thead>
                                <tr>
                                    <th onClick={() => handleSort('log_date')} className="sortable">
                                        Date {sortConfig.key === 'log_date' && 
                                            (sortConfig.direction === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}
                                    </th>
                                    <th>Time</th>
                                    <th onClick={() => handleSort('ingredient_name')} className="sortable">
                                        Item {sortConfig.key === 'ingredient_name' && 
                                            (sortConfig.direction === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}
                                    </th>
                                    <th onClick={() => handleSort('action_type')} className="sortable">
                                        Action {sortConfig.key === 'action_type' && 
                                            (sortConfig.direction === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}
                                    </th>
                                    <th onClick={() => handleSort('quantity_change')} className="sortable">
                                        Change {sortConfig.key === 'quantity_change' && 
                                            (sortConfig.direction === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortData(logs, sortConfig).map((log) => (
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
                    <p className="no-data">No logs found for the selected criteria</p>
                )}
            </div>

            <div className="logs-container">
                <h2>Visualized Actions</h2>
                <div className="stats-grid">
                    {renderBarChart(stats.used || [], 'Used Items', '#2563eb')}
                    {renderBarChart(stats.restock || [], 'Restocked Items', '#059669')}
                    {renderBarChart(stats.discarded || [], 'Discarded Items', '#dc2626')}
                </div>
            </div>
            
            {error && <div className="error-message">{error}</div>}
        </div>
    );
};

export default InventoryReport;