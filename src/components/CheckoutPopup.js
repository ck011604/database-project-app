import "../css/CheckoutPopup.css"

const CheckoutPopup = ( {onClose} ) => {
    
    return ( 
        <div className="checkout-popup-overlay">
            <div className="checkout-popup-content">
                <button onClick={onClose}>Close</button>
                <h2>Checkout Popup</h2>
            </div>
        </div>
     );
}
 
export default CheckoutPopup;