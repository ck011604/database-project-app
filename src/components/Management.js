import axios from "axios";
import { useState, useEffect } from "react";
import Ingredient from "./Ingredient";
import Modal from "./Reusable/Modal";
import AddMenuItemForm from "./EditForms/AddMenuItemForm";
import InventoryManagement from "./InventoryManagement";
import { BsFillTrashFill, BsFillPencilFill } from "react-icons/bs";
import '../css/Management.css';  // We'll rename this CSS file too

const Management = () => {
    const [items, setItems] = useState([]);
    const [productFilter, setProductFilter] = useState("MENU_ITEMS");
    const [modal, setModal] = useState(false);
    const [item, setItem] = useState(null);

    const toggleModal = async (item = null) => {
        if(item){
            let data = {
                id: item.id,
                name: item.name,
                price: item.price,
                type: {
                    value: item.type,
                    label: item.type
                },
                ingredients: []
            }
            for(let ingredient of item.ingredients){
                let res = await axios.get(`http://localhost:3001/api/inventory/${ingredient.ingredient_id}`)
                ingredient = res.data.ingredient
                data.ingredients.push({
                    value: ingredient.ingredient_id,
                    label: ingredient.name,
                })
            }
            item = data
        }
        setItem(item)
        setModal(!modal)
    };

    const fetchAllItems = async () => {
        try{
            let res = await axios.get("http://localhost:3001/api/menu_management")
            let items = res.data.menu;
            let new_items = []
            for(let item of items){
                new_items.push({
                    id: item.recipe_id,
                    name: item.name,
                    ingredients: item.ingredients,
                    type: item.type,
                    price: item.price,
                    isActive: item.is_active
                })
            }
            setItems(new_items);
        } catch (err) {
            console.log(`Error fetching Menu Items: ${err}`)
        }
    }
    
    useEffect(() => {
        if (productFilter === "MENU_ITEMS") {
            fetchAllItems();
        }
    }, [productFilter]);

    const handleDelete = async(id) => {
        try {
            await axios.delete(`http://localhost:3001/api/menu_management/${id}`);
            fetchAllItems();
        } catch (err) {
            console.error(`Error deleting item: ${err}`);
        }
    };

    const handleReactivate = async(id) => {
        try {
            await fetch(`http://localhost:3001/api/menu_management/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ is_active: true })
            });
            fetchAllItems();
        } catch (err) {
            console.error(`Error reactivating item: ${err}`);
        }
    }

    return (
        <div className="management">
            <Modal modal={modal} setModal={setModal}>
                <AddMenuItemForm setModal={setModal} item={item} callback={fetchAllItems}/>
            </Modal>
            <div className="management-navbar">
                <button onClick={() => setProductFilter("MENU_ITEMS")}>Menu Items</button>
                <button onClick={() => setProductFilter("INVENTORY")}>Inventory</button>
                <button onClick={() => setProductFilter("REWARDS")}>Rewards</button>
                <button onClick={() => setProductFilter("EVENTS")}>Events</button>
            </div>
            
            {productFilter === "MENU_ITEMS" && (
                <div>
                    <div className="add-menu-item">
                        <h2 style={{display: "inline"}} >List of Menu Items</h2>
                        <button onClick={() => toggleModal()} className="btn-modal"> + </button>
                    </div> 
                    <table className="management-table">
                        <thead> 
                            <tr className="item-info">
                                <th>Item Number</th>
                                <th>Name</th>
                                <th>Ingredients</th>
                                <th>Type</th>
                                <th>Price</th>
                                <th>Is Active</th>
                            </tr>
                        </thead>
                        <tbody id="items-table">
                            {items.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.id}</td>
                                    <td>{item.name}</td>
                                    <td>{item.ingredients.map((ingredient) => (
                                        <Ingredient key={ingredient.ingredient_id} ingredient_id={ingredient.ingredient_id} />
                                    ))}</td>
                                    <td>{item.type}</td>
                                    <td>{item.price}</td>
                                    <td>
                                        <div>
                                            <span className={`status-label ${item.isActive ? 'status-label-active' : 'status-label-inactive'}`}>
                                                {item.isActive ? "Active" : "Disabled"}
                                            </span>
                                            {item.isActive ? 
                                                <span className='item-actions'>
                                                    <BsFillPencilFill onClick={() => toggleModal(item)}/>
                                                    <BsFillTrashFill className='delete-btn' onClick={() => handleDelete(item.id)}/>
                                                </span> :
                                                <button className="reactivate-btn" onClick={() => handleReactivate(item.id)}> Reactivate </button>
                                            }
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            {productFilter === "INVENTORY" && <InventoryManagement />}
            {productFilter === "REWARDS" && (
                <div>Rewards Content Coming Soon</div>
            )}
            {productFilter === "EVENTS" && (
                <div>Events Content Coming Soon</div>
            )}
        </div>
    );
}
 
export default Management;