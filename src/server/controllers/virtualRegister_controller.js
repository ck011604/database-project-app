const pool = require("../pool");

exports.menu = (req, res) => { // Get menu
    console.log("Received request to get menu");
    pool.query("SELECT * FROM menu WHERE is_active = 1 ORDER BY price DESC", (error, results) => {
      if (error) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            success: false,
            message: "Server Error fetching menu",
          })
        );
        console.log("Error fetching menu");
        return;
      } // Else
      console.log("Successfully fetched menu");
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: true, menu: results }));
    });
};

exports.inventory_stock = (req, res) => { // Get inventory stock
    console.log("Received request to get inventory stock");
    pool.query(
      "SELECT ingredient_id, name, amount FROM inventory",
      (error, results) => {
        if (error) {
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              success: false,
              message: "Server Error fetching inventory",
            })
          );
          console.log("Error fetching inventory");
          return;
        } // Else
        console.log("Successfully fetched inventory");
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: true, inventory: results }));
      }
    );
};

exports.confirm_order = (req, res) => {
    console.log("Received request to add order");
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      const { selectedItems, waiterID, tableNumber, customerID, subtotal, tax, tipPercent, tipAmount, total, receivedAmount, changeAmount, specialRequest } = JSON.parse(body);
      const addedPoints = Math.floor(subtotal)
      pool.query(
        "INSERT INTO orders (items, waiter_id, table_number, customer_id, subtotal, tip_percent, tip_amount, total, received_amount, change_amount, tax_amount, special_requests, pointsEarned) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)",
        [selectedItems, waiterID, tableNumber, customerID, subtotal, tipPercent, tipAmount, total, receivedAmount, changeAmount, tax, specialRequest, addedPoints],
        (error, result) => {
          if (error) {
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({
                success: false,
                message: "Server Error inserting into orders",
              })
            );
            console.log(error)
            return;
          } // Else
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ success: true }));
          console.log("Successfully added order");
        }
      );
    });
};
