const pool = require("../pool");

exports.login = (req, res) => {
    console.log("Received Post and /login");
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', () => {
        const { email, password } = JSON.parse(body);

        pool.query('SELECT * FROM employees WHERE email = ? AND password = ? AND is_active = 1', [email, password],
            (error, results) => {
                if (error) {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, message: 'Server Error fetching employee logins' }));
                    console.log('Server Error', error);
                    return;
                }
                if (results.length > 0) {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: true, role: results[0].role }));
                    console.log('Correct Employee Login');
                    return;
                }
                pool.query('SELECT * FROM users WHERE email = ? AND password = ? AND is_active = 1', [email, password],
                    (error, results) => {
                        if (error) {
                            res.writeHead(500, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ success: false, message: 'Server Error fetching user logins' }));
                            console.log('Server Error', error);
                            return;
                        }
                        if (results.length > 0) {
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ success: true, role: results[0].role }));
                            console.log('Correct user Login');
                            return;
                        }
                        res.writeHead(401, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ success: false, message: 'Invalid credentials' }));
                        console.log("Invalid credentials");
                    }
                );
            }
        );
    });
};

exports.createUserAccount = (req, res) => {
    console.log("Received request to create user account");
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', () => {
        const { email, firstName, lastName, password } = JSON.parse(body);
        pool.query('INSERT INTO users (email, first_name, last_name, password) VALUES (?, ?, ?, ?)',
            [email, firstName, lastName, password],
            (error, result) => {
                if (error) {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, message: 'Server Error inserting into USERS' }));
                    return;
                } // Else
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true }));
                console.log("Successfully created user account");
            }
        )
    });
};