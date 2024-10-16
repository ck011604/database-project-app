import axios from "axios";
import { useState, useEffect } from "react";
import React from "react";
import Form from "../Reusable/Form";
import Select from "react-select";

const AddMenuItemForm = (props) => {
    const onSubmit = (values) => {
        console.log(values);
    };
    const [ingredientsOptions, setIngredientsOptions] = useState([]);
    const [typeOptions, setTypeOptions] = useState([]);

    useEffect(() => {
        const fetchIngredients = async () => {
            try {
                let res = await axios.get("http://localhost:3001/api/inventory")
                let ingredientsOptions = res.data.inventory;
                let new_ingredients = []
                for (let ingredient of ingredientsOptions) {
                    new_ingredients.push({
                        value: ingredient.ingredient_id,
                        label: ingredient.name,
                    })
                }
                console.log(new_ingredients)
                setIngredientsOptions(new_ingredients);
            } catch (err) {
                console.log(`Error fetching ingredients: ${err}`);
            }
        };
        fetchIngredients();
    }, []);

    useEffect(() => {
        const fetchAllItems = async ()=>{
            try{
                let res = await axios.get("http://localhost:3001/menu")
                let typeOptions = res.data.menu;
                let uniqueTypes = new Set();
                let new_items = [];
                for (let item of typeOptions) {
                    if (!uniqueTypes.has(item.type)) {
                        uniqueTypes.add(item.type);
                        new_items.push({
                            value: item.type,
                            label: item.type,
                        });
                    }
                }
                console.log(new_items)
                setTypeOptions(new_items);
            } catch (err) {
                console.log(`Error fetching types: ${err}`)
            }
        }
        fetchAllItems()
    }, [])

    const type = [
        { value: 'main', label: 'Main Course' },
        { value: 'side', label: 'Side Dish' },
        { value: 'drink', label: 'Drink' },
    ];

    // const validate = (watchValues, errorMethods) => {
    //     const { errors, setError, clearErrors } = errorMethods;
    
    //     // clearErrors('itemName');
    
    //     // itemName validation
    //     if(watchValues['itemName'] === 'pizza') {
    //         setError('itemName', {
    //             type: 'manual',
    //             message: 'Item already exists'
    //         });
    //     }
    // }

    const template =  {
        title: 'Add New Menu Item',
        fields: [
            // test form
            {
                title: 'Item Name',
                type: 'text',
                name: 'itemName',
                validationProps: {
                    required: 'Item name is mandatory'
                }
            },
            {
                title: 'Ingredients',
                name: 'ingredients',
                type: 'select',
                rules: { required: true },
                render: ({ field }) => (<Select {...field} isMulti options={ingredientsOptions} />),
                validationProps: {
                    required: 'Ingredients is mandatory'
                }
            },
            {
                title: 'Price',
                type: 'number',
                name: 'price',
                validationProps: {
                    required: 'Price is mandatory'
                }
            },
            {
                title: 'Image',
                type: 'text',
                name: 'image',
                // validationProps: {
                //     required: 'Image is mandatory'
                // }
            },
            {
                title: 'Type',
                name: 'type',
                type: 'select',
                rules: { required: true },
                render: ({ field }) => (<Select {...field} options={typeOptions} />),
                validationProps: {
                    required: 'Item type is mandatory'
                }
            },
        ]
    }

    return (
        <Form
            template={template}
            watchFields={['itemName']}
            // validate={validate}
            // Allow access to data within component
            onSubmit={onSubmit}
        />
    );
}

export default AddMenuItemForm;