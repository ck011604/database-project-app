import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BsFillTrashFill, BsFillPencilFill } from "react-icons/bs";
import '../css/Management.css';
import Modal from "./Reusable/Modal";
import AddEmployeeForm from "./EditForms/AddEmployeeForm";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EmployeeManagement = () => {
    const [productFilter] = useState("EMPLOYEES");
    const [employees, setEmployees] = useState([]);
    const [modal, setModal] = useState(false);
    const [employee, setEmployee] = useState(null);

    const fetchAllEmployees = async () => {
        try{
            let res = await axios.get(`${process.env.REACT_APP_API_URL}/api/employees`)
            let employees = res.data.employees;
            let new_employees = []
            for(let employee of employees){
                new_employees.push({
                    id: employee.employee_id,
                    first_name: employee.first_name,
                    last_name: employee.last_name,
                    email: employee.email,
                    role: employee.role,
                    isActive: employee.is_active,
                })
            }
            console.log(new_employees)
            setEmployees(new_employees);
        } catch (err) {
            console.log(`Error fetching Employees: ${err}`)
        }
    }

    useEffect(() => {
        if (productFilter === "EMPLOYEES") {
            fetchAllEmployees();
        }
    }, [productFilter]);

    const toggleModal = async (employee = null) => {
        console.log(employee)
        if(employee){
            let data = {
                id: employee.id,
                first_name: employee.first_name,
                last_name: employee.last_name,
                email: employee.email,
                role: {
                    value: employee.role,
                    label: employee.role
                },
                isActive: employee.isActive,
            }
            employee = data
        }
        console.log(employee)
        setEmployee(employee)
        setModal(!modal)
    };

    const handleDelete = async(id) => {
        try {
            await axios.delete(`${process.env.REACT_APP_API_URL}/api/employees/${id}`);
            fetchAllEmployees();
            toast.success("Successfully deleted Employee!")
        } catch (err) {
            console.error(`Error deleting item: ${err}`);
            toast.error("Error deleting Employee!")
        }
    };

    const handleReactivate = async(id) => {
        try {
            await fetch(`${process.env.REACT_APP_API_URL}/api/employees/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ is_active: true })
            });
            fetchAllEmployees();
        } catch (err) {
            console.error(`Error reactivated Employee: ${err}`);
        }
    }

    const filterTable = (e) => {
        const searchValue = e.target.value.toUpperCase()
        // Declare variables
        let table, tr, td, i, txtValue;
        table = document.getElementById("employee-table");
        tr = table.getElementsByTagName("tr");
      
        // Loop through all table rows, and hide those who don't match the search query
        for (i = 0; i < tr.length; i++) {
          td = tr[i].getElementsByTagName("td")[1];
          if (td) {
            txtValue = td.textContent || td.innerText;
            if (txtValue.toUpperCase().indexOf(searchValue) > -1) {
              tr[i].style.display = "";
            } else {
              tr[i].style.display = "none";
            }
          }
        }
      }

    return(
        <div className="add-menu-item">
            <ToastContainer position="bottom-right"/>
            <Modal modal={modal} setModal={setModal}>
                <AddEmployeeForm setModal={setModal} employee={employee} callback={fetchAllEmployees}/>
            </Modal>
            <div className="inventory-form-container">
                <div className="add-employee" style={{"paddingBottom": "5px"}}>
                    <h2 style={{display: "inline"}} >Employee Management</h2>
                </div>
                <div>
                <input className="filter-table" type="text" onKeyUp={filterTable} placeholder="Search for items.."></input>
                    <button onClick={() => toggleModal()} className="btn-modal"> + </button>
                </div>
                <table id="employee-table" className="management-table">
                    <thead> 
                        <tr className="item-info">
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Is Active</th>
                        </tr>
                    </thead>
                        <tbody id="items-table">
                            {employees.map((employee) => (
                                <tr key={employee.id}>
                                    <td>{employee.id}</td>
                                    <td>{`${employee.first_name} ${employee.last_name}`}</td>
                                    <td>{employee.email}</td>
                                    <td>{employee.role}</td>
                                    <td>
                                        <div className='actions-container'>
                                            <span className={`status-label ${employee.isActive ? 'status-label-active' : 'status-label-inactive'}`}>
                                                {employee.isActive ? "Active" : "Inactive"}
                                            </span>
                                            {employee.isActive ? 
                                                <span className='item-actions'>
                                                    <BsFillPencilFill onClick={() => toggleModal(employee)}/>                       
                                                    <BsFillTrashFill className='delete-btn' onClick={() => handleDelete(employee.id)}/>
                                                </span> :
                                                <button className="reactivate-btn" onClick={() => handleReactivate(employee.id)}> Reactivate </button>
                                            }
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                </table>
            </div>
        </div>
    );

};

export default EmployeeManagement;
