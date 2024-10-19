import React, {useEffect} from "react";
import { useForm, Controller } from 'react-hook-form';
import Select from "react-select";

// Reusable Form Component
function Form({ template, onSubmit, watchFields, validate }) {

    const { register, handleSubmit, formState: { errors }, watch, setError, clearErrors, control } = useForm({
        // defaultValues: {
        //     itemName: '',
        //     ID: ''
        // }
    });
    
    // Parameters needed to create Form
    const { title, fields } = template;

    const watchValues = watch();
    console.log(watchValues);
    
    // useEffect(() => {
    //     validate(watchValues, { errors, setError, clearErrors });
    //     // console.log(watchValues);
    // }, [watchValues]);

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
                            <input type='number' name={name} id={name} {...register(name, validationProps)}></input>
                            { errors[name] && <span className='red-text'>{errors[name]['message']}</span>}
                        </div>
                    )
                case 'select':
                    return (
                        <div key={name} style={{ marginTop: '10px' }}>
                            <label htmlFor={name}>{title}</label>
                            <Controller
                                name={name}
                                control={control}
                                rules={rules}
                                render={render}
                            />
                            {errors[name] && <span className='red-text'>{errors[name]['message']}</span>}
                        </div>
                    );
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