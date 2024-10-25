import axios from "axios";
import { useState, useEffect } from "react";
import React from "react";
import Form from "../Reusable/Form";
import Select from "react-select";

const AddMenuItemForm = ({setModal, item, callback}) => {
    const onSubmit = async(values, event) => {
        try{
            let props = ["name", "price", "ingredients", "type", "image"]
            let data = {}
            for(let key of props){
                if(key === "ingredients"){
                    data["ingredients"] = []
                    for(let ingredient of values[key]){
                        data["ingredients"].push({
                            "quantity": 1, 
                            "ingredient_id": ingredient.value
                        });
                    }
                }
                else if(key === "type"){
                    data["type"] = values[key].value
                }
                else if (key === "image"){
                    data[key] = values[key][0].name
                }
                else{
                    data[key] = values[key]
                }
            }

            let method = (item === null) ? 'POST' : 'PATCH';
            let endpoint = (item === null) ? `http://localhost:3001/api/menu_management` :
                `http://localhost:3001/api/menu_management/${item.id}`;

            let res = await fetch(endpoint, {
                method: method,
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            setModal(false);
            callback()
        } catch (err) {
            console.log(`Error posting new menu item: ${err}`)
        }
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
                let res = await axios.get("http://localhost:3001/api/menu_management")
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

    const template =  {
        title: 'Add New Menu Item',
        fields: [
            // test form
            {
                title: 'Item Name',
                type: 'text',
                name: 'name',
                rules: { required: true },
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
                rules: { required: true },
                validationProps: {
                    required: 'Price is mandatory'
                }
            },
            {
                title: 'Image',
                type: 'file',
                name: 'image',
                rules: { required: item ? false : true },
                validationProps: {
                    required: 'JPG Image is mandatory'
                }
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
        onSubmit={onSubmit}
        preloadedValues={item}
        />
    );
}

export default AddMenuItemForm;