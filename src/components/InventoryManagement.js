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
      const response = await axios.get('http://localhost:3001/api/inventory');
      setIngredients(response.data.inventory || []);
    } catch (error) {
      console.error('Error fetching ingredients:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await axios.patch(`http://localhost:3001/api/inventory/${selectedIngredient}`, {
        quantity: action === 'restock' ? Math.abs(Number(quantity)) : -Math.abs(Number(quantity)),
        action_type: action
      });

      if (response.data.success) {
        setMessage({
          type: 'success',
          text: `Successfully ${action}ed ${quantity} units of the ingredient`
        });
        fetchIngredients(); // Refresh the list
        setSelectedIngredient('');
        setQuantity('');
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'An error occurred while adjusting inventory'
      });
    }
    
    setLoading(false);
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
                <option key={ingredient.ingredient_id} value={ingredient.ingredient_id}>
                  {ingredient.name} (Current Stock: {ingredient.quantity} {ingredient.unit})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Quantity</label>
            <input
              type="number"
              min="0"
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
              <th>Unit</th>
            </tr>
          </thead>
          <tbody>
            {ingredients.map((ingredient) => (
              <tr key={ingredient.ingredient_id}>
                <td>{ingredient.ingredient_id}</td>
                <td>{ingredient.name}</td>
                <td>{ingredient.quantity}</td>
                <td>{ingredient.unit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryManagement;