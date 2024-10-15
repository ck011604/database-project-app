import React from "react";
import Form from "../Reusable/Form";

function AddMenuItemForm(props) {
    const onSubmit = (values) => {
        console.log(values);
    };

    const template =  {
        title: 'Add New Menu Item',
        fields: [
            // test form
            {
                title: 'Item Name',
                type: 'text',
                name: 'itemName'
            }
        ]
    }

    return (
        <Form
            template={template}
            // Allow access to data within component
            onSubmit={onSubmit}
        />
    );
}

export default AddMenuItemForm;