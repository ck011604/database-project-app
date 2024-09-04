# How to run project

## Download dependencies

### `npm install`

node_modules never gets put into the repository because of the large size. By running this command, it downloads all of the packages needed. Do this everytime. Usually it will say there are high issues or something like that. Ignore them and whatever you do don't npm audit them or they will cause more issues.

## Turn local server on

If you chose to not have it start up with windows, run cmd as administrator and type:

### `net start mysql90`

Assuming you downloaded the same mysql version. To stop the server you do the following. Note that shutting down the computer, the server stops as well.

### `net stop mysql90`

## Import sql file

 If you are using the "MySQL" Extension by Weijan Chen, right click the database, click import sql, and select the file. (Should be in the root folder of the repo)

## Start server

Navigate to the server.js file `cd src/server` then the js file.

### `node server.js`

## Start react app

### `npm start`

For development only. Note the website will actively update as your code changes. Right click > inspect > console to see console.logs().

Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## Transfer database

Make sure you are in a directory you can access. Add sql bin to your enviroment path to run in any directory. Dump the database using the following command:

### `mysqldump -u root -p databaseproject > databaseproject.sql`

Go to the directory to retrieve the .sql file and place it in the root of the repo when transferring.
