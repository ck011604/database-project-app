import React, { useState, useEffect } from "react";
import "../css/SalesReport.css";
import axios from 'axios';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const SalesReports = () => {
  const [employeeIdFilter, setEmployeeIdFilter] = useState('');
  const [employeeNameFilter, setEmployeeNameFilter] = useState('');
  const [orderIdFilter, setOrderIdFilter] = useState('');
  const [employeeOrderData, setEmployeeOrderData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const [orderTotalThresholdFilter, setOrderTotalThresholdFilter] = useState('');
  const [isOptionSelected, setIsOptionSelected] = useState(false);
  const [topEmployees, setTopEmployees] = useState(null);

useEffect(() => {
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
  fetchEmployeeOrderData();
}, []);

useEffect(() => {
  const filtered = employeeOrderData.filter(row => {
    const matchesEmployeeName = `${row.first_name} ${row.last_name}`.toLowerCase().includes(employeeNameFilter.toLowerCase());
    const matchesEmployeeId = employeeIdFilter === '' || row.employee_id.toString().includes(employeeIdFilter);
    const matchesOrderId = orderIdFilter === '' || row.order_id.toString().includes(orderIdFilter);
    const matchedTotalTheshold = orderTotalThresholdFilter === '' || row.order_total >= Number(orderTotalThresholdFilter);
    return matchesEmployeeName && matchesEmployeeId && matchesOrderId && matchedTotalTheshold;
  });
  setFilteredData(filtered);
  setCurrentPage(1); // Reset to page 1 when filters change
}, [employeeNameFilter, employeeIdFilter, orderIdFilter, orderTotalThresholdFilter, employeeOrderData]);

const clearEmployeeOrderFilters = () => {
  setEmployeeNameFilter('');
  setEmployeeIdFilter('');
  setOrderIdFilter('');
  setOrderTotalThresholdFilter('');
};

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
  const matchesName = employee.first_name.toLowerCase().includes(employeeNameFilter.toLowerCase()) ||
                      employee.last_name.toLowerCase().includes(employeeNameFilter.toLowerCase());
  return matchesName;
});

const chartData = topEmployees
  ? {
      labels: filteredEmployees.map(
        (employee) => `${employee.first_name} ${employee.last_name}`
      ),
      datasets: [
        {
          label: 'Total Orders Taken',
          data: filteredEmployees.map((employee) => employee.orders_count),
          backgroundColor: 'rgba(0, 51, 102, 0.6)',
          borderColor: 'rgba(0, 51, 102, 1)',
          borderWidth: 1,
        },
        {
          label: 'Total Tips',
          data: filteredEmployees.map((employee) => employee.total_tips),
          backgroundColor: 'rgba(76, 175, 80, 0.6)',
          borderColor: 'rgba(76, 175, 80, 1)',
          borderWidth: 1,
        },
      ],
    }
: null;

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    tooltip: {
      callbacks: {
        label: (context) => `${context.dataset.label}: ${context.raw}`,
      },
    },
  },
  scales: {
    x: {
      title: {
        display: true,
        text: 'Employee',
      },
    },
    y: {
      title: {
        display: true,
        text: 'Count / Total Tips',
      },
      beginAtZero: true,
    },
  },
};

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
        <input
          type="text"
          placeholder="Minimum Order Total"
          value={orderTotalThresholdFilter}
          onChange={(e) => setOrderTotalThresholdFilter(e.target.value)}
        />
        <button
          className="clear-filters-button"
          onClick={clearEmployeeOrderFilters}
        >
    Clear Filters
  </button>
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
                <td>{employee.first_name}</td>
                <td>{employee.last_name}</td>
                <td>{employee.role}</td>
                <td>{employee.orders_count}</td>
                <td>{employee.total_tips}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="histogram">
        <h3>Employee Performance Histogram</h3>
        {chartData && <Bar data={chartData} options={chartOptions} />}
      </div>
      </div>
    )}
  </div>
  </div>
  );
};

export default SalesReports;