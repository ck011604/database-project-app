import axios from "axios";
import { useState, useEffect } from "react";
import "../css/Products.css"

const Products = () => {
    const [items, setItems] = useState([]);
    const [productFilter, setProductFilter] = useState("Menu Items");
    useEffect(() => {
        if (productFilter === "MENU_ITEMS") {
            
        }
        else if (productFilter === "INVENTORY") {
            
        }
        else if (productFilter === "REWARDS") {
            
        }
        else if (productFilter === "EVENTS") {
            
        }
    }, [productFilter])

    return (
        <div className="products">
            <style>
                
            </style>
            <div className="menu-navbar">
                <button onClick={() => setProductFilter("MENU_ITEMS")}>Menu Items</button>
                <button onClick={() => setProductFilter("INVENTORY")}>Inventory</button>
                <button onClick={() => setProductFilter("REWARDS")}>Rewards</button>
                <button onClick={() => setProductFilter("EVENTS")}>Events</button>
            </div>
            <h3>List of Menu Items</h3>
            <table class="table">
                <thead> 
                    <tr>
                        <th>Item Number</th>
                        <th>Name</th>
                        <th>Ingredients</th>
                        <th>Type</th>
                        <th>Price</th>
                        <th>IsActive</th>
                    </tr>
                </thead>
            </table>
        </div>
    );
}
 
export default Products;