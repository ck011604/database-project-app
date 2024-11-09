import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BsFillPencilFill } from "react-icons/bs";
import '../css/Management.css';
import Modal from "./Reusable/Modal";
import AddIngredientForm from "./EditForms/AddIngredientForm";

const InventoryManagement = () => {
    const [ingredients, setIngredients] = useState([]);
    const [selectedIngredient, setSelectedIngredient] = useState('');
    const [quantity, setQuantity] = useState('');
    const [action, setAction] = useState('restock');
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [modal, setModal] = useState(false);

    useEffect(() => {
        fetchIngredients();
    }, []);

    const fetchIngredients = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/inventory`);
            if (response.data.success) {
                const mappedIngredients = response.data.inventory.map(ing => ({
                    ...ing,
                    quantity: ing.amount
                }));
                setIngredients(mappedIngredients);
            }
        } catch (error) {
            console.error('Error fetching ingredients:', error);
            setMessage({
                type: 'error',
                text: 'Error loading ingredients'
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedIngredient || !quantity) {
            setMessage({
                type: 'error',
                text: 'Please fill in all fields'
            });
            return;
        }

        setLoading(true);
        try {
            const adjustedQuantity = action === 'restock' ? 
                parseInt(quantity) : 
                -parseInt(quantity);

            const response = await axios.patch(
                `${process.env.REACT_APP_API_URL}/api/inventory/${selectedIngredient}`,
                {
                    quantity: adjustedQuantity,
                    action_type: action  // This will be either 'restock' or 'discarded'
                }
            );

            if (response.data.success) {
                setMessage({
                    type: 'success',
                    text: `Successfully ${action === 'restock' ? 'restocked' : 'discarded'} ${Math.abs(quantity)} units`
                });
                await fetchIngredients();
                setSelectedIngredient('');
                setQuantity('');
            }
        } catch (error) {
            console.error('Error updating inventory:', error);
            setMessage({
                type: 'error',
                text: error.response?.data?.message || error.message || 'Error updating inventory'
            });
        } finally {
            setLoading(false);
        }
    };
    
    const toggleModal = async (selectedIngredient = null) => {
        if(selectedIngredient){
            let data = {
                ingredient_id: selectedIngredient.ingredient_id,
                name: selectedIngredient.name,
                amount: selectedIngredient.amount,
                restock_threshold: selectedIngredient.restock_threshold,
                restock_amount: selectedIngredient.restock_amount,
                autoRestock: selectedIngredient.autoRestock,
            }
            selectedIngredient = data
        }
        console.log(selectedIngredient)
        setSelectedIngredient(selectedIngredient)
        setModal(!modal)
    };

    const handleManual = async(id) => {
        try {
            await fetch(`${process.env.REACT_APP_API_URL}/api/ingredient/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ autoRestock: false })
            });
            fetchIngredients();
        } catch (err) {
            console.error(`Error setting autoRestock to manual: ${err}`);
        }
    }

    const handleAutomatic = async(id) => {
        try {
            await fetch(`${process.env.REACT_APP_API_URL}/api/ingredient/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ autoRestock: true })
            });
            fetchIngredients();
        } catch (err) {
            console.error(`Error setting autoRestock to automatic: ${err}`);
        }
    }

    return (
        <div>
            <div className="add-menu-item">
                <Modal modal={modal} setModal={setModal}>
                    <AddIngredientForm setModal={setModal} ingredient={selectedIngredient} callback={fetchIngredients}/>
                </Modal>
                <h2 style={{display: "inline"}}>Inventory Management</h2>
            </div>

            <div className="inventory-form-container">
                {message && (
                    <div className={`message ${message.type === 'success' ? 'message-success' : 'message-error'}`}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Action Type</label>
                        <select
                            value={action}
                            onChange={(e) => setAction(e.target.value)}
                            className="form-select"
                        >
                            <option value="restock">Restock</option>
                            <option value="discarded">Discard</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Ingredient</label>
                        <select
                            value={selectedIngredient}
                            onChange={(e) => setSelectedIngredient(e.target.value)}
                            required
                            className="form-select"
                        >
                            <option value="">Select an ingredient</option>
                            {ingredients.map((ingredient) => (
                                <option 
                                    key={ingredient.ingredient_id} 
                                    value={ingredient.ingredient_id}
                                >
                                    {ingredient.name} (Current Stock: {ingredient.amount})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Quantity</label>
                        <input
                            type="number"
                            min="1"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            required
                            className="form-input"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-submit"
                    >
                        {loading ? 'Processing...' : `${action === 'restock' ? 'Restock' : 'Discard'} Inventory`}
                    </button>
                </form>
                <div className="add-menu-item" style={{"padding-bottom": "5px"}}>
                        <h2 style={{display: "inline"}} >List of Ingredients</h2>
                        <button onClick={() => toggleModal()} className="btn-modal"> + </button>
                    </div> 
                <table className="management-table">
                    <thead>
                        <tr className="item-info">
                            <th>ID</th>
                            <th>Name</th>
                            <th>Current Stock</th>
                            <th>Restock Threshold</th>
                            <th>Restock Amount</th>
                            <th>Restock Method</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ingredients.map((ingredient) => (
                            <tr key={ingredient.ingredient_id}>
                                <td>{ingredient.ingredient_id}</td>
                                <td>{ingredient.name}</td>
                                <td>{ingredient.amount}</td>
                                <td>{ingredient.restock_threshold}</td>
                                <td>{ingredient.restock_amount}</td>
                                <td>
                                    <div>
                                        {ingredient.autoRestock ?
                                                <button className='restock-btn restock-auto-btn' onClick={() => handleManual(ingredient.ingredient_id)}>Automatic</button> :
                                                <button className='restock-btn restock-manual-btn' onClick={() => handleAutomatic(ingredient.ingredient_id)}>Manual</button>
                                        }
                                        <span className='item-actions'>
                                            <BsFillPencilFill onClick={() => toggleModal(ingredient)}/>                    
                                            {/* <BsFillTrashFill className='delete-btn' onClick={() => handleDelete(ingredient.ingredient_id)}/> */}
                                            </span>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default InventoryManagement;