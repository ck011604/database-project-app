import axios from "axios";
import { useEffect, useState } from "react";
import "../../css/CustomerView.css";
import Collapsible from 'react-collapsible';
import { jwtDecode } from 'jwt-decode';
import { FaChevronDown } from "react-icons/fa";

const CustomerOrdersView= () => {
    const [orders, setOrders] = useState([]);

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

    function formatDate(string){
        var options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(string).toLocaleDateString([],options);
    }

    const fetchAllOrders = async () => {
        try{
            let res = await axios.get(`${process.env.REACT_APP_API_URL}/api/order/${user_id}`)
            let orders = res.data.orders;
            console.log(res.data)
            let new_orders = []
            for(let order of orders){
                new_orders.push({
                    id: order.order_id,
                    date: formatDate(order.time),
                    dateTime: new Date(order.time).toString(),
                    total: order.total,
                    table_number: order.table_number,
                    points_earned: order.pointsEarned,
                    request: order.special_requests,
                    subtotal: order.subtotal,
                    tip: order.tip_amount,
                    discount_type: order.discount_type,
                    discount_amount: order.discount_amount,
                    items: order.items
                })
            }
            console.log(new_orders)
            setOrders(new_orders);
        } catch (err) {
            console.log(`Error fetching Orders: ${err}`)
        }
    }

    useEffect(() => {
        fetchAllOrders();
    }, []);

    return (
        <div className="Collapsible">
            <div className="customer-orders-title">Your Previous Orders</div>
            <div style={{"paddingTop": "10px"}}> {orders.map((order) => (
                <Collapsible 
                    trigger={
                        <div>
                            <div style={{display: "inline-flex", gap: "80px"}}>
                                {`Order Number: ${order.id}`}
                                <div>
                                    {`Date: ${order.date}`}
                                </div>
                                <div style={{display: "inline-block"}}>
                                    {`Total: ${order.total}`}
                                </div>
                            </div>
                            <div style={{float: "right", display: "inline-flex", gap: "5px"}}>
                                {"Details"}
                                <div>
                                    <FaChevronDown className="chevron" style={{"marginTop": "3px"}}/>
                                </div>
                            </div>
                        </div>
                    }>
                    <div>
                        <h2>Summary</h2>
                        <div className="Order-Label">
                            Order Time:
                            <div>
                                {order.dateTime}
                            </div>
                        </div>
                        <div className="Order-Label"> 
                            Order Number:
                            <div>
                                {order.id}
                            </div>
                        </div>
                        <div className="Order-Label">
                            Table Number:
                            <div>
                                {order.table_number}
                            </div>
                        </div>
                        <div className="Order-Label">
                            Points Earned:
                            <div>
                                {order.points_earned}
                            </div>
                        </div>
                    </div>
                    <div>
                        <h2 style={{"paddingTop": "0px"}}>Items</h2>
                    </div>
                    <div className="Item-Label">
                        <div style={{"paddingLeft": "100px", "textDecoration": "underline"}}>
                            Item
                        </div>
                        <div style={{"textDecoration": "underline"}}>
                            Quantity
                        </div>
                        <div style={{"textDecoration": "underline"}}>
                            Price
                        </div>
                    </div>
                    {order.items.map((item) => (
                        <div className="Item-Label">
                            <div style={{"paddingLeft": "100px"}}>
                                {item.name}
                            </div>
                            <div>
                                {item.quantity}
                            </div>
                            <div>
                                ${item.price}
                            </div>
                        </div>
                    ))}
                    {order.request === null &&
                        <div className="Order-Label" style={{"paddingTop": "20px", "paddingBottom": "8px", "border-bottom": "1px solid #888"}}>
                            Special Requests:
                            <div>
                                {order.request}
                            </div>
                        </div>
                    }
                    <div className="line"></div>
                    <div>
                        <div className="Totals-Label" style={{"paddingTop": "10px"}}>
                            <div></div>
                            Subtotal:
                            <div>
                                ${order.subtotal}
                            </div>
                        </div>
                        <div className="Totals-Label">
                            <div></div>
                            Tip:
                            <div>
                                ${order.tip}
                            </div>
                        </div>
                        <div className="Totals-Label">
                            <div></div>
                            Discount:
                            <div>
                                <div>
                                    {order.discount_type}
                                </div>
                                <div>
                                    - ${order.discount_amount}
                                </div>
                            </div>
                        </div>
                        <div className="Totals-Label" style={{"fontWeight": "bold"}}>
                            <div></div>
                            Total:
                            <div>
                                ${order.total}
                            </div>
                        </div>
                    </div>
                </Collapsible>
            ))}
            </div>
        </div>
    );
}

export default CustomerOrdersView;