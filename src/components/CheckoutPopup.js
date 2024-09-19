import { useEffect, useState } from "react";
import "../css/CheckoutPopup.css";

const CheckoutPopup = ({ onClose, subtotal }) => {
  const [tax, setTax] = useState(0.0);
  const [total, setTotal] = useState(0.0);
  const [tableNumber, setTableNumber] = useState(0);
  const [receivedAmount, setReceivedAmount] = useState(0.00);
  const [tipPercent, setTipPercent] = useState(0);
  const [tipAmount, setTipAmount] = useState(0.00);
  const [changeAmount, setChangeAmount] = useState(0.00);
  const [error, setError] = useState("");
  const [confirmOrderButton, setConfrimOrderButton] = useState("Confrim Order");

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

  const handleConfirmOrder = (e) => {
    e.preventDefault();
    if (changeAmount < 0) {
      const neededMoney = (changeAmount * -1).toFixed(2);
      setError(`Insufficient Funds. Need $${neededMoney} more`);
    }
    else if (tableNumber === 0) {
      setError("Invalid table number")
    }
    else {
      setError("");
      setConfrimOrderButton("Loading...");
      // send to server
      setConfrimOrderButton("Confirm Order");
    }
  }

  return (
    <div className="checkout-popup-overlay">
      <div className="checkout-popup-content">
        <div className="checkout-header">
          <h1>Payment</h1>
          <button onClick={onClose}>Close</button>
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
            />
          </div>
          {changeAmount > 0 &&
            <div className="checkout-label">
              <label>Change: </label>
              <p>${changeAmount}</p>
            </div>
          }
          {error && <p className="confirm-order-error">{error}</p>}
          <button className="confirm-order-button">{confirmOrderButton}</button>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPopup;