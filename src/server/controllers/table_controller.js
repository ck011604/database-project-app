const pool = require("../pool");
const url = require("url");

exports.valid_table = (req, res) => {
  console.log("Received request to check table validity");
  const { query } = url.parse(req.url, true); // Parse the URL
  const tableNumber = query.tableNumber; // Extract tableNumber from query
  if (!tableNumber) { // Make sure a table number was given
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({ success: false, message: "Table number is required" })
    );
    return;
  }
  pool.query("SELECT table_id FROM restaurant_tables WHERE table_id = ?", [tableNumber],
    (error, results) => {
      if (error) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({success: false, message: "Server Error fetching RESTAURANT_TABLES",}));
        console.log("Server Error", error);
        return;
      }
      if (results.length > 0) {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: true }));
        console.log("Valid table");
        return;
      }
      res.writeHead(401, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: false, message: "Invalid table number" }));
      console.log("Invalid table number");
    }
  );
};
