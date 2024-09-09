const http = require('http');
const mysql = require('mysql2');
const url = require('url');
// const querystring = require('querystring');

// Create a connection pool
const pool = mysql.createPool({
    host: 'localhost',   //  database host
    user: 'root', //  MySQL username
    password: 'P@sswordDB123', //  MySQL password
    database: 'databaseproject' // database name
});

const server = http.createServer((req, res) => {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    console.log("Creating Server");
    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }
    if (req.method === "POST") {
        if (req.url === "/login") {
            console.log("Received Post and /login");
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', () => {
                const { email, password } = JSON.parse(body);

                pool.query('SELECT * FROM logins WHERE email = ? AND password = ?', [email, password],
                    (error, results) => {
                        if (error) {
                            res.writeHead(500, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ success: false, message: 'Server Error fetching logins' }));
                            console.log('Server Error', error);
                            return;
                        }
                        if (results.length > 0) {
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ success: true }));
                            console.log('Correct Login');
                        }
                        else {
                            res.writeHead(401, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ success: false, message: 'Invalid credentials' }));
                            console.log("Invalid credentials");
                        }
                    }
                );
            });
        }
        if (req.url === "/create-account") {
            console.log("Received request to create account");
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', () => {
                const { email, firstName, lastName, password } = JSON.parse(body);
                pool.query('INSERT INTO logins (email, firstName, lastName, password) VALUES (?, ?, ?, ?)',
                    [email, firstName, lastName, password],
                    (error, result) => {
                        if (error) {
                            res.writeHead(500, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ success: false, message: 'Server Error inserting into logins' }));
                            return;
                        } // Else
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ success: true }));
                        console.log("Successfully created account");
                    }
                )
            });
        }
    }
    if(req.method === "GET") {
        if (req.url === "/menu") {
            console.log("Received request to get menu")
            pool.query('SELECT * FROM recipes', (error, results) => {
                if (error) {
                    res.writeHead(500, { 'Content-Type': 'application/json'});
                    res.end(JSON.stringify({ success: false, message: 'Server Error fetching menu'}))
                    console.log("Error fetching menu")
                    return;
                } // Else
                console.log("Successfully fetched menu")
                res.writeHead(200, { "Content-Type": "application/json" });
                console.log(results);
                res.end(JSON.stringify({ success: true, menu: results}));
            })
        }
    }
})

server.listen(3001, () => {
    console.log('Server running on port 3001')
});

// Remember to end the pool when your application terminates
process.on('SIGINT', () => {
    pool.end(err => {
        if (err) {
            console.error('An error occurred while closing the database connection pool:', err);
        } else {
            console.log('Database connection pool closed.');
        }
        process.exit(err ? 1 : 0);
    });
});
