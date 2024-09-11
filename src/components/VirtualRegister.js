import axios from "axios";
import "../css/VirtualRegister.css"
import { useEffect, useState } from "react";
import MenuItem from "./MenuItem";

const VirtualRegister = () => {

    const [originalItems, setOriginalItems] = useState([]);
    const [items, setItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [menuFilter, setMenuFilter] = useState("ALL");
    const [subtotal, setSubtotal] = useState(0);
    const [error, setError] = useState("");

    useEffect(() => { // Load menu
        const fetchMenu = async () => {
            try {
                const response = await axios.get('http://localhost:3001/menu');
                setItems(response.data.menu);
                setOriginalItems(response.data.menu);
                 // console.log(typeof items)
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

    useEffect(() => { // update subtotal
        const calculateSubtotal = () => {
            let newTotal = 0.00;
            for (let i = 0; i < selectedItems.length; i++)
                newTotal += selectedItems[i].quantity * selectedItems[i].price;
            setSubtotal(newTotal.toFixed(2));
        }
        calculateSubtotal();
    }, [selectedItems]);

    useEffect(() => { // manage menu filter
        if (menuFilter === "ALL") {
            setItems(originalItems);
        }
        else if (menuFilter === "MAIN") {
            setItems(originalItems.filter(item => item.type === "main"))
        }
        else if (menuFilter === "SIDES") {
            setItems(originalItems.filter(item => item.type === "side"))
        }
        else if (menuFilter === "DRINKS") {
            setItems(originalItems.filter(item => item.type === "drink"))
        }
    }, [menuFilter])

    return ( 
        <div className="virtual-register">
            <div className="menu-container">
                <div className="menu-navbar">
                    <button onClick={() => setMenuFilter("ALL")}>All</button>
                    <button onClick={() => setMenuFilter("MAIN")}>Main</button>
                    <button onClick={() => setMenuFilter("SIDES")}>Sides</button>
                    <button onClick={() => setMenuFilter("DRINKS")}>Drinks</button>
                </div>
                <div className="menu-options">
                    {items.map(item => (
                        <MenuItem key={item.recipe_id} item={item} onSelect={handleSelect} />
                    ))}
                </div>
            </div>
            <div className="order-container">
                <div className="selection-list">
                    {!error && <p>{error}</p>}
                    {selectedItems.map(item => (
                        <div key={item.recipe_id} className="selected-items">
                            <span className="receipt-item-name">{item.name}</span>
                            <button className="remove-item-button" onClick={() => handleQuantityChange(item.recipe_id, -1)}>-</button>
                            <span className="receipt-item-quantity">{item.quantity}</span>
                            <button className="add-item-button" onClick={() => handleQuantityChange(item.recipe_id, 1)}>+</button>
                        </div>
                    ))}
                </div>
                {selectedItems.length > 0 && <button className="clear-list-button" onClick={() => setSelectedItems([])}>Clear All</button>}
                <div className="finish-order">
                    <p>Subtotal: ${subtotal}</p>
                    <button className="checkout-button">Checkout</button>
                </div>
            </div>
        </div>
     );
}
 
export default VirtualRegister;