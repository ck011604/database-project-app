import axios from "axios";
import { useState, useEffect } from "react";
import React from "react";
import Form from "../Reusable/Form";
import Select from "react-select";

const AddEmployeeForm = ({setModal, employee, callback}) => {
    const onSubmit = async(values, event) => {
        try{
            let props = ["first_name", "last_name", "email", "role"]
            let data = {}
            for(let key of props){
                if(key === "role"){
                    data["role"] = values[key].value
                }
                else{
                    data[key] = values[key]
                }
            }

            let method = (employee === null) ? 'POST' : 'PATCH';
            let endpoint = (employee === null) ? `${REACT_APP_API_URL}/api/employees` :
                `${REACT_APP_API_URL}/api/employees/${employee.id}`;

            let res = await fetch(endpoint, {
                method: method,
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            console.log(data)
            setModal(false);
            callback()
        } catch (err) {
            console.log(`Error posting new employee: ${err}`)
        }
    };
    const [roleOptions, setRoleOptions] = useState([]);

    useEffect(() => {
        const fetchAllEmployees = async ()=>{
            try{
                let res = await axios.get(`${REACT_APP_API_URL}/api/employees`)
                let roleOptions = res.data.employees;
                let uniqueTypes = new Set();
                let new_roles = [];
                for (let employee of roleOptions) {
                    if (!uniqueTypes.has(employee.role)) {
                        uniqueTypes.add(employee.role);
                        new_roles.push({
                            value: employee.role,
                            label: employee.role,
                        });
                    }
                }
                setRoleOptions(new_roles);
            } catch (err) {
                console.log(`Error fetching roles: ${err}`)
            }
        }
        fetchAllEmployees()
    }, [])

    const template =  {
        title: 'Add a New Employee',
        fields: [
            {
                title: 'First Name',
                type: 'text',
                name: 'first_name',
                rules: { required: true },
                validationProps: {
                    required: 'First Name is mandatory'
                }
            },
            {
                title: 'Last Name',
                name: 'last_name',
                type: 'text',
                rules: { required: true },
                validationProps: {
                    required: 'Last Name is mandatory'
                }
            },
            {
                title: 'Email',
                type: 'email',
                name: 'email',
                rules: { required: true },
                validationProps: {
                    required: 'Email is mandatory'
                }
            },
            {
                title: 'Role',
                name: 'role',
                type: 'select',
                rules: { required: true },
                render: ({ field }) => (<Select {...field} options={roleOptions} />),
                validationProps: {
                    required: 'Employee role is mandatory'
                }
            },
        ]
    }

    return ( 
        <Form 
        template={template}
        watchFields={['First Name']}
        onSubmit={onSubmit}
        preloadedValues={employee}
        />
    );
}

export default AddEmployeeForm;