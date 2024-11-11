import React, {useEffect} from "react";
import { useForm, Controller } from 'react-hook-form';
import Select from "react-select";
import axios from "axios";

// Reusable Form Component
function Form({ template, onSubmit, watchFields, validate, preloadedValues, autocomplete}) {
    const { register, handleSubmit, formState: { errors }, watch, setError, clearErrors, control } = useForm({
        defaultValues: preloadedValues
    });
    // Parameters needed to create Form
    const { title, fields } = template;

    const uploadImage = async (file) => {  
        const formData = new FormData()
        formData.append("image", file)

        await fetch(`${process.env.REACT_APP_API_URL}/api/menu_image`, {
            method: "POST",
            body: formData
        })
    }

    const handleChange = async(e) => {
        const fileList = e.target.files
        if(fileList == undefined)
            return

        let files = fileList.length
        if(files < 1){
            return
        }

        let file = fileList[0]
        uploadImage(file)
    }

    // Render every data type in fields
    const renderFields = (fields) => {
        return fields.map (field => {
            const { title, type, name, validationProps, rules, render } = field;

            switch(type){
                case 'text':
                    return(
                        <div key={name}>
                            <label htmlFor={name} style={{ marginTop: '10px' }}>{title}</label>
                            <input type='text' name={name} id={name} {...register(name, validationProps)}></input>
                            { errors[name] && <span className='red-text'>{errors[name]['message']}</span>}
                        </div>
                    )
                case 'number':
                    return(
                        <div key={name}>
                            <label htmlFor={name} style={{ marginTop: '10px' }}>{title}</label>
                            <input type='number' name={name} id={name} step={0.01} {...register(name, validationProps)}></input>
                            { errors[name] && <span className='red-text'>{errors[name]['message']}</span>}
                        </div>
                    )
                case 'email':
                    return(
                        <div key={name}>
                            <label htmlFor={name} style={{ marginTop: '10px' }}>{title}</label>
                            <input type='email' name={name} id={name} autocomplete={autocomplete} {...register(name, validationProps)}></input>
                            { errors[name] && <span className='red-text'>{errors[name]['message']}</span>}
                        </div>
                    )
                case 'select':
                    return (
                        <div key={name}>
                            <label htmlFor={name} style={{ marginTop: '10px' }}>{title}</label>
                            <Controller
                                name={name}
                                control={control}
                                rules={rules}
                                render={render}
                            />
                            {errors[name] && <span className='red-text'>{errors[name]['message']}</span>}
                        </div>
                    );
                case 'file':
                    return (
                        <div key={name}>
                            <label htmlFor={name} style={{ marginTop: '10px' }}>{title}</label>
                            <input type='file' {...register('image', { onChange: handleChange, required: rules.required, accept: 'image/jpeg'})}></input>
                        </div>
                    );
                    case 'password':
                        return (
                            <div key={name}>
                                <label htmlFor={name} style={{ marginTop: '10px' }}>{title}</label>
                                <input type="text" style={{"display": "none"}}></input>
                                <input type='password' name={name} id={name} autocomplete={autocomplete} {...register(name, validationProps)}></input>
                                { errors[name] && <span className='red-text'>{errors[name]['message']}</span>}
                            </div>
                        )
                default:
                    return(
                        <div key={name} style={{ marginTop: '10px' }}>
                            <span className='red-text'>Invalid Field</span>
                        </div>
                    )
            }
        })
    }

    return (
        <div className = 'form-details'>
            <form autoComplete={autocomplete} onSubmit={handleSubmit(onSubmit)}>
                <h2>{title}</h2>
                {renderFields(fields)}
                <br/>
                <button type="submit" className="btn">Submit</button>
            </form>
        </div>
    )
}

export default Form;