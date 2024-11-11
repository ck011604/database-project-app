const mysql = require('mysql2/promise');
const pool = require("../pool");

const receipt_controller = {
  getReceiptData: async (req, res) => {
    console.log("Received request params:", req.params);
    
    if (!req.params || !req.params.orderId) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({
        success: false,
        message: "Order ID is required"
      }));
      return;
    }

    const orderId = req.params.orderId;
    
    try {
      const promisePool = pool.promise();
      
      // Modified query to handle JSON
      const query = `
        SELECT 
          o.order_id,
          JSON_EXTRACT(o.items, '$') as items,
          o.subtotal,
          o.tip_amount,
          o.tip_percent,
          o.total,
          o.tax_amount,
          o.time,
          o.table_number,
          o.pointsEarned,
          o.discount_type,
          o.discount_amount,
          o.special_requests,
          CONCAT(e.first_name, ' ', e.last_name) as waiter_name,
          u.first_name as customer_first_name,
          u.last_name as customer_last_name,
          u.points as customer_points
        FROM orders o
        LEFT JOIN employees e ON o.waiter_id = e.employee_id
        LEFT JOIN users u ON o.customer_id = u.user_id
        WHERE o.order_id = ?
      `;
      
      const [results] = await promisePool.query(query, [orderId]);
      
      if (results.length === 0) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({
          success: false,
          message: "Order not found"
        }));
        return;
      }

      const orderData = results[0];
      
      // Convert the items from string back to object if needed
      if (typeof orderData.items === 'string') {
        orderData.items = JSON.parse(orderData.items);
      }

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({
        success: true,
        data: orderData
      }));
      
    } catch (err) {
      console.error("Error in receipt generation:", err);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({
        success: false,
        message: "Internal server error",
        error: err.message
      }));
    }
  }
};

module.exports = receipt_controller;