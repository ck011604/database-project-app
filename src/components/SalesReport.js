import React, { useState, useEffect } from "react";
import "../css/SalesReport.css";
import axios from 'axios';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const SalesReports = () => {
  const [employeeIdFilter, setEmployeeIdFilter] = useState('');
  const [employeeNameFilter, setEmployeeNameFilter] = useState('');
  const [orderIdFilter, setOrderIdFilter] = useState('');
  const [employeeOrderData, setEmployeeOrderData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

const [isOptionSelected, setIsOptionSelected] = useState(false);
const [salesData, setSalesData] = useState(null);
const [topEmployees, setTopEmployees] = useState(null);
const [employeeFilter, setEmployeeFilter] = useState('');
const [salesThreshold, setSalesThreshold] = useState('');

useEffect(() => {
  fetchEmployeeOrderData();
}, []);

const fetchEmployeeOrderData = async () => {
  try {
    console.log("fetch Employee data activated");
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/employee-performance`); // have to change the name
    if (response.data.success) {
      setEmployeeOrderData(response.data.tableData);
      setFilteredData(response.data.tableData);
    } else {
      console.error(response.data.message);
      alert(response.data.message);
    }
  } catch (error) {
    console.error("Error getting employee - orders data table", error);
    alert("There was an error generating table.");
  }
};

useEffect(() => {
  const filtered = employeeOrderData.filter(row => {
    const matchesEmployeeName = `${row.first_name} ${row.last_name}`.toLowerCase().includes(employeeNameFilter.toLowerCase());
    const matchesEmployeeId = employeeIdFilter === '' || row.employee_id.toString().includes(employeeIdFilter);
    const matchesOrderId = orderIdFilter === '' || row.order_id.toString().includes(orderIdFilter);

    return matchesEmployeeName && matchesEmployeeId && matchesOrderId;
  });
  setFilteredData(filtered);
  setCurrentPage(1); // Reset to page 1 when filters change
}, [employeeNameFilter, employeeIdFilter, orderIdFilter, employeeOrderData]);

const indexOfLastRow = currentPage * rowsPerPage;
const indexOfFirstRow = indexOfLastRow - rowsPerPage;
const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);
const totalPages = Math.ceil(filteredData.length / rowsPerPage);

const handleNextPage = () => {
  if (currentPage < totalPages) setCurrentPage(currentPage + 1);
};

const handlePreviousPage = () => {
  if (currentPage > 1) setCurrentPage(currentPage - 1);
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

return (
  <div>
    <header className="app-header">
      <h1 className="app-title">Employee Performance Report</h1>
    </header>
    <div>
  </div>
  <div className="EmpOrderTable">
    <h2 className="EmpOrder">Employee Orders</h2>
    <table>
        <thead>
          <tr>
            <th>Employee ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Order ID</th>
            <th>Discount Amount</th>
            <th>Tip Amount</th>
            <th>Subtotal</th>
            <th>Order Total</th>
          </tr>
        </thead>
        <tbody>
          {currentRows.map((row, index) => (
            <tr key={index}>
              <td>{row.employee_id}</td>
              <td>{row.first_name}</td>
              <td>{row.last_name}</td>
              <td>{row.order_id}</td>
              <td>{row.discount_amount}</td>
              <td>{row.tip_amount}</td>
              <td>{row.subtotal}</td>
              <td>{row.order_total}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="filters">
        <input
          type="text"
          placeholder="Filter by Employee Name"
          value={employeeNameFilter}
          onChange={(e) => setEmployeeNameFilter(e.target.value)}
        />
        <input
          type="text"
          placeholder="Filter by Employee ID"
          value={employeeIdFilter}
          onChange={(e) => setEmployeeIdFilter(e.target.value)}
        />
        <input
          type="text"
          placeholder="Filter by Order ID"
          value={orderIdFilter}
          onChange={(e) => setOrderIdFilter(e.target.value)}
        />
      </div>
    <div className="pagination">
        <button onClick={handlePreviousPage} disabled={currentPage === 1}>
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>
          Next
        </button>
    </div>
  </div>
  <div className="report-container">
    {!isOptionSelected && (
      <>
      <div className="button-group">
        <button className="submit2-button" onClick={submitBestEmployees}>
          Summary
        </button>
       </div>
      </>
    )}
    {topEmployees && (
      <div className="employee-data">
        <h2 className="section-heading">Summary:</h2>
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
              <th>First Name</th>
              <th>Last Name</th>
              <th>Role</th>
              <th>Total Orders Taken</th>
              <th>Tip Earnings</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((employee, index) => (
              <tr key={index}>
                <td>{employee.employee_id}</td>
                <td>{employee.last_name}</td>
                <td>{employee.first_name}</td>
                <td>{employee.role}</td>
                <td>{employee.orders_count}</td>
                <td>{employee.total_tips}</td>
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