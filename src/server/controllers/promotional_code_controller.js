const pool = require("../pool");
const url = require("url");

exports.check_promo_code = (req, res) => {
    console.log("Received request to apply promotional code");
    const { query } = url.parse(req.url, true); // Parse the URL
    const promoCode = query.promoCode; // Extract promoCode from query
    if (!promoCode) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, message: "Promotional code is required to check validity" }));
        return;
    }
    pool.query(
        `SELECT promoCode_id, code, discount_percent, uses_left 
        FROM promotion_codes 
        WHERE code = ? AND is_active = 1 AND (uses_left > 0 OR uses_left IS null)`, [promoCode],
        (error, results) => {
            if (error) {
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ success: false, message: "Server Error fetching PROMOTION_CODES", }));
                console.log("Server Error fetching PROMOTION_CODES", error);
                return;
            }
            if (results.length > 0 && (results[0].uses_left == null || results[0].uses_left > 0)) {
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ 
                    success: true, 
                    promoCode_ID: results[0].promoCode_id, 
                    discountPercent: results[0].discount_percent 
                }));
                console.log(`Valid promotional code: ID #${results[0].promoCode_id} ${promoCode}, ${results[0].discount_percent}%`);
                return;
            }
            res.writeHead(401, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: false, message: "Invalid promotional code" }));
            console.log("Invalid promotional code");
        }
    );
};