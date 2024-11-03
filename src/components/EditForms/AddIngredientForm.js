import React from "react";
import Form from "../Reusable/Form";

const AddIngredientForm = ({setModal, ingredient, callback}) => {
    const onSubmit = async(values, event) => {
        try{
            let props = ["name", "amount", "restock_threshold", "restock_amount"]
            let data = {}
            for(let key of props){
                data[key] = values[key]
            }

            let method = (ingredient) ? 'PATCH' : 'POST';

            let endpoint = (ingredient) ? `${process.env.REACT_APP_API_URL}/api/ingredient/${ingredient.ingredient_id}` :
             `${process.env.REACT_APP_API_URL}/api/inventory`;

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
            console.log(`Error posting new ingredient: ${err}`)
        }
    };

    const template =  {
        title: 'Add a New ingredient',
        fields: [
            {
                title: 'Ingredient Name',
                type: 'text',
                name: 'name',
                rules: { required: true },
                validationProps: {
                    required: 'Name is mandatory'
                }
            },
            {
                title: 'Current Stock',
                name: 'amount',
                type: 'number',
                rules: { required: true },
                validationProps: {
                    required: 'Current stock is mandatory'
                }
            },
            {
                title: 'Restock Threshold',
                type: 'number',
                name: 'restock_threshold',
                rules: { required: true },
                validationProps: {
                    required: 'Restock threshold is mandatory'
                }
            },
            {
                title: 'Restock Amount',
                name: 'restock_amount',
                type: 'number',
                rules: { required: true },
                validationProps: {
                    required: 'Restock amount is mandatory'
                }
            },
        ]
    }

    return ( 
        <Form 
        template={template}
        watchFields={['']}
        onSubmit={onSubmit}
        preloadedValues={ingredient}
        />
    );
}

export default AddIngredientForm;