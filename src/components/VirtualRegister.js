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
        setSelectedItems([...selectedItems, item]) // Append item
    }

    return ( 
        <div className="virtual-register">
            <div className="item-container">
                <h2>Items</h2>
                {items.map(item => (
                    <MenuItem key={item.recipe_id} item={item} onSelect={handleSelect} />
                ))}
            </div>
            <div className="order-container">
                <h2>Receipt</h2>
                {!error && <p>{error}</p>}
            </div>
        </div>
     );
}
 
export default VirtualRegister;