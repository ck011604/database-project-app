const pool = require("../pool");

exports.menu = (req, res) => { // Get menu
    console.log("Received request to get menu");
    pool.query("SELECT * FROM menu ORDER BY price DESC", (error, results) => {
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
      pool.query(
        "INSERT INTO orders (items, waiter_id, table_id, customer_id, subtotal, tip_percent, tip_amount, total, received_amount, change_amount, tax_amount, special_requests) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)",
        [selectedItems, waiterID, tableNumber, customerID, subtotal, tipPercent, tipAmount, total, receivedAmount, changeAmount, tax, specialRequest],
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
// exports.subtract_inventory = (req, res) => { // Given a list and quantity, subtract from INVENTORY
//   console.log("Received request to subtract from inventory");
//   let body = "";

//   req.on("data", (chunk) => {
//     body += chunk.toString();
//   });

//   req.on("end", () => {
//     const { ingredientsNeeded } = JSON.parse(body);
//     pool.getConnection((err, connection) => {
//       if (err) {
//         res.writeHead(500, { "Content-Type": "application/json" });
//         res.end(JSON.stringify({ success: false, message: "Could not connect to the database" }));
//         console.log(err);
//         return; // Exit if it can't connect
//       }

//       connection.beginTransaction((err) => {
//         if (err) {
//           connection.release();
//           res.writeHead(500, { "Content-Type": "application/json" });
//           res.end(JSON.stringify({ success: false, message: "Could not start transaction" }));
//           console.log(err);
//           return;
//         }

//         let promises = ingredientsNeeded.map((ingredient) => {
//           const query = "UPDATE inventory SET amount = amount - ? WHERE ingredient_id = ?";
//           return new Promise((resolve, reject) => {
//             connection.query(query, [ingredient.quantity, ingredient.ingredient_id], (error) => {
//               if (error) {
//                 return reject(error);
//               }
//               resolve();
//             });
//           });
//         });

//         Promise.all(promises)
//           .then(() => {
//             connection.commit((err) => {
//               if (err) {
//                 return connection.rollback(() => {
//                   connection.release();
//                   res.writeHead(500, { "Content-Type": "application/json" });
//                   res.end(JSON.stringify({ success: false, message: "Server Error committing transaction" }));
//                 });
//               }
//               connection.release();
//               res.writeHead(200, { "Content-Type": "application/json" });
//               res.end(JSON.stringify({ success: true })); // Success response
//               console.log("Successfully modified INVENTORY");
//             });
//           })
//           .catch((error) => {
//             connection.rollback(() => {
//               connection.release();
//               res.writeHead(500, { "Content-Type": "application/json" });
//               res.end(JSON.stringify({ success: false, message: "Server Error modifying ingredients in INVENTORY" }));
//               console.log(error);
//             });
//           });
//       });
//     });
//   });
// };
