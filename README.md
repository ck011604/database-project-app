Deployed via Microsoft Azure: https://polite-sand-0f80b0a10.5.azurestaticapps.net/

# Installation

## Prerequiste

* Node.js installed
* mysql server installed

# Setup Instructions

1. Copy the environment variables in localHost.txt and replace the variables in the .env file.
2. Clone the Repository:
    - `git clone https://github.com/ck011604/database-project-app.git`
3. Download dependencies
    - `npm install`
4. Turn local database server on
    - Might vary depending on the version of mysql you have. Run as administrator in cmd:
    - `net start mysql90`
5. Import sql file
    - Connect to your local server in mysql workbench and import `restaurantDB.sql`.
6. Start the server in its own terminal
    - `
      cd server
      node server.js
      `
7. Start the react app in its own terminal
    - `npm start`
    - Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

(If you want to run only the frontend locally and use the hosted server/database, ignore steps 1 and 4-6)
