import axios from "axios";
import { useEffect, useState } from "react";
import { generateReceipt } from './Receipt';
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
  const [confirmOrderButton, setConfirmOrderButton] = useState("Confrim Order");
  const [customerID, setCustomerID] = useState(null);
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerEmailLock, setCustomerEmailLock] = useState(false);
  const [nextVisitDiscount, setNextVisitDiscount] = useState(0);
  const [formLock, setFormLock] = useState(false);
  const [successfulOrder, setSuccessfulOrder] = useState(false);
  const [conflictingIngredients, setConflictingIngredients] = useState([]);
  const [updatedSelectedItems, setUpdatedSelectiveItems] = useState([]);
  const [itemsWithConIng, setItemsWithConIng] = useState([]);
  const [ingredientsNeeded, setIngredientsNeeded] = useState([]);
  const [specialRequest, setSpecialRequest] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [promoCodeID, setPromoCodeID] = useState("");
  const [promoCodePercent, setPromoCodePercent] = useState(0);
  const [promoCodeLock, setPromoCodeLock] = useState(false);
  const [discountType, setDiscountType] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0.00);
  const [highestDiscountPercent, setHighestDiscountPercent] = useState(0);
  const [isMilitary, setIsMilitary] = useState('no');
  const [discountMenuOpen, setDiscountMenuOpen] = useState(false);
  const [orderId, setOrderId] = useState(null);

  useEffect(() => {
    const numericSubtotal = parseFloat(subtotal);
 
    const discountOptions = {
      Military: (isMilitary === "yes" ? numericSubtotal * 0.1 : 0.00).toFixed(2),
      PromoCode: (numericSubtotal * (promoCodePercent / 100)).toFixed(2),
      LoyaltyPoints: (nextVisitDiscount <= subtotal ? nextVisitDiscount : 0.00).toFixed(2),
    };
    const bestDiscount = Object.entries(discountOptions).reduce(
      (maxEntry, currentEntry) => {
        const currentValue = parseFloat(currentEntry[1]);
        const maxValue = parseFloat(maxEntry[1]);
        return currentValue > maxValue ? currentEntry : maxEntry;
      }
    );
    setDiscountAmount(parseFloat(bestDiscount[1]).toFixed(2));
 
    if (bestDiscount[1] == 0.00) {
      setDiscountType("");
    }
    else {
      setDiscountType(bestDiscount[0]);
      if (bestDiscount[0] === "Military")
        setHighestDiscountPercent(10);
      else if (bestDiscount[0] === "PromoCode")
        setHighestDiscountPercent(promoCodePercent);
      else if (bestDiscount[0] === "LoyaltyPoints")
        setHighestDiscountPercent(0);
    }
    const afterDiscount = numericSubtotal - bestDiscount[1];
 
    const taxRate = 0.0825;
    const calculatedTax = afterDiscount * taxRate;
    setTax(calculatedTax.toFixed(2));
 
    const calculateTip = afterDiscount * (tipPercent / 100);
    setTipAmount(calculateTip.toFixed(2));
 
    const total = calculateTip + calculatedTax + afterDiscount;
    setTotal(total.toFixed(2));
 
    const calculateChange = receivedAmount - total;
    setChangeAmount(calculateChange.toFixed(2));
  }, [subtotal, tipPercent, receivedAmount, promoCodePercent, isMilitary, nextVisitDiscount]);
 
  useEffect(() => {
    console.log("OrderId changed:", orderId);
  }, [orderId]);
 
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
    setPromoCodeLock(false);
    setCustomerEmailLock(false);
    setDiscountMenuOpen(false);
    setConfirmOrderButton("Confirm Order");
    setSuccessfulOrder(false);
    fetchInventory();
    onClose();
  }
 
  const handlePromoCode = async (e) => {
    if (promoCode.length > 0) {
      try {
        const promoCodeResponse = await axios.get(`${process.env.REACT_APP_API_URL}/check-promo-code?promoCode=${promoCode}`);
        if (promoCodeResponse.data.success === false) {
          setError('Not a valid promotional code');
          return;
        }
        else {
          setPromoCodePercent(promoCodeResponse.data.discountPercent);
          setPromoCodeID(promoCodeResponse.data.promoCode_ID);
          setPromoCodeLock(true);
        }
      } catch(err) {
        if (err.response && err.response.data && err.response.data.message)
          setError(err.response.data.message);
        else
          setError(
            `An error has occured checking the validity of the promotional code: ${promoCode}`
          );
        return;
      }
    }
  }
 
  const handleCustomerEmail = async (e) => {
    if (customerEmail.length > 0) {
      try {
        const userResponse = await axios.get(`${process.env.REACT_APP_API_URL}/valid-customer-email?email=${customerEmail}`);
        if (userResponse.data.success === false) {
          setError("Invalid customer email");
          return;
        } 
        else {
          setCustomerID(userResponse.data.user_id);
          setNextVisitDiscount(userResponse.data.nextVisitDiscount)
          setCustomerEmailLock(true)
        }
      } catch (err) {
        if (err.response && err.response.data && err.response.data.message)
          setError(err.response.data.message);
        else
          setError(
            `An error has occured checking the validity of the customer email: ${customerEmail}`
          );
        return;
      }
    }
  }
 
  const handleConfirmOrder = async (e) => {
    e.preventDefault();
    if (changeAmount < 0) {
      const neededMoney = (changeAmount * -1).toFixed(2);
      setError(`Insufficient Funds. Need $${neededMoney} more`);
      return;
    }
    else {
      if (tableNumber < 0 || tableNumber > 30) {
        setError("Invalid table number")
        return;
      }
 
      let requiredIngredients = [];
      selectedItems.forEach((item) => {
        item.ingredients.forEach((ingredient) => {
          const inRequiredIngredients = requiredIngredients.find(
            (reqIng) => reqIng.ingredient_id === ingredient.ingredient_id
          );
          if (inRequiredIngredients)
            requiredIngredients.quantity += ingredient.quantity * item.quantity;
          else
            requiredIngredients.push({
              ingredient_id: ingredient.ingredient_id,
              quantity: ingredient.quantity * item.quantity,
            });
        });
      });
      setIngredientsNeeded(requiredIngredients);
      
      let inventoryStock = [];
      try {
        const inventoryResponse = await axios.get(
          `${process.env.REACT_APP_API_URL}/inventory-stock`
        );
        inventoryStock = inventoryResponse.data.inventory;
      } catch (err) {
        if (err.response && err.response.data && err.response.data.message)
          setError(err.response.data.message);
        else setError("An error has occured fetching the inventory");
      }
 
      requiredIngredients.forEach((reqIng) => {
        const ingredient = inventoryStock.find(
          (ing) => ing.ingredient_id === reqIng.ingredient_id
        );
        if (!ingredient) {
          setError("Invalid Ingredient");
          setConfirmOrderButton("Error");
          setFormLock(true);
          return;
        } else if (reqIng.quantity > ingredient.amount) {
          conflictingIngredients.push({
            name: ingredient.name,
            ingredient_id: ingredient.ingredient_id,
          });
        }
      });
      if (conflictingIngredients.length > 0) {
        setError(
          `Out of stock ingredients: ${conflictingIngredients
            .map((conIng) => conIng.name)
            .join(", ")}`
        );
        setConfirmOrderButton("Error");
        setFormLock(true);
        setUpdatedSelectiveItems(
          selectedItems.filter((item) => {
            return !item.ingredients.some((ingredient) =>
              conflictingIngredients.some(
                (conIng) => conIng.ingredient_id === ingredient.ingredient_id
              )
            );
          })
        );
        setItemsWithConIng(
          selectedItems.filter((item) => {
            return item.ingredients.some((ingredient) =>
              conflictingIngredients.some(
                (conIng) => conIng.ingredient_id === ingredient.ingredient_id
              )
            );
          })
        );
        return;
      }
 
      const itemsJSON = JSON.stringify(selectedItems);
      setError("");
      setConfirmOrderButton("Loading...");
      
      try {
        console.log("Sending order confirmation request...");
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/confirm-order`,
          {
            selectedItems: itemsJSON,
            loginToken: sessionStorage.getItem("token"),
            tableNumber,
            customerID,
            subtotal,
            tax,
            tipPercent,
            tipAmount,
            total,
            receivedAmount,
            changeAmount,
            specialRequest,
            promoCode_id: promoCodeID,
            discountType,
            discountAmount,
            discountPercentage: highestDiscountPercent
          }
        );
        console.log("Order confirmation response:", response.data);
        
        if (response.data.success) {
          console.log("Order successful, order_id:", response.data.order_id);
          setFormLock(true);
          setSuccessfulOrder(true);
          setConfirmOrderButton("Success!");
          setOrderId(response.data.order_id);
          console.log("OrderId state set to:", response.data.order_id);
        } else {
          console.error("Order response indicated failure:", response.data);
          setError(response.data.message || "Order failed");
        }
      } catch (err) {
        console.error("Order confirmation error:", err);
        console.error("Error response:", err.response?.data);
        if (err.response && err.response.data && err.response.data.message)
          setError(err.response.data.message);
        else setError("An error has occurred");
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
              min="1"
              required
              disabled={formLock}
            />
          </div>
          <div className="checkout-label">
            <label>Subtotal: </label>
            <p>${subtotal}</p>
          </div>
          {discountAmount > 0 && (
            <div className="checkout-label">
              {discountType != "LoyaltyPoints" && (
                <label>Discount {highestDiscountPercent}%: </label>
              )}
              {discountType === "LoyaltyPoints" && <label>Discount: </label>}
              <p>-${discountAmount}</p>
            </div>
          )}
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
          <button
            className="discount-menu-toggle"
            onClick={() => setDiscountMenuOpen((prev) => !prev)}
            type="button"
          >
            Discount Options
            <span
              className={`discount-menu-caret ${
                discountMenuOpen ? "up" : "down"
              }`}
            ></span>
          </button>
          {discountMenuOpen && (
            <div className="discount-menu">
              <div className="checkout-label">
                <label>Customer Account: </label>
                <input
                  type="text"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="example@domain.com"
                  disabled={formLock || customerEmailLock}
                />
                <button
                  className="customer-email-apply-button"
                  type="button"
                  onClick={handleCustomerEmail}
                  disabled={formLock || customerEmailLock}
                >
                  {customerEmailLock == true ? "Applied" : "Apply"}
                </button>
              </div>
              <div className="checkout-label">
                <label>Member of Military: </label>
                <input
                  type="radio"
                  value="yes"
                  checked={isMilitary === "yes"}
                  onChange={() => setIsMilitary("yes")}
                  disabled={formLock}
                />{" "}
                Yes
                <input
                  type="radio"
                  value="no"
                  checked={isMilitary === "no"}
                  onChange={() => setIsMilitary("no")}
                  disabled={formLock}
                />{" "}
                No
              </div>
              <div className="checkout-label">
                <label>Promotional Code: </label>
                <input
                  className="promo-code-input"
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  disabled={formLock || promoCodeLock}
                />
                <button
                  className="promo-code-apply-button"
                  type="button"
                  onClick={handlePromoCode}
                  disabled={formLock || promoCodeLock}
                >
                  {promoCodeLock == true ? "Applied" : "Apply"}
                </button>
              </div>
              <small>
                Only the highest discount will be applied to your order.
              </small>
            </div>
          )}
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
              step="0.01"
              placeholder="0.00"
              required
              disabled={formLock}
            />
          </div>
          {changeAmount > 0 && (
            <div className="checkout-label">
              <label>Change: </label>
              <p>${changeAmount}</p>
            </div>
          )}
          <div className="special-request-container">
            <textarea
              value={specialRequest}
              onChange={(e) => setSpecialRequest(e.target.value)}
              placeholder="Type special requests here"
              rows={3}
              disabled={formLock}
            />
          </div>
          {error && <p className="confirm-order-error">{error}</p>}
          {itemsWithConIng.length > 0 && (
            <p className="affected-items">
              Affected items:{" "}
              {itemsWithConIng.map((item) => item.name).join(", ")}
            </p>
          )}
          {!successfulOrder && (
            <button className="confirm-order-button" disabled={formLock}>
              {confirmOrderButton}
            </button>
          )}
          {successfulOrder && (
                      <>
                        <p className="success-order-msg">Order placed successfully</p>
                        <button 
                          className="print-receipt-button"
                          onClick={() => {
                            console.log("Print receipt clicked, orderId:", orderId);
                            if (orderId) {
                              generateReceipt(orderId);
                            } else {
                              alert('No order ID available');
                            }
                          }}
                          type="button"
                        >
                          Print Receipt
                        </button>
                      </>
                    )}
                  </form>
                </div>
              </div>
            );
          };

          export default CheckoutPopup;