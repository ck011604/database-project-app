import React, { useState, useEffect } from "react";
import "../css/SalesReport.css";
import axios from 'axios';

const SalesReports = () => {
const [showSalesOptions, setShowSalesOptions] = useState(false);
const [selectedOption, setSelectedOption] = useState('');
const [startDate, setStartDate] = useState('');
const [endDate, setEndDate] = useState('');
const [salesData, setSalesData] = useState(null);
const [topEmployees, setTopEmployees] = useState(null);
const [batchMessage, setBatchMessage] = useState('');

const handleOptionClick = (option) => {
  setSelectedOption(option);
};

const handleStartDateChange = (e) => {
  setStartDate(e.target.value);
};

const handleEndDateChange = (e) => {
  setEndDate(e.target.value);
};

const handleBatchSales = async () => {
  console.log("Batched sales button clicked");
  try{
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/batch-sales`);
    setBatchMessage(response.data.message);
  } catch (error) {
    console.error("Error executing batch sales query", error);
    setBatchMessage("Error executing batch sales query.");
  }
  setShowSalesOptions(!showSalesOptions);
};

const submitReport = async () => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/sales-report`, {
      params: {
        startDate,
        endDate
      }
    });

    if (response.data.success) {
      setSalesData(response.data.salesData);
      setTopEmployees(response.data.topEmployees);
    } else {
      console.error(response.data.message);
      alert(response.data.message);
    }
  } catch (error) {
    console.error("Error generating report", error);
    alert("There was an error generating the report.");
  }
};

const formatDate = (dateString) => {
  return new Date(dateString).toISOString().split('T')[0];
};

return (
  <div className="report-container">
    <h1>Generate Sales Report:</h1>
    <div className="button-group">
      <button className="report-button" onClick={handleBatchSales}>
          Batch Sales
      </button>
    </div>
    {batchMessage && (
      <p className="batch-message">{batchMessage}</p>
    )} 
    {showSalesOptions && (
      <div className="sales-options">
          <h3>please select a type of report:</h3>
          <div className="option-buttons">
              <button onClick={() => handleOptionClick('Daily')} className='option-button'>Daily</button>
              <button onClick={() => handleOptionClick('Monthly')} className='option-button'>Monthly</button>
              <button onClick={() => handleOptionClick('Yearly')} className='option-button'>Yearly</button>
          </div>
      </div>
    )}
    {selectedOption && (
      <div className = "date-prompt">
          <h4>{`Select a date range for ${ selectedOption } sales`}</h4>
          <label> Start Date: </label>
          <input
          type="date"
          value={startDate}
          onChange={handleStartDateChange}
          className="data-input"
          />
          <label> End Date: </label>
          <input
          type="date"
          value={endDate}
          onChange={handleEndDateChange}
          className="data-input"
          />
          <button className="submit-button" onClick={submitReport}>
              Generate {selectedOption} Report
          </button>
          </div>
    )}
    {salesData && (
      <div className="sales-data">
        <h2 className="section-heading"> {selectedOption} Sales Report starting {startDate} and ending {endDate} </h2>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Total Sales</th>
              <th>Total Cash</th>
              <th>Total Taxes</th>
              <th>Total Discounts</th>
            </tr>
          </thead>
        <tbody>
          {salesData.map((row, index) => (
            <tr key={index}>
              <td>{formatDate(row.sales_date)}</td>
              <td>{row.total_sales}</td>
              <td>{row.total_cash}</td>
              <td>{row.total_taxes}</td>
              <td>{row.total_discounts}</td>
            </tr>
          ))}
         </tbody>
        </table>
      </div>
    )}
    {topEmployees && (
      <div className="employee-data">
        <h2 className="section-heading">Employees Performance:</h2>
        <table>
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>Last Name</th>
              <th>First Name</th>
              <th>Role</th>
              <th>Total Sales</th>
            </tr>
          </thead>
          <tbody>
            {topEmployees.map((employee, index) => (
              <tr key={index}>
                <td>{employee.employee_id}</td>
                <td>{employee.last_name}</td>
                <td>{employee.first_name}</td>
                <td>{employee.role}</td>
                <td>{employee.total_sales}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
  );
};

export default SalesReports;