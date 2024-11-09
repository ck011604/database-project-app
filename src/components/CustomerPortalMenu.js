import axios from "axios";
import { useEffect, useState } from "react";
import MenuItem from "../components/MenuItem";
import "../css/CheckoutPopup.css";
import CustomerView from "../components/CustomerView";

const CustomerMenuView= () => {
    const [originalItems, setOriginalItems] = useState([]);
    const [originalInventoryStock, setOriginalInventoryStock] = useState([]);
    const [items, setItems] = useState([]);
    const [inventoryStock, setInventoryStock] = useState([]);
    const [menuFilter, setMenuFilter] = useState("ALL");
    const [error, setError] = useState("");

    const fetchInventory = async () => {
        try {
            const inventoryResponse = await axios.get(`${process.env.REACT_APP_API_URL}/inventory-stock`);
            setInventoryStock(inventoryResponse.data.inventory);
            setOriginalInventoryStock(inventoryResponse.data.inventory);
        } catch (err) {
            if (err.response && err.response.data && err.response.data.message)
                setError(err.response.data.message);
            else
                setError('An error has occured fetching the inventory');
        }
    }

    useEffect(() => { // Load menu
        const fetchMenu = async () => {
            try {
                const menuResponse = await axios.get(`${process.env.REACT_APP_API_URL}/menu`);
                setItems(menuResponse.data.menu);
                setOriginalItems(menuResponse.data.menu);
            } catch(err) {
                if (err.response && err.response.data && err.response.data.message)
                    setError(err.response.data.message);
                else
                    setError('An error has occured fetching the menu');
            }
        };
        fetchMenu();
        fetchInventory();
    }, []);

    const handleSelect = () => {
        return null
    }

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
        <div className="management" style={{"maxWidth": "1100px"}}>
            <CustomerView/>
            <div className="virtual-register" style={{"border-radius": "15px", "padding": "20px"}}>
            <div className="menu-container" style={{"width": "100%"}}>
                <div className="menu-navbar">
                    <button onClick={() => setMenuFilter("ALL")}>All</button>
                    <button onClick={() => setMenuFilter("MAIN")}>Main</button>
                    <button onClick={() => setMenuFilter("SIDES")}>Sides</button>
                    <button onClick={() => setMenuFilter("DRINKS")}>Drinks</button>
                </div>
                <div className="menu-options">
                    {items.map(item => (
                        <MenuItem key={item.recipe_id} item={item} onSelect={handleSelect}/>
                    ))}
                </div>
                {error && <p>{error}</p>}
            </div>
        </div>
    </div>
    );
}

export default CustomerMenuView;