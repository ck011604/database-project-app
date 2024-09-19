import { useEffect, useState } from "react";
import "../css/CheckoutPopup.css";

const CheckoutPopup = ({ onClose, subtotal }) => {
  const [tax, setTax] = useState(0.0);
  const [total, setTotal] = useState(0.0);
  const [tableNumber, setTableNumber] = useState(0);
  const [receivedAmount, setReceivedAmount] = useState(0.00);

  useEffect(() => {
    const taxRate = 0.0825; // 8.25% tax rate
    const numericSubtotal = parseFloat(subtotal); // Treat as number, not string
    const calculatedTax = numericSubtotal * taxRate;
    setTax(calculatedTax.toFixed(2));
    const total = calculatedTax + numericSubtotal;
    setTotal(total.toFixed(2));
  }, [subtotal]);

  return (
    <div className="checkout-popup-overlay">
      <div className="checkout-popup-content">
        <button onClick={onClose}>Close</button>
        <h1>Payment</h1>
        <form>
          <div>
            <label>Table number: </label>
            <input
              type="number"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              min="0"
              placeholder="Enter table number"
            />
          </div>
          <div>
            <label>Subtotal: ${subtotal}</label>
          </div>
          <div>
            <label>Tax: ${tax}</label>
          </div>
          <div>
            <label>Total: ${total}</label>
          </div>
          <div>
            <label>Received Amount: $</label>
            <input
              type="number"
              value={receivedAmount}
              onChange={(e) => setReceivedAmount(e.target.value)}
              min="0"
              placeholder="Enter amount received"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPopup;
