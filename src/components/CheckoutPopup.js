import axios from "axios";
import { useEffect, useState } from "react";
import "../css/CheckoutPopup.css";

const CheckoutPopup = ({ onClose, subtotal, selectedItems, onReset, fetchInventory, setSelectedItemsVR }) => {
  const [tax, setTax] = useState(0.0);
  const [total, setTotal] = useState(0.0);
  const [tableNumber, setTableNumber] = useState(0);
  const [receivedAmount, setReceivedAmount] = useState(0.00);
  const [tipPercent, setTipPercent] = useState(0);
  const [tipAmount, setTipAmount] = useState(0.00);
  const [changeAmount, setChangeAmount] = useState(0.00);
  const [error, setError] = useState("");
  const [confirmOrderButton, setConfrimOrderButton] = useState("Confrim Order");
  const [waiterID, setWaiterID,] = useState(999); //For testing, needs to be passed along from login
  const [customerID, setCustomerID] = useState(999); // For testing, needs to be passed along from virtual register
  const [formLock, setFormLock] = useState(false);
  const [successfulOrder, setSuccessfulOrder] = useState(false); // Needed for reseting selected items when closing
  const [conflictingIngredients, setConflictingIngredients] = useState([]); // Name and ID of conIng
  const [updatedSelectedItems, setUpdatedSelectiveItems] = useState([]); // New list after removing items with conIng
  const [itemsWithConIng, setItemsWithConIng] = useState([]); // List of items containing a conIng

  useEffect(() => { // Handle all of the calculations
    const numericSubtotal = parseFloat(subtotal); // Treat as number, not string

    const taxRate = 0.0825; // 8.25% tax rate
    const calculatedTax = numericSubtotal * taxRate;
    setTax(calculatedTax.toFixed(2));

    const calculateTip = numericSubtotal * (tipPercent/100);
    setTipAmount(calculateTip.toFixed(2))

    const total = calculateTip + calculatedTax + numericSubtotal;
    setTotal(total.toFixed(2));

    const calculateChange = receivedAmount - total;
    setChangeAmount(calculateChange.toFixed(2))
  }, [subtotal, tipPercent, receivedAmount]);

  const handleOnClose = () => {
    if (successfulOrder)
      onReset();
    else if (conflictingIngredients.length > 0) {
      setConflictingIngredients([]);
      setSelectedItemsVR(updatedSelectedItems);
      setUpdatedSelectiveItems([]);
      setItemsWithConIng([]);
    }
    setFormLock(false);
    setConfrimOrderButton("Confirm Order");
    setSuccessfulOrder(false);
    fetchInventory();
    onClose();
  }
  const handleConfirmOrder = async (e) => {
    e.preventDefault();
    if (changeAmount < 0) {
      const neededMoney = (changeAmount * -1).toFixed(2);
      setError(`Insufficient Funds. Need $${neededMoney} more`);
      return;
    }
    else if (tableNumber <= 0) {
      setError("Invalid table number")
      return;
    }
    else {
      let requiredIngredients=[]; // List of all the ingredients and the amount required for the order
      selectedItems.forEach(item => {
        item.ingredients.forEach(ingredient => {
          const inRequiredIngredients = requiredIngredients.find(reqIng => reqIng.ingredient_id === ingredient.ingredient_id)
          if (inRequiredIngredients) // Increment quantity for that ingredient
            requiredIngredients.quantity  += ingredient.quantity * item.quantity;
          else // Add to required ingredients list and its quantity
            requiredIngredients.push({ingredient_id: ingredient.ingredient_id, quantity: ingredient.quantity * item.quantity});
        });
      });
      //Check inventory one last time in case another waiter ordered food
      let inventoryStock = [];
      try {
        const inventoryResponse = await axios.get('http://localhost:3001/inventory-stock');
        inventoryStock = inventoryResponse.data.inventory;
      } catch(err) {
        if (err.response && err.inventoryResponse.data && err.inventoryResponse.data.message)
          setError(err.inventoryResponse.data.message);
        else
          setError('An error has occured fetching the inventory');
      }
      //let conflictingIngredients =[]; // Name and ID of out of stock ingredients
      requiredIngredients.forEach(reqIng => {
        const ingredient = inventoryStock.find(ing => ing.ingredient_id === reqIng.ingredient_id);
        if (!ingredient) {
          setError("Invalid Ingredient");
          setConfrimOrderButton("Error");
          setFormLock(true);
          return;
        }
        else if (reqIng.quantity > ingredient.amount) {
          conflictingIngredients.push({ name: ingredient.name, ingredient_id: ingredient.ingredient_id });
        }
      });
      if (conflictingIngredients.length > 0) { // There is an out of stock ingredient
        setError(`Out of stock ingredients: ${conflictingIngredients.map(conIng => conIng.name).join(", ")}`);
        setConfrimOrderButton("Error");
        setFormLock(true);
        // filters out items without a conflicting ingredient
        setUpdatedSelectiveItems(selectedItems.filter(item => 
          { return !item.ingredients.some(ingredient =>
            conflictingIngredients.some(conIng => conIng.ingredient_id === ingredient.ingredient_id)
            ) 
          })
        );
        // filters out items with a conflicting ingredient
        setItemsWithConIng(selectedItems.filter(item => {
          return item.ingredients.some(ingredient =>
            conflictingIngredients.some(conIng => conIng.ingredient_id === ingredient.ingredient_id)
          )
        })
        );
        return;
      }
      // Passed checks, order can continue...
      const itemsJSON = JSON.stringify(selectedItems);
      setError("");
      setConfrimOrderButton("Loading...");
      try {
          const response = await axios.post('http://localhost:3001/confirm-order', {selectedItems:itemsJSON, waiterID, tableNumber, customerID, subtotal, tax, tipPercent, tipAmount, total, receivedAmount, changeAmount});
          if (response.data.success)
            setFormLock(true);
            setSuccessfulOrder(true);
            setConfrimOrderButton("Success!");
      }
      catch(err) {
        if (err.response && err.response.data && err.response.data.message)
          setError(err.response.data.message);
        else setError("An error has occured");
      }
    }
  }

  return (
    <div className="checkout-popup-overlay">
      <div className="checkout-popup-content">
        <div className="checkout-header">
          <h1>Payment</h1>
          <button onClick={handleOnClose}>Close</button>
        </div>
        <form onSubmit={handleConfirmOrder}>
          <div className="checkout-label">
            <label>Table number: </label>
            <input
              type="number"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              min="0"
              placeholder="1"
              required
              disabled={formLock}
            />
          </div>
          <div className="checkout-label">
            <label>Subtotal: </label>
            <p>${subtotal}</p>
          </div>
          <div className="checkout-label">
            <label>Tax: </label>
            <p>${tax}</p>
          </div>
          <div className="checkout-label">
            <label>Tip {tipPercent}%: </label>
            <p>${tipAmount}</p>
          </div>
          <div className="range-container">
            <input
              type="range"
              min="0"
              max="25"
              step="5"
              value={tipPercent}
              onChange={(e) => setTipPercent(e.target.value)}
              required
              disabled={formLock}
            />
          </div>
          <div className="checkout-label">
            <label>Total: </label>
            <p>${total}</p>
          </div>
          <div className="checkout-label">
            <label>Received Amount: $</label>
            <input
              type="number"
              value={receivedAmount}
              onChange={(e) => setReceivedAmount(e.target.value)}
              min="0"
              placeholder="0.00"
              disabled={formLock}
            />
          </div>
          {changeAmount > 0 &&
            <div className="checkout-label">
              <label>Change: </label>
              <p>${changeAmount}</p>
            </div>
          }
          {error && <p className="confirm-order-error">{error}</p>}
          {itemsWithConIng.length > 0 && <p className="affected-items">Affected items: {
            itemsWithConIng.map(item => item.name).join(', ')
          }</p>}
          <button className="confirm-order-button" disabled={formLock}>{confirmOrderButton}</button>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPopup;