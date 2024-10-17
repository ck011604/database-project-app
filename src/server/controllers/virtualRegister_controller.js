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

// exports.confirm_order = (req, res) => {
//     console.log("Received request to add order");
//     let body = "";
//     req.on("data", (chunk) => {
//       body += chunk.toString();
//     });
//     req.on("end", () => {
//       const { selectedItems, waiterID, tableNumber, customerID, subtotal, tax, tipPercent, tipAmount, total, receivedAmount, changeAmount, specialRequest } = JSON.parse(body);
//       const addedPoints = Math.floor(subtotal)
//       pool.query(
//         "INSERT INTO orders (items, waiter_id, table_number, customer_id, subtotal, tip_percent, tip_amount, total, received_amount, change_amount, tax_amount, special_requests, pointsEarned) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)",
//         [selectedItems, waiterID, tableNumber, customerID, subtotal, tipPercent, tipAmount, total, receivedAmount, changeAmount, tax, specialRequest, addedPoints],
//         (error, result) => {
//           if (error) {
//             res.writeHead(500, { "Content-Type": "application/json" });
//             res.end(
//               JSON.stringify({
//                 success: false,
//                 message: "Server Error inserting into orders",
//               })
//             );
//             console.log(error)
//             return;
//           } // Else
//           res.writeHead(200, { "Content-Type": "application/json" });
//           res.end(JSON.stringify({ success: true }));
//           console.log("Successfully added order");
//         }
//       );
//     });
// };

exports.confirm_order = (req, res) => {
  console.log("Received request to add order");
  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString();
  });
  req.on("end", () => {
    const {
      selectedItems,
      waiterID,
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
    } = JSON.parse(body);
    const addedPoints = Math.floor(subtotal);

    pool.getConnection((err, connection) => {
      if (err) {
        console.error('Error getting connection:', err);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, message: "Server Error: Unable to connect to database." }));
        return;
      }
      connection.beginTransaction((err) => {
        if (err) {
          connection.release();
          console.error('Error starting transaction:', err);
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ success: false, message: "Server Error: Unable to start transaction." }));
          return;
        }
        connection.query(
          `INSERT INTO orders 
           (items, waiter_id, table_number, customer_id, subtotal, tip_percent, tip_amount, 
            total, received_amount, change_amount, tax_amount, special_requests, pointsEarned)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [selectedItems, waiterID, tableNumber, customerID, subtotal, tipPercent, tipAmount, total, receivedAmount, changeAmount, tax, specialRequest, addedPoints],
          (error, result) => {
            if (error) {
              return connection.rollback(() => {
                connection.release();
                console.error('Error inserting order:', error);
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ success: false, message: "Server Error: Unable to insert order." }));
              });
            }

            // Update inventory for each item and ingredient
            let inventoryPromises = [];
            const selectedItemsObject = JSON.parse(selectedItems); // Convert from string to objects
            const totalNumberItems = selectedItemsObject.length;

            for (let i = 0; i < totalNumberItems; i++) {
              const item = selectedItemsObject[i];
              const itemQuantity = item.quantity;
              const ingredients = item.ingredients;
              
              for (let j = 0; j < ingredients.length; j++) {
                const ingredient = ingredients[j];
                const ingredientID = ingredient.ingredient_id;
                const ingredientQuantity = ingredient.quantity; 
                
                // Subtract from the inventory
                const promise = new Promise((resolve, reject) => {
                  connection.query(
                    `UPDATE inventory SET amount = amount - ? WHERE ingredient_id = ?`,
                    [itemQuantity * ingredientQuantity, ingredientID],
                    (err, result) => {
                      if (err)
                        reject(err);
                      else
                        resolve(result);
                    }
                  );
                });
                inventoryPromises.push(promise);
              }
            }
             // Run inventory updates in parallel
            Promise.all(inventoryPromises)
              .then(() => {
                // Update customer points if their email was provided
                if (customerID && addedPoints) {
                  connection.query(
                    `UPDATE users SET points = points + ? WHERE user_id = ?`,
                    [addedPoints, customerID],
                    (err, result) => {
                      if (err) {
                        return connection.rollback(() => {
                          connection.release();
                          console.error('Error updating points:', err);
                          res.writeHead(500, { "Content-Type": "application/json" });
                          res.end(JSON.stringify({ success: false, message: "Server Error: Unable to update points." }));
                        });
                      }
                      // Commit transaction if all operations are successful
                      connection.commit((err) => {
                        if (err) {
                          return connection.rollback(() => {
                            connection.release();
                            console.error('Error committing transaction:', err);
                            res.writeHead(500, { "Content-Type": "application/json" });
                            res.end(JSON.stringify({ success: false, message: "Server Error: Unable to commit transaction." }));
                          });
                        }

                        connection.release();
                        console.log("Successfully added order, updated inventory, and customer points");
                        res.writeHead(200, { "Content-Type": "application/json" });
                        res.end(JSON.stringify({ success: true }));
                      });
                    }
                  );
                  } 
                  else {
                  // Commit without updating points if no customer or points
                  connection.commit((err) => {
                    if (err) {
                      return connection.rollback(() => {
                        connection.release();
                        console.error('Error committing transaction:', err);
                        res.writeHead(500, { "Content-Type": "application/json" });
                        res.end(JSON.stringify({ success: false, message: "Server Error: Unable to commit transaction." }));
                      });
                    }
                    
                    connection.release();
                    console.log("Successfully added order and updated inventory");
                    res.writeHead(200, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ success: true }));
                  });
                }
              })
              .catch((err) => {
                // Rollback on inventory update failure
                connection.rollback(() => {
                  connection.release();
                  console.error('Error updating inventory:', err);
                  res.writeHead(500, { "Content-Type": "application/json" });
                  res.end(JSON.stringify({ success: false, message: "Server Error: Unable to update inventory." }));
                });
              });
          }
        );
      });
    });
  });
}
