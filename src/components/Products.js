import axios from "axios";
import { useState, useEffect } from "react";
import Ingredient from "./Ingredient";
import AddMenuItemForm from "./EditForms/AddMenuItemForm"
import '../css/Products.css';

const Products = () => {
    const [items, setItems] = useState([]);
    const [productFilter, setProductFilter] = useState("Menu Items");
    const [modal, setModal] = useState(false);

    const toggleModal = () => {
        setModal(!modal)
    };
    
    useEffect(() => {
        const fetchAllItems = async ()=>{
            try{
                let res = await axios.get("http://localhost:3001/menu")
                let items = res.data.menu;
                let new_items = []
                for(let item of items){
                    new_items.push({
                        id: item.ingredient_id,
                        name: item.name,
                        ingredients: item.ingredients,
                        type: item.type,
                        price: item.price,
                        isActive: item.is_active
                    })
                }
                console.log(new_items)
                setItems(new_items);
            } catch (err) {
                console.log(`Error fetching Menu Items: ${err}`)
            }
        }
        fetchAllItems()
    }, [])
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
            <div>
                <div className="add-menu-item">
                    <h2 style={{display: "inline"}} >List of Menu Items</h2>
                    <button onClick = {toggleModal} className="btn-modal"> + </button>
                    {modal && (
                        <div className="modal">
                            <div onClick={() => toggleModal()} className="overlay"></div>
                            <div className="modal-content">
                                <AddMenuItemForm />
                                <button className="close-modal" onClick={() => toggleModal()}>Close</button>
                            </div>
                        </div>
                    )}
                </div>
                <table class = "menu_items_table">
                    <thead> 
                        <tr class = "item_info">
                            <th>Item Number</th>
                            <th>Name</th>
                            <th>Ingredients</th>
                            <th>Type</th>
                            <th>Price</th>
                            <th>IsActive</th>
                        </tr>
                    </thead>
                    <tbody id = "items_table">
                        {items.map((item, key) => {
                            return (   
                                <tr>
                                    <td>{key}</td>
                                    <td>{item.name}</td>
                                    <td>{item.ingredients.map((ingredient, _) => {
                                        return ( <Ingredient ingredient_id={ingredient.ingredient_id} />)
                                    })}</td>
                                    <td>{item.type}</td>
                                    <td>{item.price}</td>
                                    <td>{item.isActive}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
 
export default Products;