import React from "react";
import Form from "../Reusable/Form";
import { toast } from 'react-toastify';

const AddPromotionForm = ({setModal, promotion, callback}) => {
    const onSubmit = async(values, event) => {
        try{
            let props = ["code", "discount_percent", "uses_left"]
            let data = {}
            for(let key of props){
                if (key === "uses_left" && values[key] == "") {
                    data[key] = null
                } 
                else{
                    data[key] = values[key]
                }
            }

            let method = (promotion) ? 'PATCH' : 'POST';

            let endpoint = (promotion) ? `${process.env.REACT_APP_API_URL}/api/promotions/${promotion.promoCode_id}` :
             `${process.env.REACT_APP_API_URL}/api/promotions`;

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
            toast.success("Success!")
        } catch (err) {
            console.log(`Error posting new promotion: ${err}`)
            toast.error("Error!")
        }
    };

    let template =  {
        title: 'Add a new Promotion Code',
        fields: [
            {
                title: 'Code Name',
                type: 'text',
                name: 'code',
                rules: { required: true },
                validationProps: {
                    required: 'Code Name is mandatory'
                }
            },
            {
                title: 'Discount Percent',
                name: 'discount_percent',
                type: 'number',
                rules: { required: true },
                validationProps: {
                    required: 'Discount Percentage is mandatory',
                    min: 0,
                    max: 100
                }
            },
            {
                title: 'Remaining Uses',
                type: 'number',
                name: 'uses_left',
                rules: { required: false },
            },
        ]
    }

    return ( 
        <Form
        template={template}
        onSubmit={onSubmit}
        preloadedValues={promotion}
        />
    );
}

export default AddPromotionForm;
