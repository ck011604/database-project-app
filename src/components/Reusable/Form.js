import React from "react";
import { useForm } from 'react-hook-form';

// Reusable Form Component
function Form({ template, onSubmit }) {

    const { register, handleSubmit } = useForm();
    // Parameters needed to create Form
    const { title, fields } = template;

    // Render every data type in fields
    const renderFields = (fields) => {
        return fields.map (field => {
            const { title, type, name } = field;
            return(
                <div key={name}>
                    <label htmlFor={name}>{title}</label>
                    <input type='text' name={name} id={name} {...register('${name}')}></input>
                </div>
            )
        })
    }

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <h2>{title}</h2>
                {renderFields(fields)}
                <br/>
                <button type="submit" className="btn">Submit</button>
            </form>
        </div>
    )
}

export default Form;