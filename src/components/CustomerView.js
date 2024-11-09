import { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from 'jwt-decode';
import { FaChevronDown } from "react-icons/fa";
import "../css/CheckoutPopup.css";
import "../css/Management.css";
import "../css/CustomerView.css";
import CustomerOrdersView from "./CustomerViews/CustomerOrdersView";
import CustomerMenuView from "./CustomerViews/CustomerMenuView";

const CustomerView= () => {
    const [productFilter, setProductFilter] = useState("YOUR_ORDERS");
    const [points, setPoints] = useState([]);

    const token = sessionStorage.getItem("token")
    let user_id = 1
    if (token) {
        try {
            const decodedToken = jwtDecode(token);
            // user_id = decodedToken.user_id
        } catch (error) {
            console.error("Failed to decode token", error);
        }
    }

    const fetchPoints = async () => {
        try{
            let res = await axios.get(`${process.env.REACT_APP_API_URL}/api/user/${user_id}`)
            let totalPoints = res.data.user.points;
            console.log(res.data)
            setPoints(totalPoints);
        } catch (err) {
            console.log(`Error fetching points: ${err}`)
        }
    }

    useEffect(() => {
        fetchPoints();
    }, []);

    return (
        <div className= "management">
            <div className="management-navbar" style={{"display": "inline-flex"}}>
                <button onClick={() => setProductFilter("YOUR_ORDERS")}>Your Orders</button>
                <button onClick={() => setProductFilter("OUR_MENU")}>Our Menu</button>
            </div>
            <div className= "loyalty-header" style={{"display": "flex", gap: "5px"}} >
                You currently have:
                <span>{points} Loyalty Points</span>
            </div>

            {productFilter === "YOUR_ORDERS" && <CustomerOrdersView/>}
            {productFilter === "OUR_MENU" && <CustomerMenuView/> }
        </div>
    );
}

export default CustomerView;
