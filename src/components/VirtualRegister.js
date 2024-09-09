import axios from "axios";
import "../css/VirtualRegister.css"
import { useEffect, useState } from "react";
import MenuItem from "./MenuItem";

const VirtualRegister = () => {

    const [items, setItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchMenu = async () => {
            try {
                const response = await axios.get('http://localhost:3001/menu');
                setItems(response.data.menu);
                console.log(typeof items)
            } catch(err) {
                if (err.response && err.response.data && err.response.data.message)
                    setError(err.response.data.message);
                else
                    setError('An error has occured');
            }
        };
        fetchMenu();
    }, []);

    const handleSelect = (item) => {
        const updatedItems = [...selectedItems]; // Copy selectedItems
        let itemFound = false; // Track if item is found
        for (let i = 0; i < updatedItems.length; i++) { // Loop through all selected items
            if (updatedItems[i].recipe_id === item.recipe_id) { // If the item exist, increase quantity by 1
                updatedItems[i] = {
                    ...updatedItems[i], // Copies all the other properties
                    quantity: updatedItems[i].quantity + 1 // Update quantity
                };
                itemFound = true; // Item found
                break;
            }
        }
        if (!itemFound) { // If item is not found, append the item at quantity 1
            updatedItems.push({...item, quantity: 1});
        }
        setSelectedItems(updatedItems); // Update selected items
    }
    const handleQuantityChange = (itemID, delta) => {
        console.log("Changing", {itemID}, "Quantity by", {delta})
        const updatedItems = selectedItems.map(item => {
            if (item.recipe_id === itemID) { // If this is the item we are updating, change its quantity
                return {
                    ...item, // Copy properties
                    quantity: item.quantity + delta // Update quantity by delta
                };
            }
            return item; // Else return unchanged
        }).filter(item => item.quantity > 0); // Remove items with quantity 0 or less
        setSelectedItems(updatedItems);
    };

    useEffect(() => { // For testing
        console.log("Updated Selected Items:", selectedItems);
    }, [selectedItems]);

    return ( 
        <div className="virtual-register">
            <div className="menu-container">
                <div className="menu-navbar">
                    <h1>Menu</h1>
                </div>
                <div className="menu-options">
                    {items.map(item => (
                        <MenuItem key={item.recipe_id} item={item} onSelect={handleSelect} />
                    ))}
                </div>
            </div>
            <div className="order-container">
                {selectedItems.map(item => (
                    <div key={item.recipe_id} className="selected-items">
                        <span className="receipt-item-name">{item.name}</span>
                        <button onClick={() => handleQuantityChange(item.recipe_id, -1)}>-</button>
                        <span className="receipt-item-quantity">{item.quantity}</span>
                        <button onClick={() => handleQuantityChange(item.recipe_id, 1)}>+</button>
                    </div>
                ))}
                {!error && <p>{error}</p>}
            </div>
        </div>
     );
}
 
export default VirtualRegister;