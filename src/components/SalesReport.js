import React, { useState, useEffect } from "react";
import "../css/SalesReport.css";
import axios from 'axios';

const SalesReports = () => {
const [showSalesOptions, setShowSalesOptions] = useState(false);
const [selectedOption, setSelectedOption] = useState('');
const [startDate, setStartDate] = useState('');
const [endDate, setEndDate] = useState('');
const [salesData, setSalesData] = useState(null);
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
        reportType: selectedOption,
        startDate: startDate,
        endDate: endDate
      }
    });

    setSalesData(response.data.salesData);
  } catch (error) {
    console.error("Error generating report", error);
  }
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
      <div>
        <h2> {selectedOption} Sales Report starting {startDate} and ending {endDate} </h2>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Total Sales</th>
              <th>Total Discounts</th>
              <th>Total Taxes</th>
              <th>Total Cash</th>
            </tr>
          </thead>
        <tbody>
          {salesData.map((row, index) => (
            <tr key={index}>
              <td>{row.sales_date}</td>
              <td>{row.total_sales}</td>
              <td>{row.total_discounts}</td>
              <td>{row.total_taxes}</td>
              <td>{row.total_cash}</td>
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