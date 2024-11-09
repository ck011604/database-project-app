const pool = require("../pool")

exports.order_detail = (req, res) => { // Get info of an order
    // console.log("Recieved request to get find an order");
    // Getting the ID from the URL
    const customerId = req.url.split("/")[3];
    if (!customerId) {
        res.writeHead(400, {"Content-Type": "application/json"});
        res.end(JSON.stringify({success: false, message: "Order ID is required"}));
        return;
    }
    // Query database for order with specified ID
    pool.query("SELECT * FROM orders WHERE customer_id = ?", [customerId], (error, results) => {
        if (error) {
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(
                JSON.stringify({ 
                    success: false,
                    message: "Server Error fetching order details",
                })
            );
            console.error("Error fetching order details:", error);
            return;
        }
        if (results.length === 0) {
            // No order is found with the given ID
            res.writeHead(404, {"Content-Type": "application/json"});
            res.end(
                JSON.stringify({
                    success: false,
                    message: "Order not found",
                })
            );
            return;
        }
        // If the order is found, return details
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: true, orders: results}));
    });
}