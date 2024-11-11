import React, { useState, useEffect } from "react";
import "../css/SalesReport.css";
import axios from 'axios';

const SalesReports = () => {
const [showSalesOptions, setShowSalesOptions] = useState(false);
const [isOptionSelected, setIsOptionSelected] = useState(false);
const [selectedOption, setSelectedOption] = useState('');
const [startDate, setStartDate] = useState('');
const [endDate, setEndDate] = useState('');
const [salesData, setSalesData] = useState(null);
const [topEmployees, setTopEmployees] = useState(null);
const [batchMessage, setBatchMessage] = useState('');
const [errorMessage, setErrorMessage] = useState('');
const [employeeFilter, setEmployeeFilter] = useState('');
const [salesThreshold, setSalesThreshold] = useState('');

const handleOptionClick = (option) => {
  setSelectedOption(option);
};

const handleStartDateChange = (e) => {
  setStartDate(e.target.value);
  setErrorMessage('');
  if (selectedOption === 'Daily') {
    setEndDate(e.target.value);
  }
};

const handleEndDateChange = (e) => {
  setEndDate(e.target.value);
  setErrorMessage('');
};

const handleBatchSales = async () => {
  console.log("Batched sales button clicked");
  setIsOptionSelected(true);
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
  if (!startDate || !endDate) {
    setErrorMessage('Please select valid date(s)')
    return;
  }
  try {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/sales-report`, {
      params: {
        startDate,
        endDate
      }
    });

    if (response.data.success) {
      setSalesData(response.data.salesData);
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

const submitBestEmployees = async () => {
  setIsOptionSelected(true);
  try {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/empsales-report`, {
    });

    if (response.data.success) {
      setTopEmployees(response.data.topEmployees);
    } else {
      console.error(response.data.message);
      alert(response.data.message);
    }
  } catch (error) {
    console.error("Error generating report", error);
    alert("There was an error generating the Top Employees report.");
  }
};

const filteredEmployees = topEmployees?.filter((employee) => {
  const matchesName = employee.first_name.toLowerCase().includes(employeeFilter.toLowerCase()) ||
                      employee.last_name.toLowerCase().includes(employeeFilter.toLowerCase());
  const matchesSales = salesThreshold === '' || employee.total_sales >= Number(salesThreshold);
  return matchesName && matchesSales;
});

const calculateTotals = (data) => {
  if (!data || data.lenght === 0) return null;

  const totals = data.reduce(
    (acc, row) => {
      acc.totalSales += parseFloat(row.total_sales);
      acc.totalCash += parseFloat(row.total_cash);
      acc.totalTaxes += parseFloat(row.total_taxes);
      acc.totalDiscounts += parseFloat(row.total_discounts);
      return acc;
    },
    {totalSales: 0, totalCash: 0, totalTaxes: 0, totalDiscounts: 0 }
  );
  return totals;
}

const totals = calculateTotals(salesData);

return (
  <div>
    <header className="app-header">
      <h1 className="app-title">Resturant Sales Reports</h1>
    </header>

  <div className="report-container">
    {!isOptionSelected && (
      <>
      <h1>Please select an option:</h1>
      <div className="button-group">
        <button className="report-button" onClick={handleBatchSales}>
          Sales Overview
        </button>
        <button className="submit2-button" onClick={submitBestEmployees}>
          Employee Performance
        </button>
       </div>
      </>
    )}
    {batchMessage && (
      <p className="batch-message">{batchMessage}</p>
    )} 
    {showSalesOptions && (
      <div className="sales-options">
          <h3>Single Day or Time Frame:</h3>
          <div className="option-buttons">
              <button onClick={() => handleOptionClick('Daily')} className='option-button'>Daily</button>
              <button onClick={() => handleOptionClick('Time Frame')} className='option-button'>Time Range</button>
          </div>
      </div>
    )}
    {selectedOption && (
      <div className = "date-prompt">
          <h4>{`Select date${selectedOption === 'Daily' ? '' : 's'} for the sales overview`}</h4>

          {selectedOption === 'Daily' ? (
            <>
              <label> Date: </label>
              <input
              type="date"
              value={startDate}
              onChange={handleStartDateChange}
              className="data-input"
              />
            </>
          ) : (
            <>
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
        </>
        )}

        {errorMessage && <p style={{ color: 'red'}} > {errorMessage} </p>}

        <button className="submit-button" onClick={submitReport}>
            Generate Sales Overview
        </button>
      </div>
    )}
    {salesData && (
      <div className="sales-data">
        <h2 className="section-heading"> Sales Overview From {startDate} to {endDate} </h2>
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
          {totals && (
            <tr className="totals-row">
              <td><strong>Totals</strong></td>
              <td>{totals.totalSales.toFixed(2)}</td>
              <td>{totals.totalCash.toFixed(2)}</td>
              <td>{totals.totalTaxes.toFixed(2)}</td>
              <td>{totals.totalDiscounts.toFixed(2)}</td>
            </tr>
          )}
         </tbody>
        </table>
      </div>
    )}
    {topEmployees && (
      <div className="employee-data">
        <h2 className="section-heading">Employee Performance:</h2>
        <div className="filters">
          <label>Employee Name:</label>
          <input
            type="text"
            value={employeeFilter}
            onChange={(e) => setEmployeeFilter(e.target.value)}
            placeholder="Search by name"
            />
          <label>Sales Threshold:          </label>
          <input
            type="text"
            value={salesThreshold}
            onChange={(e) => setSalesThreshold(e.target.value)}
            placeholder="Enter minimum sales"
            />
            <button className="clear-filters-button" onClick={() => { setEmployeeFilter(''); setSalesThreshold(''); }}>
              Clear Filters
            </button>
          </div>
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
            {filteredEmployees.map((employee, index) => (
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
  </div>
  );
};

export default SalesReports;