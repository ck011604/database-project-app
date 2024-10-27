import React, { useState, useEffect } from 'react';
import axios from 'axios';

const InventoryManagement = () => {
    const [ingredients, setIngredients] = useState([]);
    const [selectedIngredient, setSelectedIngredient] = useState('');
    const [quantity, setQuantity] = useState('');
    const [action, setAction] = useState('restock');
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchIngredients();
    }, []);

    const fetchIngredients = async () => {
        try {
            const response = await axios.get(`${REACT_APP_API_URL}/api/inventory`);
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
                `${REACT_APP_API_URL}/api/inventory/${selectedIngredient}`,
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

    return (
        <div>
            <div className="add-menu-item">
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

                <table className="management-table">
                    <thead>
                        <tr className="item-info">
                            <th>ID</th>
                            <th>Name</th>
                            <th>Current Stock</th>
                            <th>Restock Threshold</th>
                            <th>Restock Amount</th>
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
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default InventoryManagement;