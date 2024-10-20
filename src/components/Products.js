import axios from "axios";
import { useState, useEffect } from "react";
import Ingredient from "./Ingredient";
import Modal from "./Reusable/Modal";
import AddMenuItemForm from "./EditForms/AddMenuItemForm";
import { BsFillTrashFill, BsFillPencilFill } from "react-icons/bs";
import '../css/Products.css';

const Products = () => {
    const [items, setItems] = useState([]);
    const [productFilter, setProductFilter] = useState("Menu Items");
    const [modal, setModal] = useState(false);
    const [item, setItem] = useState(null);

    const toggleModal = async (item = null) => {
        console.log(item)
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
        console.log(item)
        setItem(item)
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
                        id: item.recipe_id,
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

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:3001/api/menu_management/${id}`);
            setItems(items.filter(item => item.id !== id));
        } catch (err) {
            console.error(`Error deleting item: ${err}`);
        }
        window.location.reload()
    };

    return (
        <div className="products">
            <Modal modal={modal} setModal={setModal}>
                <AddMenuItemForm setModal={setModal} item={item}/>
            </Modal>
            <div className="menu-navbar">
                <button onClick={() => setProductFilter("MENU_ITEMS")}>Menu Items</button>
                <button onClick={() => setProductFilter("INVENTORY")}>Inventory</button>
                <button onClick={() => setProductFilter("REWARDS")}>Rewards</button>
                <button onClick={() => setProductFilter("EVENTS")}>Events</button>
            </div>
            <div>
                <div className="add-menu-item">
                    <h2 style={{display: "inline"}} >List of Menu Items</h2>
                    <button onClick = {() => {toggleModal()}} className="btn-modal"> + </button>
                </div> 
                <table className = "menu_items_table">
                    <thead> 
                        <tr className = "item_info">
                            <th>Item Number</th>
                            <th>Name</th>
                            <th>Ingredients</th>
                            <th>Type</th>
                            <th>Price</th>
                            <th>Is Active</th>
                        </tr>
                    </thead>
                    <tbody id = "items_table">
                        {items.map((item, _) => {
                            return (   
                                <tr>
                                    <td>{item.id}</td>
                                    <td>{item.name}</td>
                                    <td>{item.ingredients.map((ingredient, _) => {
                                        return ( <Ingredient ingredient_id={ingredient.ingredient_id} />)
                                    })}</td>
                                    <td>{item.type}</td>
                                    <td>{item.price}</td>
                                    <td>
                                        <div>
                                            <span className={`product-label ${item.isActive ? 'product-label-isActive' : 'product-label-isNotActive'}`}>
                                            {item.isActive ? "Active" : "Disabled"}
                                            </span>
                                            
                                            <span className='product-actions'>
                                                <BsFillPencilFill onClick = {() => { toggleModal(item)}}/>
                                                <BsFillTrashFill className='product-delete-btn' onClick={() => handleDelete(item.id)}/>
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            )})}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
 
export default Products;