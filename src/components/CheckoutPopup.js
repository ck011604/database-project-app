import axios from "axios";
import { useEffect, useState } from "react";
import "../css/CheckoutPopup.css";

const CheckoutPopup = ({ onClose, subtotal, selectedItems, onReset, fetchInventory, setSelectedItemsVR }) => {
  const [tax, setTax] = useState(0.0); // Based off subtotal
  const [total, setTotal] = useState(0.0); // Subtotal + tax + tip
  const [tableNumber, setTableNumber] = useState(0);
  const [receivedAmount, setReceivedAmount] = useState(0.00);
  const [tipPercent, setTipPercent] = useState(0);
  const [tipAmount, setTipAmount] = useState(0.00);
  const [changeAmount, setChangeAmount] = useState(0.00); // total - received amount
  const [error, setError] = useState("");
  const [confirmOrderButton, setConfirmOrderButton] = useState("Confrim Order");
  const [waiterID, setWaiterID,] = useState(1); //For testing, needs to be passed along from login
  const [customerID, setCustomerID] = useState(null);
  const [customerEmail, setCustomerEmail] = useState(""); // From the form
  const [customerEmailLock, setCustomerEmailLock] = useState(false);
  const [nextVisitDiscount, setNextVisitDiscount] = useState(0); // In dollars
  const [formLock, setFormLock] = useState(false);
  const [successfulOrder, setSuccessfulOrder] = useState(false); // Needed for reseting selected items when closing
  const [conflictingIngredients, setConflictingIngredients] = useState([]); // Name and ID of conIng
  const [updatedSelectedItems, setUpdatedSelectiveItems] = useState([]); // New list after removing items with conIng
  const [itemsWithConIng, setItemsWithConIng] = useState([]); // List of items containing a conIng
  const [ingredientsNeeded, setIngredientsNeeded] = useState([]); // List of ingredients and quantity for the order
  const [specialRequest, setSpecialRequest] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [promoCodeID, setPromoCodeID] = useState("");
  const [promoCodePercent, setPromoCodePercent] = useState(0);
  const [promoCodeLock, setPromoCodeLock] = useState(false); // Once the submit promo button is pressed, don't allow more
  const [discountType, setDiscountType] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0.00);
  const [highestDiscountPercent, setHighestDiscountPercent] = useState(0);
  const [isMilitary, setIsMilitary] = useState('no');

  useEffect(() => {
    // Handle all of the calculations
    const numericSubtotal = parseFloat(subtotal); // Treat as number, not string

    // Find the highest discount
    const discountOptions = { // The different options and the discount in dollars
      Military: (isMilitary === "yes" ? numericSubtotal * 0.1 : 0.00).toFixed(2),
      PromoCode: (numericSubtotal * (promoCodePercent / 100)).toFixed(2),
      LoyaltyPoints: (nextVisitDiscount <= subtotal ? nextVisitDiscount : 0.00).toFixed(2),
    };
    const bestDiscount = Object.entries(discountOptions).reduce( // Get the best discount
      (maxEntry, currentEntry) => {
        const currentValue = parseFloat(currentEntry[1]); // Convert to number
        const maxValue = parseFloat(maxEntry[1]);
        return currentValue > maxValue ? currentEntry : maxEntry; // Check if the current value is greater than the max value
      }
    );
    setDiscountAmount(parseFloat(bestDiscount[1]).toFixed(2)); // Set the discount amount from the best option
    setDiscountType(bestDiscount[0]); // Set the best discount type
    // Depending on the discount type, set the best discount percentage
    if (bestDiscount[0] === "Military")
      setHighestDiscountPercent(10);
    else if (bestDiscount[0] === "PromoCode")
      setHighestDiscountPercent(promoCodePercent);
    else if (bestDiscount[0] === "LoyaltyPoints")
      setHighestDiscountPercent(0);
    const afterDiscount = numericSubtotal - bestDiscount[1];

    // let calculatedDiscount = 0
    // if (isMilitary === "yes" && promoCodePercent < 10) {
    //   setHighestDiscountPercent(10);
    //   calculatedDiscount = numericSubtotal * 0.10;
    //   setDiscountAmount(calculatedDiscount.toFixed(2));
    // }
    // else if (promoCodePercent > 0) {
    //   setHighestDiscountPercent(promoCodePercent);
    //   calculatedDiscount = numericSubtotal * (promoCodePercent/100);
    //   setDiscountAmount(calculatedDiscount.toFixed(2));
    // }
    // else
    //   setDiscountAmount(0.00);
    // const afterDiscount = numericSubtotal - calculatedDiscount;

    const taxRate = 0.0825; // 8.25% tax rate
    const calculatedTax = afterDiscount * taxRate;
    setTax(calculatedTax.toFixed(2));

    const calculateTip = afterDiscount * (tipPercent / 100);
    setTipAmount(calculateTip.toFixed(2));

    const total = calculateTip + calculatedTax + afterDiscount;
    setTotal(total.toFixed(2));

    const calculateChange = receivedAmount - total;
    setChangeAmount(calculateChange.toFixed(2));
  }, [subtotal, tipPercent, receivedAmount, promoCodePercent, isMilitary, nextVisitDiscount]);

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
    setConfirmOrderButton("Confirm Order");
    setSuccessfulOrder(false);
    fetchInventory();
    onClose();
  }
  const handlePromoCode = async (e) => {
    if (promoCode.length > 0) {
      try {
        const promoCodeResponse = await axios.get(`http://localhost:3001/check-promo-code?promoCode=${promoCode}`);
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
        const userResponse = await axios.get(`http://localhost:3001/valid-customer-email?email=${customerEmail}`);
        if (userResponse.data.success === false) {
          setError("Invalid customer email");
          return;
        } 
        else {
          setCustomerID(userResponse.data.user_id);
          setNextVisitDiscount(userResponse.data.nextVisitDiscount)
          setCustomerEmailLock(true)
          console.log(userResponse.data.nextVisitDiscount);
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
      if (tableNumber < 0 || tableNumber > 30) { // Check if its a valid table (1-30)
        setError("Invalid table number")
        return;
      }
      // // Check if the customer email is valid
      // let customerIDFromAPI; // Need because customerID is asynchronous meaning it is not updated immediately
      // if (customerEmail.length > 0) { // Customer email is optional. Only do check if something was provided
      //   try {
      //     const userResponse = await axios.get(
      //       `http://localhost:3001/valid-customer-email?email=${customerEmail}`
      //     );
      //     if (userResponse.data.success === false) {
      //       setError("Invalid customer email");
      //       return;
      //     }
      //     else {
      //       customerIDFromAPI = userResponse.data.user_id;
      //       setCustomerID(customerIDFromAPI);
      //     }
      //   } catch (err) {
      //     if (err.response && err.response.data && err.response.data.message)
      //       setError(err.response.data.message);
      //     else
      //       setError(
      //         `An error has occured checking the validity of the customer email: ${customerEmail}`
      //       );
      //     return;
      //   }
      // }

      let requiredIngredients = []; // List of all the ingredients and the amount required for the order
      selectedItems.forEach((item) => {
        item.ingredients.forEach((ingredient) => {
          const inRequiredIngredients = requiredIngredients.find(
            (reqIng) => reqIng.ingredient_id === ingredient.ingredient_id
          );
          if (inRequiredIngredients)
            // Increment quantity for that ingredient
            requiredIngredients.quantity += ingredient.quantity * item.quantity;
          // Add to required ingredients list and its quantity
          else
            requiredIngredients.push({
              ingredient_id: ingredient.ingredient_id,
              quantity: ingredient.quantity * item.quantity,
            });
        });
      });
      setIngredientsNeeded(requiredIngredients);
      //Check inventory one last time in case another waiter ordered food
      let inventoryStock = [];
      try {
        const inventoryResponse = await axios.get(
          "http://localhost:3001/inventory-stock"
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
        // There is an out of stock ingredient
        setError(
          `Out of stock ingredients: ${conflictingIngredients
            .map((conIng) => conIng.name)
            .join(", ")}`
        );
        setConfirmOrderButton("Error");
        setFormLock(true);
        // filters out items without a conflicting ingredient
        setUpdatedSelectiveItems(
          selectedItems.filter((item) => {
            return !item.ingredients.some((ingredient) =>
              conflictingIngredients.some(
                (conIng) => conIng.ingredient_id === ingredient.ingredient_id
              )
            );
          })
        );
        // filters out items with a conflicting ingredient
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
      // Passed checks, order can continue...
      const itemsJSON = JSON.stringify(selectedItems);
      setError("");
      setConfirmOrderButton("Loading...");
      try {
        const response = await axios.post(
          "http://localhost:3001/confirm-order",
          {
            selectedItems: itemsJSON,
            waiterID,
            tableNumber,
            // customerID: customerIDFromAPI,
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
            // isMilitary,
            discountPercentage: highestDiscountPercent
          }
        );
        if (response.data.success) setFormLock(true);
        setSuccessfulOrder(true);
        setConfirmOrderButton("Success!");
      } catch (err) {
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
              min="1"
              required
              disabled={formLock}
            />
          </div>
          <div className="checkout-label">
            <label>Subtotal: </label>
            <p>${subtotal}</p>
          </div>
          {discountAmount > 0 &&
            <div className="checkout-label">
              {discountType != "LoyaltyPoints" && <label>Discount {highestDiscountPercent}%: </label>}
              {discountType === "LoyaltyPoints" && <label>Discount: </label>}
              <p>-${discountAmount}</p>
            </div>
          }
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
            <label>Member of Military: </label>
            <input
              type="radio"
              value="yes"
              checked={isMilitary === "yes"}
              onChange={() => setIsMilitary("yes")}
              disabled={formLock}
            /> Yes
            <input
              type="radio"
              value="no"
              checked={isMilitary === "no"}
              onChange={() => setIsMilitary("no")}
              disabled={formLock}
            /> No
          </div>
          <div className="checkout-label">
            <label>Promotional Code: </label>
            <input className="promo-code-input"
              type="text" 
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              disabled={formLock || promoCodeLock}
            />
            <button className="promo-code-apply-button" type="button" onClick={handlePromoCode} disabled={formLock || promoCodeLock}>
              {promoCodeLock == true ? "Applied" : "Apply"}
            </button>
          </div>
          <small>Only the highest discount will be applied to your order.</small>
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
          <div className="checkout-label">
            <label>Customer Account: </label>
            <input
              type="text"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              placeholder="example@domain.com"
              disabled={formLock || customerEmailLock}
            />
            <button className="customer-email-apply-button" type="button" onClick={handleCustomerEmail} disabled={formLock || customerEmailLock}>
              {customerEmailLock == true ? "Applied" : "Apply"}
            </button>
          </div>
          {error && <p className="confirm-order-error">{error}</p>}
          {itemsWithConIng.length > 0 && (
            <p className="affected-items">
              Affected items:{" "}
              {itemsWithConIng.map((item) => item.name).join(", ")}
            </p>
          )}
          <button className="confirm-order-button" disabled={formLock}>
            {confirmOrderButton}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPopup;