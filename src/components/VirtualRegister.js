import axios from "axios";
import "../css/VirtualRegister.css"
import { useEffect, useState } from "react";
import MenuItem from "./MenuItem";
import CheckoutPopup from "./CheckoutPopup";

const VirtualRegister = () => {

    const [originalItems, setOriginalItems] = useState([]);
    const [items, setItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [originalInventoryStock, setOriginalInventoryStock] = useState([]);
    const [inventoryStock, setInventoryStock] = useState([]);
    const [menuFilter, setMenuFilter] = useState("ALL");
    const [subtotal, setSubtotal] = useState(0);
    const [isCheckoutVisible, setIsCheckoutVisible] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => { // Load menu
        const fetchMenu = async () => {
            try {
                const menuResponse = await axios.get('http://localhost:3001/menu');
                setItems(menuResponse.data.menu);
                setOriginalItems(menuResponse.data.menu);
            } catch(err) {
                if (err.response && err.menuResponse.data && err.menuResponse.data.message)
                    setError(err.menuResponse.data.message);
                else
                    setError('An error has occured fetching the menu');
            }
        };
        const fetchInventory = async () => {
            try {
                const inventoryResponse = await axios.get('http://localhost:3001/inventory-stock');
                setInventoryStock(inventoryResponse.data.inventory);
                setOriginalInventoryStock(inventoryResponse.data.inventory);
            } catch(err) {
                if (err.response && err.inventoryResponse.data && err.inventoryResponse.data.message)
                    setError(err.inventoryResponse.data.message);
                else
                    setError('An error has occured fetching the inventory');
            }
        }
        fetchMenu();
        fetchInventory();
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
    const resetSelectedItems = () => {
        setSelectedItems([]);
        console.log("Reseting selected items", selectedItems)
    }

    const handleQuantityChange = (itemID, delta) => {
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
    const handlePopupOnClose = () => {
        setIsCheckoutVisible(false);
    };

    const isItemOutOfStock = (item) => {
      let outOfStock = false; // Assume the item is in stock by default

      // Loop through each ingredient the item needs
      item.ingredients.forEach((ingredient) => {
        // Find the ingredient in the inventory by its ID
        const stockItem = inventoryStock.find(
          (stock) => stock.ingredient_id === ingredient.ingredient_id
        );

        // Check if the ingredient is not found or if there's not enough in stock
        if (!stockItem || stockItem.amount < ingredient.quantity) {
            outOfStock = true; // If any ingredient is out of stock, mark the item as out of stock
        }
      });

      return outOfStock; // Return true if out of stock, false if fully available
    }

    useEffect(() => { // update subtotal
        const calculateSubtotal = () => {
            let newTotal = 0.00;
            for (let i = 0; i < selectedItems.length; i++)
                newTotal += selectedItems[i].quantity * selectedItems[i].price;
            setSubtotal(newTotal.toFixed(2));
        }
        const calculateInventory = () => { // update local inventory
            let newInventoryStock = originalInventoryStock.map(item => ({
                ...item
            }));
            for (let i = 0; i < selectedItems.length; i++)
                for (let j = 0; j < selectedItems[i].ingredients.length; j++) {
                    let ingredient = selectedItems[i].ingredients[j];
                    let inventoryItem = newInventoryStock.find(item => item.ingredient_id === ingredient.ingredient_id)
                    inventoryItem.amount -= selectedItems[i].quantity * ingredient.quantity
                }
            setInventoryStock(newInventoryStock)
        }
        calculateSubtotal();
        calculateInventory();
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

    // useEffect(() => { // For testing purposes
    //     console.log(inventoryStock)
    // }, [inventoryStock])
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
                        <MenuItem key={item.recipe_id} className={isItemOutOfStock(item) ? 'out-of-stock' : ''} item={item} onSelect={handleSelect} />
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
                {selectedItems.length > 0 && <button className="clear-list-button" onClick={resetSelectedItems}>Clear All</button>}
                <div className="finish-order">
                    <p>Subtotal: ${subtotal}</p>
                    <button className="checkout-button" onClick={() => setIsCheckoutVisible(true)}>Checkout</button>
                </div>
            </div>
            {isCheckoutVisible && <CheckoutPopup onClose={handlePopupOnClose} subtotal={subtotal} selectedItems={selectedItems} onReset={resetSelectedItems} />}
        </div>
     );
}
 
export default VirtualRegister;